const _ = require('lodash')

module.exports = {
  id: 'translated_text',
  title: 'Translated Text',
  renderer: '#translated_text',
  jsonSchema: {
    title: 'Text Message',
    description: 'A normal text message with translations',
    type: 'object',
    required: ['textEn', 'textAr'],
    properties: {
      textEn: { type: 'string', title: 'Text (English)' },
      textAr: { type: 'string', title: 'Text (Arabic)' }
    }
  },
  uiSchema: {},
  computeFormData: formData => formData,
  computeData: formData => formData,
  computePreviewText: formData => formData.textEn + ' / ' + formData.textAr,
  computeMetadata: null
}
