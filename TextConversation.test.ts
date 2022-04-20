import { nanoid } from 'nanoid';
import TextConversation from './TextConversation';
import { mock} from 'jest-mock-extended';
import { Socket } from 'socket.io-client';

describe('TextConversation', () => {
    it('constructor should set the authorName property', () => {
        const userName = `userName-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName, [userName])
        expect(conversationText.authorName).toBe(userName);
    });
    describe('sendMessage', () => {
        const userName = `userName-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName, [userName])
        it('console logs when a user send a text message to the channel', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText.sendMessage(message)
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a message", userName);
        });
    });

    describe('sendDirectMessage', () => {
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName1, [userName1, userName2])
        it('console logs when a user send a text message directly to another user', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText.sendDirectMessage(message, userName2)
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a direct message", userName1);
            expect(logSpy).toHaveBeenCalledWith("%s Received a direct message", userName2);
        });
    });

    describe('sendGroupMessage', () => {
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const userName3 = `userName3-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName1, [userName1, userName2, userName3])
        it('console logs when a user send a text message directly to a group of users', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText.sendGroupMessage(message, [userName2, userName3])
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName1);
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName2);
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName3);
        });
    });
});