console.log("sockets.js initiated");

var socket = io();

socket.on("serverMsg", function(data){
	if (data.msg == "hello"){
		console.log('Socket server successfully connected');
	}
});