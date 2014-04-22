function initCanvas(){
  canvas = document.getElementById("mainCanvas");

  if( canvas.getContext )
  {
      setupCanvas();
  }

}

function setupCanvas(){
  setInterval( updateCanvas , drawSpeed );
  canvasContext = canvas.getContext("2d");

  resizeCanvas();

}

function updateCanvas(){

  canvasContext.clearRect(0,0,canvas.width,canvas.height)

  for(element in canvasElements){
    element = canvasElements[element];
    canvasContext.drawImage(element.img ,element.x - offsetX, element.y - offsetY, element.width, element.height);


    if(drawHitBox){
      canvasContext.beginPath();
      canvasContext.arc(element.x - offsetX , element.y - offsetY, element.radius, 0, 2 * Math.PI);
      canvasContext.stroke();
    }

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

function resizeCanvas(){
  canvas.width = standartWidth;
  canvas.height = standartHeight;

  widthRatio = document.body.clientWidth / standartWidth;
  heightRatio = document.body.clientHeight / standartHeight;

  canvasContext.scale(widthRatio,heightRatio);

}