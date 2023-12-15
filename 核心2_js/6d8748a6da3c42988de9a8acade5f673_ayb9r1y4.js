let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取分包合同号id
    var subcontractId = param.data[0].subcontractNo_subcontractNo;
    //根据分包合同号去查询分包合同主表
    var sql = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + subcontractId + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    //获取次数的字段
    var number = result[0].frequency;
    //删除之后让次数-1
    var num = number - 1;
    //获取分包合同主表的id
    var mainId = result[0].id;
    //更新实体
    var object = { id: mainId, frequency: num };
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });