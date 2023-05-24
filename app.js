const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

console.log(date);

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static("public"));

var items = [];
var workItems = [];

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
    var item = req.body.newItem;

    if(req.body.button === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
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