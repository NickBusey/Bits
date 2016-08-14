import { Template } from 'meteor/templating';
 
import { Bits } from '../api/bits.js';
 
import './bitInfo.html';
 
Template.bitInfo.events({
	'click .toggle-checked'() {
		alert("!");
		Bits.update(this._id, {
			$set: { active: ! this.active },
		});
	},
	'click .delete'() {
		alert("?");
	     Bits.remove(this._id);
       },
});

