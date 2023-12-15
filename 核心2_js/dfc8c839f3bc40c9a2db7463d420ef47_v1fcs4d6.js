let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querywarehouseSql =
      "select warehouse from GT83441AT1.GT83441AT1.setWarehouse_b left join GT83441AT1.GT83441AT1.setWarehouse a on a.id=setWarehouse_id where dr=0 and  a.dr=0 and a.org_id='" + request.orgId + "'";
    var warehouseRes = ObjectStore.queryByYonQL(querywarehouseSql, "developplatform");
    let func1 = extrequire("GT83441AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    let getsdUrl = gatewayUrl + "/yonbip/scm/stock/QueryCurrentStocksByCondition?access_token=" + token;
    let body = { stockStatusDoc: "2690423371601230" }; //合格
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