let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
function formatTime(data, format) {
  var o = {
    "M+": data.getMonth() + 1, //month
    "d+": data.getDate(), //day
    "h+": data.getHours(), //hour
    "m+": data.getMinutes(), //minute
    "s+": data.getSeconds(), //second
    "q+": Math.floor((data.getMonth() + 3) / 3), //quarter
    "N+": data.getHours() < 12 ? "am" : "pm", //ampm
    S: data.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let now = new Date().getTime() + 28800000; //加时区
    let timestamp = formatTime(new Date(now), "yyyy-MM-dd hh:mm:ss");
    var object = { id: businessId, shenheshijian: timestamp };
    var res = ObjectStore.updateById("GT82926AT1.GT82926AT1.qyd", object, "8b0c2903");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });