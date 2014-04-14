$(window).ready(function(){
  console.log("ready");


  if ('WebSocket' in window){
    Connection(function(){ //Starts the Connection (js/Connection)
      inputHandlers();
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

  console.log(objects[playerId].intrs[direction]);

  if(action == 'start' && objects[playerId].intrs[direction] == null){
    objects[playerId].move(direction, action);
  }else if(action == "stop"){
    objects[playerId].move(direction, action);
  }
}