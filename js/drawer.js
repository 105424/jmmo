function initCanvas(){

  var connection = Connection();

  canvas = document.getElementById("mainCanvas");

  if( canvas.getContext )
  {
      setupCanvas();
  }

}

function setupCanvas(){
  setInterval( updateCanvas , drawSpeed );
  canvasContext = canvas.getContext("2d");

  new Testcircle(0,0);
}

function updateCanvas(){
  resizeCanvas();

  canvasContext.fillStyle = getRandomColor();
  canvasContext.fillRect( 0 , 0 , canvas.width , canvas.height );

  canvasElements.forEach(function(element){
    canvasContext.drawSvg(element.img ,element.x, element.y);
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

function resizeCanvas(){
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}