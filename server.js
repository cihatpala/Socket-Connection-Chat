var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var 
users = [];
connections = [];

server.listen(process.env.PORT || 3000); //Dinlenen port numarası
console.log('Server Çalışıyor...');

//Sokete bağlanma ve çıkış saatleri. - Mesajlaşma saatleri  // mesaj şifreleme //Farklı bilgisayarlarda socket

app.get('/',function(req,res){ 
	res.sendFile(__dirname + '/index.html');
});//index adında ( klasör içerisine ) html sayfası oluşturur.


	io.sockets.on('connection',function(socket){ //Sokete bağlanma
	connections.push(socket);
	console.log('Bağlı Soket Sayısı : %s', connections.length);

	
	socket.on('disconnect',function(data){ //Hali hazırda bağlı olan soketlerden ayrılan olursa
		
		users.splice(users.indexOf(socket.username),1);
		updateUsernames();
		connections.splice(connections.indexOf(socket));
		console.log('Bağlı Soket Sayısı : %s', connections.length);
	});
	
	socket.on('send message',function(data){ //Mesaj gönderme
		console.log(data);
		io.sockets.emit('new message',{msg: data, user:socket.username});
	});

	
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username=data;
		users.push(socket.username);
		updateUsernames();

	});
	function updateUsernames(){
		io.sockets.emit('get users',users);
	}
});