const _ = require('lodash')

module.exports = {

  //Begin: Added for Tarento bot
  startClientConversation: state => {
    return {
      ...state, // we clone the existing state
      count: 0 // we then reset the number of questions asked to `0`
    }
  },

  welcomeToClientChat:async(state, event) => {
    const messageSent = await event.reply('#!client-queries-wu~T4r');
    // const goodAnswer = _.find(messageSent.context.choices, { payload: 'TRIVIA_REC' });
    // const messageSent = await event.reply('#!trivia-question-AwmBFO');
    // const goodAnswer = messageSent.context.choices.filter(function(ans){
    //   return ans;
    // });
    // const goodAnswer = _.find(messageSent.context.choices, { payload: 'TRIVIA_GOOD' });
    const goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_REC' }], 'payload');
    return {
      ...state, // We clone the state
      isCorrect: null, // We reset `isCorrect` (optional)ss
      goodAnswer,
      // badAnswer
    }
  },

  knowingTarento:(state,event)=>{
    console.log(state.goodAnswer )  
    // console.log(state.badAnswer);
    console.log(event.text);
    let isCorrect = state.goodAnswer && event.text === state.goodAnswer.text    
    if(!isCorrect)
    {
    // let FindArrayinBad =  _.find(state.badAnswer, { text: event.text });
    let FindArrayinBad =  _.find(state.goodAnswer, { text: event.text });
    isCorrect = FindArrayinBad?true:false;
    }
    return { ...state, isCorrect, erorr:isCorrect?null:event.text, userInput: event.text}
  },  

  answerClientQuery: (state, event) => {
    if(state.userInput === "About")
    {
      const messageSent = await event.reply('#!client-queries-wu~T4r');
      const goodAnswer =  _.pullAllBy(messageSent.context.choices, [{ payload: 'CLIENT_REC' }], 'payload');
    }
    console.log(state);
    return {
      ...state,
      goodAnswer
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
