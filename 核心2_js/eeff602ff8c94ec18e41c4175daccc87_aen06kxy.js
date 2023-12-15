let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
  }
}
exports({ entryPoint: MyTrigger });
//主方法
var myCommon = {
  //生成从minNum到maxNum的随机数
  randomNum: function (minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },
  MD5: function (key) {
    return MD5Encode(key);
  }
};
//生成标签
myCommon.getLableCode = function (type) {
  var res = "B01";
  if (type == 2) res = "A01";
  if (arguments[0] == undefined) {
    res += new Date().format("yyyyMMdd");
    res += new Date().format("hhmmssfff");
    res += $.Common.randomNum(1000, 9999);
  } else {
    var level = parseInt(arguments[0]) + 1;
    var len = arguments[1],
      lenPart = arguments[2];
    if (len == undefined) len = 21;
    if (lenPart == undefined) lenPart = 3;
    while (len > 0) {
      res += "0";
      len--;
    }
    var _arr = res.splitLenth(lenPart);
    var _letter = "";
    while (lenPart > 0) {
      _letter += "?";
      lenPart--;
    }
    _arr[level] = _letter;
    console.log(_arr);
    res = _arr.join("");
  }
  return res;
};
//时间对象格式化
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds(),
    "f+": this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  } else if (new RegExp("(f+)").test(format)) {
    var _minSeconds = this.getMilliseconds() + "";
    format = format.replace(
      RegExp.$1,
      RegExp.$1.length == 1
        ? ("0" + _minSeconds).substr(("" + _minSeconds).length)
        : RegExp.$1.length == 2
        ? ("00" + _minSeconds).substr(("" + _minSeconds).length)
        : ("000" + _minSeconds).substr(("" + _minSeconds).length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};
const myHttpRequest = {
  ajax: (settings = {}) => {
    // 初始化请求参数
    let _s = Object.assign(
      {
        url: "", // string
        type: "GET", // string 'GET' 'POST' 'DELETE'
        dataType: "json", // string 期望的返回数据类型:'json' 'text' 'document' ...
        async: true, //  boolean true:异步请求 false:同步请求 required
        data: null, // any 请求参数,data需要和请求头Content-Type对应
        headers: {}, // object 请求头
        timeout: 1000, // string 超时时间:0表示不设置超时
        beforeSend: (xhr) => {},
        success: (result, status, xhr) => {},
        error: (xhr, status, error) => {},
        complete: (xhr, status) => {}
      },
      settings
    );
    // 参数验证
    if (!_s.url || !_s.type || !_s.dataType || _s.async === undefined) {
      alert("参数有误");
      return;
    }
    // 创建XMLHttpRequest请求对象
    let xhr = new XMLHttpRequest();
    // 请求开始回调函数
    xhr.addEventListener("loadstart", (e) => {
      _s.beforeSend(xhr);
    });
    // 请求成功回调函数
    xhr.addEventListener("load", (e) => {
      const status = xhr.status;
      if ((status >= 200 && status < 300) || status === 304) {
        let result;
        if (xhr.responseType === "text") {
          result = xhr.responseText;
        } else if (xhr.responseType === "document") {
          result = xhr.responseXML;
        } else {
          result = xhr.response;
        }
        // 注意:状态码200表示请求发送/接受成功,不表示业务处理成功
        _s.success(result, status, xhr);
      } else {
        _s.error(xhr, status, e);
      }
    });
    // 请求结束
    xhr.addEventListener("loadend", (e) => {
      _s.complete(xhr, xhr.status);
    });
    // 请求出错
    xhr.addEventListener("error", (e) => {
      _s.error(xhr, xhr.status, e);
    });
    // 请求超时
    xhr.addEventListener("timeout", (e) => {
      _s.error(xhr, 408, e);
    });
    let useUrlParam = false;
    let sType = _s.type.toUpperCase();
    // 如果是"简单"请求,则把data参数组装在url上
    if (sType === "GET" || sType === "DELETE") {
      useUrlParam = true;
      _s.url += http.getUrlParam(_s.url, _s.data);
    }
    // 初始化请求
    xhr.open(_s.type, _s.url, _s.async);
    // 设置期望的返回数据类型
    xhr.responseType = _s.dataType;
    // 设置请求头
    for (const key of Object.keys(_s.headers)) {
      xhr.setRequestHeader(key, _s.headers[key]);
    }
    // 设置超时时间
    if (_s.async && _s.timeout) {
      xhr.timeout = _s.timeout;
    }
    // 发送请求.如果是简单请求,请求参数应为null.否则,请求参数类型需要和请求头Content-Type对应
    xhr.send(useUrlParam ? null : http.getQueryData(_s.data));
  },
  // 把参数data转为url查询参数
  getUrlParam: (url, data) => {
    if (!data) {
      return "";
    }
    let paramsStr = data instanceof Object ? http.getQueryString(data) : data;
    return url.indexOf("?") !== -1 ? paramsStr : "?" + paramsStr;
  },
  // 获取ajax请求参数
  getQueryData: (data) => {
    if (!data) {
      return null;
    }
    if (typeof data === "string") {
      return data;
    }
    if (data instanceof FormData) {
      return data;
    }
    return http.getQueryString(data);
  },
  // 把对象转为查询字符串
  getQueryString: (data) => {
    let paramsArr = [];
    if (data instanceof Object) {
      Object.keys(data).forEach((key) => {
        let val = data[key];
        if (val instanceof Date) {
        }
        paramsArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
      });
    }
    return paramsArr.join("&");
  }
};
myCommon.http = myHttpRequest;