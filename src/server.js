const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config(); 
const port = process.env.PORT  || 8000; 

//mongodb connection
require('./DB/connection') 

const emailRegister = require('./Model/User')

//routes

app.get('/', (req, res)=>{
    res.send('server is up')
})
app.get('/registter', async(req,res)=>{
    const num =await emailRegister.countDocuments(); 
    res.json({num:num});
})

app.post('/register',  (req,res)=>{

    const {email} = req.body;
    // console.log(req.body);
    emailRegister.findOne({email}, (err, user)=>{
        if(user){
            res.status(202).send( {status:true,message : ' user Exist'})
            // console.log({mesaage : ' user exist'});
        }else{
            const User  = new emailRegister ({email});
            User.save((err)=>{
                if(err){
                    res.status(400).send({status:false, message : "having problem in registering"})
            // console.log({status : false , mesaage : ' having problem in registerung'});

                }else{
                    res.status(201).send({ status : true, message:`Registered succesfully ${email}`})
            // console.log({mesaage : ' Registered succesfully'});

                }
            })
        }
    }) 
})


app.listen(port,()=>{
    console.log(`server is up at  ${port}`);
})