/**
 * Created by ziyu on 2017/8/25.
 */
"use strict";

exports.jsonFormat = function (code,massage,...data) {
    console.log(data)

    let _jsonStr = {
        code:code,
        message:massage,
    }
    _jsonStr = Object.assign(_jsonStr,data[0]);
    return _jsonStr;
}