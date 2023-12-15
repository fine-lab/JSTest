let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgid = request.org_id;
    let userid = this.getPsnInfoByCurrentUser().id;
    let sql = "select id from GT7239AT6.GT7239AT6.cmmssn_merchant_h where dr = 0 and org_id = " + orgid;
    let cmmssnMerchant = ObjectStore.queryByYonQL(sql);
    if (!cmmssnMerchant || cmmssnMerchant.length <= 0) {
      return { res: [] };
    }
    let cmmssnMerchantIds = this.getCmmssnMerchantIds(cmmssnMerchant);
    //查询内容
    var object = {
      ids: cmmssnMerchantIds,
      compositions: [
        {
          name: "cmmssn_merchant_bList"
        }
      ]
    };
    //实体查询
    var obj = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.cmmssn_merchant_h", object);
    if (!cmmssnMerchant || cmmssnMerchant.length <= 0) {
      return { res: [] };
    }
    let res = new Set();
    obj.forEach(function (cmms) {
      cmms.cmmssn_merchant_bList.forEach(function (cmmsb) {
        if (cmmsb.operatorId == userid) {
          res.add(cmms.id);
        }
      });
    });
    return { res: Array.from(res) };
  }
  getCmmssnMerchantIds(cmmssnMerchant) {
    if (!cmmssnMerchant || cmmssnMerchant.length <= 0) {
      return null;
    }
    let idSet = new Set();
    cmmssnMerchant.forEach(function (cmms) {
      idSet.add(cmms.id);
    });
    return Array.from(idSet);
  }
  getPsnInfoByCurrentUser() {
    let ctx = JSON.parse(AppContext()).currentUser;
    let wrapperJson = listOrgAndDeptByUserIds("diwork", ctx.tenantId, [ctx.id]);
    let wrapperObj = JSON.parse(wrapperJson);
    var psnData = wrapperObj.data[ctx.id];
    return psnData;
  }
}
exports({ entryPoint: MyAPIHandler });