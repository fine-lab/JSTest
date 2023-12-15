let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取当前任务的租户ID
    var tenantid = context.tenant;
    var tenres = ObjectStore.queryByYonQL("select alias from base.tenant.Tenant where id='" + tenantid + "'");
    tenantid = tenres[0].alias;
    var appcontext = JSON.parse(AppContext());
    var currentuser = appcontext.currentUser;
    var userId = currentuser.id;
    var billObj = {
      id: param.data[0].id,
      compositions: [
        {
          name: "CustomerApply",
          compositions: [
            {
              name: "CustomerApplyDef"
            }
          ]
        }
      ]
    };
    //实体查询
    var billInfo = ObjectStore.selectById("aa.customerapply.CustomerApply", billObj);
    var res_json = billInfo.customerData;
    var detail_bill = JSON.parse(res_json);
    //证照列表
    var effectTime = billInfo.auditTime;
    if (billInfo.effectTime != undefined) {
      effectTime = billInfo.effectTime;
    }
    var license = detail_bill.SY01_customer_licenseList;
    if (license != undefined && license != null) {
      for (let i = 0; i < license.length; i++) {
        for (let j = i + 1; j < license.length; j++) {
          if (license[i].license_type == license[j].license_type && license[i].license_code == license[j].license_code) {
            throw new Error("GMP客户证照异常，存在重复的证照即证照类型，证照编码完全相同");
          }
        }
      }
      var object = {
        tenant_id: tenantid,
        customer_code: billInfo.merchantCode,
        org_id: billInfo.applicationOrg,
        applyer: billInfo.bizOperator,
        depart: billInfo.applyDepartment,
        audit_time: billInfo.auditTime,
        effect_time: effectTime,
        customer_apply_id: param.data[0].id
      };
      let tenantparam = { tenantid: tenantid };
      let BeServiceURLFun = extrequire("GT22176AT10.publicFunction.GetBeServiceURL");
      let resapiRestPre = BeServiceURLFun.execute(tenantparam);
      let urlobj = JSON.parse(JSON.stringify(resapiRestPre));
      let apiRestPre = urlobj.apiRestPre;
      let str = JSON.stringify(object);
      var strResponse = postman("post", apiRestPre + "/gsp/applyAuditToGMPSave", null, JSON.stringify(object));
      var json_response = JSON.parse(strResponse);
      if (json_response.error != undefined) {
        throw new Error(json_response.error);
      } else if (json_response.Error != undefined) {
        throw new Error(json_response.Error);
      } else if (json_response.code != 200) {
        throw new Error("证照保存异常");
      }
      return { strResponse };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });