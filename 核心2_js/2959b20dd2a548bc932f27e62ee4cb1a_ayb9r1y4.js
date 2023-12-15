let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取分包合同号id
    var subcontractId = param.data[0].subcontractNo_subcontractNo;
    //根据分包合同号去查询分包合同表的次数
    var sql = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + subcontractId + "'";
    var result = ObjectStore.queryByYonQL(sql);
    var count = result[0].frequency;
    var number = count - 1;
    //获取分包合同号id
    var mainId = result[0].id;
    //更新实体分包合同
    var object = { id: mainId, frequency: number };
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });