let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //判定当前月是否有人进行了Depart+巡检GT43053AT3.backDefaultGroup.MonNoSelCheckV1_1
    //查询当前所有的部门信息
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const selectDept = 'select deptId,deptName from GT43053AT3.GT43053AT3.synthDeptGradeV1_2 where dr ="0" ';
    var depts = ObjectStore.queryByYonQL(selectDept);
    let deptMonthFlags = [];
    for (let i = 0; i < depts.length; i++) {
      deptMonthFlags.push({
        deptId: depts[i].deptId,
        deptName: depts[i].deptName,
        flag: false
      });
    }
    var newStatus = ObjectStore.queryByYonQL('select Finderdepartment,createTime,Priority from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where Inspectioncategory="4"');
    //遍历查询过来的结果,Depart+巡检:2396427379413248;Section巡检:2396426934030592;工程师巡检：2396426534588672
    let mesLog = "";
    for (let i = 0; i < newStatus.length; i++) {
      let item = newStatus[i];
      for (let j = 0; j < deptMonthFlags.length; j++) {
        if (item.Finderdepartment == deptMonthFlags[j].deptId) {
          if (!deptMonthFlags[j].flag) {
            mesLog = "执行了";
            //判断部门是否有在两周的时间内进行自主巡检
            var tempDate = new Date(item.createTime);
            var tempYear = tempDate.getFullYear();
            var tempMonth = tempDate.getMonth();
            deptMonthFlags[j].flag = tempYear == currentYear && tempMonth == currentMonth && item.Priority == "2396427379413248";
          }
        }
      }
    }
    //组装数据进行计分变更
    let monthInsertData = [];
    for (let d = 0; d < deptMonthFlags.length; d++) {
      if (deptMonthFlags[d].flag == false) {
        monthInsertData.push({
          deptId: deptMonthFlags[d].deptId,
          deptName: deptMonthFlags[d].deptName,
          itemCode: "无",
          operationGrade: -5,
          operationType: "一月内无Depart+自主巡检",
          objectName: "无",
          objectCode: "无",
          finderName: "无",
          finderDept: "无",
          finderName: "无",
          finderDept: "无"
        });
      }
    }
    var res1 = ObjectStore.insert("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", monthInsertData, "fe940bb1");
    //跟新部门积分，组装跟新数据
    let deptGradeUpdateMonth = [];
    for (let h = 0; h < monthInsertData.length; h++) {
      var item = monthInsertData[h];
      var condtionObject = { deptName: item.deptName };
      var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade + item.operationGrade;
      deptGradeUpdateMonth.push({ id: curDeptRiskGrade.id, deptGrade: resultGrade });
    }
    var res4 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdateMonth, "c5200c80");
    //自定义日志处理
    var object = {
      logType: "自主巡检定时任务",
      mes5: JSON.stringify(deptGradeUpdateMonth)
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLog", object, "1d7e2886");
    return {};
  }
}
exports({ entryPoint: MyTrigger });