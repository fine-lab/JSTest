let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0].detailsOfLiftingStatementList;
    if (param.data[0].hasOwnProperty("detailsOfLiftingStatementList") && data.length != null) {
      for (var i = 0; i < data.length; i++) {
        // 新增的生产工号
        var NewproductionWorkNumber = data[i].productionWorkNumber;
        // 查询分包合同子表
        var fenbaoSun = "select id,subcontract_id from GT102917AT3.GT102917AT3.subcontractDetails where id = '" + NewproductionWorkNumber + "'";
        var fenbaoSunRes = ObjectStore.queryByYonQL(fenbaoSun);
        // 查询吊装结算子表
        var sql = "select * from GT102917AT3.GT102917AT3.detailsOfLiftingStatement";
        var List = ObjectStore.queryByYonQL(sql);
        if (List.length > 0) {
          for (var j = 0; j < List.length; j++) {
            // 获取分包子表的生产工号
            var productionWorkNumber = List[j].productionWorkNumber;
            if (NewproductionWorkNumber != productionWorkNumber) {
              // 更新分包合同子表
              var object = { id: fenbaoSunRes[0].subcontract_id, subcontractDetailsList: [{ id: fenbaoSunRes[0].id, hoistingWhether: "1", _status: "Update" }] };
              var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
            }
          }
        }
        // 更新分包合同子表
        var Updateobject = { id: fenbaoSunRes[0].subcontract_id, subcontractDetailsList: [{ id: fenbaoSunRes[0].id, hoistingWhether: "1", _status: "Update" }] };
        var Updateres = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", Updateobject, "5ff76a5f");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });