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
    if(isJson(message.data))
    {
      var msgArray = JSON.parse(parseMsg(message.data));

      for (key in msgArray){
        
        var msg = msgArray[key];

        if(useTimeStamps){
          delay = new Date().getTime() - msg.timeStamp;
          console.log("msg delayed by: "+delay);
        }

        if(msg.type=="allUsers"){

          msg.users.forEach(function(user){
            new Player(user.id, user.x, user.y).color = user.color;
          });

        }       
        if(msg.type=="id")
        {

          console.log("--------ID--------");
          console.log("id:"+msg.user.id);

          playerId = msg.user.id;

          new Player(playerId,msg.user.x,msg.user.y).color = msg.user.color;
        }
        if(msg.type=="newUser")
        {
          if(msg.user.id != playerId){
            console.log("--------New Player--------");
            console.log("New Player:"+msg.user.id);
            new Player(msg.user.id, msg.user.x, msg.user.y).color = msg.user.color;
          }
        } 
        if(msg.type=="userQuit")
        {

          console.log("------Delete Player -----");
          console.log("Deleted Player:"+msg.id);
          objects[msg.id].quit();
        }
        if(msg.type=="move")
        {
          objects[msg.id].move(msg.direction, msg.action, msg.position.x ,msg.position.y)     
        }
        if(msg.type == "shoot")
        {
          objects[msg.id].shoot(msg.direction, msg.action, msg.position.x, msg.position.y)
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

          console.log("killing:"+ msg.id);

          if(objects[msg.id]){
            objects[msg.id].die();
          }
        }     

        if(msg.type == 'mapData'){
          loadMap(msg.map);
        }
      }
    }else console.log("invallid json: "+message.data);
  }
}

function setStackInterval(){
  setInterval(emptyStack, stackSpeed);
}

function addToStack(msg){
  messageStack.push(msg);
}

function emptyStack(){

  if(messageStack.length > 0){
    var message = [];
    messageStack.forEach(function(msg){
      message.push(JSON.parse(msg));
    });

    connection.send(JSON.stringify(message));

    messageStack = [];
  }
}

function sendUTF(msg){

  if(useTimeStamps){
    msg = JSON.parse(msg);
    msg.timeStamp = new Date().getTime();
    msg = JSON.stringify(msg);
  }

  commandMap.commands.forEach(function(command, key){
    var find = '"'+command+'"';
    var re = new RegExp(find, 'g');

    msg = msg.replace(re,'"'+key+'"');  });

  addToStack(msg);
}

function parseMsg(msg){

  commandMap.commands.forEach(function(command, key){
    var find = '"'+key+'"';
    var re = new RegExp(find, 'g');

    msg = msg.replace(re,'"'+command+'"');
  });

  return msg;
}