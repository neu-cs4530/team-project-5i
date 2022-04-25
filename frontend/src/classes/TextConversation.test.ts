import { nanoid } from 'nanoid';
import { mock} from 'jest-mock-extended';
import { Socket } from 'socket.io-client';
import { assert } from 'console';
import TextConversation from './TextConversation';

describe('TextConversation', () => {
    it('constructor should set the authorName property', () => {
        const userName = `userName-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName, [userName])
        expect(conversationText.authorName).toBe(userName);
    });
    describe('sendMessage', () => {
        const userName = `userName-${nanoid()}`;
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText1 = new TextConversation(mockSocket, userName, [userName])
        const conversationText2 = new TextConversation(mockSocket, userName, [userName, userName1, userName2])
        it('console logs when a user send a text message to a channel where he is the only occupant', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText1.sendMessage(message)
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a message", userName);
        });
        it('console logs when a user send a text message to a channel with occupants', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText2.sendMessage(message)
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a message", userName);
            expect(logSpy).toHaveBeenCalledWith("%s Received a message", userName1);
            expect(logSpy).toHaveBeenCalledWith("%s Received a message", userName2);
        });
        
    });

    describe('sendDirectMessage', () => {
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const userName3 = `userName2-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName1, [userName1, userName2, userName3])
        it('console logs when a user send a text message directly to another user', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText.sendDirectMessage(message, userName2)
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a direct message", userName1);
            expect(logSpy).toHaveBeenCalledWith("%s Received a direct message", userName2);
            expect(logSpy).not.toHaveBeenCalledWith("%s Received a message", userName2);
            expect(logSpy).not.toHaveBeenCalledWith("%s Received a direct message", userName3);
        });
    });

    describe('sendGroupMessage', () => {
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const userName3 = `userName3-${nanoid()}`;
        const userName4 = `userName3-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText = new TextConversation(mockSocket, userName1, [userName1, userName2, userName3, userName4])
        it('console logs when a user send a text message directly to a group of users', async () => {
            const logSpy = jest.spyOn(console, 'log');
            const message = `message-${nanoid()}`;
            const result = conversationText.sendGroupMessage(message, [userName2, userName3])
            expect(result).toBe(true)
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName1);
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName2);
            expect(logSpy).not.toHaveBeenCalledWith("%s Received a message", userName2);
            expect(logSpy).toHaveBeenCalledWith("%s Received a group message", userName3);
            expect(logSpy).not.toHaveBeenCalledWith("%s Received a direct message", userName3);
            expect(logSpy).not.toHaveBeenCalledWith("%s Received a group message", userName4);
        });
    });

    describe('occupants', () => {
        const userName1 = `userName1-${nanoid()}`;
        const userName2 = `userName2-${nanoid()}`;
        const userName3 = `userName3-${nanoid()}`;
        const mockSocket = mock<Socket>();
        const conversationText1 = new TextConversation(mockSocket, userName1, [])
        const conversationText2 = new TextConversation(mockSocket, userName1, [userName1, userName2, userName3])
        it('the occupants() method should properly reflect the actually occupants of the conversation', async () => {
            if (conversationText1 && conversationText1.occupants()) {
                expect(conversationText1.occupants().length).toEqual(0);
            }
            expect(conversationText2.occupants().length).toEqual(3);
            expect(conversationText2.occupants()[0]).toEqual(userName1);
        });
    })
});