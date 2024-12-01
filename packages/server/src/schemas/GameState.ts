import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string")
  id = "";

  @type("string")
  color = "";

  @type("number")
  x = 0;


  @type("number")
  y = 0;
}

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
