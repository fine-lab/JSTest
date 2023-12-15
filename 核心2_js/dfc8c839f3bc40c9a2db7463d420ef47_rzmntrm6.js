let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querywarehouseSql = "select warehouse from GT83441AT1.GT83441AT1.setWarehouse where dr=0 ";
    var warehouseRes = ObjectStore.queryByYonQL(querywarehouseSql);
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
    let availableqty = 0;
    let message = apiResponsejson.message;
    let code = undefined;
    if (apiResponsejson.code == "200") {
      let data = apiResponsejson.data;
      code = 200;
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          let availableqtyData = data[i];
          if (warehouseRes.length > 0) {
            //存在不参与现存量计算的仓库
            for (var j = 0; j < warehouseRes.length; j++) {
              if (warehouseRes[j].warehouse == availableqtyData.warehouse) {
                if (numMap[availableqtyData.product] != undefined) {
                  availableqty = availableqtyData.availableqty + Number(numMap[availableqtyData.product]);
                  numMap[availableqtyData.product] = availableqty;
                } else {
                  numMap[availableqtyData.product] = availableqtyData.availableqty;
                }
              }
            }
          } else {
            //不存在不参与现存量计算的仓库
            if (numMap[availableqtyData.product] != undefined) {
              availableqty = availableqtyData.availableqty + Number(numMap[availableqtyData.product]);
              numMap[availableqtyData.product] = availableqty;
            } else {
              numMap[availableqtyData.product] = availableqtyData.availableqty;
            }
          }
        }
      }
    } else {
      code = apiResponsejson.code;
    }
    let result = {
      code: code,
      numMap: numMap,
      message: message
    };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });