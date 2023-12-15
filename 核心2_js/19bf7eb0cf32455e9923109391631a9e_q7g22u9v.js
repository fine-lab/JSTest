let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var suppliers = request.suppliers;
    var msg = ""; //问题容器
    var verification = true; //验证变量,通过此变量验证是否需要弹窗展示msg
    if (suppliers.length === 0) {
      return { msg: "", verification: verification };
    }
    var detail = []; //问题单据容器
    var newDate = new Date();
    var codes = []; //订单编号容器
    for (var i in suppliers) {
      //订单编号
      var code = suppliers[i].code;
      //采购组织id
      var org = suppliers[i].org;
      //查询资质共享关系,找资质共享组织
      var shareSql = "select * from GT59181AT30.GT59181AT30.XPH_QSRelationship where qualificationSourcingOrganization='" + org + "' and businessType='1' and enable ='1'";
      var shareResp = ObjectStore.queryByYonQL(shareSql);
      if (shareResp.length > 0) {
        if (typeof shareResp[0].org_id === "undefined") {
        } else {
          org = shareResp[0].org_id;
        }
      }
      //查询资质效期是否合法
      var sql = "select * from GT59181AT30.GT59181AT30.XPH_SQFile where enterpriseCode='" + suppliers[i].id + "'and org_id='" + org + "'and enable='1'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length === 0) {
        return { verification: verification };
      }
      for (var j in res) {
        if (res[j].effectiveControl) {
          var vuDate = new Date(res[j].validUntil).getTime();
          var vouchDate = new Date(suppliers[i].vouchDate).getTime();
          if (vuDate < vouchDate) {
            if (codes.length > 0) {
              for (var k = 0; k < codes.length; k++) {
                if (codes[k] == "单据号:" + code) {
                  codes.splice(k, 1);
                }
              }
            }
            codes.push("单据号:" + code);
            verification = false;
            detail.push("[资质编码:" + res[j].code + "、有效期至:" + res[j].validUntil + "]");
          }
        }
      }
    }
    msg = "当前供应商存在过期资质，请检查，过期资质清单如下：" + detail;
    return { msg: msg, verification: verification, codes: codes };
  }
}
exports({ entryPoint: MyAPIHandler });