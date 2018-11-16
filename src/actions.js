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

  RaisingRandomQuestion:async(state,event)=>{
    let isQuestion,isContinue=false;
    let aboutPattren = new RegExp('about','i');
    let projectsPattren = new RegExp('projects|project','i');
    let clientsPattren = new RegExp ('cleints|client','i');
    let helloPattren = new RegExp('hlo|hello|hii|hi','i');
    if(aboutPattren.test(event.text))
    {
      isQuestion=true;
      event.reply('#!client-queries-6h~ILK');
      
    }else if(projectsPattren.test(event.text))
    {
      isQuestion=true;
      event.reply('#!client-queries-3F~o5c');
    }
    else if(clientsPattren.test(event.text))
    {
      isQuestion=true;
      event.reply('#!client-queries-KwPlpR');
    }
    else if(helloPattren.test(event.text))
    {
      isContinue=true;
    }
    if(!isQuestion && !isContinue) {
      //Begin: Added to pauseChatAndNotify
      event.reply('#!text-jkDyoU');
      hitlService.pauseChatAndNotify(event, function(err, result) {
      });
    }
    return{
      ...state, 
      isQuestion:isQuestion,
      startFlow:isContinue
    }
  },

  saveName:async(state,event)=>{
    let isName,allow=false;
    let userData,compareData = [];
    let criteria = ["No","By","Sorry"];
    let suggestions;
    if(event.text.trim().length>0)
    {
       userData = event.text.split(" ").length>0? event.text.split(" ") : event.text;
       if(userData.length>1)
       {
        compareData =  criteria.filter(function(val){
         return userData.includes(val)?allow=true:allow=false
        })
       }
    

      if(compareData.length>1)
      {
        messageSent = await event.reply('#!client-queries-P0g8CF');
        suggestions = _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
        return{
          ...state,
          isName:false,
          isCorrect: null,
          suggestions
        }
      }
      else{
        userName = event.text; 
        isName=true;
       return {
        ...state, 
        isName,// We clone the state
        isCorrect: null, // We reset `isCorrect` (optional)ss
        userName: userName,
       
      }
    }
  }
    // if he doesnt enter anything
    else{
      return{
        ...state,
        isCorrect:null
      }
    }
  },

  continueWithoutName:async(state,event)=>{
    let continueFlow = false;
    let pattren = new RegExp('Yes|yeah|yup','i');

    if(pattren.test(event.text))
    {
      return{
        ...state,
        continueFlow:true,
        isCorrect:null
      }
    }else{
      return{
        ...state,
        continueFlow:false,
        isCorrect:null
      }
    }


  },

  welcomeToChat:async(state,event)=>{
    let messageSent,suggestions,userName;

  if(state.userInput && state.userInput === "About"){
    messageSent = await event.reply('#!client-queries-6h~ILK');
    suggestions =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
  }
  else if(state.userInput && state.userInput === "Clients")
  {
    messageSent = await event.reply('#!client-queries-KwPlpR');
    suggestions =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else if(state.userInput && state.userInput === "Projects")
  {
    messageSent = await event.reply('#!client-queries-3F~o5c');
    suggestions =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    //Begin: Added to save chat to mongodb
    // mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
    //   console.log(result);
    // });
    //End: Added to save chat to mongodb
  }
  else
  {
     messageSent = await event.reply('#!client-queries-lh~nGY');
     suggestions =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
     userName = event.text;
  }
  return {
    ...state, // We clone the state
    isCorrect: null, // We reset `isCorrect` (optional)ss
    suggestions,
    userName: userName,
    // badAnswer
  }
},

knowingTarento:(state,event)=>{
    let isCorrect,temp = false ;
    let answer;
    let index =-1;
    console.log(state.suggestions )
    // console.log(state.badAnswer);
    console.log(event.text);
    isCorrect = state.suggestions && event.text === state.suggestions.text
    if(!isCorrect)
    {
    // let FindArrayinBad =  _.find(state.badAnswer, { text: event.text });
    let FindArrayinBad =  _.find(state.suggestions, { text: event.text });
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
      let FindArrayinBad =  _.find(state.suggestions, { text: event.text });
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
