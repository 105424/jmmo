var Bullet = function(x, y, spdX, spdY, shotee){

  this.id = 42;

  var isUniquId = false;
  while(isUniquId == false)
  {
    this.id = Math.floor((Math.random()*1000000)+1);
    if(bullets[this.id] != false){
      isUniquId = true;
    }
  }

  this.radius = 10;

  this.x = x;
  this.y = y;

  this.startX = this.x;
  this.startY = this.y;

  this.range = 1500;


  this.ownerId = shotee;

  this.spdX = spdX;
  this.spdY = spdY;

  this.dom = document.createElementNS("http://www.w3.org/2000/svg","use");
  this.dom.setAttribute("id",this.id);
  this.dom.setAttributeNS('http://www.w3.org/1999/xlink',"xlink:href","#girlface");

  this.intrs = [];

  this.addToWindow(this,function(){
    

    this.update();

    bullets[this.id] = this;

    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  
  }.bind(this));
};

Bullet.prototype.addToWindow = function(parent,callback){

/*  var xhr = new XMLHttpRequest;
  xhr.open('get',"images/girlface.svg",true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
      var svg = xhr.responseXML.documentElement;

      $(parent.dom).append($(svg).children());
      */
      $("#main").append(parent.dom);

      callback();
/*    }
  };
  xhr.send();*/
}


Bullet.prototype.update = function(){

  this.dom.setAttribute("transform","translate("+this.x+","+this.y+")");

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;

  if( Math.abs(this.x - this.startX) + Math.abs(this.y, this.startY) > this.range){
    this.quit();
  } 

}

Bullet.prototype.quit = function(){

  $("#"+this.id).remove();

  clearIntertvalArray(this.intrs);

  delete bullets[this.id];
}