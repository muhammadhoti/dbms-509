var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql/msnodesqlv8");

const app = express();
const port = 90;
app.use(bodyParser.json());

app.listen(port, "0.0.0.0", () =>
    console.log(`Application started successfully on port ${port}.`)
);

//Initiallising connection string
var dbConfig = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={DBMS_PROJECT_FINAL};Trusted_Connection={yes};'
};

app.use(express.static("public"));

app.get("/:tableName", async (req, res) => {
    const tableName = req.params.tableName;
    try {
        sql.connect(dbConfig, (err) => {
            if (!err) {
                console.log("CONNECTED");
                sql.query(`SELECT * FROM ${tableName}`, (err, result, fields) => {
                    if (!err) {
                        res.status(200);
                        res.send(getTable(tableName, result.recordsets[0]));
                    } else {
                        res.send(err);
                    };
                });
            } else {
                console.log("Error while connecting database :- " + err);
                res.send(err);
                sql.close();
            }
        });
    } catch (error) {
        res.status(500);
        res.send({
            success: false,
            data: {}
        });
    }
});

function getTable(tableName, data) {
    let cols = Object.keys(data[0]);
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <style>
        #table_Dv {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          
          #table_Dv td, #table_Dv th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          #table_Dv tr:nth-child(even){background-color: #f2f2f2;}
          
          #table_Dv tr:hover {background-color: #ddd;}
          
          #table_Dv th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
          }
        </style>
        <title>DBMS-509</title>
    </head>
    
    <body>
        <h1 style='text-align: center;'>DATABASE TABLES LISTING ON WEBSITE USING NODE</h1>
        <h2>${tableName} : </h2>
    
        <table id='table_Dv'>
                ${getHeader(cols)}
                ${getRows(cols,data)}

        </table>
    
    </body>
    
    </html>`
}

function getHeader(cols){
    let elem = "<tr>"
    for(let item of cols){
        elem = `${elem}<th>`;
        elem = `${elem}${item}`
        elem = `${elem}</th>`;
    }
    elem = `${elem}</tr>`
    return elem;
}

function getRows(cols,data){
    let span = "<span>";
    for(let item of data){
        let tr = "<tr>";
        for(let col of cols){
            tr = `${tr}<td>`;
            tr = `${tr}${item[col]}`
            tr = `${tr}</td>`;
        }
        tr = `${tr}</tr>`;
        span = `${span}${tr}`;
    }
    span = `${span}</span>`;
    
    return span;
}