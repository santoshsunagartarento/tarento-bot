const _ = require('lodash')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodbservice = require('./mongodbService');
var hitlService = require('./hitlService');
const index = require('./index')
// const { setup } = require('@botpress/builtins');

module.exports = {

  startClientConversation: state => {

    return {
      ...state, // we clone the existing state
      count: 0 // we then reset the number of questions asked to `0`
    }
  },

  saveName:async(state,event)=>{
    let isName,allow=false;
    let userData = [];
    let criteria = ["No","By","Sorry"];

    if(event.text.length>0)
    {
       userData = event.text.split(" ").length>0? event.text.split(" ") : event.text;
       if(userData.length>1)
       {
        criteria.forEach(function(val){
          if(userData.includes(val))
          {
          allow=true;
          return;
          }
          else
          allow=false;
        })
         
       }
     
    }

      if(!allow)
      {
        //  event.reply('#!text-JTR2T7');
        // goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
        userName = event.text; 
        isName=true;

       return {
        ...state, 
        isName,// We clone the state
        isCorrect: null, // We reset `isCorrect` (optional)ss
        userName: userName,
        // badAnswer
      }
      }
      else{
        messageSent = await event.reply('#!client-queries-P0g8CF');
        goodAnswer = _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
        return{
          ...state,
          isName,
          isCorrect: null,
          goodAnswer

        }
      }
  },

  welcomeToChat:async(state,event)=>{
    let messageSent,goodAnswer,userName;

  if(state.userInput && state.userInput === "About"){
    messageSent = await event.reply('#!client-queries-6h~ILK');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
  }
  else if(state.userInput && state.userInput === "Clients")
  {
    messageSent = await event.reply('#!client-queries-KwPlpR');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else if(state.userInput && state.userInput === "Projects")
  {
    messageSent = await event.reply('#!client-queries-3F~o5c');
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else
  {
     messageSent = await event.reply('#!client-queries-lh~nGY');
     goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
     userName = event.text;
  }
  return {
    ...state, // We clone the state
    isCorrect: null, // We reset `isCorrect` (optional)ss
    goodAnswer,
    userName: userName,
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
      event.reply('#!text-jkDyoU');
      hitlService.pauseChatAndNotify(event, function(err, result) {
     
      });
      //End: Added to pauseChatAndNotify
    }
    return { ...state, isCorrect, erorr:isCorrect?null:event.text, userInput: event.text}
  },




}
