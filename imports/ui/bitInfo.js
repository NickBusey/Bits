import { Template } from 'meteor/templating';
 
import { Bits } from '../api/bits.js';
 
import './bitInfo.html';

Template.bitInfo.helpers({
	displayHealth() {
		return Math.round(this.health);
	}
});
 
Template.bitInfo.events({
	'click .toggle-checked'() {
		Bits.update(this._id, {
			$set: { active: ! this.active },
		});
	},
	'click .delete'() {
	     Bits.remove(this._id);
       },
});

