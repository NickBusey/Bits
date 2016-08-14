import { Template } from 'meteor/templating';
 
import { Bits } from '../imports/api/bits.js';
 
import './main.html';
import '../imports/ui/bit.js';
import '../imports/ui/bitInfo.js';

Template.body.helpers({
	  bits() {
		      return Bits.find({});
		        },
});


Template.body.events({
	  'click #spawnBit'(event) {
		  Bits.insert({
			  health: 100,
			  top: 50,
			  left: 50
		  });
	},
});

setInterval(function() {
	// Gameloop
	//
	$('#playField div').trigger('click');
},100);
