var Player = function(id,x,y){

  console.log("creating new Player");

  this.id = id;
  this.x = x;
  this.y = y;
  this.dom = $('<div class="player">');

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
}

Player.prototype.resize = function(){
  this.dom.css("width", this.width * widthRatio);
  this.dom.css("height", this.height * heightRatio);
  this.dom.css("left", this.x * widthRatio);
  this.dom.css("top", this.y * heightRatio);
}

Player.prototype.move = function(direction, action){
  if(action == "start"){
    this.intrs[direction] = setInterval(function(){
      if(direction == "right"){
        this.x += 2;
      }else if (direction == "left"){
        this.x -= 2;
      }else if(direction == "up"){
        this.y -= 2;
      }else if (direction = "down"){
        this.y += 2;
      }
    }.bind(this),updateSpeed,direction);

  }else if (action == "stop"){
    clearInterval(this.intrs[direction]);
    this.intrs[direction] = null;
  }
}