let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = [];
    let token = ObjectStore.env().token;
    let body = {
      productCategory: "",
      domainCloud: "",
      domain: "",
      microServiceGroup: "",
      pageIndex: 1,
      pageSize: 10,
      conditionList: []
    };
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
    let recordList = responseJson.data.records;
    if (recordList != null && recordList.length > 0) {
      recordList.forEach((arg) => {
        data.push({ value: arg.id, text: arg.code, nameType: "string" });
      });
    }
    //组装数据data.push({ value: 'iuap', text: 'iuap', nameType: 'string' })
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });