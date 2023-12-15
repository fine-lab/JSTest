let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object4 = { id: "youridHere" };
    var res4 = ObjectStore.selectById("AT1840871816E00004.AT1840871816E00004.spdebug", object4);
    let bodyTodo = {
      processBusinessKeyIds: [res4.new3],
      source: "developplatform",
      assignee: "0904154e-6935-4c1d-b31c-cb8d3d35e3ba"
    };
    let url1 =
      "https://www.example.com/";
    let apiResponse1 = openLinker("POST", url1, "AT1840871816E00004", JSON.stringify(bodyTodo));
    var tId = JSON.parse(apiResponse1).data.data[0].id;
    let bodyApproval = {
      appSource: "developplatform",
      bpmTaskActions: [
        {
          bpmTaskActionRequest: {
            action: "complete",
            returnExecutions: false,
            returnHistoricProcessInstance: false,
            returnHistoricTasks: false,
            returnVariables: false,
            returnTasks: false
          },
          taskId: tId, //"783cd531-3caf-11ee-a7d9-4289ba297b81",
          view: "同意"
        }
      ]
    };
    let url2 =
      "https://www.example.com/";
    let apiResponse = openLinker("POST", url2, "AT1840871816E00004", JSON.stringify(bodyApproval));
    //查询AT1840871816E00004.AT1840871816E00004.xschs001
    //根据任务字段查策划详情id
    //返回实体的数据
    //更新
    return {};
  }
}
exports({ entryPoint: MyTrigger });