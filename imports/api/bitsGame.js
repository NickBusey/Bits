import { Bits } from '../api/bits.js';
import Board from '../ui/board.js';

export default class BitsGame {
	constructor() {
		that = this;
		// Time for each new spawn
		this.spawnTimeDefault = 4000;
		// Tracker
		this.spawnTime = 4000;
		// Game tick speed
		this.tickTime = 100;
		// How much to remove from spawnTime each tick.
		this.spawnTickSpeed = 100;
		this.board = new Board;
		this.gameLoop();
		setTimeout('that.board.draw();',1000);
	}
	spawnBit() {
		Bits.insert({
			health: 100,
			top: 250,
			left: 250,
		});
	}
	gameLoop() {
		setTimeout('that.gameLoop()',this.tickTime);
		// Update bits (change this)
		$('#playField .bit').trigger('click');
		// Decrement spawn time
		this.spawnTime = this.spawnTime-this.spawnSpeed();
		if (this.spawnTime < 0) {
			this.spawnTime = this.spawnTimeDefault;
			this.spawnBit();
		}
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
}
