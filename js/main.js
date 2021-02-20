//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

//load font
const loader = new THREE.FontLoader();


//game engine variables
const gameObjects = [];
const worldLimits = {
  x: [-40, 40], //Sets world limits for all different axis
  y: [-40, 40],
  z: [-40, 0]
};
const playerSize = 2;
const textColor = "#FFFFFF";
var localId = null;
var isStarted = false;
var tempStartPos = [0, 0, 0];
var firstPerson = true;

//Setup for HTML elements
const usernameInput = document.querySelector("#usernameInput");
console.log(usernameInput);
renderer.setSize(window.innerWidth, window.innerHeight - usernameInput.offsetHeight);
document.body.appendChild(renderer.domElement);


//create player game object
var playerObj;

class Player{
  constructor(name/*String for name*/,color/*string containing hex value*/,position/*array of 2 ints*/,size/*array of 2 ints*/,nameTag/*bool to render nametag or not*/,id/*id based on server*/){
      this.name = name;
      this.color = color;
      this.position = position;
      this.id = id;
    }
  }

var ClientPlayer = {
	object: null,
	name: '',
	id: 0,
  color: '',
	speed: 1/10,
    inputs: [false, false, false, false], //[up, down, left, right]
    velocity: [0, 0, 0],
    movePlayer: function() {
    	//this section detects movement
    	this.inputs = getArrowKeys(this.inputs);
      let playerMovedYet = false;
      //console.log(this.inputs);
        //detects movement on vertical axis
        if(this.inputs[0] || this.inputs[1]){
          if (this.inputs[0]){this.velocity[2]=-1}
          else{this.velocity[2]=1}
        }else{
          this.velocity[2]=0;
          }
        //detects movement on horizontal axis
        if(this.inputs[2] || this.inputs[3]){
          if (this.inputs[3]){this.velocity[0]=1}
          else{this.velocity[0]=-1}
        }else{
          this.velocity[0]=0;
          }
          
        //this section updates the position for motion forwards
        let potentialXMove = this.object.position.x  + (playerDirection[0]) * -this.velocity[2]*this.speed;
        let potentialZMove = this.object.position.z  - (playerDirection[2] - 0) * -this.velocity[2]*this.speed;
        if (potentialXMove < worldLimits.x[1] & potentialXMove > worldLimits.x[0]){
        	this.object.position.x = potentialXMove;
          if (!playerMovedYet){
            playerMove();
            playerMovedYet = true;
          }
        }
        if (potentialZMove < worldLimits.z[1] & potentialZMove > worldLimits.z[0]){
        	this.object.position.z = potentialZMove;	
          if (!playerMovedYet){
            playerMove();
            playerMovedYet = true;
          }
        }
    },
    update: function() {

      this.movePlayer();
       if (firstPerson){
          updateCameraPos(ClientPlayer.object, ClientPlayer.velocity);
        }
    },
    init: function(obj, id){
    	this.object = obj;
    	this.name = obj.name;
    	this.id = id;
      createPlayer();
    }
};



function getArrowKeys(keyz){
    let pressedKeys = keyz;
    window.onkeyup = function(e) { 
      
      
    
    }
    window.onkeydown = function(e) {
      switch(e.key){
        
        case "ArrowUp":
          pressedKeys[0] = true;
          break;
        case "ArrowDown":
          pressedKeys[1] = true;
          break;
        case "ArrowLeft":
          pressedKeys[2] = true;
          break;
        case "ArrowRight":
          pressedKeys[3] = true;
          break;
        case "w":
          pressedKeys[0] = true;
          break;
        case "s":
          pressedKeys[1] = true;
          break;
        case "a":
          pressedKeys[2] = true;
          break;
        case "d":
          pressedKeys[3] = true;
          break;
        
        default:
          break;
        
        }
      }
    window.onkeyup = function(e) {
      switch(e.key){
        
        case "ArrowUp":
          pressedKeys[0] = false;
          break;
        case "ArrowDown":
          pressedKeys[1] = false;
          break;
        case "ArrowLeft":
          pressedKeys[2] = false;
          break;
        case "ArrowRight":
          pressedKeys[3] = false;
          break;
        case "w":
          pressedKeys[0] = false;
          break;
        case "s":
          pressedKeys[1] = false;
          break;
        case "a":
          pressedKeys[2] = false;
          break;
        case "d":
          pressedKeys[3] = false;
          break;
        
        default:
          break;
        
        }
        }
    return pressedKeys;
    }


//MAIN FUNCTIONS, works like Unity
function update(){

	requestAnimationFrame(update);

	ClientPlayer.update();


	//camera.position.z = Player.object.position.z + 5;
	renderer.render(scene, camera);
}

function start(){

  isStarted = true;
  ClientPlayer.name = usernameInput.value;
  ClientPlayer.color ='#' + Math.floor(Math.random()*16777215).toString(16);
  playerObj = createPlayerObj(ClientPlayer.name, ClientPlayer.id, [0, 0, 0], ClientPlayer.color, true);
	

  nonPlayerObj = createPlayerObj("NPC", [2, 0, 0], textColor, false);
  scene.add(nonPlayerObj);
  gameObjects.push(nonPlayerObj);
  console.log(nonPlayerObj.id);

	camera.position.z = ClientPlayer.object.position.z + 5;

	update();
}


function createPlayerObj(name, id, position, pColor, isPlayer){
	const geometry = new THREE.BoxGeometry(playerSize, playerSize, playerSize);
	const material = new THREE.MeshBasicMaterial({color: pColor});
	const obj = new THREE.Mesh(geometry, material);

  //adds nametag
  loader.load('fonts/Arial_Black_Regular.json', function ( font ){
    const  textGeometry = new THREE.TextGeometry(name, {
      font: font,
      size: .2,
      height: 0,
      curveSegments: 12,
      bevelThickness: 0,
      bevelSize: 0,
      bevelEnabled: false
    });

    const textMaterial = new THREE.MeshBasicMaterial({color: textColor});
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.y += 1.5;
    textMesh.position.x -= .5;
    obj.add(textMesh);

  });
	obj.position.set(position[0], position[1],position[2]);
	obj.name = name;
	if (isPlayer){
		ClientPlayer.init(obj, id);
	}
	gameObjects.push([obj, id]);
  //console.log([obj, id]);
  scene.add(obj);
	return obj;
}

function playerStart(){
  if(!isStarted){
    start();
  }
  
}

function gameObjectExistsId(id){
  for(i in gameObjects){
    if (gameObjects[i][1] == id){
      return true;
    }
  }
  return false;
}

function gameObjectsLookUp(id){
  for(i in gameObjects){
    if (gameObjects[i][1] == id){
      //console.log("ID: " + id + ", Pos in list: " + i);
      return gameObjects[i];
    }
  }
}