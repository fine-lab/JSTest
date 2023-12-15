let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type; //打印UDI类型
    let udi_print_scheme = request.udi_print_scheme; //打印方案
    let udiList = request.udiList; //打印UDI
    let tableName = "";
    if (type == 1) {
      tableName = "I0P_UDI.I0P_UDI.UDI_print_wbz";
    } else if (type == 2) {
      tableName = "I0P_UDI.I0P_UDI.UDI_print_zbz";
    } else {
      tableName = "I0P_UDI.I0P_UDI.UDI_print_zxbz";
    }
    //查询打印方案次数
    let printNumber = ObjectStore.queryByYonQL("select printNumber from I0P_UDI.I0P_UDI.udi_print_schemev3 where  dr = 0 and id ='" + udi_print_scheme + "'");
    for (let i = 0; i < udiList.length; i++) {
      //查询子包装id
      let udiPrintLog = ObjectStore.queryByYonQL("select * from " + tableName + " where  dr = 0 and udi ='" + udiList[i].udi + "'");
      if (udiPrintLog.length >= printNumber[0].printNumber) {
        return { result: udiList[i].udi };
      }
    }
    return { result: "" };
  }
}
exports({ entryPoint: MyAPIHandler });