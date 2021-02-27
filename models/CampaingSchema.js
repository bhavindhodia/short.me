const {Schema,model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const CampaingSchema = new Schema({
    campaingName : reqString,
    description:{type:String},
    alias:[{
        type:Schema.Types.ObjectId,
        ref: 'urls',
        required: true
    }]
}, {
    timestamps: true
} )

module.exports = model('campaing', CampaingSchema)