import { Template } from 'meteor/templating';
 
import { Bits } from '../imports/api/bits.js';
 
import './main.html';
import '../imports/ui/bit.js';
import '../imports/ui/bitInfo.js';

import BitsGame from '../imports/ui/bitsGame.js';
export default app = new BitsGame;

import '../imports/ui/board.js';

Template.body.helpers({
	bits() {
		return Bits.find({});
    },
    liveBits() {
    	return Bits.find({}).count();
    }
});

Template.body.onCreated(function(){
	this.subscribe('bits');
	this.subscribe('foods');
});