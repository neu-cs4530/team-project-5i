import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import DirectChatWindowHeader  from './ChatWindowHeader/DirectChatWindowHeader';
import GroupChatWindowHeader  from './ChatWindowHeader/GroupChatWindowHeader';
import ChatInput from './ChatInput/ChatInput';
import clsx from 'clsx';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import DirectMessageList from './MessageList/DirectMessageList';
import GroupMessageList from './MessageList/GroupMessageList';
import DirectChatInput from './ChatInput/DirectChatInput';
import GroupChatInput from './ChatInput/GroupChatInput';
import DirectConversation from './DirectConversation';
import { ChatProvider } from '../ChatProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      background: '#FFFFFF',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #E4E7E9',
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      },
      position: 'fixed',
      bottom: 0,
      left: 0,
      top: 0,
      'max-width': '250px'
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
    hide: {
      display: 'none',
    },
  })
);

interface DirectChatProps {
  occupants :string[];
}

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

export default function DirectChatWindow({ occupants } :DirectChatProps) {
  const classes = useStyles();
  let { isChatWindowOpen, messages, conversation } = useChatContext();
  const { setIsChatWindowOpen } = useChatContext();

  return (
    <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: isChatWindowOpen })}>
      <ChatWindowHeader />
      <MessageList messages={messages} />
      <ChatInput conversation={conversation!} isChatWindowOpen={isChatWindowOpen} />
      <br />
    </aside>
  );
}
