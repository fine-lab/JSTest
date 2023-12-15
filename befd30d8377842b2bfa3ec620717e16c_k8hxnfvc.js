let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询条件
    var object = {};
    //实体查询
    var res = ObjectStore.selectByMap("cpu-contract.contract.ContractVO", object, "ycContractManagement");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });