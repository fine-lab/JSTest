let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //审批完成，发送通知给申请人
    var applyid = replace(processStateChangeMessage.businessKey, "45ccac5b_", "");
    //查询申请关联客户
    var applySQL = "select kehu,creator from GT40099AT12.GT40099AT12.applycustomchn where id=" + applyid;
    var applyTmp = ObjectStore.queryByYonQL(applySQL);
    //查询客户信息
    var customSQL = "select kehuming,bianma,dizhi,guhua,lianxiren,new6 from GT40099AT12.GT40099AT12.custominfochn where id = " + applyTmp[0].kehu;
    var customTmp = ObjectStore.queryByYonQL(customSQL);
    //发送消息
    var uspaceReceiver = [applyTmp[0].creator];
    var channels = ["uspace"];
    var title = "客户信息查看";
    var content = "您申请查看的客户信息如下：";
    content += "<br/>客户名：" + customTmp[0].kehuming;
    content += "<br/>编码：" + customTmp[0].bianma;
    content += "<br/>" + customTmp[0].dizhi;
    content += "<br/>" + customTmp[0].guhua;
    content += "<br/>" + customTmp[0].lianxiren;
    content += "<br/>" + customTmp[0].new6;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });