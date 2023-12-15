let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取分包合同号
    var contractId = param.data[0].contractNumber;
    //根据分包合同号查询分包合同表
    var sql = "select * from GT102917AT3.GT102917AT3.subcontract where id = '" + contractId + "'";
    var result = ObjectStore.queryByYonQL(sql);
    //获取分包合同表中frequency;
    var count = result[0].frequency;
    var num = count - 1;
    var mainId = result[0].id;
    //更新实体
    var object = { id: mainId, frequency: num };
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });