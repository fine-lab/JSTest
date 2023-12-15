let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let error_info = {};
    let fccusauditRes = [];
    let fcuscauditRes = [];
    let gysbgsp_xgzz = [];
    let syqysp_xgzzv4Res = [];
    if (request.type == "上市许可持有人") {
      //查询首营物料审批单
      let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where licneser = '" + request.id + "'";
      fccusauditRes = ObjectStore.queryByYonQL(fccusauditSql);
      //查询首营物料变更审批单
      let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where licenser = '" + request.id + "'";
      fcuscauditRes = ObjectStore.queryByYonQL(fcuscauditSql);
    } else if (request.type == "剂型") {
      //查询首营物料审批单
      let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where dosageform = '" + request.id + "'";
      fccusauditRes = ObjectStore.queryByYonQL(fccusauditSql);
      //查询首营物料变更审批单
      let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where dosageform = '" + request.id + "'";
      fcuscauditRes = ObjectStore.queryByYonQL(fcuscauditSql);
    } else if (request.type == "养护类别") {
      //查询首营物料审批单
      let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where curingtype = '" + request.id + "'";
      fccusauditRes = ObjectStore.queryByYonQL(fccusauditSql);
      //查询首营物料变更审批单
      let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where curingtype = '" + request.id + "'";
      fcuscauditRes = ObjectStore.queryByYonQL(fcuscauditSql);
    } else if (request.type == "二次验收人") {
      //查询购进入库验收单
      let fccusauditSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockys_l where double_checker = '" + request.id + "'";
      fccusauditRes = ObjectStore.queryByYonQL(fccusauditSql);
      //查询购进退出复核单
      let fcuscauditSql = "select * from GT22176AT10.GT22176AT10.SY01_gjtcfh_l where double_checker = '" + request.id + "'";
      fcuscauditRes = ObjectStore.queryByYonQL(fcuscauditSql);
    } else if (request.type == "证照管理") {
      //查询首营客户审批单相关证照子表
      let sykhsp_xgzzSql = "select * from GT22176AT10.GT22176AT10.SY01_sykhsp_xgzz where license = '" + request.id + "'";
      fccusauditRes = ObjectStore.queryByYonQL(sykhsp_xgzzSql);
      //查询首营客户变更审批单相关证照子表
      let khbgsp_xgzzSql = "select * from GT22176AT10.GT22176AT10.SY01_khbgsp_xgzz where license = '" + request.id + "'";
      fcuscauditRes = ObjectStore.queryByYonQL(khbgsp_xgzzSql);
      //查询首营供应商审批单相关证照子表
      let gysbgsp_xgzzSql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz where license = '" + request.id + "'";
      gysbgsp_xgzz = ObjectStore.queryByYonQL(gysbgsp_xgzzSql);
      //查询首营供应商变更审批单相关证照子表
      let syqysp_xgzzv4Sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzzv4 where license = '" + request.id + "'";
      syqysp_xgzzv4Res = ObjectStore.queryByYonQL(syqysp_xgzzv4Sql);
    }
    if (fccusauditRes.length > 0 || fcuscauditRes.length > 0 || gysbgsp_xgzz.length > 0 || syqysp_xgzzv4Res.length > 0) {
      error_info = { errInfo: "该" + request.type + "已被引用,无法删除" };
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });