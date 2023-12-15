let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let businessIdArr = activityEndMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select xiangmumingchen,gongzuodidian from AT1840871816E00004.AT1840871816E00004.xsrwzx001 where id = '" + businessId + "'";
    let res1 = ObjectStore.queryByYonQL(sql);
    let res11 = res1[0];
    var res12 = res11.gongzuodidian;
    let sql2 = "select id,xunshinarong,xschs001_id from AT1840871816E00004.AT1840871816E00004.xsxx001 where zhuanyemingchen = '" + res12 + "'";
    let res2 = ObjectStore.queryByYonQL(sql2);
    let res3 = res2[0];
    var object31 = { id: res3.xschs001_id, compositions: [{ name: "xsxx001List" }] };
    var res31 = ObjectStore.selectById("AT1840871816E00004.AT1840871816E00004.xschs001", object31);
    //加1
    var wanchengshu1 = res31.wanchengshu + 1;
    var zongshu1 = res31.zongshu;
    var object3;
    if (zongshu1 == wanchengshu1) {
      object3 = { id: res3.xschs001_id, wanchengshu: wanchengshu1, new4: "已全部完成", xsxx001List: [{ hasDefaultInit: true, id: res3.id, zhuangtai: "已完成", _status: "Update" }] };
    }
    else {
      object3 = { id: res3.xschs001_id, wanchengshu: wanchengshu1, xsxx001List: [{ hasDefaultInit: true, id: res3.id, zhuangtai: "已完成", _status: "Update" }] };
    }
    var res5 = ObjectStore.updateById("AT1840871816E00004.AT1840871816E00004.xschs001", object3, "xschs001");
    if (zongshu1 == wanchengshu1) {
      //自动执行 批量审批
      //获取存储的 businessId
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
    }
  }
}
exports({ entryPoint: WorkflowAPIHandler });