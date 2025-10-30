const mongoose = require('mongoose'
);


const faultySchema = new  mongoose.Schema({
    name :{
        type:String,
        Required
    }  
})

module.exports = mongoose.model('Faculty', faultySchema);