var express=require('express');

var app=express();





app.set('view engine','ejs');



var todocontroller=require('./controller/toDoController');

todocontroller(app);


app.listen(3000);
console.log("You are listening to port 3000!");


