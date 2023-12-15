let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billId = request.idnumber;
    let array = request.array;
    if (array.length == 0) {
      throw new Error("快递类型转换失败！");
    }
    //查询主表
    let queryBillSql = "select * from st.salesout.SalesOut where id=" + billId;
    var bill = ObjectStore.queryByYonQL(queryBillSql, "ustock");
    //查询子表
    let queryBodySql = "select * from st.salesout.SalesOuts where  mainid=" + billId;
    var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "ustock");
    bill[0].bodys = bodyRes;
    //查询自定义项
    bill[0].def4 = bill[0].salesOutDefineCharacter.attrext8; //快递类型
    bill[0].def5 = bill[0].salesOutDefineCharacter.attrext9; //快递号
    for (var i = 0; i < array.length; i++) {
      let bodydata = array[i];
      if ("申通" == bill[0].def4) {
        bill[0].def4Vcode = "STO";
      } else if (bill[0].def4 == bodydata.name) {
        bill[0].def4Vcode = bodydata.code;
      }
    }
    return { bill };
  }
}
exports({ entryPoint: MyAPIHandler });