const sql = require('mssql/msnodesqlv8');
var config = {
    database: "fakultet",
    server: "DESKTOP-63FIKMC\\SQLEXPRESS",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

sql.connect(config, function(err) { 
    if(err){
        throw err ;
    }
    console.log("Connection Successful!");
});

