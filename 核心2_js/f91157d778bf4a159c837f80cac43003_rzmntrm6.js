let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querywarehouseSql = "select * from aa.warehouse.Warehouse where joinStockQuery='false'";
    var warehouseRes = ObjectStore.queryByYonQL(querywarehouseSql, "productcenter");
    let warehouseList = new Array();
    if (warehouseRes.length > 0) {
      for (var j = 0; j < warehouseRes.length; j++) warehouseList.push(warehouseRes[j].id + "");
    }
    let func1 = extrequire("SQ.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    let getsdUrl = "https://www.example.com/" + token;
    let body = { stockStatusDoc: "2659131324240157" };
    var contenttype = "application/json;charset=UTF-8";
    var header = { "Content-Type": contenttype };
    let apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let numMap = new Map();
    let warehouseMap = new Map();
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
            warehouseMap = numMap[availableqtyData.product];
            if (warehouseMap[availableqtyData.warehouse] != undefined) {
              availableqty = availableqtyData.availableqty + Number(warehouseMap[availableqtyData.warehouse]);
              warehouseMap[availableqtyData.warehouse] = availableqty;
              numMap[availableqtyData.product] = warehouseMap;
            } else {
              warehouseMap[availableqtyData.warehouse] = availableqtyData.availableqty;
              numMap[availableqtyData.product] = warehouseMap;
            }
          } else {
            warehouseMap = new Map();
            warehouseMap[availableqtyData.warehouse] = availableqtyData.availableqty;
            numMap[availableqtyData.product] = warehouseMap;
          }
        }
      }
    } else {
      code = apiResponsejson.code;
    }
    let result = {
      code: code,
      numMap: numMap,
      warehouseList: warehouseList,
      message: message
    };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });