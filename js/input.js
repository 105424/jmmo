function inputHandlers(){


  /* W A S D */
  $("body").keydown(function(e) {
    if(e.keyCode == 87) move('up', 'start');
    if(e.keyCode == 68) move('right','start');  
    if(e.keyCode == 83) move('down','start');
    if(e.keyCode == 65) move('left','start');
  }); 

  $("body").keyup(function(e) {
      if(e.keyCode == 87) move('up', 'stop');
      if(e.keyCode == 68) move('right','stop'); 
      if(e.keyCode == 83) move('down','stop');
      if(e.keyCode == 65) move('left','stop');  
  }); 

  /* ARROW KEYS */
  $("body").keydown(function(e) {
    if(e.keyCode == 38) shoot('up', 'start');
    if(e.keyCode == 39) shoot('right','start');  
    if(e.keyCode == 40) shoot('down','start');
    if(e.keyCode == 37) shoot('left','start');
  }); 

  $("body").keyup(function(e) {
    if(e.keyCode == 38) shoot('up', 'stop');
    if(e.keyCode == 39) shoot('right','stop'); 
    if(e.keyCode == 40) shoot('down','stop');
    if(e.keyCode == 37) shoot('left','stop');  
  }); 

}

function move(direction, action){
  if(action == 'start' && objects[playerId].intrs["move"][direction] == null){
    sendUTF('{"type":"move","action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].move(direction, action);
  }else if(action == "stop"){
    sendUTF('{"type":"move","action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].move(direction, action);
  }
}

function shoot(direction, action){

  // Maybe implement key state and previeus key state?? //
  if(action == 'start' && objects[playerId].intrs["shoot"][direction] == null){
    sendUTF('{"type":"shoot", "action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].shoot(direction, action);
  }else if(action == "stop"){
    sendUTF('{"type":"shoot", "action":"'+action+'","direction":"'+direction+'","position":{"x":'+objects[playerId].x+',"y":'+objects[playerId].y+'} }');
    objects[playerId].shoot(direction, action);
  }  
}