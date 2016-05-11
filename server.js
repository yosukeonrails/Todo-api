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

var bcrypt = require('bcrypt')

var middleware= require('./middleware.js')(db);

app.use(bodyParser.json());
// have no idea... what is this thing even doing?



//Model = The Todo object
// Collection =  collection of the Todo objects


app.get('/', function (req, res) {
  res.send('Todo API Root');

});

// this code will only take as a res an empty page with todoAPI ROOT


//Q: whats the differnce between res.send and res.json ????
//Requests:
// GET /todos    > to get all of the todo Items 



app.get('/todos', middleware.requireAuthentication ,  function (req, res) {

  //var queryParams = req.query;

  var query= req.query;
 // var filteredTodos = todos;
    var where= {} 

      if (query.hasOwnProperty('completed') && query.completed === 'true' ) {
        where.completed = true
      } else if (
        query.hasOwnProperty('completed') && query.completed === 'false'
      ) {
        where.completed = false
      }



         if(query.hasOwnProperty('q') && query.q.length > 0 ){
        where.description = {
          $like: '%' + query.q + '%'
        };
      }




      db.todo.findAll({

        where:where

      }).then( function (todos){

      res.json(todos);
       } , function (e) {
        res.status(500).send();

      })

 })



app.get('/todos/:id',middleware.requireAuthentication , function (req, res) {


  var todoId = parseInt(req.params.id, 10); // this will make 
  //the code underneath work, because todoID needs to be a number 
  //within the array?? 

    db.todo.findById(todoId).then(function (todo) {
      if(!!todo) {
res.json(todo.toJSON())
      } else {
        res.status(404).send();
      }
    }, function (e) { 
    
    res.status(500).send();


    })

   
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  //findwhere will take 2 argumets , the array and what youre looking for
  //the code above is using underscore for the search

     
  //var matchedTodo;
  // todos.forEach( function (todo){
  // 	  if(todoId === todo.id ){
  // 	  	matchedTodo =  todo;
  // 	  }
  // 	});    
  //  the commented above is only by using normal js code

    





//   if (matchedTodo) {
//     res.json(matchedTodo);

//   } else {

//     res.status(404).send();
//     //res.json('cannot find ' + req.params.id);

//   }


})








// In the Code below, we will use app.post to take an input from the user
// by using the postman req.body 

// POST/todos request , new http method it can take data,


app.post('/todos',middleware.requireAuthentication , function(req, res) {



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





app.delete('/todos/:id',middleware.requireAuthentication , function (req, res) {


 var todoId = parseInt(req.params.id, 10);


   db.todo.destroy({
    where: {
      id:todoId
    }
   }).then( function (rowsDeleted){

    if(rowsDeleted === 0 ){
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).send();
    }
     
   }, function(){
    res.status(500).send();
   })
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });


  // if (!matchedTodo) {
  //   res.status(404).send()
  // } else {

  //   todos = _.without(todos, matchedTodo)
  //   res.json(matchedTodo);
  // }


})








//PUT / todos/:id 
app.put('/todos/:id',middleware.requireAuthentication , function (req, res) {

  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed')
  var attributes = {};

  if (body.hasOwnProperty('completed') ) {
    attributes.completed = body.completed;
  } 

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  } 

 db.todo.findById(todoId).then(function (todo){

 if (todo){

  todo.update(attributes).then(function (todo){

 res.json(todo.toJSON());

 }, function (e){
  res.status(400).json(e);
 });

 } else {

  res.status(404).send(); 
}

 }, function (){

  res.status(500).send();

 });
});


app.post('/users', function (req, res) {

  var body = _.pick(req.body, 'email', 'password');

   db.user.create(body).then(function (user){

   res.json(user.toPublicJSON());

   }, function (e){

    res.status(400).json(e);

   });
});

  //	body.hasOwnProperty('completed')

  //copies one object to another

  // POST / users / login
    
  app.post('/users/login' , function (req, res) {

    var body = _.pick(req.body, 'email', 'password');
     
     db.user.authenticate(body).then(function (user){
      var token=  user.generateToken('authentication')

      if(token){

       res.header('Auth' ,token ).json(user.toPublicJSON());
      } else {
       res.status(401).send();
      }

     }, function (){
        res.status(401).send();
     });

 });



  db.sequelize.sync({force:true}).then(function () {

    app.listen(PORT, function() {
    console.log('Express listening on ' + PORT + ' ! ');

  });

  });

