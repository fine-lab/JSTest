let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //单据id
    let id = request.id;
    let rp_prom_solution_scopeList = request.rp_prom_solution_scopeList;
    let rp_prom_solution_configList = request.rp_prom_solution_configList;
    var object = { id: id, rp_prom_solution_scopeList: rp_prom_solution_scopeList, rp_prom_solution_configList: rp_prom_solution_configList };
    var res = ObjectStore.deleteById("AT19D3CA6A0868000B.AT19D3CA6A0868000B.rp_prom_solution", object, "rp_prom_solution");
    //  在这里调用后端,告知后端将这个被删除掉的单据改为未审核 todo
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });