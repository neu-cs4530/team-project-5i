import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { Button, List, ListItem, OrderedList } from '@chakra-ui/react';
import DirectChatWindow from '../DirectChatWindow';
import RoomNameScreen from '../../PreJoinScreens/RoomNameScreen/RoomNameScreen';
import ChatWindow from '../ChatWindow';
import { nanoid } from 'nanoid';
import ConversationListScrollContainer from '../MessageList/MessageListScrollContainer/ConversationListScrollContainer';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';
import TextConversation from '../../../../../../classes/TextConversation';
import { CurrentCallContext } from 'twilio/lib/rest/preview/trusted_comms/currentCall';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '300px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

function toString(recipients:string[]) {
  let convoName = "";
  for (let i = 0; i < recipients.length; i++) {
    convoName = convoName + recipients[i]
    if (i !== recipients.length-1) {
      convoName = convoName + ",";
    }
  }
  return convoName;
}

export default function ChatWindowHeader() {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  const players = usePlayersInTown();
  const { socket, userName, currentTownID } = useCoveyAppState();
  let { isChatWindowOpen, messages, conversation, currConversation, setCurrConversation } = useChatContext();
  
  function openConvo(conversation :string[], conversations :TextConversation[] | null) {
    let id = 0;
    let s1 = '';
    if (conversations) {
      for (let i = 0; i < conversation.length; i += 1) {
        s1 += conversation[i];
      }
      for (let i = 0; i < conversations.length; i += 1) {
        const occupants = conversations[i].occupants();
        let s2 = '';
        if (occupants) { 
          for (let j = 0; j < occupants.length; j += 1) {
            s2 += occupants[j];
          }
          if (s1 === s2) {
            id = i;
            console.log(id);
          }
        }
      }
    }
    return <div>
      {setIsChatWindowOpen([false, true, false])}
      {setCurrConversation(id)}
      <DirectChatWindow occupants={conversation}/>
    </div>;
  }

  /**
   * Gets the names of the occupants in the conversation
   */
  let names:string[][] | null = [];

  if (conversation) {
    for (let i = 0; i < conversation?.length; i++) {
      const newNames = conversation[i].occupants()?.sort();
      console.log('New Names: %s',newNames);
      let dup = false;
      if(newNames) {
        let s1 = '';
        for (let k = 0; k < newNames?.length; k += 1) {
          s1 = s1 + newNames[k];
        }
        
        for (let j = 0; j < names?.length; j += 1) {
          console.log('Old Names: %s',names[j]);
          let s2 = '';
          for (let k = 0; k < names[j].length; k += 1) {
            s2 = s2 + names[j][k];
          }

          if (s1 === s2) {
            console.log('Dup convo');
            dup = true;
          }
        }
      }
      if (conversation[i] && newNames && newNames.length > 2 && !dup && !names.includes(newNames)) {
        names.push(newNames);
      }
    }
  }
  
  return (
    <div>
      <ConversationListScrollContainer conversations={conversation}>
      <List>
        {[...names].map(
        (name) =>
          <ListItem key={nanoid()}>
            <br />
            <Button onClick={() => openConvo(name, conversation)}>
              {toString(name)}
            </Button>
          </ListItem>
        )}
      </List>
      </ConversationListScrollContainer>
    </div>
  );
}
