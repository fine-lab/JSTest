let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let LogToDB = true;
    let APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail"; //查询人员
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr.length > 2 ? businessIdArr[businessIdArr.length - 1] : businessIdArr[1];
    let sqlStr = "select *,(select * from PHQGD_caigourenyuanList) as caigourenyuanList from GT3734AT5.GT3734AT5.PHQGD" + " where id = '" + businessId + "'";
    var queryRst = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "铺货请购-审批流程完成:" + businessId, reqt: JSON.stringify(processStateChangeMessage), resp: JSON.stringify(queryRst) })
    );
    let userList = [];
    let rstObj = queryRst[0];
    for (var i in rstObj.caigourenyuanList) {
      let caigouRYObj = rstObj.caigourenyuanList[i];
      userList.push(caigouRYObj.caigourenyuan);
    }
    if (userList.length == 0) {
      return;
    }
    let billCode = rstObj.code;
    if (rstObj.verifystate == 2) {
      //审核态
      var uspaceReceiver = [];
      for (var j in userList) {
        let extendcgry = userList[j];
        let corpContactRes = openLinker("POST", staffUrl, APPCODE, JSON.stringify({ id: extendcgry }));
        let corpContactObjs = JSON.parse(corpContactRes);
        if (corpContactObjs.code != 200) {
          openLinker(
            "POST",
            logToDBUrl,
            APPCODE,
            JSON.stringify({ LogToDB: true, logModule: 9, description: "铺货请购单审核-获取用户信息异常", reqt: extendcgry, resp: corpContactRes, usrName: usrName })
          );
          continue;
        }
        let userId = corpContactObjs.data.userId;
        uspaceReceiver.push(userId);
      }
      var channels = ["uspace"];
      var title = "铺货请购单[" + billCode + "]已审批通过";
      var content = "铺货请购单[" + billCode + "]审批通过,进入采购环节，详细信息请查看该单据!";
      let url = "https://www.example.com/" + businessId + "?domainKey=developplatform";
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: tid,
        uspaceReceiver: uspaceReceiver,
        receiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        createToDoExt: { webUrl: url, url: url, mUrl: url },
        messageType: "createToDo" //消息类型，支持notice(通知)和createToDo(待办)和prewarn(预警)
      };
      var result = sendMessage(messageInfo);
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });