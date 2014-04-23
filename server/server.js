var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer();
var globals = require('./globals');

var users = globals.users;
var map = globals.map;

var enemies = globals.enemies;

var messageStack = {};

var Map = function(x,y){
  this.x = x;
  this.y = y;

  this.users = [];
  this.npcs = [];
  this.enemies = [];
  this.objects = [];
  this.tiles = {};
}

var User = function(){
  
  this.connection;

  this.id = generateId();

  this.x = globals.startX;
  this.y = globals.startY;
  this.lvl = globals.startLvl;
  this.hp = globals.startHp;

}; 

var Enemy = function(type, x,y,hp){
  this.id = generateId();

  this.type = type;

  this.x = x;
  this.y = y;
  this.hp = hp;

  enemies[this.id] = this;
}; 

getCommandMap(function(map){
  globals.commandMap = map;
});

autoGenerateMap();

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

  users[user.id] = user;
  
  sendUTF(user.id, 
    '{"type":"id", "user":{ "id":'+user.id+', "lvl":1, "hp":1000, "x":'+user.x+', "y":'+user.y+', "color":"'+user.color+'" } }'
  );
  
  var all  = {"type":"allUsers","users":[]};

  for ( i in users) {
    if(users[i].id != user.id){
      var obj = {
        "id":users[i].id,
        "lvl":users[i].lvl,
        "hp":users[i].hp,
        "x":users[i].x,
        "y":users[i].y,
        "color":users[i].color
      }
      
      all.users.push(obj);
    }
  }

  sendUTF(user.id, JSON.stringify(all));
  
  toAll(' { "type":"newUser", "user":{ "id":'+user.id+', "color":"'+user.color+'" } }');
  console.log(user.id+" connected");
  
  user.connection.on('message', function(message) {
    if(message.type=="utf8"){
      console.log('Received Message from '+user.id);
      if(isJson(message.utf8Data))
      {

        var msgArray = JSON.parse(parseMsg(message.utf8Data));

        for (key in msgArray){
          
          var msg = msgArray[key];

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

          if(msg.type == "getMap")
          {

            if( map[msg.cords] ) {

              var message = { "type":"mapData" };
              message.map = map[msg.cords];

              sendUTF(user.id, JSON.stringify(message));

            }else{
              console.log("The requested cordinates where not a map cordinate. x: "+msg.x+" y:"+msg.y);
            }
          }    
        }    
      } else console.log("invalid json: "+message.utf8Data);
    }
  });

  user.connection.on('close', function(reasonCode, description) {
    toAll('{"type":"userQuit","id":'+user.id+'}');
    delete users[user.id];
  }); 
});

function toAll(msg,exeption){
 // console.log("toAll: "+msg)//+" exeption: "+exeption);

  for (i in users){
    if(users[i].id != exeption)
    {
      sendUTF(users[i].id, msg);
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

function sendUTF(userId, msg){

  if(globals.useTimeStamps){
    msg = JSON.parse(msg);
    msg.timeStamp = new Date().getTime();
    msg = JSON.stringify(msg);
  }

  globals.commandMap.commands.forEach(function(command, key){
    msg = msg.replace('"'+command+'"','"'+key+'"');
  });

  addToStack(userId, msg);
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

function addToStack(userId, msg){
  if( typeof messageStack[userId] == 'undefined'){
    messageStack[userId] = [];
  }

  messageStack[userId].push(msg);
}

function emptyStack(){

  for (userId in messageStack){

    if(users[userId] == null){
      console.log("fail");
      /*
        When a user quits the stack of the user should be emptied but somehow delete mmessageStack[userId] doesn't do the trick
        Should be fixed probaply
      */
      continue;
    }

    if(messageStack[userId].length > 0 ){
      message = [];
      messageStack[userId].forEach(function(msg){
        message.push(JSON.parse(msg));
      });

      users[userId].connection.sendUTF(JSON.stringify(message));
    }
  }

  messageStack = {};

}

function emptyStackFromUser(userId){
  delete messageStack[userId];
}

function autoGenerateMap(){
  
  for (var y = -20; y < 20; y++) {
    for (var x = -20; x < 20; x++) { 

      var tileMap = new Map(x*1920, y*1080);


      var tiles = {};

      for(var f1 = 0; f1 < 10; f1++){
        for(var f2 = 0; f2 < 10; f2++){
          tiles[f1*192+","+f2*108] = {
            'x':f1*192,
            'y':f2*108,
            "image":"tile-1"
          }
        }
      }

      tileMap['tiles'] = tiles;

      for(var i = 0; i < 5; i++){

        tX = Math.floor((Math.random()*1920)+1);
        tY = Math.floor((Math.random()*1080)+1);

        tileMap.objects.push(
          {
            "type":"rock",
            "x":tX,
            "y":tY
          }
        );
      }

      for(var i = 0; i < 3; i++){

        tX = Math.floor((Math.random()*1920)+1);
        tY = Math.floor((Math.random()*1080)+1);

        tileMap.enemies.push(new Enemy("spriteGod",tX,tY,2000));
      }


      map[x*1920+","+y*1080] = tileMap;

    }
  }

  console.log("Loaded Map");

}

function generateId(){
  var a = false;
  var id;

  while(a == false)
  {
    var id = Math.floor((Math.random()*1000000)+1);
    var b = true;
    for (key in users) {
      if(id == key) b = false;
    } 
    for (key in enemies) {
      if(id == key) b = false;
    } 

    if(b==true) a=true;
  }

  return id;
}