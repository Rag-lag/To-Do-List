// jshint esversion:8
const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname+'/date');
const mongoose = require('mongoose');

// let items = ["Buy Food", "Cook Food", "Eat Food"];

// let workItems = [];

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-raghav:Test123@cluster0.o3gli.mongodb.net/todoListDB");
const itemsSchema = mongoose.Schema({
  task: String
});
const Item = mongoose.model("Item", itemsSchema);
const t1 = new Item({
  task: "Welcome your to do list",
});
const t2 = new Item({
  task: "Hit + to add more tasks",
});
const t3 = new Item({
  task: "<-- Hit this to check it off",
});
const defaultItems = [t1, t2, t3];

// const listSchema={
//   name: String,
//   items:[itemsSchema]
// };
// const List = mongoose.model("List", listSchema);
app.get("/", function (req, res) {
  // res.send("Hello")
  // let day=date.getDate();
  let items = Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) console.log(err);
        else console.log("Successfully saved default items to DB.");
      });
      res.redirect("/");
    } else {
      res.render("list", {
        kindOfDay: "Today",
        newListItems: foundItems
      });
    }

  });
});

app.get("/:customListName", (req, res) => {
  const listName = req.params.customListName;
  console.log(listName);
  const List = mongoose.model(listName, itemsSchema);
  let items = List.find({}, function (err, foundItems) {
    res.render("list", {
      kindOfDay: listName,
      newListItems: foundItems
    });
  });

});


app.post("/", function (req, res) {
  const item = req.body.newItem;
  const listName = req.body.list;
  const List = mongoose.model(listName, itemsSchema);
  if (listName === "Today") {
    const task = new Item({
      task: item
    });
    task.save();
    res.redirect("/");
  } else {
    const task = new List({
      task: item
    });
    task.save();
    res.redirect("/" + listName);
  }


  // console.log(req.body);
});

app.post("/delete", (req, res) => {
  const checkedBoxId = req.body.checkbox;
  const listName = req.body.head;
  console.log(listName);
  const List = mongoose.model(listName, itemsSchema);
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedBoxId, function (err, item) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted task " + item._id);
      }
    });
    res.redirect("/");
  }
  else{
    List.findByIdAndDelete(checkedBoxId, (err,item)=>{
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted task " + item._id);
      }
    });
    res.redirect("/"+listName);
  }
});


// app.post("/work", function(req, res) {
//   let item = req.body.newItem;
//
// });

app.listen(process.env.PORT, function () {
  console.log("Server started on port 3000.");
});