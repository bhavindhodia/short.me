const express = require('express');
var axios = require('axios')
const router = express.Router();
const urlSchema = require('../models/UrlSchema');
const UrlDataSchema = require('../models/UrlDataSchema');
const { errorHandler } = require('../middlewares/errorHandler');

router.get('/:code', async (req, res) => {
    try {
        const url = await urlSchema.findOne({ urlCode: req.params.code });
        const {browser,version,os,platform}= req.useragent
        if (url) {
        
            // Set Location Data
            const { country, countryCode, region, regionName, city, zip, lat, lon, timezone,query } = await makeRequest(req,res)
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log("IP",  ip);
            console.log("Req IP", req.ip); 
            const urlDataResult = new UrlDataSchema({
             urlID:url._id,
             browser,
             version,
             os,
             platform,
             country,
             countryCode,
             region,
             regionName,
             city,
             zip,
             lat,
             lon,
             timezone,
             deviceType:getDeviceType(req.useragent)
            })
            .save()
       // console.log("deviceType " , getDeviceType(req.useragent));
        const urlResult = url.updateOne({$inc:{visitCount:1}}).exec()
        return res.redirect(url.longURL);
         

        } else {
            return res.status(404).json('No Url found');
        }
    } catch (err) {
        console.error(err.message);
       // res.status(500).json('Server Error');
    }
});

const getDeviceType = userAgent =>{
    //console.log("userAgent",userAgent);
    switch (true) {
        case userAgent.isMobile:
            return "Mobile"
        case userAgent.isDesktop:
            return "Desktop"
        case userAgent.isTablet:
            return "Tablet"
        case userAgent.isCurl:
            return "CURL"
        case userAgent.isBot:
            return "Bot"
        case userAgent.isSmartTV:
            return "TV"
            default:
                return "default"
    }
}
const makeRequest = async(req,res) => {
  try {
     const result = await axios.get("http://ip-api.com/json/") 
     return result.data
  } catch (error) {
      errorHandler(error,req,res)
      
  }
}

module.exports = router;