let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let promsg = processStateChangeMessage;
    //流程结束
    if (promsg.processEnd) {
      var test = { new1: "开始" };
      ObjectStore.insert("GT83874AT54.GT83874AT54.test", test, "6bccd39b");
      var mjsqId = processStateChangeMessage.businessKey.substring(processStateChangeMessage.businessKey.indexOf("_") + 1);
      var sql = "select * from GT83874AT54.GT83874AT54.xm_mjsq where id = '" + mjsqId + "'";
      var resmjsq = ObjectStore.queryByYonQL(sql);
      if (resmjsq !== null && resmjsq.length > 0) {
        var mjsq = resmjsq[0];
        var mjsq_bgdq = mjsq.mjsq_bgdq; // 办公地区
        var mjsq_bgqy = mjsq.mjsq_bgqy; // 办公区域
        var mjsq_mjlx = mjsq.mjsq_mjlx; // 门禁类型
        var sqlzb = "select * from GT83874AT54.GT83874AT54.xm_mjsqzb	where xm_mjsq_id = '" + mjsqId + "'";
        var resmjsqzb = ObjectStore.queryByYonQL(sqlzb);
        if (resmjsqzb !== null && resmjsqzb.length > 0) {
          var test1 = { new1: "进入1" };
          ObjectStore.insert("GT83874AT54.GT83874AT54.test", test1, "6bccd39b");
          for (var i = 0; i < resmjsqzb.length; i++) {
            var mjsqInfo = resmjsqzb[i];
            var mjzb_yuangong = mjsqInfo.mjzb_yuangong; // 员工编码
            var mjzb_ygzh = mjsqInfo.mjzb_ygzh; // 员工账号
            var mjzb_bm = mjsqInfo.mjzb_bm; //部门
            var mjzb_lh = mjsqInfo.mjzb_lh; // 楼号
            var mjzb_lc = mjsqInfo.mjzb_lc; // 楼层
            var mjzb_lcqy = mjsqInfo.mjzb_lcqy; // 楼层区域
            // 根据员工账号查询小米员工表
            var sqlxmyg = "select * from GT83874AT54.GT83874AT54.xm_yg	where yg_xingming = '" + mjzb_yuangong + "'";
            var resxmyg = ObjectStore.queryByYonQL(sqlxmyg);
            var test3 = { new1: "查询" + mjzb_ygzh };
            ObjectStore.insert("GT83874AT54.GT83874AT54.test", test3, "6bccd39b");
            if (resxmyg !== null && resxmyg.length > 0) {
              var test2 = { new1: "进入2" };
              ObjectStore.insert("GT83874AT54.GT83874AT54.test", test2, "6bccd39b");
              // 如果有员工信息，则直接插入子表
              var xmyg = resxmyg[0];
              var object = { yg_special_mj: "Y", xm_mjqx_listFk: xmyg.id, yg_xingming: mjzb_ygzh, yg_bgdq: mjsq_bgdq, yg_bgqy: mjsq_bgqy, yg_lh: mjzb_lh, yg_lc: mjzb_lc, yg_qy: mjzb_lcqy };
              var res = ObjectStore.insert("GT83874AT54.GT83874AT54.xm_mjqx_list", object, "0bc0404c");
              // 根据员工账号
              // 如果没有员工信息，则需要插入主子表
            }
          }
        }
      }
      var testend = { new1: "结束" };
      ObjectStore.insert("GT83874AT54.GT83874AT54.test", testend, "6bccd39b");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });