let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = [];
    let token = ObjectStore.env().token;
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      cookie: "yht_access_token=" + token
    };
    throw new Error(JSON.stringify(header));
    //请求地址 ObjectStore.env().url +
    let url = "https://www.example.com/";
    //返回的是字符串需要转对象
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let responseJson = JSON.parse(strResponse);
    let dataList = responseJson.data;
    if (dataList != null && dataList.length > 0) {
      dataList.forEach((arg) => {
        data.push({ value: arg.code, text: arg.name, nameType: "string" });
      });
    }
    //组装数据data.push({ value: 'iuap', text: 'iuap', nameType: 'string' })
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });