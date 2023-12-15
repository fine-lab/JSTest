let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 勋章信息
    let medals = request.medals;
    // 人员列表
    let staffList = request.staffList;
    // 年份
    let nyear = request.nyear;
    // 月份
    let nmonth = request.nmonth;
    let param = {};
    param["medals"] = medals;
    param["staffList"] = staffList;
    param["nyear"] = nyear;
    param["nmonth"] = nmonth;
    let func = extrequire("AT165369EC09000003.apifunc.CheckScore");
    let checkres = func.execute(param);
    if (checkres.result != 0) {
      return checkres;
    }
    let retObj = checkres.retObj;
    let budget = retObj.budget;
    let totalScore = retObj.totalScore;
    let remainderScore = retObj.remainderScore;
    // 更新主表
    var hObj = {};
    hObj["id"] = budget.id;
    hObj["score"] = remainderScore;
    hObj["month_consume"] = (budget.month_consume ? budget.month_consume : 0) + totalScore;
    ObjectStore.updateById("AT165369EC09000003.AT165369EC09000003.dept_budget", hObj, "6117c746");
    // 更新子表
    let bObjs = [];
    for (var i = 0; i < staffList.length; i++) {
      let staff = staffList[i];
      let staffId = staff.id;
      let staffName = staff.name;
      let bObj = {};
      bObj["dept_budget_id"] = budget.id;
      bObj["change_type"] = "4";
      bObj["change_value"] = medals.medal_score * -1;
      bObj["change_memo"] = "给员工【" + staffName + "】发放积分。";
      bObjs.push(bObj);
    }
    var res = ObjectStore.insertBatch("AT165369EC09000003.AT165369EC09000003.dept_budget_b", bObjs, "018aad1d");
    return { result: "0", message: "部门预算信息更新成功！" };
  }
}
exports({ entryPoint: MyAPIHandler });