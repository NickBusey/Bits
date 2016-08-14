import { Template } from 'meteor/templating';
 
import { Bits } from '../imports/api/bits.js';
 
import './main.html';
import '../imports/ui/bit.js';
import '../imports/ui/bitInfo.js';
import BitsGame from '../imports/api/bitsGame.js';

export default app = new BitsGame;

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