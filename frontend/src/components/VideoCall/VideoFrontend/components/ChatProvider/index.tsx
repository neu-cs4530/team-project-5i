import React, { createContext, useEffect, useRef, useState } from 'react';
import TextConversation, { ChatMessage } from '../../../../../classes/TextConversation';
import useCoveyAppState from '../../../../../hooks/useCoveyAppState';
import usePlayersInTown from '../../../../../hooks/usePlayersInTown';

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
  const [isChatWindowOpen, setIsChatWindowOpen] = useState<boolean[]>([]); //Boolean array here so that we can have multiple window options for our conversations
  const [conversation, setConversation] = useState<TextConversation[]>([]); //Array form to allow for multiple conversations
  const [messages, setMessages] = useState<ChatMessage[]>([]); //TODO might want to make this a 2D array for ease of multiple conversations
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const players = usePlayersInTown();

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
        const occupants:string[] = [];
        players.forEach(p => occupants?.push(p.userName));
        const conv = new TextConversation(socket, userName, occupants);
        setConversation([conv]);
        return () => {
          conv.close();
        };
      }
    }
    for (let i = 0; i < conversation.length; i++) {
      if (socket) {
        const occupants:string[] = [];
        players.forEach(p => occupants?.push(p.userName));
        const conv = new TextConversation(socket, userName, occupants);
        setConversation([conv]);
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
