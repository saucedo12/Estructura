var express = require('express')
var Storage=require('../Storage')
var Router = express.Router()

Router.get('/users',function(req,res){

	Storage.getData('users')
	.then(function(users){
		res.json(users)
	}).catch(function(error){
		res.sendStatus(500).json(error)
	})
})
Router.get('/messages',function(req,res){
	Storage.getData('messages')
	.then(function(users){
		res.json(messages)
	}).catch(function(error){
		res.sendStatus(500).json(error)
	})
})
Router.post('/users',function(req,res){
	var user =req.body.users
	Storage.getData('users')
		   .then(function(users){
		   	return new promise(function(resolve,reject){
		   		Storage.saveData('users',user, users)
		   		.then(function(message){
		   			resolve(message)
		   		}).catch(function(err){
		   			reject(err)
		   		})
		   	})
		   }).then(function(message){
		   	res.json(message)
		   }).catch(function(err){
		   	res.sendStatus(500).json(err)
		   })
})
Router.post('/messages',function(req,res){
	var message =req.body.message
	Storage.getData('messages')
		   .then(function(messages){
		   	return new promise(function(resolve,reject){
		   		Storage.saveData('users',message, messages)
		   		.then(function(message){
		   			resolve(message)
		   		}).catch(function(err){
		   			reject(err)
		   		})
		   	})
		   }).then(function(message){
		   	res.json(message)
		   }).catch(function(err){
		   	res.sendStatus(500).json(err)
		   })
})

module.exports=Router

(function(document,window,undefined, $,io){
	(function(){
		return Chat={
			//todo el codigo
			apiUrl:'/Chat',
			$userDataModal:$('#modalCaptura'),
			$btnMessages: $('#btnMessages'),
			$messageText:$('#messageText'),
			userName:'',
			socket: io(),


			init:function(){
				var self=this
				this.fetchUserInfo(function(user){
					self.renderUser(user)
				})
				this.watchMessages()
				self.socket.on('userJoin',function(user){
					self.renderUser(user)
				})
				self.socket.on('message',function(message){
					self.renderUser(message)
				})
			},

			fetchUserInfo: function(callback){
				var self=this
				this.$userDataModal.openModal()
				var $GuadaInfo=$('.guardaInfo')
				$GuadaInfo.on('click', function(){
					var nombre=$('.nombreUsuario').val()
					var user =[{nombre:nombre,img:'p2.png'}]
					self.socket.emit('userJoin',user[0])
					callback(user)

					self.joinUser(user[0])
					self.userName=nombre
					self.$userDataModal.closeModal()

				})
				self.getInitialUsers()

			},
			getInitialUsers: function(){
				var self=this
				var endpoint=self.apiUrl+'/users'
				self.ajaxRequest(endpoint,'GET',{})
					.done(function(data){
						var users=data.current
						self.renderUser(users)
					}).fail(function(err){
						console.log(err)
					})
			},
			ajaxRequest:function(url,type,data){
				return$.ajax({
					url:url,
					type:type,
					data:data
				})
			},
			joinUser: function(user){
				var self = this
				var endpoint=self.apiUrl+'/users'
				var userObj={user:user}
				self.ajaxRequest(endpoint,'POST',userObj)
				    .done(function(cofirm){
				    	console.log(cofirm)
				    }).fail(function(error){
				    	alert(error)
				    })
			},
			renderUser:function(users){
				var self
				var userList=$('.users-list')
				var userTemplate='<li class="collection-item avatar"> '+
								 '<img src="image/:image:" class="circle" /> '+
								 '<span class="title">:nombre:</span> '+
								 '<p><img src="image/online.png" alt="" />En linea </p> '+
								 '</li>'
				users.map(function(user){
					var newUser=userTemplate.replace(':image:','p2.jpg')
											.replace(':nombre', user,nombre)
				})
			},
			watchMessages: function(){
				var self=this
				self.$messagesText.on('keypress', function(e){

					if (e.wish==13) {
						if ($(this).val().trim()!='') {
							var messages={
								sender:self.userName,
								text:$(this).val()
							}
							self.renderMessage(messages)
							self.socket.emit('message',message)
							$(this).val('')
						}else{
							e.preventDefault()
						}
					}
				})
				self.$btnMessages.on('click',function(){
					if (self.$messagesText.val()!='') {
						var message={
							sender:self.userName,
							text:$(this).val()
						}
						self.renderMessage(message)
						self.socket.emit('message',message)
						self.$messagesText.val('')
					}
				})
			},
			renderMessage: function(message){
				var self=this
				var tipoMensaje=menssage.sender==self.userName?'recibidos':'enviados'
				var messageList=$('.historial-chat')
				var messageTemplate='<div class=":tipoMensaje;"> '+
									'<div class="mensaje"> '+
										'<div class="imagen"> '+
										'<img src="image/p2.jpg" alt="Contacto" /> '+
										'</div>'
											'<div class="texto">'+
											'<span class="nombre">:nombre:</span> <br />'+
											'<span>:mensaje:</span>'+
											'</div> '
										'<div class="hora"> '+
											'<span class="numHora">:hora:</span>'+
										'</div>'+
										'</div>'+
										'</div>';
			var currentDate=new Date()
			var newMessage=messageTemplate.replace(':tipoMensaje:',tipoMensaje)
										  .replace(':nombre:',message.sender)
										  .replace(':mensaje:',message.text)
										  .replace(':hora:',currentDate.getHours()+currentDate.getMinutes())
			messageList.append(newMessage)
			$(".scroller-chat").animate({scrollTop: $(".scroller-chat").get(0).scrollHeight},500)

			}
		}

	})()
	Chat.init()
})(document,window, undefined,jQuery,io)