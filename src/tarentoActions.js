const _ = require('lodash')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodbservice = require('./mongodbService');
var hitlService = require('./hitlService');
const index = require('./index')

module.exports = {
   
    newStae:async(state, event)=> {

        let messageSent = await event.reply('#!client-queries-y~4ePV');
        goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');

        return {
          ...state, // We clone the state
        isCorrect: null, // We reset `isCorrect` (optional)ss
        goodAnswer, // we then reset the number of questions asked to `0`
        }
       
      }
    
        
}
