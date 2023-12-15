let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billObj = {
      id: param.data[0].id
    };
    //实体查询
    var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_cusStatus", billObj);
    let customerInfo = {};
    let orgId = billInfo.org_id;
    let customerId = billInfo.customer;
    let customerObj = { orgId, customerId };
    customerInfo = extrequire("GT22176AT10.publicFunction.getCusLicInfo").execute(customerObj).cusLicInfo;
    let updateJson = {
      id: customerInfo.id,
      saleState: billInfo.SY01_saleState
    };
    var res = ObjectStore.updateById("GT22176AT10.GT22176AT10.sy01_customers_file", updateJson, "783ebe4e");
  }
}
exports({
  entryPoint: MyTrigger
});