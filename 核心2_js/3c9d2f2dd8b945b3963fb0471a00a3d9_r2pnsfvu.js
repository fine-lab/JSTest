let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
const FLOW_NAME = "赊销";
// 仅失败时发送通知
const SEND_MESSAGE_FAILED_ONLY = false;
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
function hanlerUserDef(processStateChangeMessage) {
  let user = JSON.parse(AppContext()).currentUser;
  let res = processStateChangeMessage.businessKey.split("_");
  let id = res[1];
  var url = "";
  var errMsg = "";
  let pushUrl = `https://api.diwork.com/${user.tenantId}/ExternalCoordination/preorder/pushBills`;
  let withdrawnNCBillUrl = `https://api.diwork.com/${user.tenantId}/ExternalCoordination/preorder/withdrawnNCBill`;
  var tip = "";
  if (processStateChangeMessage["processActionType"] == "withdraw") {
    tip = "撤回";
    url = withdrawnNCBillUrl;
  } else if (processStateChangeMessage["processActionType"] == "suspension") {
    tip = "驳回";
    url = withdrawnNCBillUrl;
  } else if (processStateChangeMessage["processEnd"] === true) {
    tip = "审批";
    url = pushUrl;
  } else {
    // 未知的操作
    errMsg = `未知的审批流动作。联系开发者！`;
  }
  let json = ublinker(
    "post",
    url,
    HEADER_STRING,
    JSON.stringify({
      pushIds: [id]
    })
  );
  var gatewayObj = JSON.parse(json);
  if (gatewayObj.code == 200) {
    var { ncRes = {}, idCodeMapping = {} } = gatewayObj.data;
    var ncStr = ncRes.data;
    var ncObj = JSON.parse(ncStr) || {};
    if (ncObj["code"] != 200) {
      if (ncObj["data"] && ncObj["data"].length > 0) {
        ncObj.data.map(function (v) {
          errMsg += v.message || "";
        });
      }
    }
    if (!errMsg && ncObj["code"] != 200) {
      errMsg = `NC处理单据[${idCodeMapping[id]}]出错。内容为[${ncObj.message}]。`;
    }
  } else {
    errMsg = `${tip}网关处理失败。原因为：${gatewayObj.message}`;
  }
  let execSuccess = gatewayObj.code == 200 && ncObj["code"] == 200;
  userSend({
    tip,
    userMail: processStateChangeMessage.userMail,
    execSuccess,
    tenantId: user.tenantId,
    content: errMsg || `${tip}单据[${idCodeMapping[id]}]操作成功，业务提醒：${ncObj.message}`,
    defObj: {
      gatewayCode: gatewayObj.code,
      ncObjCode: ncObj["code"] || 2333,
      ncObjMessage: ncObj.message,
      errMsg,
      idCodeMapping,
      execSuccess,
      billId: id
    }
  });
}
function userSend(info) {
  let { tip, execSuccess, tenantId, content, defObj, userMail } = info;
  if (execSuccess && SEND_MESSAGE_FAILED_ONLY === true) {
    return;
  }
  let messageInfo = {
    sysId: "yourIdHere",
    tenantId: tenantId,
    uspaceReceiver: ["9d67ef9e-c746-42dd-9d7d-4a1a9a9df60c"],
    channels: ["uspace"],
    subject: `${FLOW_NAME}-${tip}`,
    content: content
  };
  var spacemessage = sendMessage(messageInfo);
}
exports({ entryPoint: WorkflowAPIHandler });