import { Template } from 'meteor/templating';
 
import { Bits } from '../imports/api/bits.js';
 
import './game.html';
import '../imports/ui/bit.js';
import '../imports/ui/bitInfo.js';
import BitsGame from '../imports/api/bitsGame.js';
export default app = new BitsGame;

import '../imports/ui/board.js';

Template.body.helpers({
	bits() {
		return Bits.find({});
    },
    spawnTime() {
    	return app.spawnTime;
    },
    liveBits() {
    	return Bits.find({}).count();
    }
});