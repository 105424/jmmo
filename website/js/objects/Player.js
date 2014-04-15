var Player = function(id,x,y){

  console.log("creating new Player");

  this.id = id;

  this.x = x;
  this.y = y;


  this.maxSpd = 6;
  this.spdX = 0;
  this.spdY = 0;

  this.color = getRandomColor();

  this.dom = $('<div id="'+this.id+'" class="player">');

  this.height = "100";
  this.width = "100";

  this.resize();

  this.intrs = [];

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
    this.intrs[direction] = setInterval(function(direction){
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
    clearInterval(this.intrs[direction]);
    this.intrs[direction] = null;

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