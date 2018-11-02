const _ = require('lodash')

module.exports = {
  id: 'client-queries-searchtokens',
  title: 'Client Questions With Sarch Tokens',
  renderer: '#client-queries-searchtokens',

  jsonSchema: {
    title: 'Client Questions With Search Tokens',
    description: 'Client Questions for Tarento bot with search Tokens',
    type: 'object',
    required: ['question', 'answer', 'searchtokens'],
    properties: {
      question: {
        type: 'string',
        title: 'Question'
      },
      answer: {
        type: 'string',
        title: 'Answer'
      },
      searchtokens: {
        type: 'string',
        title: 'searchtokens'
      },
    }
  },

  uiSchema: {
    recommendations: {
      'ui:options': {
        orderable: false
      }
    }
  },

  computeData: formData => {
    const answer = { payload: 'CLIENT_ANS', text: formData.answer }
    const searchtokens = { payload: 'CLIENT_SEARCH_TOKENS', text: formData.searchtokens }
    const choices = [answer, searchtokens]

    return {
      question: formData.question,
      choices: _.shuffle(choices)
    }
  },

  computePreviewText: formData => 'Question: ' + formData.question,
  computeMetadata: null
}
