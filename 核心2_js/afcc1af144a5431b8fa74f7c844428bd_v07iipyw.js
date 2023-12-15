let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let promsg = processStateChangeMessage;
    //流程结束
    if (promsg.processEnd) {
      const [billnum, billId] = promsg.businessKey.split("_");
      var bill = ObjectStore.selectById("GT83874AT54.GT83874AT54.xm_mjqxsq", { id: billId });
      if (bill !== null) {
        const { mjqxsq_yg, mjqxsq_bgdq, mjqxsq_bgq, mjqxsq_lh, mjqxsq_lch, mjqxsq_lcqy } = bill;
        // 根据员工账号查询小米员工表
        var xmyg = ObjectStore.selectById("GT83874AT54.GT83874AT54.xm_yg", { id: mjqxsq_yg });
        if (xmyg !== null) {
          // 如果有员工信息，则直接插入子表
          var object = {
            yg_special_mj: "N",
            xm_mjqx_listFk: xmyg.id,
            yg_xingming: mjqxsq_yg,
            yg_bgdq: mjqxsq_bgdq,
            yg_bgqy: mjqxsq_bgq,
            yg_lh: mjqxsq_lh,
            yg_lc: mjqxsq_lch,
            yg_qy: mjqxsq_lcqy
          };
          var res = ObjectStore.insert("GT83874AT54.GT83874AT54.xm_mjqx_list", object, "0bc0404c");
        }
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });