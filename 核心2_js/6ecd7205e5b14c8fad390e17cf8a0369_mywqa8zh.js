let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取id
    var id = param.data[0].id;
    //根据id查询子表生产工号
    throw new Error(JSON.stringify(id));
    var sql = "select production_Job_No from GT101949AT1.GT101949AT1.additional_Detail1 where additional_details1_id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < result.length; i++) {
      var object = { id: result[i].production_Job_No, mobilization_Date: "" };
      var res = ObjectStore.updateById("GT101949AT1.API.sppp", object, "5ea43ddb");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });