let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rspo = {
      code: 0,
      message: "",
      data: ""
    };
    try {
      request.account = "55161682";
      request.requestTime = "";
      request.version = "1.0";
      request.sign = null;
      request.requestTime = new Date().getTime();
      let newrequest = this.getnewrequest(request);
      let newreq = this.objKeySort(newrequest);
      let PlainText = this.getValue(newreq) + "&key=2b6b0e0376f64ae4b72120a08a7794ef";
      let signMD5 = MD5Encode(PlainText).toUpperCase();
      newrequest.sign = signMD5;
      let baseurl = "http://139.217.226.30/api/amplifon/";
      let url = request.url;
      let body = newrequest;
      let header = { "Content-Type": "application/json;charset=utf-8" };
      let strResponse = postman("POST", baseurl + url, JSON.stringify(header), JSON.stringify(body));
      let repdata = JSON.parse(strResponse);
      if (repdata.code == "0") {
        rspo.code = 0;
        rspo.data = repdata.data;
      } else {
        rspo.code = 500;
        rspo.message = "CRM接口返回-" + repdata.message;
      }
    } catch (e) {
      rspo.code = 500;
      rspo.message = "异常" + e.message;
    } finally {
      return rspo;
    }
  }
  objKeySort(obj) {
    //排序的函数
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
      let key = newkey[i];
      if (!(key == "sign" || key == "nonStr")) {
        //剔除
        //剔除类型list
        if (!Array.isArray(obj[key])) {
          //遍历newkey数组
          newObj[key] = obj[key]; //向新创建的对象中按照排好的顺序依次增加键值对
        }
      }
    }
    return newObj; //返回排好序的新对象
  }
  getnewrequest(obj) {
    var newkey = Object.keys(obj);
    var newObj = {}; //创建一个新的对象
    for (var i = 0; i < newkey.length; i++) {
      let key = newkey[i];
      if (!(key == "url")) {
        //剔除
        //遍历newkey数组
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
  // 封装函数
  getValue(obj) {
    var strs = "";
    for (var str in obj) {
      // 获取到对象中的属性：str 和 对象中的属性值：obj[str]
      strs += str + "=" + obj[str] + "&";
    }
    // 最终结果
    return substring(strs, 0, strs.length - 1);
  }
}
exports({ entryPoint: MyAPIHandler });