var points = [];
var workShape = new Shape([]), workTriangle = 0;

function insideRect(x,y,p) { //x,y,[4]
  if (p.length!=4) throw "insideRect not given 4 coordinates of a rectangle\n";

  return min(p[0],p[2])<=x && x<=max(p[0],p[2]) &&
         min(p[1],p[3])<=y && y<=max(p[1],p[3])  ? true : false;
}

function showPoints() {
  for (let i=0; i<points.length; i+=2) {
    fill(30); stroke(240);
    ellipse(points[i], points[i+1], 10, 10);
    ellipse(points[i], points[i+1], 0.5,0.5);
  }
}

function pointAlreadyPut(x,y) {
  for (let i=0; i<points.length; i+=2) {
    if (x==points[i] && y==points[i+1]) {
      newMessage("You have already chosen this point.");
      return true;
    }
  }
  return false;
}

function saveShape() {
  shapes.push(workShape);
  workShape = new Shape([]);
}

function addPoint(p) {
  var x = p[0], y = p[1];
  if (insideRect(x, y, [0,0,width,height]) && !pointAlreadyPut(x,y))
    points.push(x, y);

  if (points.length == 6) {
    if (workShape.hasTriangle(points)) {
      points.splice(-2,2);
      newMessage("The drawing already contains this triangle.\n"+
                 "Please choose another final vertex.", 7);
    }
    else {
      workShape.add(new Triangle(points.concat([-1,0,0])));
      points = [];
    }
  }
}

function findClosePoints() {
  var closest = [], minDist = (1<<30);
  for (let i = 0; i<workShape.len(); i++)
  {
    var tri = workShape.get()[i].get();
    for (let j=0; j<6; j+=2)
    {
      var dist = sq(tri[j]-mouseX) + sq(tri[j+1]-mouseY);
      if (dist <= minDist) {
        minDist = dist; closest = [tri[j], tri[j+1]];
      }
    }
  }

  if (closest.length && minDist <= sq(10)) {
    pointCandidate = closest;
    var x = closest[0], y = closest[1];
    fill(0,102,255); noStroke();
    ellipse(x, y, 5,5);
  }
}

function displayColorPicker() {
  
}

var pointCandidate = [];
function Creator()
{
  workShape.show();
  showPoints();
  pointCandidate = [mouseX, mouseY];

  if (keyHeld('F')) findClosePoints();

  if (MouseClicked()) addPoint(pointCandidate);
  if (keyClicked('S')) saveShape();
}
