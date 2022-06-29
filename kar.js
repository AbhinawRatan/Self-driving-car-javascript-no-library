class Car{
    constructor(x,y,width,height){  //x,y are the coordinates of the center of the car
      this.x=x; //x coordinate of the center of the car
      this.y=y; //y coordinate of the center of the car
      this.width=width; //width of the car
      this.height=height; //height of the car
      this.speed=0; //speed of the car
      this.acceleration=0.2;  //acceleration of the car
      this.maxSpeed =3; //maximum speed of the car
      this.friction=0.05;
      this.angle=0;
      this.damaged=false;
      this.sensor=new Sensor(this);
      this.controls=new Controls(); //controls of the car
  
  
      //In JavaScript, the this keyword refers to an object.
  //Which object depends on how this is being invoked (used or called).
  //The this keyword refers to different objects depending on how it is used:
  
    }
    update(roadBorders,traffic){
      if(!this.damaged){
      this.#move(); //# is a symbol for private variables
      this.polygon=this.#createPolygon();
      this.damaged=this.#assessDamage(roadBorders);
      }
      this.sensor.update(roadBorders,traffic);
    }
    #assessDamage(roadBorders,traffic){
      for(let i=0;i<roadBorders.Length;i++){
          if(polysIntersect(this.polygon,roadBorders[i])){
              return true;
          }
      }
      return false;
    }
    #createPolygon(){
      const points=[];
      const rad=Math.hypot(this.width,this.height)/2;
      const alpha=Math.atan2(this.width,this.height);
      points.push({
          x:this.x-Math.sin(this.angle-alpha)*rad,
          y:this.y-Math.cos(this.angle-alpha)*rad
      });
      points.push({
          x:this.x-Math.sin(this.angle+alpha)*rad,
          y:this.y-Math.cos(this.angle+alpha)*rad
      });
      points.push({
          x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
          y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
      });
      points.push({
          x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
          y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
      });
      return points;
  }
    
      #move(){
        if(this.controls.forward){
          this.speed+=this.acceleration;
      }
      if(this.controls.reverse){
          this.speed-=this.acceleration;
      }
  
      if(this.speed>this.maxSpeed){
          this.speed=this.maxSpeed;
      }
      if(this.speed<-this.maxSpeed/2){
          this.speed=-this.maxSpeed/2;
      }
  
      if(this.speed>0){
          this.speed-=this.friction;
      }
      if(this.speed<0){
          this.speed+=this.friction;
      }
      if(Math.abs(this.speed)<this.friction){
          this.speed=0;
      }
  
      if(this.speed!=0){
          const flip=this.speed>0?1:-1;
          if(this.controls.left){
              this.angle+=0.03*flip;
          }
          if(this.controls.right){
              this.angle-=0.03*flip;
          }
      }
  
      this.x-=Math.sin(this.angle)*this.speed;
      this.y-=Math.cos(this.angle)*this.speed;
  }
  
  
    draw(ctx){  //ctx is the context of the canvas{this was the old method where we lose the details of corners the new polygon method will give us corners}
      if(this.damaged){
        ctx.fillStyle="red";
      }else{
        ctx.fillStyle="black";
      }
      ctx.beginPath();
          ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
          for(let i=1;i<this.polygon.length;i++){
              ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
          }
          ctx.fill();
        this.sensor.draw(ctx);    //this will cause the sensor to be drawn
  
    }
  }
  