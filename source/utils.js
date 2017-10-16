function Initialize()
{
  shapes =  [new Shape ([ new Triangle([200,100,100,200,200,200, 255, 231, 53]),
                          new Triangle([200,200,200,100,300,200, 249, 206, 49]),
                          new Triangle([100,200,200,200,200,300, 234, 195,  0])]),
             new Shape ([ new Triangle([200,200,300,200,300,300, 58, 226, 232]),
                          new Triangle([300,200,300,100,400,200,  4, 178, 226]),
                          new Triangle([200,200,300,200,300,100, 11, 130, 198]),
                          new Triangle([300,200,400,200,300,300, 200, 200,200])])
            ];

  animStTime=millis();
  go = shapes[no].getCopy();
  goto = shapes[no].getCopy();
  gofrom = go.getCopy();

  for (let i=0; i<225; i++)
    keyStatus.push(false);
}

var emptyTriangle = new Triangle(new Array(9).fill(0));

function copyAr(org){
  var copy = [];
  for (let i=0; i<org.length; i++)
    copy.push(org[i]);
  return copy;
}

var keyStatus = [], pMouse = false;
var pressedKeys = [];

function MouseClicked() {
  if (mouseIsPressed && !pMouse) return pMouse = true;
  return false;
}

function keyClicked(id)
{
  if (typeof id == 'string') id = id.charCodeAt();

  if (keyIsDown(id) && keyStatus[id]==false) {
    pressedKeys.push(id);
    return keyStatus[id] = true;
  }
  return false;
}

function keyHeld(id) {
  if (typeof id == 'string') id = id.charCodeAt();
  return keyIsDown(id);
}

function updateNotPressed() {
  for (let i=0; i<pressedKeys.length; i++) {
    if (!keyIsDown(pressedKeys[i])) {
      keyStatus[pressedKeys[i]] = false;
      pressedKeys[i] = pressedKeys[pressedKeys.length-1];
      pressedKeys.pop(); i--;
    }
  }

  if (!mouseIsPressed) pMouse = false;
}

var mesStartTime, message = "", mesBrightness = 0, mesTime;
function newMessage() {
  mesTime = arguments.length==2 ? arguments[1]*1000 : 3000;
  mesStartTime = millis();
  mesBrightness = 255;
  message = arguments[0];
}

function messageDisplay() {
  if (!mesBrightness) return;

  if (millis()-mesStartTime > mesTime)
    mesBrightness = emove(mesBrightness, 30);

  fill(mesBrightness); noStroke(); textSize(18);
  text(message, width/2, height*0.9);
}

var colorPalette;
function generateColorPalette(hue) {
  colorPalette = createImage(300,250);
  var img = colorPalette;

  push();
    colorMode(HSB);
    img.loadPixels();
    for (let x=0; x<img.width; x++)
      for (let y=0; y<img.height; y++)
        img.set(x, y, [hue, 100*x/img.width, 100*y/img.height]);
    img.updatePixels();
  pop();

  return colorPalette;
}

/*
var h, windowScalable = true;
function windowResized() {
  if (windowScalable) {
    h = min(windowHeight, 540*windowWidth/960);
    resizeCanvas(h*16/9, h);
  }
}

function windowManager() {
  if (keyClicked('M')) {
    windowScalable ^= true;
    if (windowScalable) windowResized();
    else resizeCanvas(960,540);
  }
  if (windowScalable) scale(h/540, h/540);
  else scale(1,1);
}*/
