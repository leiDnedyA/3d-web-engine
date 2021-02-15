//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

//game engine variables
const gameObjects = [];
const worldLimits = [-40, 40];
const playerSize = 2;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//create player game object
var playerObj;


var Player = {
	object: null,
	name: null,
	id: null,
	speed: 1/10000,
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
        	this.object.position.x += this.velocity[0];	
        }
        if (this.object.position.z + this.velocity[1] < worldLimits[1] & this.object.position.z + this.velocity[1] > worldLimits[0]){
        	this.object.position.z += this.velocity[1];	
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

function update(){

	requestAnimationFrame(update);

	Player.update();

	renderer.render(scene, camera);
}

function start(){

	playerObj = createPlayerObj("playerObj", [0, 0, 0], 0x0000ff, true);
	scene.add(playerObj);
	gameObjects.push(playerObj);

	camera.position.z = Player.object.position.z + 5;

	update();
}

start();

function createPlayerObj(name, position, pColor, isPlayer){
	const geometry = new THREE.BoxGeometry(playerSize, playerSize, playerSize);
	const material = new THREE.MeshBasicMaterial({color: pColor});
	const obj = new THREE.Mesh(geometry, material); 
	obj.position.set(position[0], position[1],position[2]);
	obj.name = name;
	if (isPlayer){
		Player.init(obj);
	}
	gameObjects.push(obj);
	return obj;
}