let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取总体需求成本实体
    var ztxqcbdh = param.data[0];
    if (!!ztxqcbdh) {
      if (!!ztxqcbdh.id) {
        //获取下游单据信息
        var res = ObjectStore.queryByYonQL("select * from GT64178AT7.GT64178AT7.B0001 where source_id='" + ztxqcbdh.id + "'");
        if (res.length > 0) {
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });