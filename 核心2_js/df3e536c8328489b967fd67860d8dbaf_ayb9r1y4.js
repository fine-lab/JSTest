let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取分包合同号
    var pid = param.data[0].contractNumber_subcontractNo;
    //根据分包合同号查询分包合同表
    var sql = ObjectStore.queryByYonQL('select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = "' + pid + '"');
    //查询次数
    if (sql.length != 0) {
      var count = sql[0].frequency;
      //每删除一次数字-1
      var sum = count - 1;
      //获取id
      var sid = sql[0].id;
      //更新实体
      var object = { id: sid, frequency: sum };
      var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });