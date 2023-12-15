let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var Data = JSON.parse(request.data);
    // 其他出库数据
    let param2 = { data: Data };
    let func = extrequire("ST.unit.INFaterOMS");
    let OutorderData = func.execute(null, param2);
    console.log(JSON.stringify(OutorderData));
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(OutorderData));
    let str = JSON.parse(strResponse);
    console.log(JSON.stringify(str));
    if (str.success != true) {
      throw new Error("调用OMS其他入库确认创建API失败，失败原因：" + str.errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });