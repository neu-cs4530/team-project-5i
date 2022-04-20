import { nanoid } from 'nanoid';
import { Socket } from 'socket.io-client';

/**
 * A basic representation of a text conversation, bridged over a socket.io client
 * The interface to this class was designed to closely resemble the Twilio Conversations API,
 * to make it easier to use as a drop-in replacement.
 */
export default class TextConversation {
  get socket(): Socket {
    return this._socket
  }

  get callbacks(): MessageCallback[]  {
    return this._callbacks
  }

  get authorName(): string {
    return this._authorName
  }

  private _socket: Socket;

  private _callbacks: MessageCallback[] = [];

  private _authorName: string;

  private _occupants: string[] | null;

  /**
   * Create a new Text Conversation
   * 4/1/2022: Added support for sending direct and group messages by extending ChatMessage with a  new parameter direct
   *
   * @param socket socket to use to send/receive messages
   * @param authorName name of message author to use as sender
   */
   public constructor(socket: Socket, author: string, occupants :string[] | null) {
    this._socket = socket;
    this._authorName = author;
    this._occupants = occupants;
    
    // const players = usePlayersInTown();
    // const player = this.players.filter(p => p.userName === author)[0];
    this._socket.on('chatMessage', (message: ChatMessage) => {
      // if (!player.blockedUsers?.includes(message.author)) {
        if (message.direct === undefined) {
          console.log("%s Received a message",this._authorName);
          message.dateCreated = new Date(message.dateCreated);
          this.onChatMessage(message);
        } else if (message.direct.length === 1) {
          if (this._authorName === message.author || this._authorName === message.direct[0]) {
            console.log("%s Received a direct message", this._authorName);
            message.dateCreated = new Date(message.dateCreated);
            this.onChatMessage(message);
          }
        } else if (message.direct.length > 1) {
            if (this._authorName === message.author) {
              console.log("%s Received a group message", this._authorName);
              message.dateCreated = new Date(message.dateCreated);
              this.onChatMessage(message);
            }
            else { 
              for (let i = 0; i < message.direct.length; i += 1) {
                if(this._authorName === message.direct[i]) {
                  console.log("%s Received a group message", this._authorName);
                  message.dateCreated = new Date(message.dateCreated);
                  this.onChatMessage(message);
                }
              }
          }
        }
      // }
    });
  }

  private onChatMessage(message: ChatMessage) {
    this._callbacks.forEach(cb => cb(message));
  }

  /**
   * Send a text message to this channel
   * @param message
   */
  public sendMessage(message: string) {
    const msg: ChatMessage = {
      sid: nanoid(),
      body: message,
      author: this._authorName,
      dateCreated: new Date(),
      direct: undefined
    };
    this._socket.emit('chatMessage', msg);
  }

  
  public sendDirectMessage(message: string, recipient: string) {
    const msg: ChatMessage = {
      sid: nanoid(),
      body: message,
      author: this._authorName,
      dateCreated: new Date(),
      direct: [recipient]
    };
    this._socket.emit('chatMessage', msg);
  }
  
  public sendGroupMessage(message: string, recipients: string[]) {
    const msg: ChatMessage = {
      sid: nanoid(),
      body: message,
      author: this._authorName,
      dateCreated: new Date(),
      direct: recipients
    };
    this._socket.emit('chatMessage', msg);
  }
  
  /**
   * Register an event listener for processing new chat messages
   * @param event
   * @param cb
   */
  public onMessageAdded(cb: MessageCallback) {
    this._callbacks.push(cb);
  }

  /**
   * Removes an event listener for processing new chat messages
   * @param cb
   */
  public offMessageAdded(cb: MessageCallback) {
    this._callbacks = this._callbacks.filter(_cb => _cb !== cb);
  }

  /**
   * Release the resources used by this conversation
   */
  public close(): void {
    this._socket.off('chatMessage');
  }

  /**
   * Returns the occupants of the conversation
   */
  public occupants(): string[] | null {
    return this._occupants;
  }
}
type MessageCallback = (message: ChatMessage) => void;
export type ChatMessage = {
  author: string;
  sid: string;
  body: string;
  dateCreated: Date;
  direct: undefined | string[]; // 4/1/2022: Added in a new parameter direct to the ChatMessage that allows support for the backend of direct and group messaging.
};
