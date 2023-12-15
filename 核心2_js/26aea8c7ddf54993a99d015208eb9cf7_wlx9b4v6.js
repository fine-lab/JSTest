let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //内部流转单主键
    var issuingContract_code = request.issuingContract_code;
    //内部完结单主键
    var idnumber = request.idnumber;
    var sql = 'select id from GT60601AT58.GT60601AT58.finishApprove where dr=0 and issuingContract_code = "' + issuingContract_code + '" ';
    var rst = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && rst.length > 0) {
      throw new Error("所选出证合同已存在完结审批单，不可再次添加！");
    } else if (idnumber !== undefined && idnumber != rst[0].id) {
      throw new Error("所选出证合同已存在完结审批单，不可再次添加！");
    }
    return { idnumber };
  }
}
exports({ entryPoint: MyAPIHandler });