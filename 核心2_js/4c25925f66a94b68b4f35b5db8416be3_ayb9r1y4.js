let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取安装合同号
    var installationContractNumber = param.data[0].installationContractNumber;
    //根据分包合同的安装合同号去查询安装合同表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation where contractno = '" + installationContractNumber + "'";
    var result = ObjectStore.queryByYonQL(sql);
    if (result.length != 0) {
      var number = result[0].frequency;
      var num = number - 1;
      var id = result[0].id;
      var object = { id: id, frequency: num };
      //更新实体：
      var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.basicinformation", object, "179f2f7c");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });