var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

module.exports = {
    insertChatContentToMongoDb: (type,chatContent,callback)=>{
      //Begin: Added to connect mongodb and save webchat
      console.log("Coming here");
      MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("tarentobot");
      var tarentoChatObject = { type: "TARENTO_WEBCHAT", chatContent: chatContent, created_on : new Date(), status : 'ACTIVE' };
      dbo.collection("tarentowebchats").insertOne(tarentoChatObject, function(err, res) {
        if (err) throw err;
        console.log("1 chat inserted");
        db.close();
        });
      //End: Added to connect mongodb and save webchat
    });
  }
}
