let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 修改某条数据
    var dataId = "yourIdHere";
    var sqlExec = `select * from GT8429AT6.GT8429AT6.construction_drawing where id ='youridHere'`;
    var dataInfo = ObjectStore.queryByYonQL(sqlExec, "developplatform");
    dataInfo[0].construction_drawing_detailList_model_of_equipment_in_the_private_room = "T4VB";
    var res = ObjectStore.updateById("GT8429AT6.GT8429AT6.construction_drawing", dataInfo[0], "b06f316aList");
    return { dataInfo };
  }
}
exports({ entryPoint: MyAPIHandler });