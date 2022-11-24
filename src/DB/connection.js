const mongoose = require('mongoose'); 
 
mongoose.connect(process.env.Mongo_uri, {
    //depreciation warning
    useNewUrlParser:true,
    useUnifiedTopology:true
    // userCreateIndex:true
}).then(()=>{
    console.log(`connection succesful`);
}).catch((e)=>{
    console.log(
        `muhammad there is an error : ${e}`
    );

})