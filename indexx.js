var centerBtn = document.getElementById('center-btn');
var span1 = document.getElementById('span1');
var span2 = document.getElementById('span2');
var span3 = document.getElementById('span3');
var span5 = document.getElementById('span5');
var centerX = centerBtn.offsetLeft;
var centerY = centerBtn.offsetTop;
console.log(centerY);
class CanvasDrawing {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.isDrawing = false;
      this.drawingData = [];
      this.arr = [];
      this.direction;
      this.lastX = 0;
      this.lastY = 0;
      this.ctx.lineWidth = 5;
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.threshold = 7000;
      this.lastMoveTime = 0;
      this.startPoint = null;
      this.lastScore = 0;
      this.ctx.strokeStyle = 'green';
      this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
      this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
      this.canvas.addEventListener("mousemove", this.drawLine.bind(this));
      this.canvas.addEventListener("mouseleave", this.warning.bind(this));
      window.addEventListener("resize", this.resizeCanvas.bind(this));
      this.resizeCanvas();
    }
  
    startDrawing(e) {
      this.isDrawing = true;
      [this.lastX, this.lastY] = [e.clientX, e.clientY];
      this.startPoint = { x: e.clientX, y: e.clientY };
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.lastMoveTime = Date.now();
      span5.innerHTML =" ";
      console.log('tHIS IS OFFSETX');
    }
  
    drawLine(e) {
      if (this.isDrawing) {
        var startX = e.clientX ;
        var startY = e.clientY ;
        //check for velocity
        const currTime = Date.now();
        const diff = currTime - this.lastMoveTime;
        if(diff>this.threshold){
          this.isDrawing = false;
          span5.innerHTML = "TOO SLOW";
          console.log('TOO SLOW');
        }
        //incrementing threshold as number of points grow
        this.threshold+=2;
        console.log(e.clientX+" CLIENT X  " + e.offsetX+"  OFFSETX");
        var dist;
        dist = Math.sqrt((centerX-startX)**2+(centerY-startY)**2);
        this.arr.push(dist);

        this.ctx.lineWidth = 5;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        //check if it is too close to the center
        if(dist<100){
          this.isDrawing = false;
          span5.innerHTML = "TOO CLOSE TO THE CENTER";
          console.log('TOO CLOSE TO CENTER');
        }
        //getting the percentage
        var returnV = this.percentage.bind(this);
        var returnValue = returnV();

        
        //space for changing the line
        const color = `rgb(${255 -(2.55*returnValue-100)}, ${2.55*returnValue - 100}, 0)`;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(startX, startY);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();








        //setting the percentage
        span1.innerHTML = Math.floor(returnValue/10);
        span1.style.color = color; 
        span2.innerHTML = ((returnValue*10)%100-(returnValue*10)%10)/10;
        span2.style.color = color;
        span3.innerHTML = (returnValue*10)%10;
        span3.style.color = color;
        // var circlecheck = this.dotCheck.bind(this);
        // this.isDrawing = circlecheck(startX, startY);
        
        this.drawingData.push({
          x: e.offsetX,
          y: e.offsetY,
          windowX: window.innerWidth,
          windowY: window.innerHeight,
          colorCh: this.ctx.strokeStyle,
          lastx:this.lastX,
          lasty:this.lastY,
          distance: dist
          
        });


        [this.lastX, this.lastY] = [e.clientX, e.clientY];

      }
    }
    warning(){
      this.isDrawing = false;
      if(span5.innerHTML===' '){
        span5.innerHTML = "DRAW A FULL CIRCLE";
      }
    }
    stopDrawing() {
      this.isDrawing = false;
      this.startPoint = null;
      const currScore =  this.percentage();
      if(currScore>this.lastScore){
        span5.innerHTML = `Best score: ` + currScore;
        this.lastScore = currScore;
      }
      this.arr = [];
    }

    percentage(){
      let std = 0;
      let stdS = 0;
      var firstDist = this.arr[0];
      var per;
      for(let i=0;i<this.arr.length;i++){
           stdS = stdS + ((this.arr[i]-firstDist)**2);
      }
      std = Math.sqrt(stdS/this.arr.length);
      per = Math.abs(100 - (std / firstDist) * 100);
      return parseFloat(per.toFixed(1));
  }
  dotCheck(currX, currY){
    var lowerBoundX = centerX - 5;
    var lowerBoundY = centerY - 5;
    var upperBoundX = centerX + 5;
    var upperBoundY = centerY + 5;
    console.log(upperBoundY + "  center  "+ centerY +"   " + lowerBoundY );
    if((currX<upperBoundX && currX>lowerBoundX)||(currY<upperBoundY&&currY>lowerBoundY)){
      return false;
    }
    return true;

  }
    resizeCanvas() {
    const currentDrawingData = this.drawingData;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    currentDrawingData.forEach(data => {
      this.ctx.lineWidth = 5;
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      console.log(data.colorCh +"THIS IS COLOR");
      this.ctx.moveTo((data.lastx/data.windowX)*window.innerWidth, (data.lasty/data.windowY)*window.innerHeight);
      this.ctx.lineTo((data.x/data.windowX)*window.innerWidth , (data.y/data.windowY)*window.innerHeight);
      this.ctx.strokeStyle = data.colorCh;
      this.ctx.stroke();
    });
    }

    // resizeCanvas() {
    //   const currentDrawingData = this.drawingData;
    //   const oldWidth = this.canvas.width;
    //   const oldHeight = this.canvas.height;
    //   const newWidth = window.innerWidth;
    //   const newHeight = window.innerHeight;
    //   this.canvas.width = newWidth;
    //   this.canvas.height = newHeight;
    //   currentDrawingData.forEach(data => {
    //     const scaleX = newWidth / oldWidth;
    //     const scaleY = newHeight / oldHeight;
    //     const scale = Math.min(scaleX, scaleY); // choose the smaller scale to preserve aspect ratio
    //     const lastX = data.lastx * scale;
    //     const lastY = data.lasty * scale;
    //     const x = data.x * scale;
    //     const y = data.y * scale;
    //     this.ctx.lineWidth = data.lineWidth * scale;
    //     this.ctx.lineJoin = 'round';
    //     this.ctx.lineCap = 'round';
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(lastX, lastY);
    //     this.ctx.lineTo(x, y);
    //     this.ctx.strokeStyle = data.colorCh;
    //     this.ctx.stroke();
    //   });
    // }
    
  }
  
  const canvas = document.getElementById("canvas");
  const drawing = new CanvasDrawing(canvas);