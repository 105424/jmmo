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

    distanceFromCenterX = Math.abs(element.x - offsetX - standartWidth /2);
    distanceFromCenterY = Math.abs(element.y - offsetY - standartHeight / 2);

    if( distanceFromCenterX < (standartWidth / 2) + drawExtraSpaceX && distanceFromCenterY < (standartHeight / 2) + drawExtraSpaceY ){
      canvasContext.drawImage(element.img ,element.x - offsetX, element.y - offsetY, element.width, element.height);
    }
  }


  for(element in canvasElements){
    element = canvasElements[element];

    elX = (element.x - element.width / 2 ) - offsetX;
    elY = (element.y - element.height / 2 ) - offsetY;

    distanceFromCenterX = Math.abs(element.x - offsetX - standartWidth /2);
    distanceFromCenterY = Math.abs(element.y - offsetY - standartHeight / 2);

    if( distanceFromCenterX < (standartWidth / 2) + drawExtraSpaceX && distanceFromCenterY < (standartHeight / 2) + drawExtraSpaceY ){
      canvasContext.drawImage(element.img , elX, elY, element.width, element.height);
      if(drawHitBox){
        canvasContext.beginPath();
        canvasContext.arc(element.x - offsetX , element.y - offsetY, element.radius, 0, 2 * Math.PI);
        canvasContext.stroke();
      }

    }
  }

  drawGui(canvasContext);

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


var canDrawGui = false;
function drawGui(canvasContext){

  if(!canDrawGui){
    if(images["Heart1.gif"] == null){
      images["Heart1.gif"] = document.createElement('img');
      images["Heart1.gif"].src = 'images/Heart1.gif';

     images["Heart1.gif"].onload = function(){
        canDrawGui = true;
      }
    }
  }else{
    if(typeof objects[playerId] != 'undefined' && objects[playerId] != null )
    {
      var playerHp = objects[playerId].hp;
  
      var hearts = Math.round( playerHp / 100);
  
      var x = 0;
      var y = 0;
  
      for (var i = 0 ; i < hearts; i++) {
        canvasContext.drawImage(images["Heart1.gif"], x, y, 50, 50);
        x += 50;
      }; 
    }
  }
}
