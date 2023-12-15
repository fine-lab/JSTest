let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //收证合同主键
    var cerContract_code = request.cerContract_code;
    //收证合同变更申请单主键
    var idnumber = request.idnumber;
    var sql = "select id from GT60601AT58.GT60601AT58.cerContractChange where  cerContract_code ='" + cerContract_code + "'";
    var rst = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && rst.length > 0) {
      throw new Error("所引用的收证合同已存在数据，不可再次添加！");
    } else if (idnumber !== undefined && idnumber != rst[0].id) {
      throw new Error("所引用的收证合同已存在数据，不可再次添加！");
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });