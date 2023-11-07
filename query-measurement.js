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

// Function to measure the time to retrieve all records
async function measureQueryTime() {
  try {
    const pool = await sql.connect(config);
    const startTime = Date.now();
    
    const result = await pool.request().query('SELECT * FROM Statusi');
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    console.log("Query execution time: " + executionTime + " ms");
    
    const records = result.recordset;
    console.log("Number of records retrieved: " + records.length);

    sql.close();
  } catch (err) {
    console.error(err);
  }
}

measureQueryTime();
