let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let temp = 1;
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    // 获取表单id
    let applyid = replace(processStateChangeMessage.businessKey, "c74a51c2_", "");
    // 查询申请的表单
    let sqlstr = "select kehu,creator from 	GT38600AT3.GT38600AT3.applycustom1 where id =" + applyid;
    var applytemp = ObjectStore.queryByYonQL(sqlstr);
    //查询客户信息表单
    var kehuid = applytemp[0].kehu;
    let kehusql = "select kehuming from GT38600AT3.GT38600AT3.custominfo1 where id =" + kehuid;
    let kehutemp = ObjectStore.queryByYonQL(kehusql, "developplatform");
    var uspaceReceiver = [applytemp[0].creator];
    var channels = ["uspace"];
    var title = "客户信息";
    var content = "您申请查看的客户信息如下：";
    content += "<br/>客户名：" + kehutemp[0].kehuming;
    content += "<br/>编  号：" + kehutemp[0].kehubianma;
    content += "<br/>地  址：" + kehutemp[0].kehudizhi;
    content += "<br/>固  话：" + kehutemp[0].guhua;
    content += "<br/>联系人：" + kehutemp[0].lianxiren;
    content += "<br/>电  话：" + kehutemp[0].dianhua;
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
  activityComplete(activityEndMessage) {
    let temp = 1;
  }
}
exports({ entryPoint: WorkflowAPIHandler });