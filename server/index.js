

const bodyParser=require('body-parser'),
	http   	  =require('http'),
	express   =require('express'),

	chat=require('./Chat'),
	socketio=require('socket.io'),

 const	port 	  =port=process.env.PORT || 3000,
	app 	  =express(),
	server    =http.createServer(app),
	io=socketio(server)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('./Chat',chat)
app.use(express.static('public'))

server.listen(port,() =>console.log("server is runing on port"+port))
	


io.on('connection', function(socket){
	console.log('new user connected, socket: '+socket.id)

	socket.on('userJoin',user =>{
		socket.user=user
		socket.broadcast.emit('userJoin',user)
	})
	socket.on('message',message =>{
		socket.broadcast.emit('message',message)
	})
	socket.on('disconnect',() =>{
		if (socket.hasOwnProperty('user')) {
			deleteUser(socket.user, err, confirm => {
				// body...
				if(err)throw err
			})
		}
	})
})
///////////////////////////////////
//comandos para la consola

// npm install
// forma abreviada npm -i

// npm init
// nombre del

// en el package
// "dependencies":{
// 	"body-parser":"^1.15.2",
// 	"express":"^4.14.0"
// }

// consola

// npm install
// node server/