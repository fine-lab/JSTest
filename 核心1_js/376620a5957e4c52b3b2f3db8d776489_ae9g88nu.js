let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前停售单的ID
    var id = request.id;
    var code = request.code;
    // 获取当前单据的审核状态，未审核不允许下推
    let sqlstr0 = "select verifystate from  GT22176AT10.GT22176AT10.SY01_drugsuspension where id =" + id;
    let returns0 = ObjectStore.queryByYonQL(sqlstr0);
    if (returns0.length < 1) {
      return { errInfo: "单据" + code + "未查询到需要生单的单据！" };
    } else if (returns0[0].verifystate != 2) {
      return { errInfo: "单据" + code + "未审核，请审核后下推！" };
    }
    // 查询主表详情是不是都存在下游单据
    var sqlstr = "select id from GT22176AT10.GT22176AT10.SY01_suspensionson  where  SY01_suspensionsonFk = '" + id + "'";
    var upBillDetails = ObjectStore.queryByYonQL(sqlstr);
    // 判断表体
    var flag = false; // 是否存在可以推单的行
    //遍历表体
    for (var i = 0; i < upBillDetails.length; i++) {
      var resumeSql = "select id from GT22176AT10.GT22176AT10.SY01_detailson  where sourcechild_id = '" + upBillDetails[i].id + "'";
      var resumes = ObjectStore.queryByYonQL(resumeSql);
      // 判断行是不是已经存在下游单据
      if (resumes == "undefined" || resumes.length == 0) {
        flag = true;
      }
    }
    if (!flag) {
      return { errInfo: "单据" + code + "所有商品都已存在解除停售单！" };
    }
    // 返回校验结果
    return { data: flag };
  }
}
exports({ entryPoint: MyAPIHandler });