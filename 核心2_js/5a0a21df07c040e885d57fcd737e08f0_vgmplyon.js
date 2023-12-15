let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 勋章信息
    let medals = request.medals;
    // 人员列表
    let staffList = request.staffList;
    // 部门id
    let deptId = medals.applicable_dept;
    // 年份
    let nyear = request.nyear;
    // 月份
    let nmonth = request.nmonth;
    // 人员数量
    let staffNum = staffList.length;
    // 勋章积分
    let medalsScore = medals.medal_score;
    // 总发放积分
    let totalScore = staffNum * medalsScore;
    // 根据部门和年份月份查询部门预算信息
    var budgets = ObjectStore.queryByYonQL(
      "select * from AT165369EC09000003.AT165369EC09000003.dept_budget where dept = " + deptId + ' and year = "' + nyear + '" and month = "' + nmonth + '" order by pubts desc'
    );
    if (!budgets || budgets.length <= 0) {
      return { result: "1", message: "查无此部门的预算数据，无法颁发勋章" };
    }
    let budget = budgets[0];
    let isbudget = budget.is_budget;
    if (!isbudget) {
      return { result: "1", message: "部门非预算组织，无法颁发勋章" };
    }
    // 部门当前积分
    let nowScore = budget.score;
    // 剩余积分
    let remainderScore = nowScore - totalScore;
    if (remainderScore < 0) {
      return { result: "1", message: "部门积分不足，无法颁发勋章。当前积分为：" + nowScore + ",颁发积分为:" + totalScore };
    }
    let retObj = {};
    retObj["budget"] = budget;
    retObj["totalScore"] = totalScore;
    retObj["remainderScore"] = remainderScore;
    return { result: "0", message: "校验通过！", retObj: retObj };
  }
}
exports({ entryPoint: MyAPIHandler });