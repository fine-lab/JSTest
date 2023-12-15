let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //自动审核方法
    let autoCheck = function (tenantId, id, userId) {
      //查询参数，是否支持自动复核
      let selectOrgIdSql = "select id,invoiceOrg from st.salesout.SalesOut where id = '" + id + "'";
      let invoiceOrg = ObjectStore.queryByYonQL(selectOrgIdSql, "ustock")[0].invoiceOrg;
      let queryIsAutoCheck = "select id,saleOutAutoCheck from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + invoiceOrg + "'";
      let isAutoCheckRes = ObjectStore.queryByYonQL(queryIsAutoCheck, "sy01");
      if (!Array.isArray(isAutoCheckRes) || isAutoCheckRes.length == 0) {
        return;
      }
      if (isAutoCheckRes[0].saleOutAutoCheck == undefined || isAutoCheckRes[0].saleOutAutoCheck == false) {
        return;
      }
      let obj = { tenantId: tenantId, id: id, userId: userId };
      strResponse = postman("post", apiRestPre + "/gsp/fastcheckBySaleOut", null, JSON.stringify(obj));
      if (!strResponse.includes("操作成功")) {
        throw new Error(strResponse);
      }
      let responseObj = JSON.parse(strResponse);
      if (responseObj.error != undefined && responseObj.error != null && responseObj.error.length > 0) {
        throw new Error(responseObj.error);
      }
    };
    var res = AppContext();
    var obj = JSON.parse(res);
    var tenantid = obj.currentUser.tenantId;
    let tenantparam = { tenantid: tenantid };
    let BeServiceURLFun = extrequire("GT22176AT10.publicFunction.GetBeServiceURL");
    let resapiRestPre = BeServiceURLFun.execute(tenantparam);
    let urlobj = JSON.parse(JSON.stringify(resapiRestPre));
    let apiRestPre = urlobj.apiRestPre;
    let strResponse;
    if (param.billnum == "st_salesoutlist") {
      var bills = param.data;
      for (var i = 0; i < bills.length; i++) {
        autoCheck(tenantid, param.data[i].id, ObjectStore.user().id);
      }
    } else {
      autoCheck(tenantid, param.data[0].id, ObjectStore.user().id);
    }
  }
}
exports({ entryPoint: MyTrigger });