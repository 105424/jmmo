var Bullet = function(x, y, spdX, spdY, shotee){

  console.log("creating new Bullet");

  this.id = 10;

  var isUniquId = false;
  while(isUniquId == false)
  {
    this.id = Math.floor((Math.random()*1000000)+1);
    if(bullets[this.id] != false){
      isUniquId = true;
    }
  }


  this.height = "200";
  this.width = "200";


  this.x = x;
  this.y = y;

  this.ownerId = shotee;

  this.maxSpd = standartPlayerMaxSpeed;
  this.spdX = spdX;
  this.spdY = spdY;

  this.dom = $('<div id="'+this.id+'" class="bullet">');

  this.resize();

  this.intrs = [];

  this.addToWindow(this,function(){
    
    bullets[this.id] = this;

    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  
  }.bind(this));
};

Bullet.prototype.addToWindow = function(parent,callback){

  var xhr = new XMLHttpRequest;
  xhr.open('get',"images/bullet.svg",true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
      var svg = xhr.responseXML.documentElement;

      parent.dom.append(svg);
      
      $("body").append(parent.dom);

      callback();
    }
  };
  xhr.send();

}


Bullet.prototype.update = function(){

  this.dom.css("left", this.x * widthRatio);
  this.dom.css("top", this.y * heightRatio);

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;

}

Bullet.prototype.resize = function(){
  this.dom.css("width", this.width * widthRatio);
  this.dom.css("height", this.height * heightRatio);
  this.dom.css("left", this.x * widthRatio);
  this.dom.css("top", this.y * heightRatio);
}

Bullet.prototype.quit = function(){
  $("#"+this.id).remove();
  for (var i = 0 ; i < this.intrs;i++)
  {
    clearInterval(this.intrs[i]);
  }
  delete bullets[this.id];
}