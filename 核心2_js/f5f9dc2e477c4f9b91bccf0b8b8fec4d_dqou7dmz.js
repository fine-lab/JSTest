let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取租户所在数据中心域名
    let hqym = "https://www.example.com/";
    let apiResponse = openLinker("GET", hqym, "SDOC", JSON.stringify({}));
    let result = JSON.parse(apiResponse);
    //调用接口
    let url = result.data.gatewayUrl + "/yonbip/sd/dst/tradevouch/import";
    //前端函数传的数据
    let data = request.data;
    //解析json数据
    let data2 = [];
    let externalData = [];
    let partParam = {};
    let orgCode;
    for (var d in data) {
      let a = {
        tid: data[d]["采购单号"],
        receiver_address: data[d]["收货地址"]
      };
      data2.push(a);
    }
    return { data2 };
  }
}
exports({ entryPoint: MyAPIHandler });