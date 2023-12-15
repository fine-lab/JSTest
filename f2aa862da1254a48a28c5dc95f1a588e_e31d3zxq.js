let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断组织是否启用GSP组织参数
    let sqlStr = " select isgspzz, poacontrol,isgspmanage, noGspFlowCtrl from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where dr = 0  and org_id = '" + request.orgId + "'";
    let gspParameterArray = ObjectStore.queryByYonQL(sqlStr, "sy01");
    if (gspParameterArray.length > 0) {
      if (!gspParameterArray[0].isgspmanage) {
        return { code: 1005, errCode: "该组织未启用GSP管理, 请检查" };
      }
    } else {
      return { code: 1005, errCode: "该组织未启用GSP管理, 请检查" };
    }
    let sql = "";
    let err_info = {};
    sql = "select code from GT22176AT10.GT22176AT10.SY01_fccompauditv4 where org_id = '" + request.orgId + "' and supplier = '" + request.supplierId + "'";
    let result = ObjectStore.queryByYonQL(sql);
    if (result.length !== 0) {
      err_info = { errCode: "1001", msg: "已存在相同供应商审批单:【" + result[0].code + "】" };
      return err_info;
    }
    return { errCode: "200", msg: "sccess" };
  }
}
exports({ entryPoint: MyAPIHandler });