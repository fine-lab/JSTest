//多条日清时，传paramId、ymd、bugKey参数，并把aid置为空
//单条日清时，仅需传aid
//获取浏览器参数
function getParams(key) {
  let search = window.location.search.replace(/^\?/, "");
  let pairs = search.split("&");
  let paramsMap = pairs
    .map((pair) => {
      let [key, value] = pair.split("=");
      return [decodeURIComponent(key), decodeURIComponent(value)];
    })
    .reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
  return paramsMap[key] || "";
}
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
//页面初始化后执行动作
viewModel.on("afterLoadData", function (data) {
  // 返回值详情--页面初始化
  let code = getParams("JIRACode"); //获取参数，调用后端函数获取处理过后的字符串
  if (code != "") {
    //调用后端接口，将pm系统返回值填入页面
    cb.rest.invokeFunction("AT16F67D6A08C80004.Back.getPM", { jirakey: code }, function (err, res) {
      debugger;
      viewModel.get("ruleTitle").setValue(res.JIRA_res.ruleTitle);
      viewModel.get("paramId").setValue(res.JIRA_res.paramId);
      viewModel.get("JiraKey").setValue(res.JIRA_res.bugKey);
      viewModel.get("JiraKeyName").setValue(res.JIRA_res.bugSummary);
      viewModel.get("JiraKeyStatus").setValue(res.JIRA_res.statusName);
      viewModel.get("JiraXM").setValue(res.JIRA_res.projectName);
      viewModel.get("jbr").setValue(res.JIRA_res.assigneeName);
      viewModel.get("jbrOrg1").setValue(res.JIRA_res.psnDeptl1);
      viewModel.get("jbrOrg2").setValue(res.JIRA_res.psnDeptl2);
      viewModel.get("jbrOrg3").setValue(res.JIRA_res.psnDeptl3);
      viewModel.get("rqDate").setValue(res.JIRA_res.ymd);
      viewModel.get("affectVerName").setValue(res.JIRA_res.affectVerName);
      viewModel.get("reporter").setValue(res.JIRA_res.reporterName);
      viewModel.get("link").setValue({ linkText: "https://www.example.com/" + res.JIRA_res.bugKey, linkAddress: "https://www.example.com/" + res.JIRA_res.bugKey });
    });
  }
});
//保存前校验，日清申请日期的范围
viewModel.on("beforeSave", function (args) {
  debugger;
  //日清开始日期不能超过日清日期的2天
  days1 = parseInt((Date.parse(viewModel.get("rqDate").getValue()) - Date.parse(viewModel.get("rqStartDate").getValue())) / (1000 * 60 * 60 * 24)); //时间戳相减，然后除以天数
  //日清结束日期不能超过日清日期的5天
  days2 = parseInt((Date.parse(viewModel.get("rqEndDate").getValue()) - Date.parse(viewModel.get("rqDate").getValue())) / (1000 * 60 * 60 * 24)); //时间戳相减，然后除以天数
  if (days1 >= 2 || days1 < 0) {
    alert("日清申诉开始日期不能在日清日期前2天！");
    return false;
  } else if (days2 >= 5 || days2 < 0) {
    alert("日清申诉结束日期不能超过日清日期5天！");
    return false;
  }
});