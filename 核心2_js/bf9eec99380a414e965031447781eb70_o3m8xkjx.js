let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 客户id
    var agentId = request.agentId;
    var OrgID = request.OrgID;
    var productID = request.productID;
    //公共仓库
    var publicS = "2745418837185536";
    // 仓库集合
    var array = new Array();
    //查询发货仓库
    let sqltApplyRange = "select id from aa.merchant.MerchantApplyRange where merchantId=" + agentId + " and orgId=" + OrgID + "";
    let restApplyRange = ObjectStore.queryByYonQL(sqltApplyRange, "productcenter");
    let id = restApplyRange[0].id;
    let sqlRangeDetail = "select deliveryWarehouse from aa.merchant.MerchantApplyRangeDetail where id=" + agentId + " and merchantApplyRangeId=" + id + "";
    let resRangeDetail = ObjectStore.queryByYonQL(sqlRangeDetail, "productcenter");
    let deliveryWarehouse = resRangeDetail[0].deliveryWarehouse;
    array.push(deliveryWarehouse);
    array.push(publicS);
    // 查询现存量
    // 获取Token
    let func = extrequire("SCMSA.API.Token");
    let res = func.execute(request);
    let token = res.access_token;
    // 获取动态域名
    let func1 = extrequire("SCMSA.API.domainName");
    let res1 = func1.execute(request);
    let gatewayUrl = res1.gatewayUrl;
    // 可用量
    let availableqty = 0;
    // 现存量
    let currentqty = 0;
    for (var j = 0; j < array.length; j++) {
      let deliveryWarehouse = array[j];
      // 调用接口
      let contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": contenttype
      };
      var body = { warehouse: deliveryWarehouse, product: productID, bStockStatusDocNotNull: false };
      let getExchangerate = gatewayUrl + "/yonbip/scm/stock/QueryCurrentStocksByCondition?access_token=" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
      let rateresponseobj = JSON.parse(rateResponse);
      if (rateresponseobj.code == "200") {
        // 返回的数据
        let data = rateresponseobj.data;
        for (var i = 0; i < data.length; i++) {
          // 现存量
          currentqty = data[i].currentqty + currentqty;
          // 可用量
          availableqty = data[i].availableqty + availableqty;
        }
      }
    }
    return { currentqty, availableqty };
  }
}
exports({ entryPoint: MyAPIHandler });