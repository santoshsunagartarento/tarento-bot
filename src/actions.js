const _ = require('lodash')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodbservice = require('./mongodbService');
var hitlService = require('./hitlService');
const index = require('./index')

module.exports = {
  
  welcomeToChat:async(state,event)=>{
    let messageSent,goodAnswer;

  if(state.userInput && state.userInput === "About"){
    messageSent = await event.reply('#!client-queries-8LzjTj');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
  }
  else if(state.userInput && state.userInput === "Clients")
  {
    messageSent = await event.reply('#!client-queries-9wiv1v');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else if(state.userInput && state.userInput === "Services")
  {
    messageSent = await event.reply('#!client-queries-_BgQHB');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else
  {
    // messageSent = await event.reply('#!client-queries-y~4ePV');
     messageSent = await event.reply('#!client-queries-y~4ePV');
    //  temp = messageSent.context.question.split(",");
    // temp[0]= temp[0]+" "+event.text;
    // temp = temp[0]+ temp[1];
    // messageSent.context.question = temp;
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
  }
  return {
    ...state, // We clone the state
    isCorrect: null, // We reset `isCorrect` (optional)ss
    goodAnswer,
    // badAnswer
  } 
},

knowingTarento:(state,event)=>{
    let isCorrect,temp = false ;

    let answer;
    let index =-1;
    console.log(state.goodAnswer )
    // console.log(state.badAnswer);
    console.log(event.text);
    isCorrect = state.goodAnswer && event.text === state.goodAnswer.text
    if(!isCorrect)
    {
    // let FindArrayinBad =  _.find(state.badAnswer, { text: event.text });
    let FindArrayinBad =  _.find(state.goodAnswer, { text: event.text });
    isCorrect = FindArrayinBad?true:false;
    }
    if(!isCorrect)
    {
      answer = event.text.split(" ");
      index =  answer.indexOf('About');
      index = index!=-1?index:answer.indexOf('Clients');
     index = index!=-1?index:answer.indexOf( 'Services');
    }
    if(index!=-1)
    {
      event.text = answer[index];
      let FindArrayinBad =  _.find(state.goodAnswer, { text: event.text });
      isCorrect = FindArrayinBad?true:false;
    }
    if(!isCorrect) {
      //Begin: Added to pauseChatAndNotify
      hitlService.pauseChatAndNotify(event, function(err, result) {
        console.log("Chat paused, human will get in touch with user soon");
      });
      //End: Added to pauseChatAndNotify
    }
    return { ...state, isCorrect, erorr:isCorrect?null:event.text, userInput: event.text}
  },




}
