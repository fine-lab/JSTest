let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 勋章信息
    let medals = request.medals;
    // 人员列表
    let staffList = request.staffList;
    // 勋章颁发记录数组
    let recordObjs = [];
    for (var i = 0; i < staffList.length; i++) {
      let staff = staffList[i];
      let recordObj = {};
      // 勋章名称
      recordObj["medal_name"] = medals.id;
      // 受奖人
      recordObj["staff"] = staff.id;
      // 部门
      recordObj["dept"] = medals.applicable_dept;
      // 价值观类型
      recordObj["values_manage"] = medals.values_type;
      // 价值观分值
      recordObj["values_val"] = medals.values_val;
      // 勋章积分
      recordObj["medal_score"] = medals.medal_score;
      recordObjs.push(recordObj);
    }
    var res = ObjectStore.insertBatch("AT165369EC09000003.AT165369EC09000003.award_record_medals", recordObjs, "2f01254a");
    return { result: "0", message: "勋章颁发记录更新成功！" };
  }
}
exports({ entryPoint: MyAPIHandler });