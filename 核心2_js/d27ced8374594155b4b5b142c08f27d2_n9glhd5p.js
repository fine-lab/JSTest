let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querywarehouseSql = "select * from aa.warehouse.Warehouse where joinStockQuery='false'";
    var warehouseRes = ObjectStore.queryByYonQL(querywarehouseSql, "productcenter");
    let warehouseList = new Array();
    if (warehouseRes.length > 0) {
      for (var j = 0; j < warehouseRes.length; j++) warehouseList.push(warehouseRes[j].id + "");
    }
    let func1 = extrequire("SQ.backDesignerFunction.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    let getsdUrl = "https://www.example.com/" + token;
    let body = { stockStatusDoc: "1576714715350433820", bStockStatusDocNotNull: false }; //合格
    var contenttype = "application/json;charset=UTF-8";
    var header = { "Content-Type": contenttype };
    let apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let numMap = new Map();
    let warehouseMap = new Map();
    let typeMap = new Map();
    let availableqty = 0; //可用量
    let currentqty = 0; //现存量
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
              typeMap = warehouseMap[availableqtyData.warehouse];
              currentqty = availableqtyData.currentqty + Number(typeMap["currentqty"]);
              availableqty = availableqtyData.availableqty + Number(typeMap["availableqty"]);
              typeMap["currentqty"] = currentqty;
              typeMap["availableqty"] = availableqty;
              warehouseMap[availableqtyData.warehouse] = typeMap;
              numMap[availableqtyData.product] = warehouseMap;
            } else {
              typeMap = new Map();
              typeMap["currentqty"] = availableqtyData.currentqty;
              typeMap["availableqty"] = availableqtyData.availableqty;
              warehouseMap[availableqtyData.warehouse] = typeMap;
              numMap[availableqtyData.product] = warehouseMap;
            }
          } else {
            warehouseMap = new Map();
            typeMap = new Map();
            typeMap["currentqty"] = availableqtyData.currentqty;
            typeMap["availableqty"] = availableqtyData.availableqty;
            warehouseMap[availableqtyData.warehouse] = typeMap;
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