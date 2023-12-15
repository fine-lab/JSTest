let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    //查询组织信息
    let func1 = extrequire("GT30661AT5.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      appId: "0",
      content: "快到碗里来",
      highlight: "碗里",
      yhtUserIds: ["ea764084-6c48-43b7-8ba7-62a47a767034"],
      tenantId: "yourIdHere",
      sendScope: "list",
      title: "你好消息",
      esnData: {
      }
    };
    var userInfos = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //查询组织信息
    let func1 = extrequire("GT30661AT5.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      appId: "0",
      content: "快到碗里来",
      highlight: "碗里",
      yhtUserIds: ["ea764084-6c48-43b7-8ba7-62a47a767034"],
      tenantId: "yourIdHere",
      sendScope: "list",
      title: "你好消息",
      esnData: {
      }
    };
    var userInfos = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    let func = extrequire("GT30661AT5.backDefaultGroup.ProcessEnd");
    let res = func.execute(processStateChangeMessage);
    return res;
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });