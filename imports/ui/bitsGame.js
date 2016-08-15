import { Bits } from '../api/bits.js';
import Board from '../ui/board.js';

import './bitsGame.html';

export default class BitsGame {
	constructor() {
		that = this;
		// Time for each new spawn
		this.spawnTimeDefault = 3000;
		// Tracker
		this.spawnTime = this.spawnTimeDefault;
		// Game tick speed
		this.tickTime = 100;

		// How much to remove from spawnTime each tick.
		this.spawnTickSpeed = 100;
		this.newBitHealth = 100;
		this.healthDecay = .3;
		this.board = new Board;
		this.gameLoop();
		setTimeout('that.board.drawMap();',1000);
	}
	spawnBit() {
		Bits.insert({
			health: this.newBitHealth,
			top: this.randomIntFromInterval(0,this.board.gridSize.y),
			left: this.randomIntFromInterval(0,this.board.gridSize.x),
		});
	}
	gameLoop() {
		var that = this;
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
			  $set: { left: bit.left, top: bit.top, health: bit.health - that.healthDecay },
			});
		});
		this.board.update();
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
	updateBitPosition(bit) {
		var that = this;
		var rnd = Math.random();
		var left = 0;
		var top = 0;
		if (rnd < .3) {
			left = bit.left + 1;
		}
		if (rnd >= .3 && rnd < .6) {
			left = bit.left - 1;
		}
		var rnd = Math.random();
		if (rnd < .3) {
			top = bit.top + 1;
		}
		if (rnd >= .3 && rnd < .6) {
			top = bit.top - 1;
		}

		// console.log(left,top);
		// if (left > that.board.gridSize.x) left = that.board.gridSize.x-1;
		// if (left < 1) left = 1;
		// if (top > that.board.gridSize.x) top = that.board.gridSize.y-1;
		// if (top < 1) top = 1;
		// console.log(left,top);

		// Now check if the new location is a rock. If so, try again.
		for (var i = that.board.map.rock.length - 1; i >= 0; i--) {
			var rock = that.board.map.rock[i];
			if (rock.x == left && rock.y == top) {
				return this.updateBitPosition(bit);
			}
		}

		bit.left = left;
		bit.top = top;

		return bit;
	}
	randomIntFromInterval(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
}
