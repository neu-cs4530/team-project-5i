import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { Button, List, ListItem, OrderedList } from '@chakra-ui/react';
import DirectChatWindow from '../DirectChatWindow';
import RoomNameScreen from '../../PreJoinScreens/RoomNameScreen/RoomNameScreen';
import ChatWindow from '../ChatWindow';
import { nanoid } from 'nanoid';

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
  for (let i = 1; i < recipients.length; i++) {
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
  let { isChatWindowOpen, messages, conversation } = useChatContext();

  function openConvo(conversation :string[]) {
    return <div>
      {setIsChatWindowOpen([false, true, false])}
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
      if (conversation[i] && newNames && newNames.length > 2 && !names.includes(newNames)) {
        console.log(newNames);
        names.push(newNames);
      }
    }
  }

  return (
    <div>
      <List>
        {[...names].map(
        (name) =>
          <ListItem key={nanoid()}>
            <br />
            <Button onClick={() => openConvo(name)}>
              {toString(name)}
            </Button>
          </ListItem>
        )}
      </List>
    </div>
  );
}
