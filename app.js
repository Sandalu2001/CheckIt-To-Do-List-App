const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static("public"));

var items = [];
var workItems = [];

console.log(date);

mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser : true})
    .then(()=>{
        console.log("Database is connected!");
    })
    .catch((err)=>{
        console.log(err);
    });

const toDoListSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item",toDoListSchema);


app.get("/",function(req,res){

    let day = date.Date();

    res.render("list" , {
        kindOfDay : day,
        newListItems : items
    });

    
});

app.get("/work",function(req,res){
    res.render("list",{kindOfDay : "Work List",newListItems : workItems});
})

//Home route
app.post("/",function(req,res){
    const item = req.body.newItem;

    if(req.body.button === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        doListItem = new Item({
            name : item
        });
        doListItem.save();

        res.redirect("/");
    }
    
})

app.get("/about",function(req,res){
    res.render("about",{kindOfDay : "Hello"});
})


app.listen(process.env.PORT || 3000,function(){
    console.log("The server is on port 3000");
});


//https://floating-citadel-80749.herokuapp.com