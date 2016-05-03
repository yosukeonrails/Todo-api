

var Sequelize = require('sequelize');


var sequelize = new Sequelize(undefined, undefined , undefined, {
	'dialect': 'sqlite', 
	'storage': __dirname + '/basic-sqlite-database.sqLite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull:false,
		defaultValue: false

	}
})

sequelize.sync({
	force:true  
	}).then(function(){



	// 	Todo.create({
	// 		description: 'kill my frog',
	// 		completed:true
	// 	}).then(function () {
	// 		Todo.create({
	// 			description: 'eat the frog',
	// 			completed: false
	// 		})
	// 	}).then(function() {
	// 		return Todo.findById(2)
	// 	}).then(function(todo){
 //             console.log(todo.toJSON());
	// 	})
	// })
	
	





// }).then(function () {
// 	console.log('Everything is synced')

	Todo.create({
		description: 'Walk my dog to the office' ,
		completed: true

	}).then(function (todo){
		return Todo.create({
			description: 'clean office',
		})
	}).then(function() {
    //return Todo.findById(1)
    return Todo.findAll({
    	where: {
    	//	completed: false
       description: {		
       	$like: '%office%'
       }
    	}
    });
	}).then(function (todos) {

		if(todos) {

			todos.forEach(function (todo) {
               console.log(todo.toJSON());
			})  // it creates an empty array called todos,
			// todos at this point, is all the stuff found in Todo
			// then consoles.log todo.toJSON in this new 
			// emptied array. if(todos) works because 
			// it exists eventhough its empty
			// one thing is for certainl todo now = whats 
			//returned after Todo.findAll

		}else {
			console.log('no todo found')
		}


	}) //-- end of .then func

	.catch(function (e) {
		console.log (e);

	})
} )