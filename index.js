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

app.get("/dbms/ORDER_DETAILS", async (req, res) => {
    const tableName = "ORDER_DETAILS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*,ORDERS.TOT_PRICE as TOTAL_PRICE, ${tableName}.ORDER_ID as ORDERR_ID, ${tableName}.PID as PRODUCT_ID, PRODUCTS.NAME as PRODUCT_NAME, PRODUCTS.COST as PRODUCT_COST FROM ${tableName} JOIN ORDERS ON ${tableName}.ORDER_ID = ORDERS.ID JOIN PRODUCTS ON ${tableName}.PID = PRODUCTS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.ORDER_ID;
            delete item.PID;
            item.TOTAL_PRICE = item.QTY * item.PRODUCT_COST;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/ORDERS", async (req, res) => {
    const tableName = "ORDERS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.CUSTOMER_ID as CUSTOMERR_ID, CUSTOMERS.EMAIL as CUSTOMER_EMAIL, CUSTOMERS.NAME as NAME, ${tableName}.PAYMENT_ID as PAYMENT_METHOD_ID, PAYMENT_METHODS.NAME as PAYMENT_METHOD FROM ${tableName} JOIN CUSTOMERS ON ${tableName}.CUSTOMER_ID = CUSTOMERS.ID JOIN PAYMENT_METHODS ON ${tableName}.PAYMENT_ID = PAYMENT_METHODS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.CUSTOMER_ID;
            delete item.PAYMENT_ID;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/CART_DETAILS", async (req, res) => {
    const tableName = "CART_DETAILS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.CARTID as CART_ID, CARTS.EMAIL as CUSTOMER_EMAIL, ${tableName}.PID as PRODUCT_ID, PRODUCTS.NAME as PRODUCT_NAME, PRODUCTS.COST FROM ${tableName} JOIN CARTS ON ${tableName}.CARTID = CARTS.ID JOIN PRODUCTS ON ${tableName}.PID = PRODUCTS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.CARTID;
            delete item.PID;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/CARTS", async (req, res) => {
    const tableName = "CARTS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.CUSTOMERID as CUSTOMER_ID, CUSTOMERS.NAME as CUSTOMER_NAME, CUSTOMERS.EMAIL as CUSTOMER_EMAIL FROM ${tableName} JOIN CUSTOMERS ON ${tableName}.CUSTOMERID = CUSTOMERS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.CUSTOMERID;
            delete item.EMAIL;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/PRODUCT_DECORS", async (req, res) => {
    const tableName = "PRODUCT_DECORS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.PID as PRODUCT_ID, PRODUCTS.NAME as PRODUCT_NAME FROM ${tableName} JOIN PRODUCTS ON ${tableName}.PID = PRODUCTS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.PID;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/PRODUCT_RUGS", async (req, res) => {
    const tableName = "PRODUCT_RUGS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.PID as PRODUCT_ID, PRODUCTS.NAME as PRODUCT_NAME FROM ${tableName} JOIN PRODUCTS ON ${tableName}.PID = PRODUCTS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.PID;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/PRODUCTS", async (req, res) => {
    const tableName = "PRODUCTS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.SUPID as SUPPLIER_ID, SUPPLIERS.NAME as SUPPLIER_NAME, ${tableName}.CATID as CATEGORY_ID, CATEGORIES.NAME as CATEGORY_NAME FROM ${tableName} JOIN CATEGORIES ON ${tableName}.CATID = CATEGORIES.ID JOIN SUPPLIERS ON ${tableName}.SUPID = SUPPLIERS.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.SUPID;
            delete item.CATID;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/ADMINS", async (req, res) => {
    const tableName = "ADMINS";
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT ${tableName}.*, ${tableName}.ADMIN_TYPE as ADMIN_ROLE_ID , ADMIN_TYPES.NAME as ADMIN_ROLE FROM ${tableName} INNER JOIN ADMIN_TYPES ON ${tableName}.ADMIN_TYPE=ADMIN_TYPES.ID`);
        sql.close();
        res.status(200);
        for(let item of response.recordset){
            delete item.ADMIN_TYPE;
        }
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
        });
    }
});

app.get("/dbms/:tableName", async (req, res) => {
    const tableName = req.params.tableName;
    try {
        let db = await sql.connect(dbConfig);
        let response = await db.query(`SELECT * FROM ${tableName}`);
        sql.close();
        res.status(200);
        res.send(getTable(tableName, response.recordset));
    } catch (err) {
        sql.close();
        res.status(500);
        res.send({
            success: false,
            data: {err}
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