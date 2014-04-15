var Player = function(id,x,y){

  console.log("creating new Player");

  this.id = id;

  this.x = x;
  this.y = y;


  this.maxSpd = standartPlayerMaxSpeed;
  this.spdX = 0;
  this.spdY = 0;

  this.bulletSpeed = standartPlayerBulletSpeed;

  this.color = getRandomColor();

  this.dom = $('<div id="'+this.id+'" class="player">');

  this.height = "60";
  this.width = "60";

  this.resize();

  this.intrs = [];
  this.intrs["move"] = [];
  this.intrs["shoot"] = [];

  this.addToWindow(this,function(){
    
    objects[this.id] = this;

    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  
  }.bind(this));
};

Player.prototype.addToWindow = function(parent,callback){

  var xhr = new XMLHttpRequest;
  xhr.open('get',"images/circle.svg",true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
      var svg = xhr.responseXML.documentElement;
      
      $(svg).find("circle").attr("fill",parent.color);

      parent.dom.append(svg);
      
      $("body").append(parent.dom);

      callback();
    }
  };
  xhr.send();

}

Player.prototype.update = function(){
  //this.x += 1;

  this.dom.css("left", this.x * widthRatio);
  this.dom.css("top", this.y * heightRatio);

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;

}

Player.prototype.resize = function(){
  this.dom.css("width", this.width * widthRatio);
  this.dom.css("height", this.height * heightRatio);
  this.dom.css("left", this.x * widthRatio);
  this.dom.css("top", this.y * heightRatio);
}

Player.prototype.move = function(direction, action, x, y){

  if(x != undefined){
    this.x = x; 
  }
  if(y != undefined){
    this.y = y;
  }

  if(action == "start"){
    this.intrs["move"][direction] = setInterval(function(direction){
      if(direction == "right"){
        if(this.spdX < this.maxSpd)
          this.spdX += 1;
      }else if (direction == "left"){
        if(this.spdX > this.maxSpd * -1)
          this.spdX -= 1;
      }else if(direction == "up"){
        if(this.spdY > this.maxSpd * -1)
          this.spdY -= 1;
      }else if (direction = "down"){
        if(this.spdY < this.maxSpd)
        this.spdY += 1;
      }
    }.bind(this),updateSpeed,direction);

  }else if (action == "stop"){
    clearInterval(this.intrs["move"][direction]);
    this.intrs["move"][direction] = null;

    if(direction == "right"){
      this.spdX = 0;
    }else if (direction == "left"){
      this.spdX = 0;
    }else if(direction == "up"){
      this.spdY = 0;
    }else if (direction = "down"){
      this.spdY = 0;
    }

  }
}

Player.prototype.quit = function(){
  $("#"+this.id).remove();
  for (var i = 0 ; i < this.intrs;i++)
  {
    clearInterval(this.intrs[i]);
  }
  delete objects[this.id];
}

Player.prototype.shoot = function(direction, action, x, y){

  if(x != null)
    this.x = x;
  if(y != null)
    this.y = y;

  if(action == "start"){
    this.intrs["shoot"][direction] = setInterval(function(direction){

      offsetX = this.width / 2;
      offsetY = this.height / 2;

      if(direction == "up")
        new Bullet(this.x + offsetX, this.y + offsetY, 0, -this.bulletSpeed, this.id);
      if(direction == "right")
        new Bullet(this.x + offsetX, this.y + offsetY, this.bulletSpeed, 0, this.id);
      if(direction == "down")
        new Bullet(this.x + offsetX, this.y + offsetY, 0, this.bulletSpeed, this.id);
      if(direction == "left")
        new Bullet(this.x + offsetX, this.y + offsetY, -this.bulletSpeed, 0, this.id);
      
    }.bind(this),100,direction);
  }
  if(action == "stop"){
    clearInterval(this.intrs["shoot"][direction]);
    this.intrs["shoot"][direction] = null;
  }
}