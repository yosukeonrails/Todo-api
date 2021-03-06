var bcrypt = require('bcrypt');
	var _ = require ('underscore');
	var cryptojs= require('crypto-js');
	var jwt = require('jsonwebtoken')

	/// NOW IT HAS A COMMENT 

		module.exports = function (sequelize , DataTypes) {



			var user = sequelize.define('user', {



			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate:{
					isEmail: true
				     } 
				},
				salt: {
					type: DataTypes.STRING
				},
				password_hash: {
					type: DataTypes.STRING
				},
                password: {
					type: DataTypes.VIRTUAL,
					allowNull: false,
					validate: {
						len: [7 , 100]
					},
					set: function (value) {
						var salt = bcrypt.genSaltSync(10);
						var hashedPassword = bcrypt.hashSync(value, salt);

						this.setDataValue('password', value);
						this.setDataValue('salt' , salt);
						this.setDataValue ('password_hash' , hashedPassword);
					}
				} // end of email object
		},  


			{   /// beggining of instances ------------------


			 hooks: {
	     	beforeValidate: function (user , options) {

                  if (typeof user.email === 'string') {
                  	user.email =  user.email.toLowerCase();
                  	  	}
				     }
				 },




				 classMethods: {

				 	authenticate: function (body) {
				 		return new Promise(function(resolve, reject){
				 	  if( typeof body.email !== 'string' || typeof body.password !== 'string') {
				 	  	return reject() ;

				 	  }

				      user.findOne({ 
				      where: {
				      email: body.email
				     }
				   }).then(function (user) {
				       if (!user || ! bcrypt.compareSync(body.password, user.get('password_hash'))) {
				        return reject();
				       }

				       resolve(user);

				   }, function (e) {
				          reject();

 				      });

				 		});
				 	       },

				 	findByToken: function (token) {  
				 		 return new Promise(function (resolve, reject) {
				 		 	try {
				 		 		var decodedJWT = jwt.verify(token , 'qwerty098')
				 		 		var bytes=  cryptojs.AES.decrypt(decodedJWT.token, 'abc12345')
				 		 		var tokenData= JSON.parse(bytes.toString(cryptojs.enc.Utf8));

				 		 		user.findById(tokenData.id).then(function (user){

				 		 			if(user){
				 		 				resolve(user);
				 		 			} else {
				 		 				reject();
				 		 			}

				 		 		}, function (e){
				 		 			reject();
				 		 		})

				 		 	} catch (e) {
				 		 		reject();
				 		 	}
				 		 })

				 	}

				 },




				 instanceMethods: {

				 	toPublicJSON: function () {
				 		var json = this.toJSON();
				 		return _.pick(json, 'id' , 'email' , 'createdAt' , 'updatedAt');
				 	},

				 	generateToken: function (type) {
				 		if (!_.isString(type)){
				 			return undefined;
				 		}
				 		try {

       				var stringData= JSON.stringify( {id: this.get('id'), type: type})
       				  // the type here is 'authentification' as seen in server.js
       				  // what is 'this'? 

                      var encryptedData = cryptojs.AES.encrypt(stringData, 'abc12345').toString();
                           // fisrt argument is what to encrypt
                           // second, the password needed to encrypt and decrypt data
                         
                         var token= jwt.sign({

                         	token: encryptedData
                         }, 
                            'qwerty098')

                         return token;

				 		} catch (e) {
				 			return undefined;
				 		}
				 	}






				 }// end of new argument in seq. define----------


		});

       return user;

		};
