
var express = require('express') ;
var app= express();
var PORT= process.env.PORT || 3000 ; 

var todos= [ {
	id: 1, 
	description: ' Meet Mom for Lunch ',
	completed: false //a boolean

}, 
{

	id: 2, 
	description: ' Go to market ',
	completed: false 

},

{

	id: 3, 
	description: ' Kill Zombies for fun AND MOBS ',
	completed: true

}
];

//Model = The Todo object
// Collection =  collection of the Todo objects


app.get('/' ,  function (req, res) {
	res.send('Todo API Root');

});
//Requests:
// GET /todos    > to get all of the todo Items
app.get('/todos', function (req,res) {
	res.json(todos); // to convert to JSON
	// we can use POSTman to test if the get request 
	//is working.
} )
//GET /todos/:id > to get individual 

app.get('/todos/:id', function (req,res) {

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;




    todos.forEach( function (todo){
    	  if(todoId === todo.id ){
    	  	matchedTodo =  todo;
    	  }


    	});

 if (matchedTodo) {
 	   res.json(matchedTodo);
 } else {

 res.status(404).send();
   //res.json('cannot find ' + req.params.id);

 }	
 

})




app.listen(PORT , function () {
	console.log('Express listening on ' + PORT +  ' ! ');

});

