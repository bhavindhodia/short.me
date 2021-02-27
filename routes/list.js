const { response } = require('express');
const express = require('express');
const router = express.Router();

const config = require('config');
const baseUrl = config.get('baseURI');

const urlSchema = require("../models/UrlSchema");
const campaingSchema= require('../models/CampaingSchema')
const { NO_CAMPAING} = require('../errorCode');
const {Types} = require("mongoose");
const {isWebUri} = require('valid-url')


router.get('/',async(req,res) =>{
    console.log("base",baseUrl);
    if (isWebUri(baseUrl)) {
        const { current = 1, pageSize = 10 } = req.query;
    
            const campaingList= await campaingSchema.find()
            if(campaingList.length > 0){
                
                try {
                const {campaingID = campaingList[0]._id} = req.query
                
                const urlList = await urlSchema.aggregate(
                    [{$match: {
                            campaingID: Types.ObjectId(campaingID)
                            
                        }},
                    {$sort: { updatedAt: -1 }},
                    { $skip: (current - 1) * pageSize },
                    {$limit:pageSize*1}
                    
                ]).exec()
                
                    if (urlList) {
                        const campaingData = await campaingSchema.findById(campaingID)
                        const count = campaingData.alias.length
                        console.log("totalPG", count);
                         return res.json({
                            campaingList,
                            urlList,
                            totalPages: count, 
                            currentPage: parseInt(current),
                            ok:true,
                            error:''
                        });
                    }
                    
                    return res.status(404).json({ 
                    error: 'No record Found 😣' ,
                    ok:false
                })
                } catch (err) {
                    console.error(err.message);
                    res.status(500).json('Server Error');
                }
            }else{
                
                res.status(204).json({
                    ok:false,
                    error: NO_CAMPAING
                })
            }
    }
    else{
        console.log("invalid URL");
    }
})

router.get('/:urlID', async (req, res) => {
    if (isWebUri(baseUrl)) {
        try {
            const listData = await urlSchema.findOne({ 
                _id:req.params.urlID
            })
             if (listData) {
                  res.json(listData) 
                 }
             else {
                 res.status(404).json({ error: 'No Data matching that ID' })          
                }
        } catch (err) {
            console.error(err.message);
            response.status(500).json('Server Error');
        }
    }
})

module.exports = router