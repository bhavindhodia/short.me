const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid')
require('dotenv').config()
const urlSchema = require("../models/UrlSchema");
const campaingSchema = require("../models/CampaingSchema");

const { isUri } = require('valid-url');
const UrlDataSchema = require('../models/UrlDataSchema');
const {errorHandler} = require('../middlewares/errorHandler');

router.post('/',async(req,res) =>{
    const {longURL,campaingID} = req.body
    console.log("Body",req.body);
    if (isUri(longURL)){
    
        try {
            const ifUrlExist = await urlSchema.findOne({ longURL })
            if (ifUrlExist) {
                return res.status(409).json({
                    ok: false,
                    result: ifUrlExist,
                    error: "URL Already Exist "
                })
            }
    
            const campaing = await campaingSchema.findById(campaingID)
            const urlCode = nanoid(6)
            const shortURL = process.env.BASE_URI+urlCode

            // CREATE NEW URL SCHEMA
        //?? Add to URL List
            const saveToUrl = await new urlSchema({
                urlCode,
                longURL,
                shortURL,
                campaingID  
            })

        // ADD THAT URL TO CAMPAING
        //?? Add to campaing URL list array
            await campaing.alias.push(saveToUrl._id) 

        //?? Create URLData Schema for that URL

            
            const campaingResult = await campaing.save()
            const saveToUrlResult = await saveToUrl.save()
            //const urlDataResult = await saveToUrlData.save()
           return res.json({
               result:[campaingResult,saveToUrlResult],
               error:'',
               ok:true
           })
            }
        catch (error) {
            console.log("Error  => ", error);
            return res.json({
                result: [],
                ok: false,
                error: error
            })
        }
    }
    return res.json({
        ok:false,
        error:"Not a valid URL"
    })
})
            

router.post('/campaing',async(req,res) =>{
    const {campaingName} = req.body
    console.log(("Body", campaingName));
    try{
        let campaings = await campaingSchema.findOne({ campaingName})
        if(campaings){
            return res.status(409).json({
                result:campaings,
                ok:false,
                error:"Campaing Already Exist"
            })
        }
        
        campaings = new campaingSchema({
            campaingName
        })
        campaings = await campaings.save() 
        return res.json({
            result:campaings,
            ok:true,
            error:''
        })
        
    }catch(err){
        console.log("Error",err);
        /* res.status(500).json({
            ok:false,
            error:"Server Error",
            result:[]
        }) */
        errorHandler(err,res,req)
    }
})

module.exports = router;