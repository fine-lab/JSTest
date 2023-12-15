let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    throw new Error(processStartMessage);
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let businessIdArr = activityEndMessage.businessKey.split("_");
    var sql = "select name from AT17038D2E09100008.AT17038D2E09100008.person_applyee_test";
    var res = ObjectStore.queryByYonQL(sql);
    let name = "";
    for (var j = 0; j < res.length; j++) {
      name = res[j].name;
    }
    let body = {
      data: {
        id: "youridHere",
        staffVODefine: {
          define1: "23344",
          define2: "true",
          id: "youridHere"
        }
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "HRED", JSON.stringify(body));
    throw new Error(JSON.stringify(apiResponse));
  }
}
exports({ entryPoint: WorkflowAPIHandler });