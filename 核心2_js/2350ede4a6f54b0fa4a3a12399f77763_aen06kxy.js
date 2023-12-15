let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //流程结束，将客户信息发送给申请人
    //从流程中获取申请的表单ID
    var applyid = replace(processStateChangeMessage.businessKey, "ce50f95b_", "");
    //查询申请表单
    var applySQL = "select kehu,creator from GT39251AT11.GT39251AT11.applycustomch where id = " + applyid;
    var tempapply = ObjectStore.queryByYonQL(applySQL);
    //查询客户信息
    var kehuid = tempapply[0].kehu;
    var infoSQL = "select kehuming,bianma,dizhi,guhua,lianxiren,dianhua from GT39251AT11.GT39251AT11.custominfch where id = " + kehuid;
    var tempinfo = ObjectStore.queryByYonQL(infoSQL);
    //发送消息
    var uspaceReceiver = [tempapply[0].creator];
    var channels = ["uspace"];
    var title = "客户信息";
    var content = "您申请的客户信息如下";
    content += "<br/>客户名" + tempinfo[0].kehuming;
    content += "<br/>编码" + tempinfo[0].bianma;
    content += "<br/>地址" + tempinfo[0].dizhi;
    content += "<br/>固话" + tempinfo[0].guhua;
    content += "<br/>联系人" + tempinfo[0].lianxiren;
    content += "<br/>电话" + tempinfo[0].dianhua;
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