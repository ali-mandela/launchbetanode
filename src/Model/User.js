const mongoose  = require('mongoose');

const registerSchama =  mongoose.Schema ({
    email:{
        type:String,
        required:true,
        unique:true,

    },
    
},
{
    timestamps : true,
});

const emailRegister = mongoose.model('emailRegister', registerSchama);


module.exports =emailRegister;