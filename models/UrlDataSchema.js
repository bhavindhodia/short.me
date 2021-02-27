const { Schema,model} = require('mongoose')

const URLDataSchema = new Schema({
    urlID:{
        type: Schema.Types.ObjectId,
        ref:'urls',
        required:true
    },
    browser:String,
    os:String,
    version:String,
    platform:String,
    deviceType:String,
    country:String,
    countryCode:String,
    region:String,
    regionName:String,
    city:String,
    zip:String,
    lat:String,
    lon:String,
    timezone:String
    

},{
    timestamps:true
})
module.exports = model('urlData',URLDataSchema)