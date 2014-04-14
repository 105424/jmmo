function Connection()
{
  connection = new WebSocket('ws://localhost:2000');

  connection.onopen = function(){ 

  }
  connection.onclose = function(){
    console.log('Connection closed');
  }
  connection.onerror = function(error){
    console.log('Error detected: ');
    console.log(error);
  }    
  connection.onmessage = function (message) { 
    console.log(message.data);
    if(isJson(message.data))
    {
      var msg = JSON.parse(message.data);
      
      if(msg.type=="allUsers"){
        for (var i in msg.users)
        {         
          var user = new User(msg.users[i].id, msg.users[i].x, msg.users[i].y+100);
          users[msg.users[i].id] = user;
        }
      }       
      if(msg.type=="id")
      {
        console.log("--------ID--------");
        console.log("id:"+msg.user.id);
        me = msg.user.id;
        var user = new User(msg.user.id, msg.user.x, msg.user.y,msg.user.lvl,msg.user.hp);

        users[user.id] = user;
      }
      if(msg.type=="newUser")
      {
        console.log("--------New User--------");
        console.log("New User:"+msg.user.id);
        var user = new User(msg.user.id, msg.user.x, msg.user.y);
        users[user.id] = user;
      } 
      if(msg.type=="userQuit")
      {
        console.log(msg.user);
        users[msg.user].quit();
      }
      if(msg.type=="move")
      {
        users[msg.id].move(msg.direction, msg.action, msg.position.x ,msg.position.y)     
      }
      if(msg.type=="click")
      {
        if(msg.action=="swordStorm") users[msg.id].swordStorm(20, msg.direction, msg.position.x, msg.position.y); 
        if(msg.action=="bang") users[msg.id].bang(msg.position.x, msg.position.y); 
        if(msg.action=="teleport") users[msg.id].teleport(msg.position.x, msg.position.y); 
      }
      if(msg.type=="hit")
      {
        users[msg.user].hit(msg.dmg,msg.hpLeft);
      }
      if(msg.type=="chat")
      {
        var text = msg.id+": "+msg.text;
        chatLog.push(text);
        $("#chat").append("<p class='chat'>"+text+"</p>");  
      }
      if(msg.type=="death")
      {
        users[msg.user].die();
      }     
    }else console.log("invallid json: "+message.data);
  }
}







