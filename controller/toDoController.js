var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const ObjectId = mongoose.Types.ObjectId;

//create the mongodb connection
mongoose.connect(
  "mongodb+srv://chathura:test@cluster0.kkdmc6p.mongodb.net/learn?retryWrites=true&w=majority"
);

//create the schema
var todoschema = new mongoose.Schema({
  item: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

//create the model(table name:todos)
var Todo = mongoose.model("Todo", todoschema);

module.exports = function (app) {
  app.get("/todo", function (req, res) {
    //get data from mongodb and view

    Todo.find({})
      .then((data) => {
        res.render("todos", { todos: data });
      })
      .catch((err) => {
        // Handle the error
        console.error(err);
      });
  });
  app.post("/todo", urlencodedParser, function (req, res) {
    //insert todos to the db

    var newtodo = new Todo({ item: req.body.task });

    newtodo
      .save()
      .then((data) => {
        //  res.json(data);
        res.redirect("/todo");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/todo/delete/:id", async (req, res) => {
    try {
      const todoId = req.params.id;
      await Todo.findByIdAndRemove(todoId);
      res.redirect("/todo");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting todo");
    }
  });

  app.get("/todo/markcompleted/:id", async (req, res) => {
    var todoId = req.params.id;
  
    try {
      var updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        { isCompleted: true },
        { new: true }
      );
  
      if (updatedTodo) {
       // res.status(200).json({ message: "Todo marked as completed", todo: updatedTodo });
       res.redirect('/todo');
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error marking todo as completed" });
    }
  });
  app.get("/todo/marknotcompleted/:id", async (req, res) => {
    var todoId = req.params.id;
  
    try {
      var updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        { isCompleted: false },
        { new: true }
      );
  
      if (updatedTodo) {
       // res.status(200).json({ message: "Todo marked as completed", todo: updatedTodo });
       res.redirect('/todo');
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error marking todo as not completed" });
    }
  });
  app.get('/todo/updatepage/:id',function(req,res){
    res.render('updatetodo',{targetid:req.params.id});
  })

  app.post('/todo/updatetask',urlencodedParser,async function(req,res){
    var todoId=req.body.targetid;
    try {
        var updatedTodo =await Todo.findByIdAndUpdate(
          todoId,
          { item: req.body.task },
          { new: true }
        );
    
        if (updatedTodo) {
          //res.status(200).json({ message: "Todo marked as completed", todo: updatedTodo });
         res.redirect('/todo');
        } else {
          res.status(404).json({ message: "Todo not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error marking todo as not completed" });
      }

  });
  

};
