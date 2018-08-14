/**
 * Created by ziyu on 2017/8/24.
 */
"use strict";
 let mysql = require('promise-mysql');
let DB = require('./../db/DBconfig');


let pool = mysql.createPool({
    host:DB.mysql.host,
    user: DB.mysql.user,
    password: DB.mysql.password,
    database: DB.mysql.database,
    port: DB.mysql.port,
    connectionLimit:10
});

function getSqlConnection() {
    return pool.getConnection().disposer(function (conn) {
        pool.releaseConnection(conn);
    });
}

module.exports = getSqlConnection;







