let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取分包合同号
    var contractId = param.data[0].contractNumber_subcontractNo;
    //查询分包合同表;
    var sql = "select frequency,id from GT102917AT3.GT102917AT3.subcontract where subcontractNo ='" + contractId + "'";
    var result = ObjectStore.queryByYonQL(sql);
    //获取frequency，-1;
    var num = result[0].frequency;
    var count = num - 1;
    //获取id
    var mainId = result[0].id;
    //更新实体
    var object = { id: mainId, frequency: count };
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });