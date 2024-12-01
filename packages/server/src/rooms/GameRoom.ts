import { Client, Room } from "colyseus";
import { GameState, Player } from "../schemas/GameState";

export class GameRoom extends Room<GameState> {
  maxClients = 25; // Current Discord limit is 25

  onCreate(options: any): void {
    this.setState(new GameState());

    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.y = message.y;

        // Broadcast the entire player list to all clients
        this.broadcast("updateState", Array.from(this.state.players.values()));
      }
    });
  }

  onJoin(client: Client, options?: any): void {
    console.log(`Client joined: ${client.sessionId}`);

    const player: Player = new Player();
    player.id = client.sessionId

    // Add the new player to the state
    this.state.players.set(client.sessionId, player);

    this.broadcast("updateState", Array.from(this.state.players.values()));
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(`Client left: ${client.sessionId}`);
    this.state.players.delete(client.sessionId);

    // Notify all clients about the updated state
    this.broadcast("updateState", Array.from(this.state.players.values()));
  }
}
