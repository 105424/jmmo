$(window).ready(function(){
  console.log("ready");


  if(getHashValue("server")){
    addres = getHashValue("server");
  };


  if ('WebSocket' in window){

    getCommandMap(function(map){
      commandMap = map;

      Connection(function(){ //Starts the Connection (js/Connection)
        inputHandlers();
      });
      
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
}

function sendUTF(msg){

  if(useTimeStamps){
    msg = JSON.parse(msg);
    msg.timeStamp = new Date().getTime();
    msg = JSON.stringify(msg);
  }

  commandMap.commands.forEach(function(command, key){
    msg = msg.replace('"'+command+'"','"'+key+'"');
  });

  connection.send(msg);
}

function parseMsg(msg){
  commandMap.commands.forEach(function(command, key){
    var find = '"'+key+'"';
    var re = new RegExp(find, 'g');

    msg = msg.replace(re,'"'+command+'"');
  });

  if(useTimeStamps){
    temp = JSON.parse(msg);
    delay = new Date().getTime() - temp.timeStamp;
    console.log("msg delayed by: "+delay);
  }

  return msg;
}

function getCommandMap(callback){
  $.get('js/commandMap.json',function(data){
    callback(data);
  });
}

function clearIntertvalArray(array){

  for(key in array){

    if( typeof array[key] === 'object') {
      clearIntertvalArray(array[key]);
    }else{
      clearInterval(array[key]);
    }
  
  }

}
