let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    var object = {
      customer_code: billInfo.merchantCode,
      org_id: billInfo.applicationOrg,
      applyer: billInfo.bizOperator,
      depart: billInfo.applyDepartment,
      license_str: JSON.stringify(license),
      is_do: 0,
      auditTime: billInfo.auditTime,
      effectTime: effectTime
    };
    var res = ObjectStore.insert("aa.customerapply.CustomerApplyToLicense", object, "CustomerApplyToLicense", "productcenter");
    return {};
  }
}
exports({ entryPoint: MyTrigger });