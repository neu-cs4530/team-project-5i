import React from 'react';
import TextConversation, { ChatMessage } from '../../../../../../classes/TextConversation';
import MessageInfo from './MessageInfo/MessageInfo';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';

interface MessageListProps {
  messages: ChatMessage[];
  conversation: TextConversation;
}

const getFormattedTime = (message?: ChatMessage) =>
  message?.dateCreated.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' }).toLowerCase();

export default function MessageList({ messages, conversation }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const players = usePlayersInTown();

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        let valid = false;
        const occupants = conversation.occupants()?.sort();
        const partipants = message.direct?.sort();
        if (partipants && occupants) {
          let s1 = '';
          let s2 = '';
          for (let i = 0; i < occupants.length; i += 1) {
            s1 += occupants[i];
          }
          for (let i = 0; i < partipants.length; i += 1) {
            s2 += partipants[i];
          }
          if (s1 === s2) {
            valid = true;
          }
        }
        if (message.direct && valid) {
          const time = getFormattedTime(message)!;
          const previousTime = getFormattedTime(messages[idx - 1]);

          // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
          const shouldDisplayMessageInfo = time !== previousTime || message.author !== messages[idx - 1]?.author;

          const isLocalParticipant = localParticipant.identity === message.author;

          const profile = players.find(p => p.id == message.author);

          return (
            <React.Fragment key={message.sid}>
              {shouldDisplayMessageInfo && (
                <MessageInfo author={profile?.userName || message.author} isLocalParticipant={isLocalParticipant} dateCreated={time} />
              )}
              <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />
            </React.Fragment>
          );
        }
      })}
    </MessageListScrollContainer>
  );
}
