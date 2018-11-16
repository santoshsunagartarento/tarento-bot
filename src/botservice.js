module.exports = {
    isQuestion: (chatContent,callback)=>{
    let isQuestion=false;
    if(chatContent.length > 0) {
      let aboutPattren = new RegExp('about','i');
      let projectsPattren = new RegExp('projects|project','i');
      let clientsPattren = new RegExp ('cleints|client','i');
      let helloPattren = new RegExp('hlo|hello|hii|hi','i');
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
    } else {
      return isQuestion;
    }
    return isQuestion;
  }
}
