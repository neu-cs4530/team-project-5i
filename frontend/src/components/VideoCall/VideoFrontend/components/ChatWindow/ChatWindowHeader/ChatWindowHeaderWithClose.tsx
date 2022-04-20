import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { Button, List, ListItem, OrderedList } from '@chakra-ui/react';
import DirectChatWindow from '../DirectChatWindow';
import RoomNameScreen from '../../PreJoinScreens/RoomNameScreen/RoomNameScreen';
import ChatWindow from '../ChatWindow';
import CloseIcon from '../../../icons/CloseIcon';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';


const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
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

interface HeaderProps {
  occupants :string[];
}

// Only display Recipients name
function toString(recipients:string[]) {
  const {userName} = useCoveyAppState();
  const currentPlayerName = userName;
  let convoName = "";
  for (let i = 0; i < recipients.length; i++) {
    if(recipients[i] === currentPlayerName){
    }
    else{
      convoName = convoName + recipients[i] + " "
    }
  }
  return convoName;
}

export default function ChatWindowHeader({occupants} :HeaderProps) {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  let { isChatWindowOpen, messages, conversation } = useChatContext();

  function openConvo(conversation :string[]) {
    return <div>
      {setIsChatWindowOpen([false, true])}
      <DirectChatWindow occupants={conversation}/>
    </div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.text}>{toString(occupants)}
      </div>
      <button className={classes.closeChatWindow} onClick={() => setIsChatWindowOpen([true,false])}>
        <CloseIcon />
      </button>
      
    </div>
  );
}
