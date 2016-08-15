import { Bits } from '../api/bits.js';
import Board from '../ui/board.js';

import './bitsGame.html';

export default class BitsGame {
	constructor() {
		that = this;
		// Time for each new spawn
		this.spawnTimeDefault = 4000;
		// Tracker
		this.spawnTime = 3000;
		// Game tick speed
		this.tickTime = 100;
		// How much to remove from spawnTime each tick.
		this.spawnTickSpeed = 100;
		this.newBitHealth = 100;
		this.board = new Board;
		this.gameLoop();
		setTimeout('that.board.drawMap();',1000);
	}
	spawnBit() {
		Bits.insert({
			health: this.newBitHealth,
			top: 10,
			left: 10,
		});
	}
}
