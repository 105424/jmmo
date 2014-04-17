$(window).ready(function(){
  console.log("ready");

  if ('WebSocket' in window){


    if(getHashValue("server")){
     addres = getHashValue("server");
    };

    offsetX = 0;
    offsetY = 0;


    /* This should really be refactord. */
    defineSvg("bullet",function(){
      defineSvg("circle", function(){
        defineSvg("girlface", function(){
          defineSvg("hitText", function(){
            getCommandMap(function(map){
              commandMap = map;

              Connection(function(){ //Starts the Connection (js/Connection)
                inputHandlers();
                setInterval(update, updateSpeed);
              });
                    
            });
          })
        })
      })
    });

  } else {
     console.log("to bad"); // Browser can't use websockets
  }

  resize();
  $(window).resize(resize);
});


function update(array){
  if(playerId > 0 ){
    offsetX = objects[playerId].x - standartWidth / 2;
    offsetY = objects[playerId].y - standartHeight / 2;
  }
}

function resize(){
  $('body').width(document.body.clientWidth);
  $('body').height(document.body.clientHeight);

/*  widthRatio = document.body.clientWidth / standartWidth;
  heightRatio = document.body.clientHeight / standartHeight;*/
}


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
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

function defineSvg(imageName, callback){

  var xhr = new XMLHttpRequest;
  xhr.open('get',"images/"+imageName+".svg",true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
      var svg = xhr.responseXML.documentElement;

      dom = document.createElementNS("http://www.w3.org/2000/svg","g");
      dom.setAttribute("id",imageName);

      $(dom).append($(svg).children());
      
      $("#defs").append(dom);

      callback();
    }
  };
  xhr.send();
}


function getHashValue(key) {  
  if(location.hash)
    return location.hash.match(new RegExp(key+'=([^&]*)'))[1];

  return false;
}

function extend(subClass, superClass) {

    var F = function() {};

    F.prototype = superClass.prototype;

    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;

    if(superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};

function getNewId(){
  var id = 0;

  var isUniquId = false;
  while(isUniquId == false)
  {
    id = Math.floor((Math.random()*1000000)+1);
    if(objects[id] != false){
      isUniquId = true;
    }
  }

  return id;

}