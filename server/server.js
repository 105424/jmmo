var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer();
var globals = require('./globals');

var users = globals.users;

server.listen(globals.port, function() {
    console.log(' Server is listening on port 2000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

 var User = function(){
  this.connection;
  this.x;
  this.y;
  this.id;
  
  this.hp;
  this.lvl;
}; 


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
  
  user.connection.sendUTF('{"type":"id","user":{"id":'+user.id+',"lvl":1,"hp":1000,"x":'+user.x+',"y":'+user.y+'}}');  
  
  var all  = {"type":"allUsers","users":[]};
  for (var i=0; i < users.length; i++) {
    if(users[i].id != user.id){
      var obj = {"id":users[i].id,"lvl":users[i].lvl,"hp":users[i].hp,"x":users[i].x,"y":users[i].y}
      all.users.push(obj);
    }
  } 
  user.connection.sendUTF(JSON.stringify(all));
  
  toAll('{"type":"newUser","user":{"id":'+user.id+'}}');
  console.log(user.id+" connected");
  
  user.connection.on('message', function(message) {
  if(message.type=="utf8"){
    console.log('Received Message from '+user.id);
    if(isJson(message.utf8Data))
    {
      var msg = JSON.parse(message.utf8Data);

      if(msg.type=="move")
      {
        console.log(user.id+" move action: "+msg.action+" to: "+msg.direction);
        toAll(
          '{"type":"move","id":"'+user.id+'","action":"'+msg.action+'","direction":"'+msg.direction+'","position":{"x":'+msg.position.x+',"y":'+msg.position.y+'} }',
          user.id
        );
        user.x = msg.position.x;
        user.y = msg.position.y;
      }


    }else console.log("invalid json: "+message.utf8Data);
  }
  });
  user.connection.on('close', function(reasonCode, description) {
    toAll('{"type":"userQuit","user":'+user.id+'}');
    for (var i=0; i < users.length; i++) {
      if(users[i].id==user.id) users.splice(i,1);
    }
  }); 
});


function toAll(msg,exeption){
  console.log("toAll: "+msg)//+" exeption: "+exeption);
  for (var i=0; i < users.length; i++) {
    if(users[i].id != exeption)
    {
      users[i].connection.sendUTF(msg);
    }
  } 
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}