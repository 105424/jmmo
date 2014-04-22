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

  for(element in mapTiles){
    element = mapTiles[element];

/*    distanceFromCenterX = Math.abs(element.x - objects[playerId].x);
    distanceFromCenterY = Math.abs(element.y - objects[playerId].y);*/
    distanceFromCenterX = Math.abs(element.x - offsetX - standartWidth /2);
    distanceFromCenterY = Math.abs(element.y - offsetY - standartHeight / 2);

    if( distanceFromCenterX < (standartWidth / 2) + 192 && distanceFromCenterY < (standartHeight / 2) + 108 ){
      canvasContext.drawImage(element.img ,element.x - offsetX, element.y - offsetY, element.width, element.height);
    }
  }


  for(element in canvasElements){
    element = canvasElements[element];

    elX = (element.x - element.width / 2 ) - offsetX;
    elY = (element.y - element.height / 2 ) - offsetY;

    distanceFromCenterX = Math.abs(element.x - offsetX - standartWidth /2);
    distanceFromCenterY = Math.abs(element.y - offsetY - standartHeight / 2);

    if( distanceFromCenterX < (standartWidth / 2) + 192 && distanceFromCenterY < (standartHeight / 2) + 108 ){
      canvasContext.drawImage(element.img , elX, elY, element.width, element.height);
      if(drawHitBox){
        canvasContext.beginPath();
        canvasContext.arc(element.x - offsetX , element.y - offsetY, element.radius, 0, 2 * Math.PI);
        canvasContext.stroke();
      }

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