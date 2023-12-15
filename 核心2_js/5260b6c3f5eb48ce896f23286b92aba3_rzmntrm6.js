let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querywarehouseSql = "select * from aa.warehouse.Warehouse where joinStockQuery='false'";
    var warehouseRes = ObjectStore.queryByYonQL(querywarehouseSql, "productcenter");
    let func1 = extrequire("GT83441AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    let getsdUrl = "https://www.example.com/" + token;
    let body = { stockStatusDoc: "2659131324240157" };
    var contenttype = "application/json;charset=UTF-8";
    var header = { "Content-Type": contenttype };
    let apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let numMap = new Map();
    let availableqty = 0; //现存量
    let message = apiResponsejson.message;
    let code = undefined;
    if (apiResponsejson.code == "200") {
      let data = apiResponsejson.data;
      code = 200;
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          let availableqtyData = data[i];
          if (numMap[availableqtyData.product] != undefined) {
            availableqty = availableqtyData.availableqty + Number(numMap[availableqtyData.product]);
            numMap[availableqtyData.product] = availableqty;
          } else {
            numMap[availableqtyData.product] = availableqtyData.availableqty;
          }
        }
      }
    } else {
      code = apiResponsejson.code;
    }
    let result = {
      code: code,
      numMap: numMap,
      warehouseList: warehouseRes,
      message: message
    };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });