/**
 * Created by ziyu on 2017/8/23.
 */
"use strict";
 // /user?act=reg&user=aaa&pass=123456
// {"ok":false,"msg":"msg"}
 // /user?act=login&user=aaa&pass=123456

const http = require('http');

const fs = require('fs');

const querystring = require('querystring');

const urlLIb = require('url');

var users = {};

let server = http.createServer(function (req,res) {
    let str = '';
    req.on('data',function (data) {
        str += data;
    })
    req.on('end',function () {
        var obj = urlLIb.parse(req.url,true);
        const url = obj.pathname;
        const GET = obj.query;
        const POST = querystring.parse(str);

        //区分接口或文件
        if(url == '/user'){
            switch(GET.act){
                case 'reg':
                    if(users[GET.user]){
                        res.write('{"ok":false,"msg":"用户已存在"}');
                    }else{
                        users[GET.user]=GET.pass;
                        res.write('{"ok":true,"msg":"注册成功"}');
                    }
                    break;
                case 'login':
                    if(users[GET.user] == null){
                        res.write('{"ok":false,"msg":"用户不存在"}')
                    }else if(users[GET.user] != GET.pass){
                        res.write('{"ok":false,"msg":"用户或密码不对"}')
                    }else{
                        res.write('{"ok":true,"msg":"登录成功"}')
                    }
                    break;
                default:
                    res.write('{"ok":false,"msg":"不知道你要干什么"}');
            }
            res.end();

        }else{
            //文件
            //读文件
            var file_name = './wwww' + url;
            fs.readFile(file_name,function (err,data) {
                if(err){
                    res.write(404);
                }else{
                    res.write(data);
                }
                res.end();
            })
        }

    })
});

server.listen(3000,function () {
    console.log('http://localhost:3000');
});
