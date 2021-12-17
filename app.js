//shint esvesroin-6.1

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importing another js file
const date = require(__dirname + '/date.js');
// const ejs = require('ejs');
// console.log(date());

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name : "Welcome to Your To-Do list"
});

const item2 = new Item({
    name : "Hit + to add"
});

const item3 = new Item({
    name : "Hit to delete an item"
});

const defaultItems = [item1, item2, item3]



app.get('/', function(req, res) {
    let day = date.getDate();
    Item.find({}, function(err, foundItems){
        if (foundItems.length == 0){
            Item.insertMany(defaultItems, function(err){
                if(err)
                    console.log(err);
                else
                    console.log("Success");
            });
            res.redirect('/');
        }
        else{
            res.render("list", {kindOfDay : "Today", newListItems: foundItems});
        }
    });
});
 
app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkboxed;
    console.log(checkedItemId);
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("succesfully deleted");
            res.redirect('/');
        }
    });
});
app.post('/', function(req, res){
    // new item = req.body.newItem;
    const item = new Item({
        name : req.body.newItem
    });

    item.save();
    // defaultItems.push(item);
    res.redirect("/");
});


app.listen(3000, function(){
    console.log('Server started in port 3000');
});
