let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var processInstId = processStateChangeMessage.processInstId;
    var indexid = processStateChangeMessage.businessKey.indexOf("_");
    var businessKey = processStateChangeMessage.businessKey.substring(indexid + 1);
    function addMonth(date, months) {
      if (months == undefined || months == "") months = 6;
      var date = new Date(date);
      date.setMonth(date.getMonth() + months);
      return date;
    }
    function format(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
    //更新有效期
    var yxqdate = addMonth(new Date(), 6);
    var yxq = format(yxqdate);
    var object2 = { id: businessKey, youxiaoqi: yxq };
    var res2 = ObjectStore.updateById("GT20875AT13.GT20875AT13.GWZJSQD", object2);
    //实体查询
    var object = { id: businessKey };
    var res = ObjectStore.selectById("GT20875AT13.GT20875AT13.GWZJSQD", object);
    var pompBody = {
      yhtUserId: res.creator,
      code: res.code,
      name: res.shenqingren,
      idCard: res.shenfenzhenghaoma,
      certMode: 0,
      certLevel: res.ZJDJ,
      busiSerial: res.shenqingxulie,
      direction: res.shenqingfangxiang,
      productLine: res.cpxcode,
      domain: res.lingyubianma,
      industry: res.xingyebianma,
      startTime: format(new Date()),
      endTime: yxq
    };
    //调用第三方接口推送数据
    var resultRes = {};
    var hmd_contenttype = "application/json;charset=UTF-8";
    let token_url = "https://www.example.com/" + res.creator;
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(pompBody));
      resultRes = JSON.parse(resultRet);
    }
    return resultRes;
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });