$(window).ready(function(){
  console.log("ready");

  if ('WebSocket' in window){
    Connection(); //Starts the Connection (js/Connection)
  } else {
     console.log("to bad"); // Browser can't use websockets
     $("html").empty();
  }

  var connection = Connection();

  canvas = document.getElementById("mainCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  
  canvasW = canvas.width;
  canvasH = canvas.height;

  if( canvas.getContext )
  {
      setup();
      setInterval( run , 33 );
  }

});

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}