const express = require('express');
const mysqlConnection = require('./conn');
const dotenv = require('dotenv');
const cors = require('cors');
const shortid = require('shortid');
const nodemailer = require('nodemailer'); 


const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
//
async function main(email) { 
    let transporter = nodemailer.createTransport({
      host: 'mail.skropay.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@skropay.com',
        pass: 't?bIBjWP8bG2'
      }
    }); 
    let info = await transporter.sendMail({
    from: '"SkroPay "<contact@skropay.com>',
      to: `${email}`,
      subject: 'Thank you for registering with skropay.',
    //   text: 'Hello! This is a test email sent using Nodemailer and Sendinblue.',
      html: { path: './email.html' }
    }); 
    // console.log("Message sent: %s", info.messageId);
  }
  
// home route
app.get('/', (req, res) => {
    res.send("server is up")
})
// route to get count of subs
app.get('/count', (req, response) => {
    var sql = `SELECT COUNT(*) as subs FROM SKROPAY_EMAIL_REGISTER`;
    mysqlConnection.query(sql, function (err, res) {
        if (err) 
            console.log(err);
        response.send({subscriber: `${res[0].subs}`})

    })
})

//route to get rank
app.post('/rank/:id', (req, response) => {
    const unique_id = req.params.id;

    var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER WHERE ref_id='${unique_id}'`
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            response.send({msg: "error in registering", err})
            console.log(err);
        } else {
            var len = Object
                .keys(result)
                .length;
            if (len === 0) {
                response.send({msg: `${unique_id} is not a valid ref id.`, unique_id})
            } else {
                // query to find the rsnk of user
                var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER ORDER BY count DESC`;
                mysqlConnection.query(sql, function (err, res) {
                    if (err) {
                        console.log(err);
                        response.send({msg: "errorin getting the rank of user, please wait later"})
                    } else {
                        var a = res.findIndex(x => x.ref_id === unique_id);
                        response.send({
                            rank: `${a + 1}`
                        })
                    }
                })
            }

        }
    })
})
// get route to get rank
app.get('/rank/:id', (req, response) => {
    const unique_id = req.params.id;
    console.log(unique_id);

    var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER WHERE ref_id='${unique_id}'`
    var ress;
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            response.send({msg: "error in getting the rank", err})

        } else {
            console.log(result);
            ress = result;
            var len = Object
                .keys(result)
                .length;
            if (len === 0) {
                response.send({status: 'invcontact@skropay.comd ref id', msg: `${unique_id} is not a valid ref id.`, unique_id})
            } else {
                // query to find the rsnk of user
                var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER ORDER BY count DESC`;
                mysqlConnection.query(sql, function (err, res) {
                    if (err) {
                        response.send({status: "error", msg: "errorin getting the rank of user, please wait"})
                    } else {
                        var a = res.findIndex(x => x.ref_id === unique_id);
                        response.send({
                            rank: `${a + 1}`,
                            ress,
                            status: "success"
                        })
                    }
                })
            }

        }
    })

})
//route to register an user
app.post('/register', (req, response) => {
    const ref_id = shortid.generate()
    const {email, cityName} = req.body;
    const userCity = (cityName
        ? cityName
        : "india")
    //checking wearther user exist ot not
    var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER WHERE email='${email}'`
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            response.send({msg: "error in registering", err, status: "error"})
        } else {
            var len = Object
                .keys(result)
                .length;
            if (len === 0) {
                //registering new user here
                var sql = `INSERT INTO SKROPAY_EMAIL_REGISTER (email, count, ref_id , usercity) VALUES ('${email}', '${ 0}',  '${ref_id}', '${userCity}')`;
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        response.send({msg: "error in registering", err, status: "error"})
                    } else {
                        var sql = `SELECT * FROM  SKROPAY_EMAIL_REGISTER WHERE email="${email}"`;
                        mysqlConnection.query(sql, function (err, results) {
                            if (err) {
                                console.log(err);
                                response.send({msg: "error in registering", err, status: "error"})
                            } else { 
                                var email = results[0].email;
                                main(email).catch(console.error)
                                response.send({msg: "registeration done", results, status: "success"})
                            }
                        })

                    };
                });

            } else {
                var sql = `SELECT * FROM  SKROPAY_EMAIL_REGISTER WHERE email="${email}"`;
                mysqlConnection.query(sql, function (err, res) {
                    if (err) {
                        console.log(err);
                        response.send({msg: "error in registering", err, status: "error"})
                    } else {
                        console.log(res);
                        response.send({msg: "user already exist", status: "success", res})
                    }
                })

            }

        }
    })
})

// route to register using ref link

app.post('/register/:id', (request, response) => {
    const ref_id = shortid.generate()
    const unique_id = request.params.id;
    const {email, cityName} = request.body;
    const userCity = (cityName
        ? cityName
        : "india")

    //checking weather ref exist or not
    var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER WHERE ref_id='${unique_id}'`
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            response.send({msg: "error in registering", err, status: "error"})
        } else {
            var len = Object
                .keys(result)
                .length;
            if (len === 0) {
                response.send({msg: "invalid referral id.", status: "success"})
            } else {
                //ref id exist check weather user exist or not
                const data = result;
                var sql = `SELECT * FROM SKROPAY_EMAIL_REGISTER WHERE email='${email}'`
                mysqlConnection.query(sql, function (err, res) {
                    if (err) {
                        console.log(err);
                        response.send({msg: "error in registering", err, status: "error"})
                    } else {
                        var len = Object
                            .keys(res)
                            .length;
                        if (len !== 0) {
                            var sql = `SELECT * FROM  SKROPAY_EMAIL_REGISTER WHERE email="${email}"`;
                            mysqlConnection.query(sql, function (err, res) {
                                if (err) {
                                    response.send({msg: "error in registering", err, status: "error"})
                                    console.log(err);
                                } else {
                                    response.send({msg: "user already exist", res, status: "success"})
                                }
                            })
                        } else {
                            //update count and emails
                            var sql = `UPDATE SKROPAY_EMAIL_REGISTER SET emails = JSON_ARRAY_APPEND(emails, '$', "${email}"), count=${data[0].count + 1} WHERE ref_id='${unique_id}'`
                            mysqlConnection.query(sql, function (err, res) {
                                if (err)    console.log(err);   })
                            //creating new user from referral link
                            var sql = `INSERT INTO SKROPAY_EMAIL_REGISTER (email, count, ref_id , usercity) VALUES ('${email}', '${ 0}',  '${ref_id}', '${userCity}')`;
                            mysqlConnection.query(sql, function (err, result) {
                                if (err) {
                                    response.send({msg: "error in registering", err, status: "error"})
                                } else {
                                    var sql = `SELECT * FROM  SKROPAY_EMAIL_REGISTER WHERE email="${email}"`;
                                    mysqlConnection.query(sql, function (err, results) {
                                        if (err) {
                                            response.send({msg: "error in registering", err, status: "error"})
                                            console.log(err);
                                        } else {
                                            var email = results[0].email;
                                            main(email).catch(console.error)
                                            response.send({msg: "registeration done", results, status: "success"})
                                        }
                                    })

                                };
                            });
                        }

                    }
                })
            }
        }
    })

})
 

app.listen(process.env.port, () => {
    console.log(`server is up at  ${process.env.port}`);
})