console.log("sockets.js initiated");

var socket = io();

socket.on("serverMsg", function(data){
	if (data.msg == "hello"){
		console.log('Socket server successfully connected');
	}
});

socket.on("playerVars", function(data){
	ClientPlayer.id = data.id;
	console.log(data.id);
});

socket.on("newPositions", function(data){
	//console.log(data);
	if (isStarted){
		for (var i = 0; i < data.length; i++) {
			if(data[i].id != ClientPlayer.id){
				if(gameObjectExistsId(data[i].id)){

				gameObjects[gameObjectLookUp(data[i].id)].position[0] = data[i].x;
				gameObjects[gameObjectLookUp(data[i].id)].position[1] = data[i].y;
			}else{
				createPlayerObj(data[i].name,data[i].id, [data[i].x, data[i].y, data[i].z], data[i].color, false);
				//console.log("Game Object Added: " + data[i].id);
			}
			}
			
		}	
	}
});

function createPlayer(){
	socket.emit('createPlayer', {
		name: ClientPlayer.name,
		color: ClientPlayer.color,
		x: ClientPlayer.object.position.x,
		y: ClientPlayer.object.position.y,
		z: ClientPlayer.object.position.z,
	});
}
