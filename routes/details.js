const express = require('express')
const UrlDataSchema = require('../models/UrlDataSchema')
const router = express.Router()
const{Types} = require('mongoose')

router.get('/',async(req,res)=>{
    const {urlID,pastDays} = req.query
    console.log("urlID",req.query);

    const listData = await mainLineChart(urlID,pastDays)
    const deviceType = await typeData(urlID,"deviceType")
    const countryValue = await typeData(urlID,"countryCode")
    if(listData.length !==0){
        return res.json({
            ok: "true", result: {
                mainLineChart: listData,
                devicePieChart: deviceType,
                countryMap: countryValue
            }
        })
    }
    return res.json({
        ok: "false",
        error:"No Data Avaliable"
    })
   
    
})

const typeData = async (urlID,type) => {
    //const dataName = type.toString()
    const dataType = await UrlDataSchema.aggregate([{
        $match: {
            urlID: Types.ObjectId(urlID),
        }
    },
    {
        $group: {
            _id: {[type]:'$'+type},
            value: { $sum: 1 },
        }
    },
    {
        $project: {
            "name": '$_id.'+type,
            value: "$value",
            _id: 0
        }
    }])
    console.log("Data Type = ", dataType);
    return dataType;
}



const mainLineChart = async(urlID,days=70) =>{
    const weekDate = new Date()
    weekDate.setDate(weekDate.getDate() - days)
    const listData = await UrlDataSchema.aggregate([
        {
            $match: {
                urlID: Types.ObjectId(urlID),
                updatedAt: { $gt: weekDate }
            }
        },
        {
            $group: {
                _id: { $dayOfYear: "$updatedAt" },
                click: { $sum: 1 },
                date: { $min: "$updatedAt" }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } }
                , click: 1,
                _id: 0
            }
        }
    ])
    return listData
}
module.exports = router 