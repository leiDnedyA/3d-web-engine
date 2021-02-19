var playerDirection = [0,0,1];
const camDistance = 5;
function updateCameraPos(p, v){
	
	

	var velocityIsZero = function(){
		for (i in v){
			if (v[i] != 0){
				return false;
			}
		}
		return true;
	};

	if(true){
		camera.lookAt(p.position);
		//p.lookAt(p.position.x + v[0], p.position.y + v[1], p.position.z + v[2]);
		playerDirection = [Math.sin(mouseX), 0, -Math.cos(mouseX)];
		console.log(playerDirection)
		console.log(p.rotation)
		/*console.log(camera.position.x + " : " + p.position.x);
		console.log(camera.position.z + " : " + p.position.z);*/
		camera.position.x = p.position.x - Math.abs(playerDirection[0]) * camDistance;
		//camera.position.y = p.position.y - playerDirection[1];
		camera.position.z = p.position.z + Math.abs(playerDirection[2]) * camDistance;
	}
	
}

function updateCamDir(p){
	
}