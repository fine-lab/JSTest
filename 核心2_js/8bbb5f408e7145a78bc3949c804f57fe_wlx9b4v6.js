let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //出证合同主键
    var idnumber = request.idnumber;
    //人才库档案主键
    var receiContract_code = request.receiContract_code;
    //变更次数
    var changes_number = request.changes_number;
    //查询合同状态为【已出证】的个数
    var onlysql = 'select id from  GT60601AT58.GT60601AT58.issuingContract where dr=0 and issuingContract_status=2 and receiContract_code = "' + receiContract_code + '" ';
    var onlyrst = ObjectStore.queryByYonQL(onlysql);
    if (idnumber === undefined && onlyrst.length > 0) {
      throw new Error("所选的收证合同存在【已出证】状态数据，不可再次添加！");
    } else if (idnumber !== undefined && idnumber != onlyrst[0].id) {
      throw new Error("所选的收证合同存在【已出证】状态数据，不可再次添加！");
    }
    //查询合同状态为【已出证】、【合同到期】的个数，与变更次数做对比
    var sql = 'select id from  GT60601AT58.GT60601AT58.issuingContract where dr=0 and issuingContract_status in(2,3) and receiContract_code = "' + receiContract_code + '" ';
    var rst = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && rst.length == changes_number + 1) {
      throw new Error("所选的收证合同数据已达到所设置【变更次数】限制，不可再次添加！");
    } else if (idnumber !== undefined && rst.length == changes_number) {
      var isok = false;
      for (var i = 0; i < rst.length; i++) {
        if (idnumber == rst[i].id) {
          isok = true;
        }
      }
      if (!isok) {
        throw new Error("所选的收证合同数据已达到所设置【变更次数】限制，不可再次添加！");
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });