let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //判定多长时间没有人做自主巡检了;当周为执行自主巡检每次扣2分
    const dayValue = 86400000;
    let currentTime = new Date().getTime();
    let oneWeekBefore = currentTime - dayValue * 7;
    let towWeekBefore = currentTime - dayValue * 14;
    //查询当前所有的部门信息
    const selectDept = 'select deptId,deptName from GT43053AT3.GT43053AT3.synthDeptGradeV1_2 where dr ="0" ';
    var depts = ObjectStore.queryByYonQL(selectDept);
    //初始化部门未巡检标记
    let deptOneWeekFlags = [];
    let deptTowWeekFlags = [];
    for (let i = 0; i < depts.length; i++) {
      deptOneWeekFlags.push({
        deptId: depts[i].deptId,
        deptName: depts[i].deptName,
        flag: false
      });
      deptTowWeekFlags.push({
        deptId: depts[i].deptId,
        deptName: depts[i].deptName,
        flag: false
      });
    }
    //获取当前多维度积分表中的数据信息
    var newStatus = ObjectStore.queryByYonQL('select Finderdepartment,createTime,Priority from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where Inspectioncategory="4"');
    //遍历查询过来的结果,Depart+巡检:2396427379413248;Section巡检:2396426934030592;工程师巡检：2396426534588672
    let mesFlag = "";
    for (let i = 0; i < newStatus.length; i++) {
      let item = newStatus[i];
      for (let j = 0; j < deptOneWeekFlags.length; j++) {
        if (item.Finderdepartment == deptOneWeekFlags[j].deptId) {
          if (!deptOneWeekFlags[j].flag) {
            //判断部门是否有在一周的时间内进行自主巡检
            deptOneWeekFlags[j].flag = new Date(item.createTime).getTime() < currentTime && new Date(item.createTime).getTime() >= oneWeekBefore;
          }
          if (!deptTowWeekFlags[j].flag) {
            //判断部门是否有在两周的时间内进行自主巡检
            deptTowWeekFlags[j].flag = new Date(item.createTime).getTime() < currentTime && new Date(item.createTime).getTime() >= oneWeekBefore && item.Priority == "2396426934030592";
          }
        }
      }
    }
    //组装数据进行计分变更
    let oneWeekInsertData = [];
    let towWeekInsertData = [];
    for (let d = 0; d < deptOneWeekFlags.length; d++) {
      if (deptOneWeekFlags[d].flag == false) {
        oneWeekInsertData.push({
          deptId: deptOneWeekFlags[d].deptId,
          deptName: deptOneWeekFlags[d].deptName,
          itemCode: "无",
          operationGrade: -2,
          operationType: "一周无自主巡检",
          objectName: "无",
          objectCode: "无",
          finderName: "无",
          finderDept: "无",
          finderName: "无",
          finderDept: "无"
        });
      }
      if (deptTowWeekFlags[d].flag == false) {
        towWeekInsertData.push({
          deptId: deptTowWeekFlags[d].deptId,
          deptName: deptTowWeekFlags[d].deptName,
          itemCode: "无",
          operationGrade: -3,
          operationType: "两周Section未带队巡检",
          objectName: "无",
          objectCode: "无",
          finderName: "无",
          finderDept: "无",
          finderName: "无",
          finderDept: "无"
        });
      }
    }
    var res1 = ObjectStore.insert("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", oneWeekInsertData, "fe940bb1");
    var res2 = ObjectStore.insert("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", towWeekInsertData, "fe940bb1");
    //跟新部门积分，组装跟新数据
    let deptGradeUpdateOne = [];
    for (let h = 0; h < oneWeekInsertData.length; h++) {
      var item = oneWeekInsertData[h];
      var condtionObject = { deptName: item.deptName };
      var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade + item.operationGrade;
      deptGradeUpdateOne.push({ id: curDeptRiskGrade.id, deptGrade: resultGrade });
    }
    let deptGradeUpdateTow = [];
    for (let h = 0; h < towWeekInsertData.length; h++) {
      var item = towWeekInsertData[h];
      var condtionObject = { deptName: item.deptName };
      var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade + item.operationGrade;
      deptGradeUpdateTow.push({ id: curDeptRiskGrade.id, deptGrade: resultGrade });
    }
    var res4 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdateTow, "c5200c80");
    var res5 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdateTow, "c5200c80");
    //自定义日志处理
    var object = {
      logType: "自主巡检定时任务",
      mes5: JSON.stringify(deptTowWeekFlags)
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLog", object, "1d7e2886");
    return {};
  }
}
exports({ entryPoint: MyTrigger });