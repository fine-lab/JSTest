let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let error_info = {};
    let fccusauditRes = [];
    let fcuscauditRes = [];
    let gysbgsp_xgzz = [];
    let syqysp_xgzzv4Res = [];
    for (let i = 0; i < id.length; i++) {
      if (request.type == "上市许可持有人") {
        //查询首营物料审批单
        let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where licneser = '" + id[i] + "'";
        fccusauditRes.push(ObjectStore.queryByYonQL(fccusauditSql).length);
        //查询首营物料变更审批单
        let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where licenser = '" + id[i] + "'";
        fcuscauditRes.push(ObjectStore.queryByYonQL(fcuscauditSql).length);
      } else if (request.type == "剂型") {
        //查询首营物料审批单
        let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where dosageform = '" + id[i] + "'";
        fccusauditRes.push(ObjectStore.queryByYonQL(fccusauditSql).length);
        //查询首营物料变更审批单
        let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where dosageform = '" + id[i] + "'";
        fcuscauditRes.push(ObjectStore.queryByYonQL(fcuscauditSql).length);
      } else if (request.type == "养护类别") {
        //查询首营物料审批单
        let fccusauditSql = "select * from 	GT22176AT10.GT22176AT10.SY01_fccusauditv4 where curingtype = '" + id[i] + "'";
        fccusauditRes.push(ObjectStore.queryByYonQL(fccusauditSql).length);
        //查询首营物料变更审批单
        let fcuscauditSql = "select * from 		GT22176AT10.GT22176AT10.SY01_fcuscauditv2 where curingtype = '" + id[i] + "'";
        fcuscauditRes.push(ObjectStore.queryByYonQL(fcuscauditSql).length);
      } else if (request.type == "二次验收人") {
        //查询购进入库验收单
        let fccusauditSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockys_l where double_checker = '" + id[i] + "'";
        fccusauditRes.push(ObjectStore.queryByYonQL(fccusauditSql).length);
        //查询购进退出复核单
        let fcuscauditSql = "select * from GT22176AT10.GT22176AT10.SY01_gjtcfh_l where double_checker = '" + id[i] + "'";
        fcuscauditRes.push(ObjectStore.queryByYonQL(fcuscauditSql).length);
      } else if (request.type == "证照管理") {
        //查询首营客户审批单相关证照子表
        let fccusauditSql = "select * from GT22176AT10.GT22176AT10.SY01_sykhsp_xgzz where license = '" + id[i] + "'";
        fccusauditRes.push(ObjectStore.queryByYonQL(fccusauditSql).length);
        //查询首营客户变更审批单相关证照子表
        let fcuscauditSql = "select * from GT22176AT10.GT22176AT10.SY01_khbgsp_xgzz where license = '" + id[i] + "'";
        fcuscauditRes.push(ObjectStore.queryByYonQL(fcuscauditSql).length);
        //查询首营供应商审批单相关证照子表
        let gysbgsp_xgzzSql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz where license = '" + id[i] + "'";
        gysbgsp_xgzz.push(ObjectStore.queryByYonQL(gysbgsp_xgzzSql).length);
        //查询首营供应商变更审批单相关证照子表
        let syqysp_xgzzv4Sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzzv4 where license = '" + id[i] + "'";
        syqysp_xgzzv4Res.push(ObjectStore.queryByYonQL(syqysp_xgzzv4Sql).length);
      }
    }
    for (let i = 0; i < fcuscauditRes.length; i++) {
      if (fcuscauditRes[i] > 0) {
        error_info = { errInfo: "存在已被引用的单据,无法删除" };
      }
    }
    for (let i = 0; i < fccusauditRes.length; i++) {
      if (fccusauditRes[i] > 0) {
        error_info = { errInfo: "存在已被引用的单据,无法删除" };
      }
    }
    for (let i = 0; i < gysbgsp_xgzz.length; i++) {
      if (gysbgsp_xgzz[i] > 0) {
        error_info = { errInfo: "存在已被引用的单据,无法删除" };
      }
    }
    for (let i = 0; i < syqysp_xgzzv4Res.length; i++) {
      if (syqysp_xgzzv4Res[i] > 0) {
        error_info = { errInfo: "存在已被引用的单据,无法删除" };
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });