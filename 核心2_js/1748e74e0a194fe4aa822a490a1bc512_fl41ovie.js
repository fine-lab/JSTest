let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Id = param.data[0].id;
    //查询内容
    var queryObj = {
      id: Id
    };
    //实体查询
    var res = ObjectStore.selectById("GT52668AT9.GT52668AT9.checkOrder", queryObj);
    if (!res || queryUtils.isEmpty(res.checkconclusion)) {
      throw new Error("检验结论不可为空，请先确认检验结论再审核！");
    }
    if (queryUtils.isEmpty(res["stockstatus"])) {
      throw new Error("库存状态不可为空！");
    }
    if (queryUtils.isEmpty(res["otheroutbusinesstype"])) {
      throw new Error("其它出库单交易类型不可为空！");
    }
    if (res["verifystate"] === 2) {
      throw new Error("已审核单据不可重复审核！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });