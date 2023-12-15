let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //流程结束，将客户信息发送给申请人
    //获取表单ID，businessKey的格式为表单编码_唯一标识
    var applyid = replace(processStateChangeMessage.businessKey, "89b8610d_", "");
    //查询申请表单的关联客户，及发起人
    var sqlstr = "select kehu,creator from GT39166AT9.GT39166AT9.applycustomc where id = " + applyid;
    var tempapply = ObjectStore.ObjectStore.queryByYonQL(sqlstr);
    // 获取客户信息数据的唯一标识
    var kehuid = tempapply[0].kehu;
    //查询客户信息表
    var kehusql = "select kehuming,bianma,dizhi,guhua,lianxiren,dianhua from GT39166AT9.GT39166AT9.custominfoc where id =" + kehuid;
    var custominfo = ObjectStore.ObjectStore.queryByYonQL(sqlstr);
    //组装消息内容
    var uspaceReceiver = [tempapply[0].creator];
    var channels = ["uspace"];
    var title = "客户信息";
    var content = "您申请查看的客户信息如下：";
    content += "</br>客户名：" + custominfo[0].kehuming;
    content += "</br>编  号：" + custominfo[0].bianma;
    content += "</br>地  址：" + custominfo[0].dizhi;
    content += "</br>固  话：" + custominfo[0].guhua;
    content += "</br>联系人：" + custominfo[0].lianxiren;
    content += "</br>电话：" + custominfo[0].电话;
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