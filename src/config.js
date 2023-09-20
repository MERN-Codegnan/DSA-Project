const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://sivaram:sivaram@cluster0.0u7y0h0.mongodb.net/DSA?retryWrites=true&w=majority");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    firstname: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number:{
        type:String,
        required:true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;