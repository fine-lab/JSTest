let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    //新增外检查来源
    //调用物料档案openapi查询物料是否是批次管理商品
    return {};
  }
}
exports({ entryPoint: MyTrigger });