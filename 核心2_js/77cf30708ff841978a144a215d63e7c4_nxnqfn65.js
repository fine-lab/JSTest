let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //返利金额池
    let queryParams = request.queryParams;
    let uristring = queryParams.lgtype === "amount" ? "GT4691AT1.GT4691AT1.MRebateAmountLog" : "GT4691AT1.GT4691AT1.MRebateProductsLog";
    let queryString = "select rpSourceBillCode,rpParentId,code from " + uristring + " where rpParentId in (" + queryParams.logids + ")";
    let queryRes = ObjectStore.queryByYonQL(queryString);
    let refedid = [];
    for (var i = 0, ilen = queryRes.length; i < ilen; i++) {
      refedid.push(queryRes[i].rpParentId.toString());
    }
    let queryRes1 = [];
    if (refedid.length > 0) {
      let queryString1 = "select id,code from " + uristring + " where id in (" + refedid.toString() + ")";
      queryRes1 = ObjectStore.queryByYonQL(queryString1);
    }
    let rescode = queryRes.length > 0 ? "ban" : "acc";
    return { verifyres: rescode, queryRes: queryRes, queryRes1: queryRes1 };
  }
}
exports({ entryPoint: MyAPIHandler });