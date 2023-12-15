let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = "";
    let err_info = {};
    request.id = request.id == undefined ? "-1" : request.id;
    //判断组织是否启用GSP组织参数
    let sqlStr = " select isgspzz, poacontrol,isgspmanage, noGspFlowCtrl from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where dr = 0  and org_id = '" + request.orgId + "'";
    let gspParameterArray = ObjectStore.queryByYonQL(sqlStr, "sy01");
    if (gspParameterArray.length > 0) {
      if (!gspParameterArray[0].isgspmanage) {
        return { errCode: 1005, msg: "该组织未启用GSP管理, 请检查" };
      }
    } else {
      return { errCode: 1005, msg: "该组织未启用GSP管理, 请检查" };
    }
    if (request.type == 1) {
      sql =
        "select code from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where org_id = '" +
        request.orgId +
        "' and customerbillno = '" +
        request.materialId +
        "' and sku = '" +
        request.skuId +
        "' and is_sku = 1 and id !='" +
        request.id +
        "' and dr = 0";
      let result = ObjectStore.queryByYonQL(sql);
      if (result.length !== 0) {
        err_info = { errCode: "1001", msg: "sku维度商品审批,已存在相同首营商品审批单:【" + result[0].code + "】" };
        return err_info;
      }
    } else if (request.type == 0) {
      sql =
        "select code from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where org_id = '" +
        request.orgId +
        "' and customerbillno = '" +
        request.materialId +
        "' and is_sku = 0 and id !='" +
        request.id +
        "' and dr = 0";
      let result = ObjectStore.queryByYonQL(sql);
      if (result.length !== 0) {
        err_info = { errCode: "1001", msg: "非sku维度商品审批,已存在相同首营商品审批单:【" + result[0].code + "】" };
        return err_info;
      }
    }
    return { errCode: "200", msg: "sccess" };
  }
}
exports({ entryPoint: MyAPIHandler });