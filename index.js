var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql/msnodesqlv8");

const app = express();
const port = 90;
app.use(bodyParser.json());

const tables = ["Home","ADMIN_TYPES","ADMINS","CATEGORIES","SUPPLIERS","PRODUCTS","PRODUCT_RUGS","PRODUCT_DECORS","CUSTOMERS","CARTS","CART_DETAILS","PAYMENT_METHODS","ORDERS","ORDER_DETAILS"];

app.listen(port, "0.0.0.0", () =>
console.log(`Application started successfully on port ${port}.`)
);

//Initiallising connection string
var dbConfig = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={DBMS_PROJECT_FINAL};Trusted_Connection={yes};'
};

app.use(express.static("public"));

app.get("/dbms", async (req, res) => {
    try {
            res.status(200);
            res.send(await getTables());
    } catch (error) {
        res.status(500);
        res.send({
            success: false,
            data: {}
        });
    }
});

app.get("/dbms/:tableName", async (req, res) => {
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
    <link rel="shortcut icon" href="https://cdn3.iconfinder.com/data/icons/engineer-s-favorite/512/db-512.png">
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
          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #333333;
          }
          
          li {
            float: left;
          }
          
          li a {
            display: block;
            color: white;
            text-align: center;
            padding: 10px;
font-size: 12px;
            text-decoration: none;
        }
        .active{
            background: green;
            }
          
          li a:hover {
            background-color: #111111;
          }
          .all-headers{
              text-allign : center;
          }
        </style>
        <title>DBMS-509 - ${tableName}</title>
    </head>
    
    <body>
        <h1 style='text-align: center;'>DATABASE TABLES LISTING ON WEBSITE USING NODE</h1>
        <ul>
            ${getPagesList(tableName)}
        </ul>
    
        <table id='table_Dv'>
                ${getHeader(cols,tableName)}
                ${getRows(cols,data)}

        </table>
    
    </body>
    
    </html>`
}

function getHeader(cols,heading=""){
    let elem = "<tr>"
    if(heading){
        elem = `${elem}<th style="text-align:center;background-color:#00335a" colspan=${cols.length}>${heading}</th>`;
        elem = `${elem}</tr>`
        elem = `${elem}<tr>`
    }
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

function getPagesList(tableName){
    let pages = "";
    for (let table of tables){
        pages = `${pages} <li><a class="${table === tableName ? "active" : ""}" href="/dbms/${table === "Home"? "" : table}">${table}</a></li>`
    }
    return pages;
}

async function getTables() {
    return `<!DOCTYPE html>
    <html>
    
    <head>
    <link rel="shortcut icon" href="https://cdn3.iconfinder.com/data/icons/engineer-s-favorite/512/db-512.png">
        <style>
        .table_Dv {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
            margin-top: 2px;
          }
          
          .table_Dv td, #table_Dv th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          .table_Dv tr:nth-child(even){background-color: #f2f2f2;}
          
          .table_Dv tr:hover {background-color: #ddd;}
          
          .table_Dv th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
          }
          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #333333;
          }
          
          li {
            float: left;
          }
          
          li a {
            display: block;
            color: white;
            text-align: center;
            padding: 10px;
font-size: 12px;
            text-decoration: none;
        }
        .active{
            background: green;
            }
          
          li a:hover {
            background-color: #111111;
          }
          .allHeaders{
            text-align: center;
        }
        </style>
        <title>DBMS-509</title>
    </head>
    
    <body>
        <h1 style='text-align: center;'>DATABASE TABLES LISTING ON WEBSITE USING NODE</h1>
        <ul>
            ${getPagesList("Home")}
        </ul>

        ${await getAllTables()}
    
    </body>
    
    </html>`
}

async function getAllTables(){
    let allTables = "";
    try{
        let db = await sql.connect(dbConfig);
        let count = 0 ;
        for (let item of tables){
            if(item !== "Home"){
                let response = await db.query(`SELECT * FROM ${item}`);
                console.log(response);
                console.log("after")
                let data = response.recordset;
                let cols = Object.keys(data[0]);
                let header = getHeader(cols,item);
                let rows = getRows(cols,data);
                let tableDv = `<table class='table_Dv'>${header} ${rows}</table>`;
                allTables = `${allTables}${tableDv}`;                
            }
        }   
    }catch(e){
        console.log(e);
    }
    sql.close();
    return allTables;
}