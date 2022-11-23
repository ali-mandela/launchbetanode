const mongoose = require('mongoose');
const MONGOURI = process.env.Mongo_uri

console.log(MONGOURI);

mongoose.connect(MONGOURI, {
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