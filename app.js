/**
 * Created by ziyu on 2017/8/23.
 */
"use strict";
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');
const md5 = require('md5');

let myUtilTool = require('myutiltool');
let Json = require('./admin/JsonFormat');

const Promise = require('bluebird');
const getSqlConnection = require('./admin/baseConnection');

const sql = require('./admin/sqlQuery');

let app = http.createServer(function (req, res) {

    var str = '';
    if (req.method.toLocaleLowerCase() === 'get') {
        req.on('data', function (data) {
            str += data;
            console.log(str);
        });

        req.on('end', function () {

            var obj = urlLib.parse(req.url, true);
            const url = obj.pathname === '/' ? '/index.html' : obj.pathname;
            const GET = obj.query;

            if (url.indexOf('.html') > 0) {
                // console.log(req.url);
                //html
                let file_name = './www' + url;
                // console.log(file_name);
                fs.readFile(file_name, function (err, data) {
                    // console.log(err);
                    // console.log(data.toString());
                    if (err) {
                        res.write(404);
                    } else {
                        res.write(data);
                    }
                    res.end();
                });
            } else if (url.indexOf('/node_modules') > -1) {
                // console.log(obj);
                // console.log(url);
                let file_name = './' + url;
                fs.readFile(file_name, function (err, data) {
                    if (err) {
                        res.write(404);
                    } else {
                        res.write(data);
                    }
                    res.end();
                });
            } else if (url.indexOf('/user') > -1) {
                console.log(obj);
                console.log(str);
                // console.log(querystring.parse(str));
                // console.log(req.method);
                if (req.method === 'GET') {
                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                    console.log(GET);
                    switch (GET.act) {
                        case 'reg':
                            let _jsonStr = {
                                status: 100,
                                msg: '成功'
                            }
                            res.write(JSON.stringify(_jsonStr));
                            break;
                    }
                }

                res.end();

            } else {
                let file_name = './' + url;
                fs.readFile(file_name, function (err, data) {
                    if (err) {
                        res.write('404');
                    } else {
                        res.write(data);
                    }
                    res.end();
                })
            }


        });
    } else if (req.method.toLocaleLowerCase() === 'post') {

        req.on('data', function (data) {
            str += data;
            console.log(str);
        });
        req.on('end', function () {
            var obj = urlLib.parse(req.url, true);
            const url = obj.pathname;

            const POST = querystring.parse(str.toString());
            console.log(1, POST)
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});

            if (url.indexOf('/user') > -1) {

                switch (url) {
                    case '/user/login':
                        sql.sqlQuery('select * from emp', function (rows) {
                            if (rows.length > 0) {
                                let pageInfo = {
                                    isLast: false
                                }
                                let data = {
                                    result: rows,
                                    pageInfo
                                }
                                res.write(JSON.stringify(Json.jsonFormat(100, '', data)));
                            }

                            res.end();
                        });
                        break;
                    case "/user/register":

                        if (!POST.user || !POST.password) {
                            res.write(JSON.stringify(Json.jsonFormat(400, '没有用户名或密码!')));
                            res.end();

                        }

                        sql.sqlQuery('select name , password from admin', function (result) {
                            let isUser = false;
                            for (let item of result) {
                                if (item.name == POST.user) {
                                    isUser = true;
                                    break;
                                }
                            }

                            if (isUser) {
                                res.write(JSON.stringify(Json.jsonFormat(400, '用户已存在')));
                                res.end();

                            } else {
                                sql.sqlQuery('insert into admin (name,password)  values("' + POST.user + '","' + md5(POST.password) + '")', function (result) {
                                    console.log(result);
                                    if (result.insertId) {
                                        res.write(JSON.stringify(Json.jsonFormat(100, '注册成功')));
                                    } else {
                                        res.write(JSON.stringify(Json.jsonFormat(400, '注册失败')));
                                    }
                                    res.end();

                                })

                            }

                        });

                        break;

                }


            }
        })
    }


});

app.listen(3000, function () {
    console.log('http://localhost:3000')
})