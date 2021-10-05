const mongoose = require('mongoose');

const customerModel = new mongoose.Schema({
    username : {
        type: String,
        required: false
    },
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
    },
    mobile : {
        type: Number,
    },
    wallets :
       {
           agency_account:{
               balance : {
                   type: Number,
                   required: false,
                   default : 0
               }
           },
           primary_account : {
             balance : {
                 type : Number,
                 required: false,
                 default: 0
             }  
           } 
       }
}, {timestamps: true});

module.exports = mongoose.model('Customer', customerModel);