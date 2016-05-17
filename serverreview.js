/*

 var  express = require ('express');

 var app=  express();

var bodyParser = require('body-parser');

var db= require('./db.js');

var _ = require('underscore');

var todos= [];

  var PORT=  process.env.PORT || 3000;

  var bcrypt= require('bcrypt');

app.use(bodyParser.json());


     //get all todos with x requirement 

      // if parameters is 'complete'

 app.get('/todos' , function (req , res) {


       var query= req.query;
 // var filteredTodos = todos;
    var where= {} 

       if(query.hasOwnProperty('completed') && query.completed === 'true') {
         where.completed = true
       } else if (
        query.hasOwnProperty('completed') && query.completed === 'false'
        ){
        where.completed = false
       }
             


     if(query.hasOwnProperty('q') && query.q.length > 0 ) {
      where.description = {
        $like: '%' + query.q + '%'
      };
      
     }


         db.todo.findAll({

          where : where 

         }).then( function (todos) {
          res.json(todos);
         } , function (e) {
          res.status(500).send();
         })



 })


 // get by id 


  app.get('/todos/:id' , function (req, res) {

   var todoId= parseInt(req.params.id , 10) 


         db.todo.findById(todoId).then(function (todo){
          if (!!todo) {
          res.json(todo.toJSON())
         } else {
          res.status(404).send();

         } 
       }, function (e) {
          res.status(500).send();

         })

  })


// 


   // post 

   app.post('/todos' , function (req , res) {

    var body= _.pick(req.body, 'description' , 'completed')
    
    db.todo.create(body).then(function (todo) {
      res.json(todo.toJSON())
    }, function (e) {
      res.status(400).json(e)

    });

   });


   // delete 

    app.delete('/todos/:id' , function (req, res) {


      var todoId= parseInt(req.params.id, 10);
    
    db.todo.destroy({
      where: { id : todoId
      }
    }).then(function (rowsDeleted){ 
      if (rowsDeleted === 0 ) {
        res.status(404).json({
          error: 'No todo with id'
        });
      }else {
        res.status(204).send();
      }
    }, function () {

      res.status(500).send();
    } )


    })



   // update


   app.put('/todos/:id' , function (req, res) {

   
    var todoId= parseInt(req.params.id , 10);
    var body  = _.pick (req.body , 'description' , 'completed' )
    var attributes = {};

    if (body.hasOwnProperty('completed') ) {
      attributes.completed = body.completed;
    }

     if (body.hasOwnProperty('description')) {
      attributes.description = body.description;
     } 


      db.todo.findById(todoId).then(function (todo){

        if (todo) {

    todo.update(attributes).then(function (todo){

      res.json(todo.toJSON());

    },function (e) {
      res.status(400).json(e);
    });

        } else {

          res.status(404).send();
        }

      }, function(){

        res.status(500).send();

      });

   });


   //post user

     app.post('/users', function (req , res) {


     var body=_.pick(req.body , 'email' , 'password');



           db.user.create(body).then( function (user) {
                res.json(user.toPublicJSON());

           }, function (e) {

            res.status(400).json(e);

           });
     });



   //user log in


      app.post('/users/login' , function (req, res) {
        
      var body= _.pick(req.body , 'email' , 'password');

        db.user.findOne({
          where: {
            email: body.email
          }
        }).then(function (user) {
          if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
          return res.status(401).send();
        }

        res.json(user.toPublicJSON());
    }, function (e) {
      res.status(500).send();

    });


      });



  // delete account 

  
   
   app.delete('/users/delete' , function (req, res) {


    var body = _.pick(req.body, 'email', 'password');

       db.user.findOne ({
        where: {
          email: body.email
        }
       }).then(function (user){


        if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
          return res.status(401).send();
        }

        db.user.destroy({
          where: {
          email: body.email
          }

        }).then(function (user) {

          res.send('account deleted!')

        }, function (e) {
          res.status(500).send();
        })


       }, function (e) {
            res.status(500).send();
       })
   })






   db.sequelize.sync().then(function () {

     app.listen(PORT, function() {
      console.log('express listeing on '+ PORT + '!')

     });

   });

*/


