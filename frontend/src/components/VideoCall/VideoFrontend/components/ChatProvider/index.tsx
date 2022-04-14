import React, { createContext, useEffect, useRef, useState } from 'react';
import TextConversation, { ChatMessage } from '../../../../../classes/TextConversation';
import useCoveyAppState from '../../../../../hooks/useCoveyAppState';

type ChatContextType = {
  isChatWindowOpen: boolean[];
  setIsChatWindowOpen: (isChatWindowOpen: boolean[]) => void;
  hasUnreadMessages: boolean;
  messages: ChatMessage[];
  conversation: TextConversation[] | null;
};

export const ChatContext = createContext<ChatContextType>(null!);

export const ChatProvider: React.FC = ({ children }) => {
  const { socket, userName } = useCoveyAppState();
  const isChatWindowOpenRef = [useRef(false)];
  const [isChatWindowOpen, setIsChatWindowOpen] = useState<boolean[]>([]);
  const [conversation, setConversation] = useState<TextConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    for (let i = 0; i < conversation.length; i++) {
      if (conversation[i]) {
        const handleMessageAdded = (message: ChatMessage) => 
          setMessages(oldMessages => [...oldMessages, message]);
        //TODO - store entire message queue on server?
        // conversation.getMessages().then(newMessages => setMessages(newMessages.items));
        conversation[i].onMessageAdded(handleMessageAdded);
        return () => {
          conversation[i].offMessageAdded(handleMessageAdded);
        };
      }
    }
  }, [conversation]);

  useEffect(() => {
    // If the chat window is closed and there are new messages, set hasUnreadMessages to true
    for (let i = 0; i < isChatWindowOpenRef.length; i++) {
      if (!isChatWindowOpenRef[i].current && messages.length) {
        setHasUnreadMessages(true);
      }
    }
  }, [messages]);

  useEffect(() => {
    for (let i = 0; i < isChatWindowOpenRef.length; i++) {
      isChatWindowOpenRef[i].current = isChatWindowOpen[i];
      if (isChatWindowOpen[i]) setHasUnreadMessages(false);
    }
  }, [isChatWindowOpen]);

  useEffect(() => {
    if (conversation.length == 0) {
      if (socket) {
        const conv = new TextConversation(socket, userName, null);
        setConversation([conv,conv,conv]);
        return () => {
          conv.close();
        };
      }
    }
    for (let i = 0; i < conversation.length; i++) {
      if (socket) {
        const conv = new TextConversation(socket, userName, null);
        setConversation([conv,conv,conv]);
        return () => {
          conv.close();
        };
      }
    }
  }, [socket, userName, setConversation]);

  return (
    <ChatContext.Provider
      value={{
        isChatWindowOpen,
        setIsChatWindowOpen,
        hasUnreadMessages,
        messages,
        conversation,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
