let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if ((param.requestData.detailsOfLiftingStatementList == null) == true) {
      var stu = JSON.parse(param.requestData);
      var state = stu._status;
      //判断是否是新增状态
      if (state == "Insert") {
        //获取分包合同号
        var contractId = param.return.contractNumber_subcontractNo;
        //根据分包合同号查询分包合同表
        var sql = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + contractId + "'";
        var result = ObjectStore.queryByYonQL(sql);
        if (result.length > 0) {
          //获取frequency
          var count = result[0].frequency;
          //新增态让count + 1;
          var number = count + 1;
          //获取分包合同的id
          var mainId = result[0].id;
          //更新实体
          var object = { id: mainId, frequency: number };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
        }
      }
    } else {
      //获取分包合同号
      var contractId = param.return.contractNumber_subcontractNo;
      //根据分包合同号查询分包合同表
      var sql = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + contractId + "'";
      var result = ObjectStore.queryByYonQL(sql);
      if (result.length > 0) {
        //获取frequency
        var count = result[0].frequency;
        //新增态让count + 1;
        var number = count + 1;
        //获取分包合同的id
        var mainId = result[0].id;
        //更新实体
        var object = { id: mainId, frequency: number };
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });