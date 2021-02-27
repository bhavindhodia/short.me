require('dotenv').config()

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res={statusCode:500}) {
    /* eslint-enable no-unused-vars */
   const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    console.log("error handler Hit");
     return res.json({
        error: err.message,
        ok:false,
        result:'',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    }); 
    
}

module.exports = {
    notFound,
    errorHandler
};