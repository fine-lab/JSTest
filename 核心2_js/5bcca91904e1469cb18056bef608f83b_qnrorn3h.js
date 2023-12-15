let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //日期转格式化字符串方法
    function dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
    //从流程数据中获取单据id
    let id = eval(split(processStateChangeMessage.businessKey, "_", 2))[1];
    //从流程数据中获取流程结束状态
    let processEnd = processStateChangeMessage.processEnd;
    if (processEnd) {
      processEnd = 1;
    } else {
      processEnd = 0;
    }
    //根据单据id从实体中查询对应的aid
    var res = ObjectStore.queryByYonQL("select aid,rqDate,rqStartDate,rqEndDate,JiraKey,paramId from AT16F67D6A08C80004.AT16F67D6A08C80004.rjss where id=" + id);
    let aid = res[0].aid;
    let rqDate = res[0].rqDate;
    let JiraKey = res[0].JiraKey;
    let ruleTitle = res[0].paramId;
    let ymd = substring(rqDate, 0, 10);
    let rqStartDate = res[0].rqStartDate;
    let rqEndDate = res[0].rqEndDate;
    let approvalId = id;
    let days = 1;
    //开始日清日期
    let dDate = new Date(rqDate);
    //传入pm的参数
    let body = [];
    if (rqStartDate != null) {
      dDate = new Date(rqStartDate);
    }
    if (rqStartDate != null && rqEndDate != null) {
      //获取结束与开始的日期差
      days = parseInt((Date.parse(rqEndDate) - Date.parse(rqStartDate)) / (1000 * 60 * 60 * 24)); //时间戳相减，然后除以天数
    }
    //拼接多条日清记录
    for (var i = 0; i <= days; i++) {
      var jsonstr = {};
      jsonstr.ymd = dateToString(dDate);
      jsonstr.aid = "";
      jsonstr.invalid = processEnd;
      jsonstr.bugKey = JiraKey;
      jsonstr.ruleTitle = ruleTitle;
      jsonstr.approvalId = approvalId;
      body[i] = jsonstr;
      dDate.setDate(dDate.getDate() + 1);
    }
    //调试用-----将结果插入测试实体
    var object = { new2: eval(res)[0].aid, new3: parseInt(days), new4: rqStartDate, new5: parseInt(Date.parse(rqEndDate)), new6: dDate, new7: JSON.stringify(body) };
    var res = ObjectStore.insert("AT16F67D6A08C80004.AT16F67D6A08C80004.wrqjira", object, "ybc258d728List");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });