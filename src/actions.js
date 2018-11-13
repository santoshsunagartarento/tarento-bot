const _ = require('lodash')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodbservice = require('./mongodbService');
var hitlService = require('./hitlService');
const index = require('./index')

module.exports = {

  //Begin: Added for Tarento bot
  startClientConversation:(state)=> {
console.log(state);
    return {
      ...state, // we clone the existing state
      count: 0 // we then reset the number of questions asked to `0`
    }
  },

  onReciveName:async(state,event)=> {
    
    console.log(event.text);

    let messageSent = await event.reply('#!client-queries-y~4ePV');
    let temp = messageSent.context.question.split(",");
    temp[0]= temp[0]+" "+event.text;
    temp = temp[0]+ temp[1];
    messageSent.context.question = temp;
    goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    return {
      ...state, // We clone the state
    isCorrect: null, // We reset `isCorrect` (optional)ss
    goodAnswer, // we then reset the number of questions asked to `0`
    }
   
  },

  welcomeToClientChat:async(state, event) => {
    let messageSent,goodAnswer;
    //Begin: Added to save chat to mongodb
    mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", event.text, function(err, result) {
      console.log("Chat content added to mongodb with db tarentobot and collection tarentowebchats");
    });
    //End: Added to save chat to mongodb

    if(state.userInput && state.userInput === "About"){
      messageSent = await event.reply('#!client-queries-8LzjTj');
      goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
      //Begin: Added to save chat to mongodb
      mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
        console.log(result);
      });
    }
    else if(state.userInput && state.userInput === "Clients")
    {
      messageSent = await event.reply('#!client-queries-9wiv1v');
      goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
      //Begin: Added to save chat to mongodb
      mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
        console.log(result);
      });
      //End: Added to save chat to mongodb
    }
    else if(state.userInput && state.userInput === "Services")
    {
      messageSent = await event.reply('#!client-queries-_BgQHB');
      goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
      //Begin: Added to save chat to mongodb
      mongodbservice.insertChatContentToMongoDb("TARENTO_WEBCHAT", state.userInput, function(err, result) {
        console.log(result);
      });
      //End: Added to save chat to mongodb
    }
    else
    {
      // messageSent = await event.reply('#!client-queries-y~4ePV');
       messageSent = await event.reply('#!client-queries-y~4ePV');
       temp = messageSent.context.question.split(",");
      temp[0]= temp[0]+" "+event.text;
      temp = temp[0]+ temp[1];
      messageSent.context.question = temp;
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

  answerClientQuery: (state, event) => {

    // if(state.userInput === "About")
    // {
      // const messageSent = await event.reply('#!client-queries-wu~T4r');
      // const messageSent = await event.reply('#!client-queries-8LzjTj');
      // const goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_ANS' }], 'payload');
    // }
    console.log(state);
    return {
      ...state,
      // goodAnswer
     // we then reset the number of questions asked to `0`

    }
  },

  //End: Added for Tarento bot

  startGame: state => {
    return {
      ...state, // we clone the existing state
      count: 0, // we then reset the number of questions asked to `0`
      score: 0 // and we reset the score to `0`
    }
  },

  sendRandomQuestion: async (state, event) => {
    // The `-random()` extension picks a random element in all the `trivia` Content Type
    // We also retrieve the message we just sent, notice that `event.reply` is asynchronous, so we need to `await` it
    const messageSent = await event.reply('#!trivia-random()')

    // We find the good answer
    const goodAnswer = _.find(messageSent.context.choices, { payload: 'TRIVIA_GOOD' })

    return {
      ...state, // We clone the state
      isCorrect: null, // We reset `isCorrect` (optional)
      count: state.count + 1, // We increase the number of questions we asked so far
      goodAnswer // We store the goodAnswer in the state, so that we can match the user's response against it
    }
  },

  render: async (state, event, args) => {
    if (!args.renderer) {
      throw new Error('Missing "renderer"')
    }

    await event.reply(args.renderer, args)
  },

  validateAnswer: (state, event) => {
    console.log(state.goodAnswer);
    console.log(state.goodAnswer.text);
    const isCorrect = state.goodAnswer && event.text === state.goodAnswer.text
    return { ...state, isCorrect, score: isCorrect ? state.score + 1 : state.score }
  },

  /**
   * @param {string} args.name - Name of the tag.
   * @param {string} args.value - Value of the tag.
   */
  setUserTag: async (state, event, { name, value }) => {
    await event.bp.users.tag(event.user.id, name, value)
    return { ...state }
  },

  getUserTag: async (state, event, { name, into }) => {
    const value = await event.bp.users.getTag(event.user.id, name)
    return { ...state, [into]: value }
  }
}
