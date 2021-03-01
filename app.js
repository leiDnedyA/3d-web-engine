const express = require('express');
const readline = require('readline');
const fs = require('fs');
const app = express();
const serv = require('http').Server(app);

//sets up server
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.use('/',express.static(__dirname + '/'));

serv.listen(2000);
console.log('server started.');

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var bannedUsersJSON;

//sets up readline, which is a library that handles cmd inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//setting up JSON file that holds the banned players list
loadBanList();

/*this object holds all valid command inputs organized by the first word in the command, and directs them to the function associated
with that command. NOTE: commands can only be one word long by design, and each function takes the entire input given in the cmd as a string*/
const readlineInputFunctions = {
	'hello' : function(input){
		console.log('server: hello');
	},
	'kick' : function(input){
		//kicks desired player. Format: 'kick <player name> <reason>'
		let splitInput = splitText(input);
		let playerName = splitInput[1];
		let inputLength = splitInput.length;
		let playerID = getPlayerIdByName(playerName);
		let kickReason = '';
		if (inputLength > 2){
			for (i = 2; i < inputLength; i++) {
			  console.log(splitInput[i]);
			  kickReason = kickReason + splitInput[i];
			  if (i != inputLength - 1){
			  	kickReason += ' ';
			  }
			}
		}
		

		if(playerID != -1){
			console.log('kicking ' + playerName);
			SOCKET_LIST[playerID].emit('kicked', {reason: kickReason});
			SOCKET_LIST[playerID].disconnect();

		}else{
			console.log(playerName + ' is an invalid name');
		}
	},
	'ban' : function(input){ // /ban + <Player Name> + <reason>
		let splitInput = splitText(input);
		let playerName = splitInput[1];
		let inputLength = splitInput.length;
		let playerID = getPlayerIdByName(playerName);
		let banReason = '';
		if (inputLength > 2){
			for (i = 2; i < inputLength; i++) {
			  console.log(splitInput[i]);
			  banReason = banReason + splitInput[i];
			  if (i != inputLength - 1){
			  	banReason += ' ';
			  }
			}
		}
		

		if(playerID != -1){
			console.log(playerName + " has been banned for: " + banReason);
			SOCKET_LIST[playerID].emit('kicked', {reason: "BANNED: " + banReason});
			banUser(SOCKET_LIST[playerID].ipAddress, playerName, banReason);
			SOCKET_LIST[playerID].disconnect();

		}else{
			console.log(playerName + ' is an invalid name');
		}
	},
	'pardon' : function(input){ // /pardon + <IP to pardon>
		let splitInput = splitText(input);
		let pardonIP = splitInput[1];
		if (bannedUsersJSON.hasOwnProperty(pardonIP)){
			pardonUser(pardonIP);
		}else{
			console.log("This ip is not on the ban list")
		}
	},
}

//creates a class for the individual Players, allowing for their info to be stored in the server RAM
class Player{
	constructor(id,name,color,x,y,z, rotX, rotY, rotZ){
		this.x = x;
		this.y = y;
		this.z = z;
		this.rotX = rotX;
		this.rotY = rotY;
		this.rotZ = rotZ;
		this.id = id;
		this.name = name;
		this.color = color;
	}
}

//Socket functions use Socket.io, a basic server library, to send info to and recieve info from each client.
var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	socket.ipAddress = socket.handshake.address.toString();
	if (bannedUsersJSON.hasOwnProperty(socket.ipAddress)){
		socket.emit('kicked', {reason: bannedUsersJSON[socket.ipAddress]['banReason']});
		socket.disconnect();
	}

	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	socket.z = 0;

	SOCKET_LIST[socket.id] = socket;
	var player = new Player(socket.id, 'name', 0, 0);
	socket.emit("playerVars", {
		id: socket.id,
		x: socket.x,
		y: socket.y,
		z: socket.z
	});
	

	socket.emit('serverMsg',{
		msg: 'hello'
	});

	socket.on('createPlayer',function(data){
		player.name = data.name;
		PLAYER_LIST[socket.id] = player;
		player.color = data.color;
		player.x = data.x;
		player.y = data.y;
		player.z = data.z;
		player.rotX = data.rotX;
		player.rotY = data.rotY;
		player.rotZ = data.rotZ;
		console.log(player.name + " has joined the server");
		console.log(getObjSize(SOCKET_LIST) + " players are online");
	});

	socket.on('playerMove',function(data){
		player.x = data.x;
		player.y = data.y;
		player.z = data.z;
		player.rotX = data.rotX;
		player.rotY = data.rotY;
		player.rotZ = data.rotZ;
		//console.log("Cords: " + player.x + player.y + player.z);
	});

	socket.on('disconnect',function(){
		console.log(player.name + " has left the server");
		for(var i in SOCKET_LIST){
			var s = SOCKET_LIST[i];
			s.emit('disconnection',{id: player.id});
		}
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		console.log(getObjSize(SOCKET_LIST) + " players are online");
	});
	
});



//This is the recursion loop that sends out info to each client at a set interval of milliseconds, defined by refreshSpeed
const refreshSpeed = 25;
setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];

		pack.push({
			x:player.x,
			y:player.y,
			z:player.z,
			rotX:player.rotX,
			rotY:player.rotY,
			rotZ:player.rotZ,
			id:player.id,
			name:player.name,
			color:player.color
		});

	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}
}, 1000/refreshSpeed);

//handles command line input
rl.on('line', (input)=>{
	let command = splitText(input)[0];
	if(readlineInputFunctions.hasOwnProperty(command)){
		readlineInputFunctions[command](input);
	}else{
		console.log('"' + input + '"is not a valid command');
	}
});	

//helper functions
function getObjSize(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

function splitText(s){	
	return s.split(' ');
}

function getPlayerIdByName(name){
	for (let i in PLAYER_LIST){
		if (PLAYER_LIST[i].name == name){
			return i;
		}
	}
	return -1;
}

function banUser(ip, name, cause){
	bannedUsersJSON[ip]={
		'userName':name,
		'banReason':cause
	};
	fs.writeFile('server_info/banned_users.json', JSON.stringify(bannedUsersJSON, null, 1), err => {
		if(err){
			console.log(err);
		}
		else{
			console.log('SERVER: ' + name + ' has been successfully added to the ban list');
		}
	});
}
function pardonUser(ip){
	delete bannedUsersJSON[ip];
	fs.writeFile('server_info/banned_users.json', JSON.stringify(bannedUsersJSON, null, 1), err => {
		if(err){
			console.log(err);
		}
		else{
			console.log('SERVER: ' + ip + ' has been successfully removed from the ban list');
		}
	});
}

function loadBanList(){
	fs.readFile('server_info/banned_users.json', 'utf-8', (err, jsonString) => {
		if (err){
			console.log(err);
		} else{
			try{

				bannedUsersJSON = JSON.parse(jsonString);
				console.log('banned_users.json loaded');
			}catch(err){
				console.log('error parsing JSON: ', err);
			}
		}
	});
}