//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

//load font
const loader = new THREE.FontLoader();


//game engine variables
const gameObjects = [];
const worldLimits = [-40, 40];
const playerSize = 2;
const textColor = "#FFFFFF";
var localId = null;
var isStarted = false;


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
	id: null,
	speed: 1/10,
    inputs: [false, false, false, false], //[up, down, left, right]
    velocity: [0, 0, 0],
    movePlayer: function() {
    	//this section detects movement
    	this.inputs = getArrowKeys(this.inputs);
      //console.log(this.inputs);
        //detects movement on vertical axis
        if(this.inputs[0] || this.inputs[1]){
          if (this.inputs[0]){this.velocity[1]=-1}
          else{this.velocity[1]=1}
        }else{
          this.velocity[1]=0;
          }
        //detects movement on horizontal axis
        if(this.inputs[2] || this.inputs[3]){
          if (this.inputs[3]){this.velocity[0]=1}
          else{this.velocity[0]=-1}
        }else{
          this.velocity[0]=0;
          }

        //this section updates the position
        if (this.object.position.x  + this.velocity[0] < worldLimits[1] & this.object.position.x + this.velocity[0] > worldLimits[0]){
        	this.object.position.x += this.velocity[0] * this.speed;	
        }
        if (this.object.position.z + this.velocity[1] < worldLimits[1] & this.object.position.z + this.velocity[1] > worldLimits[0]){
        	this.object.position.z += this.velocity[1] * this.speed;	
        }
    },
    update: function() {
    	this.movePlayer();
    },
    init: function(obj){
    	this.object = obj;
    	this.name = obj.name;
    	this.id = obj.id;
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
	playerObj = createPlayerObj(ClientPlayer.name, [0, 0, 0], '#' + Math.floor(Math.random()*16777215).toString(16), true);
	scene.add(playerObj);
	gameObjects.push(playerObj);

  /* nonPlayerObj = createPlayerObj("NPC", [2, 0, 0], textColor, false);
  scene.add(nonPlayerObj);
  gameObjects.push(nonPlayerObj);
  console.log(nonPlayerObj.id); */

	camera.position.z = ClientPlayer.object.position.z + 5;

	update();
}


function createPlayerObj(name, position, pColor, isPlayer){
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
		ClientPlayer.init(obj);
	}
	gameObjects.push(obj);
	return obj;
}

function playerStart(){
  if(!isStarted){
    ClientPlayer.name = usernameInput.value;
    start();
  }
  
}