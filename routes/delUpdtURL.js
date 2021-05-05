const express = require('express');
const router = express.Router();
const { isWebUri } = require('valid-url')
const urlSchema = require("../models/UrlSchema");
const campaingSchema = require('../models/CampaingSchema');
const { Types } = require('mongoose');
require('dotenv').config()
const baseUrl = process.env.BASE_URI

router.delete('/',async(req,res) =>{
    if (isWebUri(baseUrl)) {
        try {
            
            const{deleteID,campaingID} = req.query
            
            try {
                const campaingSchemeData = await campaingSchema.findByIdAndUpdate(campaingID,{
                    $pull: { alias: Types.ObjectId(deleteID)}
                },{
                    new:true
                })
                if (!campaingSchemeData) {
                    return res.status(404).json({
                    ok:false,
                    error:'Campaing Error',
                    result:[]
                })
            }

                const urlSchemeData = await urlSchema.findByIdAndDelete(deleteID)
                console.log("urlSchemeData",[urlSchemeData,campaingSchemeData]);

                return res.status(200).json({
                    ok:true,
                    error:'',
                    result:[urlSchemeData,campaingSchemeData]
                })
                
            } catch (error) {
                console.log("Error",error);

                return res.status(500).json({
                    ok: false,
                    error: error,
                    result: []
                })
            }

           // console.log("result",result);
            //return res.json({ response: result})

        } catch (error) {
            console.log("Error",error);
        }
    }
})

module.exports = router