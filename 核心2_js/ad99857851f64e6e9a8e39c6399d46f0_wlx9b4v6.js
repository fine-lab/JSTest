let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //出证合同主键
    var issuingContract_code = request.issuingContract_code;
    //出证合同变更申请单主键
    var idnumber = request.idnumber;
    var sql = "select id from GT60601AT58.GT60601AT58.issContractChange where issuingContract_code ='" + issuingContract_code + "'";
    var rst = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && rst.length > 0) {
      throw new Error("所引用的出证合同已存在数据，不可再次添加！");
    } else if (idnumber !== undefined && idnumber != rst[0].id) {
      throw new Error("所引用的出证合同已存在数据，不可再次添加！");
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });