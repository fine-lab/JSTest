let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select xunshinarong from AT186845D616E80006.AT186845D616E80006.xsrwzx666 where id = '" + businessId + "'";
    let res1 = ObjectStore.queryByYonQL(sql);
    let res11 = res1[0];
    var res12 = res11.xunshinarong;
    let sql2 = "select id,xunshinarong,xcxschs666_id from AT186845D616E80006.AT186845D616E80006.xsxsb666 where xunshinarong = '" + res12 + "'";
    let res2 = ObjectStore.queryByYonQL(sql2);
    let res3 = res2[0];
    var object31 = { id: res3.xcxschs666_id, compositions: [{ name: "xsxsb666List" }] };
    var res31 = ObjectStore.selectById("AT186845D616E80006.AT186845D616E80006.xcxschs666", object31);
    //加1
    var wanchengshu1 = res31.zwancheng + 1;
    var zongshu1 = 2; // res31.rwzongshu;
    var object3;
    if (zongshu1 == wanchengshu1) {
      object3 = { id: res3.xcxschs666_id, zwancheng: wanchengshu1, new24: "已全部完成", xsxsb666List: [{ hasDefaultInit: true, id: res3.id, zhuangtai1: "合格", _status: "Update" }] };
    } else {
      object3 = { id: res3.xcxschs666_id, zwancheng: wanchengshu1, xsxsb666List: [{ hasDefaultInit: true, id: res3.id, zhuangtai1: "合格", _status: "Update" }] };
    }
    var res5 = ObjectStore.updateById("AT186845D616E80006.AT186845D616E80006.xcxschs666", object3, "xcxschs666");
    if (zongshu1 == wanchengshu1) {
      //自动执行 批量审批
      //获取存储的 businessId
      var object4 = { id: "youridHere" };
      var res4 = ObjectStore.selectById("AT186845D616E80006.AT186845D616E80006.test00101", object4);
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
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });