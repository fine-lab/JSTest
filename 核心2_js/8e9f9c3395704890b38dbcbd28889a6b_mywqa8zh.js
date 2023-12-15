let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var idnumber = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      var res1 = ObjectStore.queryByYonQL('select * from GT8313AT35.GT8313AT35.lzwjst where id = "' + idnumber + '"');
      var liuzhuanbianhao = res1[0].liuzhuanbianhao;
      var res = ObjectStore.queryByYonQL('select * from GT8313AT35.GT8313AT35.nblzst where liushuihao = "' + liuzhuanbianhao + '"');
      var zhengshuhetonghao = res[0].zhengshuhetonghao;
      var res2 = ObjectStore.queryByYonQL('select * from GT8313AT35.GT8313AT35.ServiceCentre where id ="' + zhengshuhetonghao + '"');
      //服务人才中心id
      var iddd = res2[0].id;
      var idd = res[0].id;
      var zb1 = ObjectStore.queryByYonQL('select * from GT8313AT35.GT8313AT35.gjst where source_id = "' + idd + '"');
      var zbid = zb1[0].id;
      var object = { id: iddd, gjstList: [{ id: zbid, zhuangtai: "8", _status: "Update" }] };
      var res33 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
      var object = { id: idd, zhuangtai: "8" };
      var res11 = ObjectStore.updateById("GT8313AT35.GT8313AT35.nblzst", object, "337e255e");
      var object = { id: iddd, zhuangtai: "3" };
      var res12 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });