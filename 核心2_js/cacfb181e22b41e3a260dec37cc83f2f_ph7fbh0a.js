let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billId = request.idnumber;
    //查询主表
    let queryBillSql = "select * from st.salesout.SalesOut where id=" + billId;
    var bill = ObjectStore.queryByYonQL(queryBillSql, "ustock");
    //查询子表
    let queryBodySql = "select * from st.salesout.SalesOuts where  mainid=" + billId;
    var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "ustock");
    bill[0].bodys = bodyRes;
    //查询自定义项
    let queryZDYSql = "select * from st.salesout.SalesOutDefine where  id=" + billId;
    var zdyRes = ObjectStore.queryByYonQL(queryZDYSql, "ustock");
    bill[0].def1 = zdyRes[0].define1; //快递类型
    bill[0].def2 = zdyRes[0].define2; //快递号
    return { bill };
  }
}
exports({ entryPoint: MyAPIHandler });