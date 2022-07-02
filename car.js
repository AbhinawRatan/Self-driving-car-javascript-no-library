class Car{
  constructor(x,y,width,height,controlType,maxSpeed=3){ //controlType is a string
      this.x=x; //x coordinate of the center of the car
      this.y=y;
      this.width=width; //width of the car
      this.height=height;

      this.speed=0; //speed of the car
      this.acceleration=0.2;  //acceleration of the car
      this.maxSpeed=maxSpeed;
      this.friction=0.05;
      this.angle=0;
      this.damaged=false;
      this.useBrain=controlType=="AI"//this will connect our neural network/brain to the car

      if(controlType!="DUMMY"){ //if the car is not a dummy
          this.sensor=new Sensor(this); //create a sensor
          this.brain= new NeuralNetwork(
            [this.sensor.rayCount,6,4]
          );
      }
      this.controls=new Controls(controlType);  //create a controller
  }

  update(roadBorders,traffic){  //update the car's position and check for collisions
      if(!this.damaged){  //if the car is not damaged
          this.#move(); //move the car
          this.polygon=this.#createPolygon(); //create a polygon for the car
          this.damaged=this.#assessDamage(roadBorders,traffic); //check if the car is damaged
      }
      if(this.sensor){
          this.sensor.update(roadBorders,traffic);
          const offsets=this.sensor.readings.map(
            s=>s==null?0:1-s.offset
          );
          const outputs=NeuralNetwork.feedForward(offsets,this.brain)
          console.log(outputs);
          if(this.useBrain){
            this.controls.forward=outputs[0];
            this.controls.left=outputs[1];
            this.controls.right=outputs[2];
            this.controls.reverse=outputs[3];
          }
      }
  }

  #assessDamage(roadBorders,traffic){ //check if the car is damaged
      for(let i=0;i<roadBorders.length;i++){
          if(polysIntersect(this.polygon,roadBorders[i])){  //if the car intersects with a road border
              return true;
          }
      }
      for(let i=0;i<traffic.length;i++){  //if the car intersects with a traffic car
          if(polysIntersect(this.polygon,traffic[i].polygon)){  //if the car intersects with a traffic car
              return true;
          }
      }
      return false;
  }

  #createPolygon(){
      const points=[];
      const rad=Math.hypot(this.width,this.height)/2; //radius of the car
      const alpha=Math.atan2(this.width,this.height); //angle of the car
      points.push({ //top left point
          x:this.x-Math.sin(this.angle-alpha)*rad,  //x coordinate of the top left point
          y:this.y-Math.cos(this.angle-alpha)*rad
      });
      points.push({
          x:this.x-Math.sin(this.angle+alpha)*rad,  //x coordinate of the top right point
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

  #move(){  //move the car
      if(this.controls.forward){  //if the car is moving forward
          this.speed+=this.acceleration;  //increase the speed of the car
      }
      if(this.controls.reverse){  //if the car is moving backward
          this.speed-=this.acceleration;  //decrease the speed of the car
      }

      if(this.speed>this.maxSpeed){ //if the car's speed is greater than the maximum speed
          this.speed=this.maxSpeed; //set the speed to the maximum speed  
      }
      if(this.speed<-this.maxSpeed/2){  //if the car's speed is less than the maximum speed
          this.speed=-this.maxSpeed/2;  //set the speed to the maximum speed
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

  draw(ctx,color){  //draw the car
      if(this.damaged){
          ctx.fillStyle="gray"; //set the color of the car
      }else{
          ctx.fillStyle=color;  //set the color of the car
      }
      ctx.beginPath();
      ctx.moveTo(this.polygon[0].x,this.polygon[0].y);  //move to the top left point
      for(let i=1;i<this.polygon.length;i++){ //draw the car
          ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
      }
      ctx.fill();

      if(this.sensor){
          this.sensor.draw(ctx);
      }
  }
}