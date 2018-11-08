const _ = require('lodash')
const jsdoc = require('jsdoc-api')

const renderers = require('./renderers')
const actions = require('./actions')

module.exports = bp => {
  ////////////////////////////
  /// INITIALIZATION
  ////////////////////////////

  // Register all renderers
  Object.keys(renderers).forEach(name => {
    bp.renderers.register(name, renderers[name])
  })

  jsdoc.explain({ files: [__dirname + '/actions.js'] }).then(docs => {
    bp.dialogEngine.registerActionMetadataProvider(fnName => {
      const meta = docs.find(({ name }) => name === fnName)
      return {
        desciption: meta.description,
        params: (meta.params || [])
          .filter(({ name }) => name.startsWith('args.'))
          .map(arg => ({ ...arg, name: arg.name.replace('args.', '') }))
      }
    })
    bp.dialogEngine.registerFunctions(actions)
  })

  ////////////////////////////
  /// Conversation Management
  ////////////////////////////

  bp.hear(/\/forget/i, async (event, next) => {
    await bp.users.untag(event.user.id, 'nickname')
    // By not calling next() here, we "swallow" the event (won't be processed by the dialog engine below)
  })

  // All events that should be processed by the Flow Manager
  bp.hear({ type: /text|message|quick_reply/i }, (event, next) => {
    bp.dialogEngine.processMessage(event.sessionId || event.user.id, event).then()
  })


  //Begin: Added changes for Human in the loop
    bp.middlewares.load()

    bp.hear(/HITL_START/, (event, next) => {
      bp.messenger.sendTemplate(event.user.id, {
        template_type: 'button',
        text: 'Bot paused, a human will get in touch very soon.',
        buttons: [{
          type: 'postback',
          title: 'Cancel request',
          payload: 'HITL_STOP'
        }]
      })

      bp.notifications.send({
        message: event.user.first_name + ' wants to talk to a human',
        level: 'info',
        url: '/modules/botpress-hitl'
      })
      bp.hitl.pause(event.platform, event.user.id)
    })

    bp.hear(/HITL_STOP/, (event, next) => {
      bp.messenger.sendText(event.user.id, 'Human in the loop disabled. Bot resumed.')
      bp.hitl.unpause(event.platform, event.user.id)
    })

    bp.hear({ type: 'message', text: /.+/i }, (event, next) => {
      bp.messenger.sendText(event.user.id, 'You said: ' + event.text)
    })
    //End: Added changes for Human in the loop


}
