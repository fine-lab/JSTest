let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    //业务系统员工id
    var userid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      userid = userData[currentUser.id].id; //员工id
      // 增加当前员工（即承揽商的任职部门）
      let apiResponse = apiman(
        "post",
        "https://www.example.com/",
        {
          data: {
            code: userData[currentUser.id].code,
            name: userData[currentUser.id].name,
            mobile: userData[currentUser.id].mobile,
            _status: "Update",
            mainJobList: [
              {
                org_id: "youridHere",
                dept_id: "youridHere",
                begindate: new Date(),
                _status: "Insert"
              }
            ]
          }
        },
        null
      );
    } else {
      throw new Error("获取员工信息异常");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });