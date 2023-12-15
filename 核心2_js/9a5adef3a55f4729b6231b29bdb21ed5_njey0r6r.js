let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var taskId = request.taskIds;
    var bpmTaskActions = [];
    let bpmTaskActionRequest = { action: "complete", returnExecutions: false, returnHistoricProcessInstance: false, returnHistoricTasks: false, returnVariables: false, returnTasks: false };
    for (var i = 0; i < taskId.length; i++) {
      let bpmTaskAction = { view: "同意", taskId: taskId[i], bpmTaskActionRequest: bpmTaskActionRequest };
      bpmTaskActions.push(bpmTaskAction);
    }
    let body = { appSource: "RBSM", bpmTaskActions: bpmTaskActions };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT99731AT2", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });