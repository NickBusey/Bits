import { Meteor } from 'meteor/meteor';
import { Bits } from '../imports/api/bits.js'
import { Foods } from '../imports/api/foods.js'

Meteor.startup(() => {

});

  Bits.allow({
  	        update: function () {
         // add custom authentication code here
        return true;
        },
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    'remove': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });

   Foods.allow({
   	        update: function () {
         // add custom authentication code here
        return true;
        },
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    'remove': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });

Meteor.publish("bits", function () {
  if (this.userId) {
    return Bits.find({ userId: this.userId });
  } else {
    this.ready();
  }
});

Meteor.publish("foods", function () {
  if (this.userId) {
    return Foods.find({ userId: this.userId });
  } else {
    this.ready();
  }
});
