$(window).ready(function(){
  console.log("ready");

  if ('WebSocket' in window){


    if(getHashValue("server")){
     addres = getHashValue("server");
    };

    offsetX = 0;
    offsetY = 0;


    /* This should really be refactord. */
/*    defineSvg("bullet",function(){
      defineSvg("circle", function(){
        defineSvg("girlface", function(){
          defineSvg("hitText", function(){
            defineSvg("rock", function(){
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
      })
    });*/

  getCommandMap(function(map){
    commandMap = map;

    Connection(function(){ //Starts the Connection (js/Connection)
      inputHandlers();
      initCanvas();

      getMap();

      resize();
      $(window).resize(resize);

      setInterval(update, updateSpeed);
    });              
  });


  } else {
     console.log("to bad"); // Browser can't use websockets
  }
});



function update(array){
  if(playerId > 0 ){
    offsetX = objects[playerId].x - standartWidth / 2;
    offsetY = objects[playerId].y - standartHeight / 2;
  }

  checkMap();

}

function resize(){
  resizeCanvas();
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


function checkMap(){

  currentX = lowerTo(offsetX, standartWidth);
  currentY = lowerTo(offsetY, standartHeight);


  if(mapState.current != currentX+","+currentY){



    for(var x = -2; x < 3; x++){
      for(var y = -2; y < 3; y++){
        
        if(y < -1 || y > 1 || x < -1 || x > 1){

          if(mapState.loaded[ (currentX - (standartWidth * x)) +","+ (currentY - (standartHeight * y)) ] != null ){
            dropMap((currentX - (standartWidth * x)) +","+ (currentY - (standartHeight * y)));
          }
        }
      }
    }

    for(var x = -1; x < 2; x++){
      for(var y = -1; y < 2; y++){
        if(mapState.loaded[ (currentX - (standartWidth * x)) +","+ (currentY - (standartHeight * y)) ] == null ){
          getMap((currentX - (standartWidth * x)) +","+ (currentY - (standartHeight * y)));
        }
      }
    }

    mapState.current = currentX+","+currentY;
  }
}

function lowerTo(number, target){
  var temp = number / target;
  temp = Math.floor(temp);

  return temp * target
}


function loadMap(map){

  console.log(map);

  var objects = {};

  for(obj in map.objects){
    obj = map.objects[obj];

    if(obj.type == "rock"){
      var rock = new Rock(obj.x + map.x, obj.y + map.y);
      objects[rock.id] = rock;
    }

  }
  map.objects = objects;


  var enemies = {};
  for(enemy in map.enemies){
    enemy = map.enemies[enemy];

    if(enemy.type == "SpriteGod"){
      var spriteGod = new SpriteGod(obj.x + map.x, obj.y + map.y);
      enemies[spriteGod.id] = spriteGod;
    }

  }
  map.enemies = enemies;


  var tiles = {};

  for(tile in map.tiles){
    tile = map.tiles[tile];
    var mapTile = new MapTile(map.x + tile.x, map.y + tile.y, tile.image);
    tiles[mapTile.id] = mapTile;
  }

  map.tiles = tiles;

  cord = map.x + "," + map.y;
  mapState.loaded[cord] = map;
}

function dropMap(cord){
  console.log("Dropping Map: "+cord);
  
  for(objId in mapState.loaded[cord].tiles){
    mapState.loaded[cord].tiles[objId].quit();
  }

  for(objId in mapState.loaded[cord].objects){
    mapState.loaded[cord].objects[objId].quit();
  }

  delete mapState.loaded[cord];
}


function getMap(cord){

  console.log("Loading map: "+cord);

  mapState.loaded[cord] = "loading";
  sendUTF('{"type":"getMap","cords":"'+cord+'" }');

}