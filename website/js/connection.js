function Connection(callback)
{
  
  console.log("connection to: "+'ws://'+addres+':'+port);
  connection = new WebSocket('ws://'+addres+':'+port);


  connection.onopen = function(){ 

    if(callback){
      callback();
    }

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
<<<<<<< HEAD
      var msg = parseMsg(message.data);
      msg = JSON.parse(msg);
=======
      var msg = JSON.parse(message.data);
>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
      
      if(msg.type=="allUsers"){

        msg.users.forEach(function(user){
<<<<<<< HEAD
=======

          console.log(user);

>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
          new Player(user.id, user.x, user.y)
        });

      }       
      if(msg.type=="id")
      {

<<<<<<< HEAD
=======

        console.log(msg.user);

>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
        console.log("--------ID--------");
        console.log("id:"+msg.user.id);

        playerId = msg.user.id;




        new Player(playerId,msg.user.x,msg.user.y);
      }
      if(msg.type=="newUser")
      {
        if(msg.user.id != playerId){
          console.log("--------New Player--------");
          console.log("New Player:"+msg.user.id);
          console.log(msg.user);

          new Player(msg.user.id, msg.user.x, msg.user.y);
        }
      } 
      if(msg.type=="userQuit")
      {
<<<<<<< HEAD

        console.log(msg);

        console.log("------Delete Player -----");
        console.log("Deleted Player:"+msg.id);
        objects[msg.id].quit();
=======
        console.log("------Delete Player -----");
        console.log("Deleted Player:"+msg.user.id);
        objects[msg.user.id].quit();
>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
      }
      if(msg.type=="move")
      {
        objects[msg.id].move(msg.direction, msg.action, msg.position.x ,msg.position.y)     
      }
/*      if(msg.type=="click")
      {
        if(msg.action=="swordStorm") users[msg.id].swordStorm(20, msg.direction, msg.position.x, msg.position.y); 
        if(msg.action=="bang") users[msg.id].bang(msg.position.x, msg.position.y); 
        if(msg.action=="teleport") users[msg.id].teleport(msg.position.x, msg.position.y); 
      }*/
      if(msg.type=="hit")
      {
       // objects[msg.user.id].hit(msg.dmg, msg.hpLeft);
      }
      if(msg.type=="chat")
      {
/*        var text = msg.id+": "+msg.text;
        chatLog.push(text);
        $("#chat").append("<p class='chat'>"+text+"</p>");  */
      }
      if(msg.type=="death")
      {
        objects[msg.user.id].die();
      }     
    }else console.log("invallid json: "+message.data);
  }
}







