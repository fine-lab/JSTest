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
    let queryUrl = DOMAIN + "/yonbip/sd/voucherorder/detail";
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail"; //查询人员
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr.length > 2 ? businessIdArr[businessIdArr.length - 1] : businessIdArr[1];
    let sqlStr = "select distinct extendcgry from voucher.order.Order inner join voucher.order.OrderDetail b on id = b.orderId " + " where id = '" + businessId + "'";
    let apiResponse = openLinker("GET", queryUrl + "?id=" + businessId, APPCODE, JSON.stringify({ id: businessId }));
    let resDataObj = JSON.parse(apiResponse).data;
    let orderDetails = resDataObj.orderDetails;
    let userList = [];
    let piNameList = [];
    for (var i in orderDetails) {
      let orderDetailObj = orderDetails[i];
      let extendcgry = orderDetailObj.extendcgry;
      let piName = "";
      if (orderDetailObj.bodyItem != undefined && orderDetailObj.bodyItem != null) {
        if (orderDetailObj.bodyItem.define1_name != undefined) {
          piName = orderDetailObj.bodyItem.define1_name;
        }
      }
      if (extendcgry != undefined && extendcgry != null && extendcgry != "") {
        let isExists = false;
        for (var j in userList) {
          if (userList[j] == extendcgry) {
            isExists = true;
            break;
          }
        }
        if (!isExists) {
          userList.push(extendcgry);
        }
      }
      if (piName != "") {
        let piExists = false;
        for (var j in piNameList) {
          if (piNameList[j] == piName) {
            piExists = true;
            break;
          }
        }
        if (!piExists) {
          piNameList.push(piName);
        }
      }
    }
    if (userList.length == 0) {
      return;
    }
    let billCode = resDataObj.code;
    if (resDataObj.verifystate == 2) {
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
            JSON.stringify({ LogToDB: true, logModule: 9, description: "销售订单审核-获取用户信息异常", reqt: extendcgry, resp: corpContactRes, usrName: usrName })
          );
          continue;
        }
        let userId = corpContactObjs.data.userId;
        uspaceReceiver.push(userId);
      }
      let piNames = piNameList.length > 0 ? "财务PI:" + piNameList.toString() : "";
      var channels = ["uspace"];
      var title = "销售订单[" + billCode + "]已审批通过";
      var content = "销售订单[" + billCode + "]审批通过,进入采购环节，详细信息请查看该单据!" + piNames;
      let url = "https://www.example.com/" + businessId + "?domainKey=udinghuo";
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: tid,
        uspaceReceiver: uspaceReceiver,
        receiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        messageType: "createToDo",
        createToDoExt: { webUrl: url, url: url, mUrl: url }
      };
      var result = sendMessage(messageInfo);
      openLinker(
        "POST",
        logToDBUrl,
        APPCODE,
        JSON.stringify({ LogToDB: true, logModule: 9, description: "销售订单审核后发信息", reqt: JSON.stringify(messageInfo), resp: JSON.stringify(result), usrName: usrName })
      );
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });