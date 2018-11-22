module.exports = {
  text: data => {
    return { text: data.text, typing: !!data.typing }
  },

  'trivia-question': data => ({
    text: data.question,
    quick_replies: data.choices.map(choice => `<${choice.payload}> ${choice.text}`),
    typing: data.typing || '2s'
  }),
  'client-queries': data => ({
    text: data.question,
    quick_replies: data.choices.map(choice => `<${choice.payload}> ${choice.text}`),
    typing: data.typing || '2s'
  }),
  'client-queries-searchtokens': data => ({
    text: data.question,
    quick_replies: data.choices.map(choice => `<${choice.payload}> ${choice.text}`),
    typing: data.typing || '2s'
  }),
  '#translated_text': data => {
  const language = data.state.language || 'En'
    return [
      {
        typing: true,
        markdown: true,
        text: data[`text${language}`],
        'web-style': { direction: language === 'Ar' ? 'rtl' : 'ltr' }
      }
    ]
  }
}
