let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { name, poc_node_type, Unit, workload, parent, code } = request.node;
    //可能存在并发风险，code已存在
    var object = { name: name, poc_node_type: poc_node_type, Unit: Unit, workload: workload, parent: parent, code: code, temp: 1, wbsc: code, wbsn: name };
    var res = ObjectStore.insert("GT9144AT102.GT9144AT102.item_wbs", object, "8663acb4");
    //根据id查询单位名称
    var sqlQuery = "select level,path,Unit.name as name from GT9144AT102.GT9144AT102.item_wbs where id='" + res.id + "'";
    var resQuery = ObjectStore.queryByYonQL(sqlQuery)[0];
    res.level = resQuery.level;
    res.Unit_name = resQuery.name;
    res.path = resQuery.path;
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });