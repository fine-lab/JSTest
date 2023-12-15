let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //易溯提供接口域名
    let url = "https://www.example.com/";
    //易溯提供
    let app_id = "youridHere";
    let key = "yourkeyHere";
    let method = param.method;
    if (method == "product") {
      //商品同步
      url = url + "/api/open/product/sync";
    } else if (method == "lineGroupWorkTask") {
      url = url + "/api/open/lineGroupWorkTask/sync";
    }
    let biz_contentS = param.biz_content;
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    let res = func1.execute(null, null);
    let sign_type = "MD5";
    let timestamp = res.dateStr;
    let biz_content = JSON.stringify(biz_contentS);
    let sign = "";
    let body = {
      sign_type: sign_type,
      timestamp: timestamp,
      app_id: app_id,
      biz_content: biz_content
    };
    body = removeProperty(body);
    body = sortASCII(body, true);
    let paramsUrl = parseParam(body);
    let signStr = paramsUrl + "&key=" + key;
    sign = capitalizeEveryWord(MD5Encode(signStr));
    body.sign = sign;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    var ysResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let ysContent = JSON.parse(ysResponse);
    return { ysContent };
    function removeProperty(obj) {
      Object.keys(obj).forEach((item) => {
        if (obj[item] === "" || obj[item] === undefined || obj[item] === null || obj[item] === "null") delete obj[item];
      });
      return obj;
    }
    function sortASCII(obj, isSort) {
      let arr = [];
      Object.keys(obj).forEach((item) => arr.push(item));
      let sortArr = isSort ? arr.sort() : arr.sort().reverse();
      let sortObj = {};
      for (let i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]];
      }
      return sortObj;
    }
    function parseParam(obj) {
      var ary = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p) && obj[p]) {
          ary.push(p + "=" + obj[p]);
        }
      return ary.join("&");
    }
  }
}
exports({ entryPoint: MyTrigger });