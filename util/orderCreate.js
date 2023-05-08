require('dotenv').config();

const mongoose = require("mongoose");
const Order = require("../models/order");
const urlConnect = process.env.DB;;

//Connect to db
mongoose.connect(urlConnect, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log("Connect successfully!!");

  var order = new Order({});

  order.save(function(err) {
    if (err) throw err;
    console.log("Comment successfully saved.");
  });
});
