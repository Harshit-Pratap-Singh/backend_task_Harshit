const mongoose=require('mongoose');

const Schema= mongoose.Schema({
    tasks:{
        type:[String],
        require:"true"
    }
})

export const BACKEND_TASK_HARSHIT=mongoose.model('BACKEND_TASK_HARSHIT',Schema);