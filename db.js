const mongoose = require('mongoose');

mongoose.connect(process.env.DBURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("app connected with db.");
});
mongoose.connection.on("error",()=>{
    console.log("error found to connection with db.");
});