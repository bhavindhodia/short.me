const {Schema,model} = require('mongoose');

const reqString = {
    type:String,
    required:true
}
const URLSchema = new Schema({
    urlCode:{
        type:String,
        unique:true
    },
    longURL:reqString,
    shortURL: reqString,  
    visitCount:{
        type:Number,
        default:0
    },
    campaingID:{
        type:Schema.Types.ObjectId,
        ref:'campaing',
        required:true
    }

},{
    timestamps:true
}
)
module.exports = model('urls', URLSchema);