export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  /** List of blocked users the player has designated * */
  private blocked: string[];

  constructor(id: string, userName: string, location: UserLocation) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this.blocked = ['test5'];
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get blockedUsers(): string[] {
    return this.blocked;
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(playerFromServer._id, playerFromServer._userName, playerFromServer.location);
  }
  
  /**
   * Blocks a username from sending messages to this player
   * @param username Name of the user to be blocked
   */
   blockUser(username :string) :void {
    this.blocked.push(username);
  }
}
export type ServerPlayer = { _id: string, _userName: string, location: UserLocation };

export type Direction = 'front'|'back'|'left'|'right';

export type UserLocation = {
  x: number,
  y: number,
  rotation: Direction,
  moving: boolean,
  conversationLabel?: string
};
