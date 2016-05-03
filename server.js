var express = require('express');

var bodyParser = require('body-parser');
// this is middleware...i dont get it
var _ = require('underscore');

var db= require('./db.js');

var app = express();

var PORT = process.env.PORT || 3000;
// where does this server run at???

var todos = [];

var todoNextID = 1



app.use(bodyParser.json());
// have no idea... what is this thing even doing?



//Model = The Todo object
// Collection =  collection of the Todo objects


app.get('/', function(req, res) {
  res.send('Todo API Root');

});

// this code will only take as a res an empty page with todoAPI ROOT


//Q: whats the differnce between res.send and res.json ????
//Requests:
// GET /todos    > to get all of the todo Items 



app.get('/todos', function(req, res) {

  var queryParams = req.query;

  var filteredTodos = todos;



  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {
      completed: true
    });
  } else if (
    queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {
      completed: false
    })
  }



  // if has property && complete=true 
  // filteredTodos = _.where(filteredTodos,?)
  // ele if hs prop && completed if 'false'

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;

    });

  }

  // 'Go to work on Saturday'.indexOf('work') 


  res.json(filteredTodos);


  // to convert to JSON
  // we can use POSTman to test if the get request 
  //is working.
});


//GET /todos/:id > to get individual 

app.get('/todos/:id', function(req, res) {


  var todoId = parseInt(req.params.id, 10); // this will make 
  //the code underneath work, because todoID needs to be a number 
  //within the array?? 

  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });
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


app.post('/todos', function(req, res) {



  var body = _.pick(req.body, 'description', 'completed');

    // post to database project :
    
    db.todo.create(body).then(function (todo) { 

      res.json(todo.toJSON())

    }, function (e) { 
      res.status(400).json(e) 
    });


   
      // 1. call create on db.todo
      // 2. respond with 200 
      // 3. res. json 


   // okay so req.body to require the body which is 
  //anything inputed into the postman body. 

  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).send();
  //   //400 means bad data was provided 
  // }

  // body.description = body.description.trim();


  // body.id = todoNextID++;

  // todos.push(body);


  // res.json(body) // i guess this is so that at the end the page will
  //   //show the body. 

})

// delete / todos / :id  url and callback

app.delete('/todos/:id', function(req, res) {

  var todoId = parseInt(req.params.id, 10);

  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });


  if (!matchedTodo) {
    res.status(404).send()
  } else {

    todos = _.without(todos, matchedTodo)
    res.json(matchedTodo);
  }


})

//PUT / todos/:id 
app.put('/todos/:id', function(req, res) {

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });

  var body = _.pick(req.body, 'description', 'completed')
  var validAttributes = {};


  if (!matchedTodo) {
    return res.status(404).send();
  }



  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) &&
    body.description.trim().length > 0) {
    validAttributes.description = body.description
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);

  res.json(matchedTodo);
  //	body.hasOwnProperty('completed')

  //copies one object to another

  })

  db.sequelize.sync().then(function(){

    app.listen(PORT, function() {
    console.log('Express listening on ' + PORT + ' ! ');

  });

  });

