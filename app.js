const express = require('express');
const route = require('./routes/mainRoute');
const dotenv = require('dotenv').config();
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
const db = require('./db');

app.use(bodyparser.urlencoded({
    extended:false
}));
app.use(bodyparser.json());
app.use(cors());
app.use(route);

app.listen(PORT,()=>{
    console.log('App is running on port : ',PORT);
});