var Player = function(id, x, y, hp){

  this.image = "wizard";

  this.color = "#"+id.toString().substring(0,3);

  this.width = 50;
  this.height = 50;
  this.radius = 20;

  Player.superclass.constructor.call(this,{
    "id":id,
    "x":x,
    "y":y,
    "imageType":"png",
    "hp":hp
  });

  this.faction = "players";

  this.maxSpd = standartPlayerMaxSpeed;

  this.spdX;
  this.spdY;

  this.bulletSpeed = standartPlayerBulletSpeed;
  this.shootSpeed = standartPlayerShootSpeed;

  this.intrs["move"] = [];
  this.intrs["shoot"] = [];

  this.intrs['collison'] = setInterval(this.collisionCheck.bind(this),collisionCheckSpeed);

};
extend(Player, DrawableObject);

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

Player.prototype.shoot = function(direction, action, x, y){

  if(x != undefined){
    this.x = x;
  }
  if(y != undefined){
    this.y = y;
  }

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
      
    }.bind(this),this.shootSpeed,direction);
  }

  if(action == "stop"){
    clearInterval(this.intrs["shoot"][direction]);
    this.intrs["shoot"][direction] = null;
  }

}

Player.prototype.hasHit = function(object){

}

Player.prototype.wasHit = function(object){

  var dmg = object.dmg;

  if(object.type == "bullet"){
    object = objects[object.ownerId];
  }

  if(this.id == playerId){

    var msg = {};
    msg.type = "playerHit";
    msg.id = this.id;
    msg.dmg = dmg;

    sendUTF(JSON.stringify(msg));
  }

  this.hp = this.hp - dmg;

  new HitText(this.x, this.y - this.width /4 ,"-100");

}

Player.prototype.die = function(){
  this.x = 0;
  this.y = 0;
  this.hp = 1000;
}