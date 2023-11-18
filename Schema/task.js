const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    description:{
        type:String,
        required : true
    },
    priority:{
        type:String,
        enum : ['high' , 'medium' , 'low'],
        default : 'medium'
    },
    assingedTo : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type : String,
        enum : ['pending' , 'in progress' , 'completed'],
        default: 'pending'
    },
    dueDate : Date

});

const Task = mongoose.model('Task' , taskSchema)
module.exports = Task;

