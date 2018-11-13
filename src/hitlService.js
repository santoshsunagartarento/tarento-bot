module.exports = {
      pauseChatAndNotify: (event,callback)=>{
        event.bp.hitl.pause(event.platform, event.user.id);
        event.bp.notifications.send({
          message: event.user.first_name + ' wants to talk to a human',
          level: 'info',
          url: '/modules/botpress-hitl'
        })
    }
  }
