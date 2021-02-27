const express =require('express')
const cors = require("cors");
const morgan = require('morgan')
const helmet = require('helmet')
const middlewares = require('./middlewares/errorHandler')
require('dotenv').config()

const app = express();
app.use(helmet())
app.use(morgan('dev'))

app.use(cors())
app.use(express.json())
app.use(require('express-useragent').express())

// Connect Database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 4000


app.set('trust proxy', true)
//app.enable('trust proxy')

// For Homepage data 

app.use('/',require('./routes'))
app.use('/api/genurl/', require('./routes/genURL'));
app.use('/', require('./routes/redirect'));

app.use('/api/get/',require('./routes/list'))
app.use('/api/delete/',require('./routes/delUpdtURL'))
app.use('/api/update/', require('./routes/delUpdtURL'))

// For Details Page
app.use('/api/details/', require('./routes/details'))


app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

app.listen(PORT,() => console.log(`Started on port => ${PORT}`));