var playerDirection = [0,0,1];
function updateCamPos(p, v){
	
	var velocityIsZero = function(){
		for (i in v){
			if (v[i] != 0){
				return false;
			}
		}
		return true;
	};

	if(!velocityIsZero()){
		playerDirection = v;
		console.log(playerDirection);
		camera.position.x = p.position.x - playerDirection[0];
		camera.position.y = p.position.y - playerDirection[1];
		camera.position.z = p.position.z - playerDirection[2];
	}
	
}

function updateCamDir(p){
	
}