let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取是insert还是update状态
    var a = JSON.parse(param.requestData);
    var stu = a._status;
    if (stu == "Insert") {
      //获取分包合同的安装合同号
      var installationContractNumber = param.data[0].installationContractNumber;
      // 根据分包合同的安装合同号去查询安装合同表
      var sql = "select * from GT102917AT3.GT102917AT3.basicinformation where contractno = '" + installationContractNumber + "'";
      var result = ObjectStore.queryByYonQL(sql);
      if (result.length != 0) {
        // 获取次数对应的字段
        var number = result[0].frequency;
        // 获取id
        var id = result[0].id;
        // 每新增一次 让次数+1
        var number2 = number + 1;
        var object = { id: id, frequency: number2 };
        // 更新实体：
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.basicinformation", object, "179f2f7c");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });