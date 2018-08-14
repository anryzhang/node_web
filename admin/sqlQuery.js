/**
 * Created by ziyu on 2017/8/24.
 */
"use strict";

let Promise = require('bluebird');

let getSqlConnection = require('./baseConnection');

/*Promise.using(getSqlConnection(),function (connection) {
    return connection.query('select id,name,email from emp').then(function (rows) {
        return console.log(rows);

    }).catch(function (error) {
        console.log(error);
    })
});*/

exports.sqlQuery = function (sql,cb) {
    Promise.using(getSqlConnection(),function (connection) {
        return connection.query(sql).then(function (rows) {
            // if(rows.length>0){
                cb(rows);
            // }
        }).catch(function (error) {
            cb(error);
        })
    })
}
 