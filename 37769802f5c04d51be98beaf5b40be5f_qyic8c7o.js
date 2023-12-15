let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = [];
    let token = ObjectStore.env().token;
    let body = { productCategory: request.productCategory, domainCloud: request.domainCloud, appVersion: "2.0" };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      cookie: "yht_access_token=" + token
    };
    //请求地址 旧地址
    //请求地址 新地址
    let url = "https://www.example.com/";
    //返回的是字符串需要转对象
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let responseJson = JSON.parse(strResponse);
    let dataList = responseJson.data;
    if (dataList != null && dataList.length > 0) {
      dataList.forEach((arg) => {
        data.push({ code_01: arg.code, name: arg.name });
      });
    }
    //组装数据data.push({ value: 'iuap', text: 'iuap', nameType: 'string' })
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });