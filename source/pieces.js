function setup () {
  createCanvas(960,540);

  fontRegular = loadFont("../fonts/Quicksand/Quicksand-Medium.ttf");
  textFont(fontRegular);
  textAlign(CENTER, CENTER);

  noStroke();
  colorMode(RGB, 255, 255, 255, 10);
  Initialize();
}

function Triangle(x) {
  var properties = x;

  this.show = function(){
    var v = properties;
    if (v[6]<0) {  fill(30); stroke(240); }
    else        {  noStroke(); fill(v[6], v[7], v[8]); }
    triangle(v[0], v[1], v[2], v[3], v[4], v[5]);
  }

  this.get = function() {
    return properties;
  }

  this.getCenter = function() {
    var v = properties;
    return [(v[0]+v[2]+v[4])/3, (v[1]+v[3]+v[5])/3];
  }

  this.getCentered = function() {
    var v = properties, xy = this.getCenter(), temp = new Array(9);
    for (var i=0; i<3; i++) {
      temp[i*2] = xy[0]; temp[i*2+1] = xy[1]; temp[i+6] = v[i+6];
    }
    return new Triangle(temp);
  }
}

function Shape(x) {
  var triangles = x;

  this.show = function() {
     for (let i=0; i<triangles.length; i++)
       triangles[i].show();
  }

  this.add = function(x) {
     triangles.push(x);
  }

  this.get = function() {
    return triangles;
  }

  this.len = function() {
    return triangles.length;
  }

  this.hasTriangle = function(tri) {
    if (tri instanceof Triangle) tri = tri.get();
    for (let i=0; i<this.len(); i++)
    {
      var cur = triangles[i].get(), same = 0;

      for (let j=0; j<6; j+=2)
        for (let k=0; k<6; k+=2)
          if (tri[k]==cur[j] && tri[k+1]==cur[j+1])
            same++;

      if (same == 3) return true;
    }
    return false;
  }

  this.getCopy = function () {
    var copy = new Shape ([]);
    for (let i=0; i<triangles.length; i++) {
      copy.add(new Triangle(copyAr(triangles[i].get())) );
    }
    return copy;
  }
}

function emove(p, q) {
    if (abs(p-q) <= 0.8) return q;
    else return p + (q-p) * 0.05;
}


function pmove(p, q, h, time) {
    if (abs(h-q) <= 0.1) return q;

    var ela = min(time/animTime, 1)*2; //time elapsed scaled 0 to 2
    var power = 3;
    var x; if (ela<=1) x = Math.pow(ela,power);
           else x = -(Math.pow(abs(ela-2),power))+2;

    return p + (q-p) * x/2;
}

var animTime = 800, gapTime = 100, fromColorDelay = 0;
function transform(dir)
{
  var n = max(go.len(), goto.len());
  for (let k=0; k<n; k++)
  {
    var j = (dir==1) ? (k) : (n-k-1);
    var cur = go.get()[j].get(),
        from = gofrom.get()[j].get(),
        to   = goto.get()[j].get(),

        time = millis() - animStTime - k * gapTime;

    for (let i=6; i<9 && time > 0; i++)  //COLORS
      cur[i] = emove (cur[i], to[i]);

    for (let i=0; i<6 && time > fromColorDelay; i++) //SHAPES
      cur[i] = pmove (from[i], to[i], cur[i], time - fromColorDelay);
  }

  shapeInPosition = animStTime + animTime + goto.len() * gapTime <= millis() ||
                    animStTime == 0 ? true : false;
}

var shapeInPosition = true, animStTime=0, direction = 0;
function Showcase() {

  var arrowPressed;
  if (keyClicked(37) || keyClicked(40)) { direction = -1; arrowPressed = true; }
  if (keyClicked(38) || keyClicked(39) || MouseClicked()) { direction =  1; arrowPressed = true; }

  if (arrowPressed) {
    no=(shapes.length+no+direction)%shapes.length; animStTime = millis();
    goto = shapes[no].getCopy();

    var smaller = go.len() < goto.len() ? go : goto,
        bigger  = go.len() < goto.len() ? goto : go;

    for (let i = smaller.len(); i < bigger.len(); i++) {
        smaller.add(bigger.get()[i].getCentered());
    }

    gofrom = go.getCopy();
  }

  transform(direction);
  go.show();
}

var shapes=[],go,gofrom,goto,no=0;
var creatorToggled = true;

function draw ()
{
  background(30);
  updateNotPressed();

  if (keyClicked('C')) {
    creatorToggled ^= true;
  }
  creatorToggled == true ? Creator() : Showcase();

  if (keyClicked('H')) newMessage("Yeeeay!");

  messageDisplay();

  //image(generateColorPalette(50), 100,100);
}
