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
			var bit = that.updateBitPosition(bit);
			Bits.update(bit._id, {
			  $set: { left: bit.left, top: bit.top, health: bit.health - 1 },
			});
		});
		this.board.update();
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
	updateBitPosition(bit) {
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

		// Now check if the new location is a rock. If so, try again.
		for (var i = that.board.map.rock.length - 1; i >= 0; i--) {
			var rock = that.board.map.rock[i];
			if (rock.x == bit.left && rock.y == bit.top) {
				return this.updateBitPosition(bit);
			}
		}

		return bit;
	}
}
