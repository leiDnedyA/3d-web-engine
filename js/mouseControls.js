// helper function

const RADIUS = 20;
var sensitivity = .7;
var rotationX = 0;
var rotationY = 0;
var canvas = renderer.domElement;

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

// setup of the canvas

var mouseX = 50;
var mouseY = 50;

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

//var tracker = document.getElementById('tracker');

function updatePosition(e) {
  if (firstPerson){
    mouseX += e.movementX;
    mouseY += e.movementY;
    rotationX = -mouseX * sensitivity;
    rotationY = -mouseY * sensitivity;
    // if (mouseX > canvas.width + RADIUS) {
    //     mouseX = -RADIUS;
    // }
    // if (mouseY > canvas.height + RADIUS) {
    //     mouseY = -RADIUS;
    // }  
    // if (mouseX < -RADIUS) {
    //     mouseX = canvas.width + RADIUS;
    // }
    // if (mouseY < -RADIUS) {
    //     mouseY = canvas.height + RADIUS;
    // }
    ClientPlayer.object.rotation.y = degToRad(rotationX);
  //tracker.textContent = "X position: " + mouseX + ", Y position: " + mouseY;
  //console.log("x: " + mouseX + ", y: " + mouseY);
  }
}
