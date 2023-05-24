const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

//Set public folder as static
app.use(express.static("public"));

let today = date.Date();

//Create mongoose connection
mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser : true})
    .then(()=>{
        console.log("Database is connected!");
    })
    .catch((err)=>{
        console.log(err);
    });



//Create a schema 
const itemSchema = new mongoose.Schema({ name : String});

//Create item model using item schema
const Item = mongoose.model("Item",itemSchema);

//Creating new items
const Item1 = new Item({name : "Welcome to your todolist !"});
const Item2 = new Item({name : "Hit the '+' button to add an item !"});
const Item3 = new Item({name : "<-- Hit this to delete an item !"});

const defaultItems = [Item1,Item2,Item3];


//Using get request send the date and item list to the list.js
app.get("/",function(req,res){
    
    //Get user input from database 
    const foundItems = Item.find()  
        .then((foundItems)=>{
            if(foundItems.length == 0){
                Item.insertMany(defaultItems)
                .then(()=>{
                    console.log("Add default values to the database !");
                    res.redirect("/");
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
            else{
                res.render("list" , {kindOfDay :  "Today" ,newListItems : foundItems});  
            }    
        })     

        .catch((err)=>{
            console.log(err);
        });
   
});


//Create new schema and model to route parameters
const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema]
});

const List = mongoose.model("List",listSchema);

//Custom list creation
app.get("/:date",function(req,res){

    //Getting the route parameter
    const customListName =  _.capitalize(req.params.date);
   

    //Check the user's list is already exists or not
    const foundList = List.findOne({name : customListName})
        .then((foundList)=>{
            if(!foundList){

                //Save the list to the database
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });

                list.save();
                console.log("New list created");
                res.render("list",{kindOfDay : customListName,newListItems : defaultItems}); 
            } 
            else{
                res.render("list",{kindOfDay : customListName,newListItems : foundList.items});  
            }
        }); 

          
    
});

app.get("/about",function(req,res){ 
    res.render("about",{kindOfDay : "Hello"});
})

// POST requests

//Get user input using post request
app.post("/",function(req,res){
    const item = req.body.newItem;
    const listName = req.body.button;

    console.log("List name "+listName);

    //Create new item using Item model
    doListItem = new Item({
        name : item
    });

    if(req.body.button != "Today"){
        var newItems = List.findOne({name : listName})
            .then((newItems)=>{
                newItems.items.push(doListItem);
                newItems.save();
                res.redirect("/"+listName);
                console.log("ADDED TO THE LIST.");
            })
            .catch((err)=>{
                console.log("ERROR\t"+err);
            })
        
    }
    else{
        //Save that data in database
        doListItem.save();

        //Redirect to the home
        res.redirect("/");
    }
});

//Delete 

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    console.log(listName);
    if(listName != "Today"){
        List.findOneAndUpdate({name : listName} , {$pull : {items : {_id : checkedItemId }}})
            .then(()=>{
                console.log("Item is deleted");

                res.redirect("/"+listName);
            })
            .catch(()=>{
                console.log(err);
            });
    }
    else{
        Item.deleteOne({_id:checkedItemId})
        .then(()=>{
            console.log("Item deleted!");
        })
        .catch(()=>{
            console.log(err);
        })

        res.redirect("/");
    }

    
});


//Date
app.post("/date",function(req,res){
    console.log(req.body.date);
    var today = new Date();
    console.log(today.getUTCDate());
 });


app.listen(process.env.PORT || 3000,function(){
    console.log("The server is on port 3000");
});


//https://floating-citadel-80749.herokuapp.com