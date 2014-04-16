var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer();
var globals = require('./globals');

var users = globals.users;

var messageStack = [];

var User = function(){
  this.connection;
  this.x;
  this.y;
  this.id;
  
  this.hp;
  this.lvl;
}; 

getCommandMap(function(map){
  globals.commandMap = map;
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

server.listen(globals.port, function() {
    console.log(' Server is listening on port 2000');
    setStackInterval();
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log('Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var user = new User();
  user.connection = request.accept(null, request.origin); 
  
  user.x = globals.startX;
  user.y = globals.startY;
  user.lvl = globals.startLvl;
  user.hp = globals.startHp;

  var a = false;
  while(a == false)
  {
    user.id = Math.floor((Math.random()*1000000)+1);
    var b = true;
    for (var i=0; i < users.length; i++) {
      if(user.id==users[i].id) b = false;
    } 
    if(b==true) a=true;
  }
  
  users.push(user);
  

  sendUTF(user.connection, '{"type":"id","user":{"id":'+user.id+',"lvl":1,"hp":1000,"x":'+user.x+',"y":'+user.y+'}}');
  
  var all  = {"type":"allUsers","users":[]};
  for (var i=0; i < users.length; i++) {
    if(users[i].id != user.id){
      var obj = {"id":users[i].id,"lvl":users[i].lvl,"hp":users[i].hp,"x":users[i].x,"y":users[i].y}
      all.users.push(obj);
    }
  } 

  sendUTF(user.connection, JSON.stringify(all));
  
  toAll('{"type":"newUser","user":{"id":'+user.id+'}}');
  console.log(user.id+" connected");
  
  user.connection.on('message', function(message) {
  if(message.type=="utf8"){
    console.log('Received Message from '+user.id);
    if(isJson(message.utf8Data))
    {
      var msg = parseMsg(message.utf8Data);
      msg = JSON.parse(msg);

      if(msg.type=="move")
      {
        //console.log(user.id+" move action: "+msg.action+" to: "+msg.direction);
        toAll(
          '{"type":"move","id":"'+user.id+'","action":"'+msg.action+'","direction":"'+msg.direction+'","position":{"x":'+msg.position.x+',"y":'+msg.position.y+'} }',
          user.id
        );
        user.x = msg.position.x;
        user.y = msg.position.y;
      }

      if(msg.type == "shoot")
      {
        toAll(
          '{"type":"shoot","id":"'+user.id+'","action":"'+msg.action+'","direction":"'+msg.direction+'","position":{"x":'+msg.position.x+',"y":'+msg.position.y+'} }',
          user.id
        );
        user.x = msg.position.x;
        user.y = msg.position.y;
      }


    }else console.log("invalid json: "+message.utf8Data);
  }
});
user.connection.on('close', function(reasonCode, description) {
  toAll('{"type":"userQuit","id":'+user.id+'}');
    for (var i=0; i < users.length; i++) {
      if(users[i].id==user.id) users.splice(i,1);
    }
  }); 
});

function toAll(msg,exeption){
 // console.log("toAll: "+msg)//+" exeption: "+exeption);
  for (var i=0; i < users.length; i++) {
    if(users[i].id != exeption)
    {
      sendUTF(users[i].connection, msg);
    }
  } 
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

function getCommandMap(callback){
  fs.readFile(__dirname + '/../website/js/commandMap.json', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
   
    if(isJson(data)){
      callback(JSON.parse(data));
    }else{
      console.log("Error reading command map");
    }
  });
}

function sendUTF(connection, msg){

  if(globals.useTimeStamps){
    msg = JSON.parse(msg);
    msg.timeStamp = new Date().getTime();
    msg = JSON.stringify(msg);
  }

  globals.commandMap.commands.forEach(function(command, key){
    msg = msg.replace('"'+command+'"','"'+key+'"');
  });

  addToStack(connection, msg);
}

function parseMsg(msg){
  globals.commandMap.commands.forEach(function(command, key){

    var find = '"'+key+'"';
    var re = new RegExp(find, 'g');

    msg = msg.replace(re,'"'+command+'"');
  });

  return msg;
}


function setStackInterval(){
  setInterval(emptyStack, globals.stackSpeed);
}

function addToStack(connection, msg){

  if(messageStack[connection] == null)
    messageStack[connection] = {"connection":connection, "msgs": []};

  messageStack[connection].msgs.push(msg);
}

function emptyStack(){

  for (stackKey in messageStack){

    message = [];
    messageStack[stackKey].msgs.forEach(function(msg){
      message.push(JSON.parse(msg));
    });

    messageStack[stackKey].connection.sendUTF(JSON.stringify(message));
  }

  messageStack = [];

}