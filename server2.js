  

    // require: express, body-parser, underscore 
    var express= require('express')


    // vars : app , PORT , todos , todoNextID =1 

    var app= express ();   

    var todos= [];

    // called for body-parser 



    // TOdo APi Root as a res on the first page
      app.get('/' , function (req,res) {
      	res.send('Todo API ROooot!');
      })
    // app.get ('/todos'), Req all todos 
          
   app.get('/todos', function (req , res) {

       var queryParams= req.query 
       var filteredTodos= todos;

       if(queryParams.hasOwnProperty('completed') && queryParams.completed===true ) {
       	filteredTodos === _.where( filteredTodos , completed:true );
       } else if (queryParams.hasOwnProperty('completed') && queryParams.completed ===false){
       	filteredTodos === _.where (filteredTodos , completed: false);
       } 


       if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
       	filteredTodos === _.filter (filteredTodos , function (todo){
       		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
       	} )
       }

   })

    //app todos/id 

       app.get('/todos/:id', function (req,res){

        


       })

    // post todos with body

    // delete 

    // update 