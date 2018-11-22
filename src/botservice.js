module.exports = {
    isQuestion: (chatContent,callback)=>{
    let isQuestion=false;
    if(chatContent.length > 0) {
      let aboutPattren = new RegExp('about','i');
      let projectsPattren = new RegExp('projects|project','i');
      let clientsPattren = new RegExp ('cleints|client','i');
      let helloPattren = new RegExp('hlo|hello|hii|hi','i');
      let applicationPattren = new RegExp('Application','i');
      let mobility = new RegExp('Mobility|mobility|native|mobile','i');
      let qualityAssurance = new RegExp('Quality|Assurance|qa|testing','i');
      let netops = new RegExp('Netops|infra|devo','i');

      if(aboutPattren.test(chatContent))
      {
        isQuestion=true;
      }else if(projectsPattren.test(chatContent))
      {
        isQuestion=true;
      }
      else if(clientsPattren.test(chatContent))
      {
        isQuestion=true;
      }
      else if(applicationPattren.test(chatContent))
      {
        isQuestion=true;
      }
      else if(mobility.test(chatContent))
      {
        isQuestion=true;
      }
      else if(qualityAssurance.test(chatContent))
      {
        isQuestion=true;
      }
      else if(netops.test(chatContent))
      {
        isQuestion=true;
      }
    } else {
      return isQuestion;
    }
    return isQuestion;
  }
}
