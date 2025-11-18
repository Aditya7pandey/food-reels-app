// create server
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth.routes.js')
const foodRoutes = require('../routes/food.routes.js')
const commentRoutes = require('../routes/comments.route.js')
const cors = require('cors')

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/food/',foodRoutes);
app.use('/api/comment',commentRoutes)

app.get('/',(req,res)=>{
    res.send("Hello world");
})  

module.exports = app;
