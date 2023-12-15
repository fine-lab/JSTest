let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let billCode = request.billCode; //来源单号
    let billType = request.billType; //来源单类型
    //查询对应包装的UDI
    let udiCodeList = ObjectStore.queryByYonQL(
      "select * from GT22176AT10.GT22176AT10.sy01_udi_data_info4 where udiConfigId = '" + configId + "' and sourceCode = '" + billCode + "' and sourceType = '" + billType + "'"
    );
    if (udiCodeList == null || udiCodeList.length == 0) {
      return { result: [] };
    }
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });