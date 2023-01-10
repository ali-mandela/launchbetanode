const mysql = require('mysql2')
const dotenv = require("dotenv")
dotenv.config();
var mysqlConnection = mysql.createConnection({
    host:process.env.mysql_host, 
    user:process.env.mysql_user,
    password:process.env.mysql_password,
    database:process.env.mysql_database
});

mysqlConnection.connect(function(err){
    if(err)
    console.log(err)
    else{
        console.log("sql connected");
//         var sql = `CREATE TABLE SKROPAY_EMAIL_REGISTER
//          (email VARCHAR(150) ,
// count int unsigned DEFAULT 0,
// ref_id VARCHAR(200) PRIMARY KEY,
// cTime DATETIME DEFAULT CURRENT_TIMESTAMP,
// usercity VARCHAR(100) DEFAULT 'india',
// emails JSON NOT NULL DEFAULT (JSON_ARRAY())
//             )`
//         mysqlConnection.query(sql, function(err, res){
//             if(err)
//             console.log(err);
//             else{
//                 console.log('res');
//             }
// //         })
        
//     }
//     )
}
})

module.exports = mysqlConnection;

