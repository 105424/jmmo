var DrawableObject = function(args){
  
  this.spdX = 0;
  this.spdY = 0;

  this.hard = true; // Should it be stored in the objects array

  for( key in args){
    this[key] = args[key];
  }

  this.dom = document.createElementNS("http://www.w3.org/2000/svg","use");
  this.dom.setAttribute("id",this.id);
  this.dom.setAttributeNS('http://www.w3.org/1999/xlink',"xlink:href","#"+this.image);

  this.intrs = [];


  this.width = $("#"+this.image)[0].getBBox().width;
  this.height = $("#"+this.image)[0].getBBox().height;

  this.addToWindow(this,function(){

    if(this.hard){
      objects[this.id] = this;
    }
    
    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  
  }.bind(this));
}

DrawableObject.prototype.addToWindow = function(parent, callback) {

  parent.update();

  parent.dom.setAttribute("fill",this.color);
  $("#main").append(parent.dom);

  callback();
};

DrawableObject.prototype.update = function(){

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;

  this.dom.setAttribute("transform","translate("+(this.x - this.width / 2)+ ","+(this.y - this.width / 2)+")");
}

DrawableObject.prototype.quit = function(){
  
  $("#"+this.id).remove();

  clearIntertvalArray(this.intrs);

  delete objects[this.id];
}