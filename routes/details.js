const express = require('express')
const UrlDataSchema = require('../models/UrlDataSchema')
const router = express.Router()
const{Types} = require('mongoose')

router.get('/',async(req,res)=>{
    const {urlID} = req.query
    console.log("urlID",req.query);
    //const listData = await UrlDataSchema.find({urlID})
   /*  const listData = await UrlDataSchema.aggregate([{
    $match:{urlID:Types.ObjectId(urlID)}
    },{
            $group: {
                 _id: { $dayOfYear: "$updatedAt" },
                click: { $sum: 1 } 
                date:{
                    $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))
                },
                views:{$sum:1}
            } 
    }]
    ) 
    */

    const listData = await UrlDataSchema.aggregate([{
        $match:{
            urlID:Types.ObjectId(urlID),
            "updatedAt":{
                $gte: new Date((new Date().getTime() - (5 * 24 * 60 * 60 * 1000)))
            }
        }
    },{
            $group:{
               
                 _id: { $dayOfYear: "$updatedAt" },
                views: { $sum: 1 } 
            
        }
    }
    ])
    console.log("listData",listData);
    return res.json({ok:"true",result:listData})
})

module.exports = router 