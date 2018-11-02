const _ = require('lodash')

module.exports = {
  id: 'client-queries',
  title: 'Client Questions',
  renderer: '#client-queries',

  jsonSchema: {
    title: 'Client Questions',
    description: 'Client Questions for Tarento bot',
    type: 'object',
    required: ['question', 'answer', 'recommendations'],
    properties: {
      question: {
        type: 'string',
        title: 'Question'
      },
      answer: {
        type: 'string',
        title: 'Answer'
      },
      criteria: {
        type: 'string',
        title: 'Criteria'
      },
      recommendations: {
        title: 'Recommendations',
        type: 'array',
        items: {
          type: 'string',
          default: ''
        }
      }
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
    const criteria = { payload: 'CLIENT_CRITERIA', text: formData.criteria }
    const recommendations = formData.recommendations.map(i => ({ payload: 'CLIENT_REC', text: i }))
    const choices = [answer, ...recommendations]

    return {
      question: formData.question,
      choices: _.shuffle(choices)
    }
  },

  computePreviewText: formData => 'Question: ' + formData.question,
  computeMetadata: null
}
