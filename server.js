const express = require('express');
const sql = require('mssql/msnodesqlv8');
const app = express();
const database = require('./database');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const bodyParser = require('body-parser');
var kolegiji = [];
var status = [];
var infoStudenta = [];
//const idStudent;
var username;
require('dotenv').config();
const JSON_COLUMN_KEY = process.env.JSON_COLUMN_KEY;

const PORT = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

//LOGIN
app.get("/", (req, res) => {
    res.render("login");
})

//LOGOUT
app.get('/logout', (req, res) => {
    res.redirect("/");
    kolegiji = []
    status = []
    username = "";
    infoStudenta = []
})

//LOGIN 
app.post('/login', function (req, res) {
    username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const request = new sql.Request();
        request.input("usr", sql.VarChar(15), username)
        request.input("pwd", sql.VarChar(20), password)
            .execute("Prijava").then(function (result) {

                if (result.recordset.length > 0) {
                    res.redirect("/data");
                    //localStorage.setItem('prijavljeniKorisnik', JSON.stringify(username));
                    const duljina = result.recordsets[0].length;
                    for (let i = 0; i < duljina; i++) {
                        global.globalID_prof = result.recordsets[0][i].PROFESORI_ID_profesor;
                    }
                } else {
                    res.render("login", { message: "Pogrešno korisničko ime ili lozinka." });
                    res.end();
                }
            }).catch(function (err) {
                console.log(err);
            });
    } else {
        res.render("login");
        res.end();
    }
});

//PRIKAZ KOLEGIJA PROFESORA
app.get('/kolegiji', function (req, res) {
    const id = globalID_prof;
    const request = new sql.Request();
    request.input("id_profesor", sql.Int(), id)
        .execute("getKolegijProf").then(function (result) {
            //res.send(JSON.parse(result.recordset[0].popisKolegija))
            if (result.recordset.length > 0) {
                kolegiji = JSON.parse(result.recordset[0].popisKolegija);
                res.send(kolegiji);
                //console.log(kolegiji)
                //res.redirect('/data');
            } else {
                res.send({ message: "" })
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ error: "An error occurred." });
        });
})

//STATUS ODABRANOG KOLEGIJA
app.post('/status', function (req, res) {
    const idKolegij = req.body.cmb;
    if (!isNaN(idKolegij)) {
        const startTime = performance.now();
        const request = new sql.Request();
        request.input("id_kolegij", sql.Int(), idKolegij)
            .execute("getStatusiByKolegij").then(function (result) {
                const endTime = performance.now();
                const executionTime = endTime - startTime;
                console.log("Stored procedure execution time (getStatusi): " + executionTime + " ms");
                if (result.recordset.length > 0) {
                    const data = JSON.parse(result.recordset[0][JSON_COLUMN_KEY]);
                    status = data.statusKolegija;
                    res.redirect("/data");
                }
            })
    } else {
        res.redirect("/data");
    }
});

//SELECT * FROM STATUSI
// app.post('/status', function(req, res){
//     const startTime = performance.now();
//     const request = new sql.Request();

//     request.query("SELECT * FROM STATUSI")
//         .then(function(result){
//             const endTime = performance.now();
//             const executionTime = endTime - startTime;
//             console.log("SQL query execution time: " + executionTime + " ms");
//             if (result.recordset.length > 0) {
//                 status = result.recordset;
//                 res.redirect("/data");
//             }
//         })
//         .catch(function(err){
//             console.error(err);
//             // Handle the error here
//             res.status(500).send("An error occurred while executing the SQL query.");
//         });
// });

//QUERY
// app.post('/status', function(req, res){
//     const idKolegij = req.body.cmb;
//     if(!isNaN(idKolegij)){
//         const startTime = performance.now(); 
//         const request = new sql.Request();
//         request.input("id_kolegij", sql.Int(), idKolegij)
//         .query("SELECT std.ID_student, std.Ime, std.Prezime, s.ID_status" +
//                "CONVERT(varchar, s.Datum, 104) AS Datum, s.Postotak, s.Bodovi" +  
//                "o.ID_ocjena, o.Oznaka, i.ID_ispit, i.Naziv " +
//                "FROM ISPITI i " +
//                "INNER JOIN STATUSI s ON i.ID_ispit = s.ISPITI_ID_ispit " +
//                "INNER JOIN OCJENE o ON s.OCJENE_ID_ocjena = o.ID_ocjena " +
//                "INNER JOIN STUDENTI std ON s.STUDENTI_ID_student = std.ID_student " +
//                "WHERE KOLEGIJI_ID_kolegij=@id_kolegij FOR JSON PATH, ROOT('statusKolegija')") 
//         .then(function(result){
//             const endTime = performance.now();
//             const executionTime = endTime - startTime;
//             console.log("SQL query execution time: " + executionTime + " ms");
//             if (result.recordset.length > 0) {
//                 const data = JSON.parse(result.recordset[0]['JSON_COLUMN_KEY']);
//                 status = data.statusKolegija;
//                 res.redirect("/data"); 
//             }   
//         }) 
//     } else {
//         res.redirect("/data");
//     }
// });

//GET
app.get('/info', function (req, res) {
    const idStudent = req.query.id;
    const startTime = performance.now();
    const request = new sql.Request();
    request.input("idStudent", sql.Int(), idStudent)
        .execute("getInfoStudenta")
        .then(function (result) {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            console.log("Stored procedure execution time (getInfo): " + executionTime + " ms");
            if (result.recordset.length > 0) {
                const data = JSON.parse(result.recordset[0][JSON_COLUMN_KEY]);
                infoStudenta = data.infoStudenta;
                res.send(infoStudenta);
            } else {
                res.send({ message: "Student not found." });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "An error occurred" });
        });
});

//DELETE
app.delete('/deleteStatus/:idStatus', function (req, res) {
    const idStatus = req.params.idStatus;
    const startTime = performance.now();
    const request = new sql.Request();
    request.input("id_status", sql.Int(), idStatus)
        .execute("deleteStatus")
        .then(function (result) {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            console.log("Stored procedure execution time (deleteStatus): " + executionTime + " ms");
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});

//UPDATE
app.post('/updateOcjena/:idStatus', function (req, res) {
    const idStatus = req.params.idStatus;
    const ocjena = req.body.ocjena;
    const startTime = performance.now();
    const request = new sql.Request();
    request.input("id_status", sql.Int(), idStatus)
    request.input("ocjena", sql.Int(), ocjena)
        .execute("updateOcjena")
        .then(function (result) {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            console.log("Stored procedure execution time (updateOcjena): " + executionTime + " ms");
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});

app.get('/data', (req, res) => {
    res.render('data', {
        username: username,
        kolegiji: kolegiji,
        status: status,
        infoStudenta: infoStudenta
    });
})

app.listen(PORT, function () {
    console.log("Server is running.");
})

