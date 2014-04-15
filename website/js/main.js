$(window).ready(function(){
  console.log("ready");


  if(getHashValue("server")){
    addres = getHashValue("server");
  };


  if ('WebSocket' in window){
<<<<<<< HEAD

    getCommandMap(function(map){
      commandMap = map;

      Connection(function(){ //Starts the Connection (js/Connection)
        inputHandlers();
      });
      
=======
    Connection(function(){ //Starts the Connection (js/Connection)
      inputHandlers();
>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
    });

  } else {
     console.log("to bad"); // Browser can't use websockets
  }

  resize();

  $(window).resize(resize);

});

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function resize(){
  $('body').width(document.body.clientWidth);
  $('body').height(document.body.clientHeight);

  widthRatio = document.body.clientWidth / standartWidth;
  heightRatio = document.body.clientHeight / standartHeight;

  objects.forEach(function(object){
    object.resize();
  });
}

function inputHandlers(){

  $("body").keydown(function(e) {
    if(e.keyCode == 87) move('up', 'start');
    if(e.keyCode == 65) move('left','start');
    if(e.keyCode == 83) move('down','start');
    if(e.keyCode == 68) move('right','start');  
  }); 

  $("body").keyup(function(e) {
      if(e.keyCode == 87) move('up', 'stop');
      if(e.keyCode == 65) move('left','stop');
      if(e.keyCode == 83) move('down','stop');
      if(e.keyCode == 68) move('right','stop');  
  }); 

}

function move(direction, action){
  if(action == 'start' && objects[playerId].intrs[direction] == null){
    connection.send('{"type":"move","action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].move(direction, action);
  }else if(action == "stop"){
    connection.send('{"type":"move","action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].move(direction, action);
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getHashValue(key) {
  if(location.hash)
    return location.hash.match(new RegExp(key+'=([^&]*)'))[1];

  return false;
<<<<<<< HEAD
}

function sendUTF(connection, msg){
  commandMap.commands.forEach(function(command, key){
    msg = msg.replace('"'+command+'"','"'+key+'"');
  });

  connection.sendUTF(msg);
}

function parseMsg(msg){
  commandMap.commands.forEach(function(command, key){
    msg = msg.replace('"'+key+'"','"'+command+'"')
  });

  return msg;
}

function getCommandMap(callback){
  $.get('js/commandMap.json',function(data){
    callback(data);
  });
=======
>>>>>>> 9536d71f8b1f6a13863165623d04e864a3b702ba
}