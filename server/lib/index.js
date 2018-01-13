var fs=require('fs')
var path=require('path')
var Storage=require('../Storage')

function deleteUser(user,callback) {
	// body...
	Storage.getData('user')
			.then(function(users) {
				// body...
				var resultUsers=users.current.filter(function(MapUser) {
					// body...
					return MapUser.nombre!=user.nombre
				})
				var userDataPath=path.join(__dirname,'../')+'/Storage/data/users.json'
				fs.writeFile(userDataPath,JSON.stringify({current:resultUsers}),function(error) {
					// body...
					if(error) callback(error)
						callback(null,'OK')
				})
			}).catch(function(err) {
				callback(err)
			})
}
module.exports=deleteUser