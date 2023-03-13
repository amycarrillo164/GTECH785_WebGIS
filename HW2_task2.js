// <!-- Create a canvas object (var canvas) form the HTML canvas element -->
// <!-- Create a 2nd drawing object(var ctx) for the canvas object -->
// <!-- Calculate the clock radius, using the height of the canvas -->
// <!-- remap the position (translate) of the drawing object to the center of the canvas -->
// <!-- Reduce the clock radius to 90% to draw the clock well inside the canvas -->

const hands = "white"
const tick = "#00001a"
const tiny_circle = "#e6e6ff"

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;

let cx,cy;



function drawFace(ctx, radius) {
    var grad;

    // draw the purple circle
    ctx.beginPath();
    ctx.arc(0,0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#9999ff';
    ctx.fill();

    // Create a raidal gradient (95% and 105% of original clock radius):
    grad = ctx.createRadialGradient(0, 0, radius, 0, 0, radius * 1.05);
    
    // CCreate 3 color stops woth the inner, middle, and out edge of the arc
    grad.addColorStop(0, '#ccccff');
    grad.addColorStop(0.5, '#e6e6ff');
    grad.addColorStop(1, '#333');

    // Define the gradient as the stroke style of the drawing object
    ctx.strokeStyle = grad;

    //Define the line width of the drawing object (10% of radius)
    ctx.lineWidth = radius * 0.1;

    //Draw the circle
    ctx.stroke();

    //Draw the clock center:
    ctx.beginPath();
    ctx.arc(0,0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    let ang;
    let num;
    
    //set the font size to 15% of the radius
    ctx.font = radius * 0.17 + "px Garamond";
    
    //set the text alignment to the middle and center of the print position
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    
    //Calculate the print position (for 12 numbers) to 85% of the radius
    //rotated (PI/6) for each
    for(num = 1; num < 13; num++) {
        ang = num * Math.PI/6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang)
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius){
    //using date to get hour, minute, second
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let milisecond = now.getMilliseconds();
    
    //calculate angle of the hour hand, and draw it a length(50%radius), and a width of 7% radius
    //hour
    hour = hour%12
    hour = (hour*Math.PI/6) +(minute*Math.PI/(6*60))+(second*Math.PI/(360*60))+(milisecond*Math.PI/(360*60*1000));
    drawHand(ctx, hour, radius*0.5, radius*0.06);
    
    //minute
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60))+(milisecond*Math.PI/(360*60*1000));
    drawHand(ctx, minute, radius*0.8, radius*0.06);

    //second
    second = (second*Math.PI/30)+ (milisecond*Math.PI/(30*1000));
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

//draws a line with a given length and width
function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.strokeStyle = hands;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

// draw ticks

function drawTicks(ctx, radius) {
    ctx.beginPath();
    ctx.strokeStyle = tick;
    const tickRadius = radius * 0.96; 
    const topTickWidth = radius * 0.01;
    const topTickLength = tickRadius - (tickRadius*0.05);
    const medTickWidth = topTickWidth * 0.65;
    const medTickLength = topTickLength * 1.03;
    const elseTickWidth = topTickWidth * 0.20;
    const elseTickLength = topTickLength * 1.05;
    
    const ticks = 360;
    for(let tick = 0; tick < ticks; tick++) {
        let tickLength;
        if(tick % 30 == 0) {
            tickLength = topTickLength
            ctx.strokeWidth = topTickWidth;
        }
        else if (tick % 6 == 0){
            tickLength = medTickLength;
            ctx.strokeWidth = medTickWidth;
        } else {
            tickLength = elseTickLength
            ctx.strokeWidth = elseTickWidth;
        }
        const angle = tick * Math.PI / 180;
        ctx.moveTo(Math.cos(angle) * tickLength, Math.sin(angle) * tickLength);
        ctx.lineTo(Math.cos(angle) * tickRadius, Math.sin(angle) * tickRadius);
        ctx.stroke();
    }
}

function drawClock(){
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    drawTicks(ctx, radius)
   }

setInterval(drawClock, 15);