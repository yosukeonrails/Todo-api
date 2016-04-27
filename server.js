


var express = require('express') ;

var bodyParser = require('body-parser');
// this is middleware...i dont get it
var _ = require('underscore');

var app= express();

var PORT= process.env.PORT || 3000 ; 
// where does this server run at???

var todos= [ ];

var todoNextID = 1 


app.use(bodyParser.json());
// have no idea... what is this thing even doing?



//Model = The Todo object
// Collection =  collection of the Todo objects


app.get('/' ,  function (req, res) {
	res.send('Todo API Root');

}); 

// this code will only take as a res an empty page with todoAPI ROOT


//Q: whats the differnce between res.send and res.json ????
//Requests:
// GET /todos    > to get all of the todo Items 


app.get('/todos', function (req,res) {
	res.json(todos); // to convert to JSON
	// we can use POSTman to test if the get request 
	//is working.
} )


//GET /todos/:id > to get individual 

app.get('/todos/:id', function (req,res) {


	var todoId = parseInt(req.params.id, 10); // this will make 
	//the code underneath work, because todoID needs to be a number 
	//within the array?? 
	
var matchedTodo= _.findWhere(todos, {id: todoId}); 
//findwhere will take 2 argumets , the array and what youre looking for
//the code above is using underscore for the search


//var matchedTodo;
    // todos.forEach( function (todo){
    // 	  if(todoId === todo.id ){
    // 	  	matchedTodo =  todo;
    // 	  }
    // 	});    
//  the commented above is only by using normal js code



 if (matchedTodo) {
 	   res.json(matchedTodo);

 } else {

 res.status(404).send();
   //res.json('cannot find ' + req.params.id);

 }	
 

})




// In the Code below, we will use app.post to take an input from the user
// by using the postman req.body 
 
 // POST/todos request , new http method it can take data,


app.post('/todos' , function (req,res){


	var body = _.pick(req.body , 'description' , 'completed');// okay so req.body to require the body which is 
	//anything inputed into the postman body. 

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
		return res.status(400).send();
		//400 means bad data was provided 
	}

	body.description = body.description.trim();


         body.id= todoNextID++ ;

		todos.push(body);


	res.json(body) // i guess this is so that at the end the page will
	//show the body. 

})


app.listen(PORT , function () {
	console.log('Express listening on ' + PORT +  ' ! ');

});

