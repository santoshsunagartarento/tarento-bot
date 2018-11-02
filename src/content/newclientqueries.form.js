const _ = require('lodash')

module.exports = {
  id: 'client-queries',
  title: 'Client Questions',
  renderer: '#client-queries',

  jsonSchema: {
    title: 'Client Questions',
    description: 'Client Questions for Tarento',
    type: 'object',
    required: ['question', 'recommendations'],
    properties: {
      question: {
        type: 'string',
        title: 'Question'
      },
      recommendations: {
        title: 'recommendations',
        type: 'array',
        items: {
          type: 'string',
          default: ''
        }
      }
    }
  },

  uiSchema: {
    bad: {
      'ui:options': {
        orderable: false
      }
    }
  },

  computeData: formData => {
    const recommendations = formData.recommendations.map(i => ({ payload: 'TRIVIA_REC', text: i }))
    const choices = [recommendations]

    return {
      question: formData.question,
      choices: _.shuffle(choices)
    }
  },

  computePreviewText: formData => 'Question: ' + formData.question,
  computeMetadata: null
}
