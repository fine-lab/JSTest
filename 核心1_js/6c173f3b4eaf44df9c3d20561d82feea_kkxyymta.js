let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let customerId = request.customerId;
    let vouchdate = request.vouchdate;
    let vouchdateDate = new Date(Date.parse(vouchdate));
    let trans_type = request.trans_type;
    let result_tf = true;
    let message = "";
    var t_type_res;
    let has_type;
    let type_id = [];
    let gback;
    let params_res = ObjectStore.queryByYonQL("select * from ISY_2.ISY_2.SY01_gmpparams where dr=0 and org_id='" + orgId + "'", "sy01");
    if (params_res.length > 0) {
      if (params_res[0].customerLicenseControl != 1) {
        gback = { result_tf: result_tf, t_type_res: t_type_res, has_type: has_type, trans_type: trans_type, message: "未管控" };
        return gback;
      }
    } else {
      gback = { result_tf: result_tf, t_type_res: t_type_res, has_type: has_type, trans_type: trans_type, message: "未管控" };
      return gback;
    }
    t_type_res = ObjectStore.queryByYonQL("select id from ISY_2.ISY_2.SY01_control_transa_type  where dr=0 ", "sy01");
    for (let i = 0; i < t_type_res.length; i++) {
      type_id.push(t_type_res[i].id);
      //查询内容
    }
    if (type_id.length > 0) {
      let typein = join(type_id, ",");
      has_type = ObjectStore.queryByYonQL("select * from ISY_2.ISY_2.SY01_control_transa_type_sale where dr=0 and fkid in (" + typein + ") and sale='" + trans_type + "'", "sy01");
      if (has_type.length > 0) {
        result_tf = false;
      }
    }
    if (result_tf) {
      gback = { result_tf: result_tf, t_type_res: t_type_res, has_type: has_type, trans_type: trans_type, message: "交易类型不受限制" };
      return gback;
    }
    let paramSql =
      "select id,customerCode,org_id,is_all_org from ISY_2.ISY_2.SY01_customer_license_file where dr=0 and enable=1 and customerCode='" + customerId + "' and (org_id='" + orgId + "' or is_all_org=1)";
    let paramRes1 = ObjectStore.queryByYonQL(paramSql, "sy01");
    let paramRes = [];
    let guoqi = [];
    if (paramRes1 != null && paramRes1.length > 0) {
      var object_det;
      var resdet;
      for (let i = 0; i < paramRes1.length; i++) {
        let paramSql_det = "select * from ISY_2.ISY_2.SY01_customer_license_detail where dr=0 and license_file_id='" + paramRes1[i].id + "'";
        resdet = ObjectStore.queryByYonQL(paramSql_det, "sy01");
        if (resdet.length > 0) {
          for (let j = 0; j < resdet.length; j++) {
            let start = new Date(Date.parse(resdet[j].validity_start_date));
            let end = new Date(Date.parse(resdet[j].validity_end_date));
            if (vouchdateDate >= start && vouchdateDate <= end) {
              paramRes.push({
                customerCode: paramRes1[i].customerCode,
                is_all_org: paramRes1[i].is_all_org,
                org_id: paramRes1[i].org_id,
                validity_start_date: resdet[j].validity_start_date,
                validity_end_date: resdet[j].validity_end_date,
                license_code: resdet[j].license_code
              });
            } else {
              guoqi.push(resdet[j].license_code);
            }
          }
        }
      }
    } else {
      gback = { result_tf: result_tf, t_type_res: t_type_res, has_type: has_type, trans_type: trans_type, message: "GMP客户证照档案找不到该客户证照，请检查！" };
      return gback;
    }
    if (paramRes.length > 0) {
      result_tf = true;
      message = "成功";
    } else {
      message = "该客户";
      for (let i = 0; i < guoqi.length; i++) {
        message += "证照:" + guoqi[i];
        if (i < guoqi.length - 1) {
          message += ",";
        }
      }
      message += "已经过期，请检查GMP客户证照档案！";
    }
    gback = { result_tf: result_tf, t_type_res: t_type_res, has_type: has_type, trans_type: trans_type, message: message };
    return gback;
  }
}
exports({ entryPoint: MyAPIHandler });