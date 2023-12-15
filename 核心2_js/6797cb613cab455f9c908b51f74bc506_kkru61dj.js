let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Id = param.data[0].id;
    let auditStatus = param.data[0].verifystate;
    if (auditStatus == 2) {
      throw new Error("已审核的检验单不能删除");
    }
    //查询内容
    var queryObj = {
      id: Id
    };
    //实体查询
    var res = ObjectStore.selectById("GT52668AT9.GT52668AT9.checkOrder", queryObj);
    ObjectStore.insert("GT52668AT9.GT52668AT9.checkOrder_del_bak", res, "checkOrder_del_bak");
    return {};
  }
}
exports({ entryPoint: MyTrigger });