var SpriteGod = function(id,x,y){

  this.image = "spriteGod";

  this.width = 420;
  this.height = 420;
  this.radius = 100;

  this.dmg = 10;

  SpriteGod.superclass.constructor.call(this,{
    "id":id,
    "x":x,
    "y":y,
    "imageType":"png"
  });

  this.faction = "enemys";
  this.type = "enemy";


  this.maxSpd = 8;
  this.bulletSpeed = 15;
  this.shootSpeed = 500;

  this.bulletType = SpriteStar;


  this.shoot("up","start");
  this.shoot("left","start");
  this.shoot("down","start");
  this.shoot("right","start");

  this.intrs['collison'] = setInterval(this.collisionCheck.bind(this),collisionCheckSpeed);

};
extend(SpriteGod, DrawableObject);

SpriteGod.prototype.move = function(direction, action, x, y){

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

SpriteGod.prototype.shoot = function(direction, action, x, y){

  if(x != undefined){
    this.x = x;
  }
  if(y != undefined){
    this.y = y;
  }

  if(action == "start"){
    this.intrs["shoot"][direction] = setInterval(function(direction){

      if(direction == "up")
        new this.bulletType(this.x, this.y, 0, -this.bulletSpeed, this);
      if(direction == "right")
        new this.bulletType(this.x, this.y, this.bulletSpeed, 0, this);
      if(direction == "down")
        new this.bulletType(this.x, this.y, 0, this.bulletSpeed, this);
      if(direction == "left")
        new this.bulletType(this.x, this.y, -this.bulletSpeed, 0, this);
      
    }.bind(this),this.shootSpeed,direction);
  }

  if(action == "stop"){
    clearInterval(this.intrs["shoot"][direction]);
    this.intrs["shoot"][direction] = null;
  }

}

SpriteGod.prototype.hasHit = function(object){

}

SpriteGod.prototype.wasHit = function(object){

  var dmg = object.dmg;

  if(object.type == "bullet"){
    object = objects[object.ownerId];
  }

  if(object.id == playerId){

    var msg = {};
    msg.type = "enemyHit";
    msg.id = this.id;
    msg.dmg = dmg;

    sendUTF(JSON.stringify(msg));
  }

  new HitText(this.x, this.y - this.width /4 ,"-100");

}
