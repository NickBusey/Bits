import { Bits } from '../api/bits.js';
import Board from '../ui/board.js';

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
	gameLoop() {
		setTimeout('that.gameLoop()',this.tickTime);
		// Decrement spawn time
		this.spawnTime = this.spawnTime-this.spawnSpeed();
		if (this.spawnTime < 0) {
			this.spawnTime = this.spawnTimeDefault;
			this.spawnBit();
		}
		
		var bits = Bits.find({});
		bits.forEach(function (bit) {
			if (bit.health < 1) {
				Bits.remove(bit._id);
			}
			var rnd = Math.random();
			if (rnd < .3) {
				bit.left = bit.left + 1;
			}
			if (rnd >= .3 && rnd < .6) {
				bit.left = bit.left - 1;
			}
			var rnd = Math.random();
			if (rnd < .3) {
				bit.top = bit.top + 1;
			}
			if (rnd >= .3 && rnd < .6) {
				bit.top = bit.top - 1;
			}
			if (bit.left > 19) bit.left = 19;
			if (bit.left < 1) bit.left = 1;
			if (bit.top > 19) bit.top = 19;
			if (bit.top < 1) bit.top = 1;
			Bits.update(bit._id, {
			  $set: { left: bit.left, top: bit.top, health: bit.health - 1 },
			});
		});
		this.board.update();
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
}
