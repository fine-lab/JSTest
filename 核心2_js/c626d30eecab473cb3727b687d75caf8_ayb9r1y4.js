let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取页面上的数据
    var data = request.record;
    var Id = request.code;
    //获取到主表id
    var Id = data.id;
    // 根据主表id查询主表信息
    var sql = "select * from GT102917AT3.GT102917AT3.advanceMaintenance where id='" + Id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var num = data.amountAdvanced;
    var sum = num * -1;
    var state = data.billState;
    if (state == 2) {
      var object = {
        taskNo: data.taskNo,
        maintenanceContractNo: data.maintenanceContractNo,
        client: data.client,
        advanceDate: data.advanceDate,
        workNumber: data.workNumber,
        amountAdvanced: sum,
        remarks: data.remarks,
        billState: "1",
        dr: data.dr
      };
      // 更新实体，并且插入实体
      var qwe = ObjectStore.insert("GT102917AT3.GT102917AT3.advanceMaintenance", object, "833dc300");
      // 更新实体
      var object1 = { id: Id, billState: "1" };
      var res1 = ObjectStore.updateById("GT102917AT3.GT102917AT3.advanceMaintenance", object1, "833dc300");
    }
    return { res1 };
  }
}
exports({ entryPoint: MyAPIHandler });