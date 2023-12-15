let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
  }
  //查询客户id
  getMerchantId(name) {
    let res = queryUtils.getIdByName("aa.merchant.Merchant", name, "productcenter");
    return res;
  }
}
exports({ entryPoint: MyTrigger });