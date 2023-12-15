let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //单据日期
    let billdate = request.billdate;
    //物料ID
    let wlId = request.wlId;
    //客户id
    let kuId = request.kuId;
    //客户分类id
    let kuclassId = request.kuclassId;
    //销售组织id
    let org_id = request.org_id;
    //模板优先级1、按照客户商品查询2按照客户分类3按照商品查询价格
    let templateIds = ["2373136573403401", "2373136573419776", "2373136573403395"];
    let func2 = extrequire("GT46163AT1.backDefaultGroup.getPriceBySql");
    let price = undefined;
    let body = "";
    if (wlId != undefined) {
      a: for (let i = 0; i < templateIds.length; i++) {
        if (i == 0) {
          if (kuId != undefined) {
            body = {
              agentId: kuId,
              productId: wlId,
              orgId: org_id,
              qjtype: 1,
              billdata: billdate
            };
          } else {
            continue;
          }
        } else if (i == 1) {
          if (kuclassId != undefined) {
            body = {
              agentClassId: kuclassId,
              productId: wlId,
              orgId: org_id,
              qjtype: 2,
              billdata: billdate
            };
          } else {
            continue;
          }
        } else if (i == 2) {
          body = {
            productId: wlId,
            orgId: org_id,
            qjtype: 3,
            billdata: billdate
          };
        }
        let wlprice = func2.execute(null, body);
        let priceList = wlprice.result;
        if (priceList != undefined && priceList.length > 0) {
          price = priceList;
          break a;
        }
      }
    }
    return { price };
  }
}
exports({ entryPoint: MyAPIHandler });