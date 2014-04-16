var Player = function(id,x,y){

  console.log("creating new Player");

  this.id = id;

  this.radius = 20;

  this.x = x;
  this.y = y;

  this.maxSpd = standartPlayerMaxSpeed;
  this.spdX = 0;
  this.spdY = 0;

  this.bulletSpeed = standartPlayerBulletSpeed;

  this.color = getRandomColor();

  this.dom = document.createElementNS("http://www.w3.org/2000/svg","g");
  this.dom.setAttribute("id",this.id);
  
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

      $(parent.dom.setAttribute("fill",getRandomColor()));

      $(parent.dom).append($(svg).children());
      
      $("#main").append(parent.dom);

      callback();
    }
  };
  xhr.send();

}

Player.prototype.update = function(){

  this.dom.setAttribute("transform","translate("+this.x+","+this.y+")");

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;

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
          this.spdX += standartPlayerAccSpeed;
      }else if (direction == "left"){
        if(this.spdX > this.maxSpd * -1)
          this.spdX -= standartPlayerAccSpeed;
      }else if(direction == "up"){
        if(this.spdY > this.maxSpd * -1)
          this.spdY -= standartPlayerAccSpeed;
      }else if (direction = "down"){
        if(this.spdY < this.maxSpd)
        this.spdY += standartPlayerAccSpeed;
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
  
  clearIntertvalArray(this.intrs);

  delete objects[this.id];
}

Player.prototype.shoot = function(direction, action, x, y){

  if(x != null)
    this.x = x;
  if(y != null)
    this.y = y;

  if(action == "start"){
    this.intrs["shoot"][direction] = setInterval(function(direction){

      if(direction == "up")
        new Bullet(this.x, this.y, 0, -this.bulletSpeed, this.id);
      if(direction == "right")
        new Bullet(this.x, this.y, this.bulletSpeed, 0, this.id);
      if(direction == "down")
        new Bullet(this.x, this.y, 0, this.bulletSpeed, this.id);
      if(direction == "left")
        new Bullet(this.x, this.y, -this.bulletSpeed, 0, this.id);
      
    }.bind(this),100,direction);
  }

  if(action == "stop"){
    clearInterval(this.intrs["shoot"][direction]);
    this.intrs["shoot"][direction] = null;
  }

}