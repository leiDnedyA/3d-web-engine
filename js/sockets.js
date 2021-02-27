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
					//console.log(data[i]);
				gameObjectsLookUp(data[i].id)[0].position.x = data[i].x;
				gameObjectsLookUp(data[i].id)[0].position.y = data[i].y;
				gameObjectsLookUp(data[i].id)[0].position.z = data[i].z;
				gameObjectsLookUp(data[i].id)[0].rotation.x = data[i].rotX;
				gameObjectsLookUp(data[i].id)[0].rotation.y = data[i].rotY;
				gameObjectsLookUp(data[i].id)[0].rotation.z = data[i].rotZ;
			}else{
				createPlayerObj(data[i].name,data[i].id, [data[i].x, data[i].y, data[i].z], data[i].color, false);
				//console.log("Game Object Added: " + data[i].id);
			}
			}
			
		}	
	}
});

socket.on('kicked', function(data){
	clientIsConnected = false;
	console.log("SERVER: client has been kicked because '" + data.reason + "'")
});

socket.on("disconnection",function(data){
	console.log(data.id);
	scene.remove(gameObjectsLookUp(data.id)[0]);

});

function createPlayer(){
	socket.emit('createPlayer', {
		name: ClientPlayer.name,
		color: ClientPlayer.color,
		x: ClientPlayer.object.position.x,
		y: ClientPlayer.object.position.y,
		z: ClientPlayer.object.position.z,
		rotX: ClientPlayer.object.rotation.x,
		rotY: ClientPlayer.object.rotation.y,
		rotZ: ClientPlayer.object.rotation.z,
	});
}

function playerMove(){
	socket.emit('playerMove', {
		x: ClientPlayer.object.position.x,
		y: ClientPlayer.object.position.y,
		z: ClientPlayer.object.position.z,
		rotX: ClientPlayer.object.rotation.x,
		rotY: ClientPlayer.object.rotation.y,
		rotZ: ClientPlayer.object.rotation.z,
	});	
}