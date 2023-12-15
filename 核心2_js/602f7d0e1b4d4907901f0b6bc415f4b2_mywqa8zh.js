let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    //主表
    var sql = "select * from st.salesout.SalesOut where id = " + id;
    var res = ObjectStore.queryByYonQL(sql);
    //子表
    var sql1 = "select * from st.salesout.SalesOuts where mainid = " + id;
    var res1 = ObjectStore.queryByYonQL(sql1);
    //自定义项
    var sql2 = "select * from st.salesout.SalesOutDefine where id = " + id;
    var res2 = ObjectStore.queryByYonQL(sql2);
    //查询物料
    var bill = res[0];
    bill.bodys = res1;
    bill.def1 = res2[0].define1;
    bill.def2 = res2[0].define2;
    return { bill };
  }
}
exports({ entryPoint: MyAPIHandler });