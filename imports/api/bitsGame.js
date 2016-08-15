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
		this.tickTime = 1000;
		// How much to remove from spawnTime each tick.
		this.spawnTickSpeed = 100;
		this.board = new Board;
		this.gameLoop();
		setTimeout('that.board.drawMap();',1000);
	}
	spawnBit() {
		Bits.insert({
			health: 100,
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
			var off_x = Math.round(Math.random()*10);
			if (Math.random() > .5) {
				off_x = off_x * -1;
			}
			var off_y = Math.round(Math.random()*10);
			if (Math.random() > .5) {
				off_y = off_y * -1;
			}
			var left = bit.left+off_x;
			var topp = bit.top+off_y;
			if (left > 20) left = 20;
			if (left < 0 ) left = 0;
			if (topp > 20) topp = 20;
			if (topp < 0 ) topp = 0;
			Bits.update(bit._id, {
			  $set: { left: left, top: topp, health: bit.health - 1 },
			});
		});
		this.board.update();
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
}
