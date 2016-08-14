import { Template } from 'meteor/templating';
 
import { Bits } from '../api/bits.js';
 
import './bit.html';
import BitsGame from '../api/bitsGame.js';

 
Template.bit.events({
	'click'(event,template) {
		if (this.health < 1) {
			Bits.remove(this._id);
		}
		off_x = Math.round(Math.random()*10);
		if (Math.random() > .5) {
			off_x = off_x * -1;
		}
		off_y = Math.round(Math.random()*10);
		if (Math.random() > .5) {
			off_y = off_y * -1;
		}
		left = this.left+off_x;
		topp = this.top+off_y;
		if (left > 500) left = 500;
		if (left < 0 ) left = 0;
		if (topp > 500) topp = 500;
		if (topp < 0 ) topp = 0;
		Bits.update(this._id, {
		  $set: { left: left, top: topp, health: this.health - 1 },
		});
		$(template.firstNode).animate({'left':this.left,'top':this.top});
	},
});

