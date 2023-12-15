let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let billCode = request.billCode; //来源单号
    let billType = request.billType; //来源单类型
    //查询对应包装的UDI
    let udiCodeList = ObjectStore.queryByYonQL(
      "select * from I0P_UDI.I0P_UDI.udi_release_data_infov3 where dr = 0 and udiConfigId = '" + configId + "' and sourceCode = '" + billCode + "' and sourceType = '" + billType + "'"
    );
    if (udiCodeList == null || udiCodeList.length == 0) {
      return { result: [] };
    }
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });