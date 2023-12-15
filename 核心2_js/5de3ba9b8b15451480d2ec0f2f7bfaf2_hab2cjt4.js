let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const dayValue = 86400000;
    let currentTime = new Date().getTime();
    let DaysBefore = currentTime - dayValue * 30;
    //每天定时任务执行一次，对自主隐患排查中已经超过三十天的扣分进行恢复
    var legalBills = ObjectStore.queryByYonQL('select operationGrade,deptId,deptName,id,createTime from GT43053AT3.GT43053AT3.multDimDeduTypeV1_2 where itemCode = "无" ');
    //遍历合法数据，取出数据进行加减分
    const selectDept = 'select deptId,deptName from GT43053AT3.GT43053AT3.synthDeptGradeV1_2 where dr ="0" ';
    let depts = ObjectStore.queryByYonQL(selectDept);
    let deptFloatGrade = [];
    for (let i = 0; i < depts.length; i++) {
      deptFloatGrade.push({
        deptId: depts[i].deptId,
        deptName: depts[i].deptName,
        floatGrade: 0
      });
    }
    //准备更新数据
    let deptGradeUpdate = [];
    let gradeRecordSelfUpdate = [];
    let megFlag = "";
    for (let i = 0; i < legalBills.length; i++) {
      let item = legalBills[i];
      //判定时间是否已经超过30天
      if (new Date(item.createTime).getTime() <= DaysBefore) {
        //组织更新部门积分变动记录的数据
        gradeRecordSelfUpdate.push({
          id: legalBills[i].id,
          itemCode: "已处理"
        });
        //累计部门积分
        for (let j = 0; j < deptFloatGrade.length; j++) {
          if (item.deptName == deptFloatGrade[j].deptName) {
            deptFloatGrade[j].floatGrade = deptFloatGrade[j].floatGrade + parseFloat(item.operationGrade);
            break;
          }
        }
      }
    }
    //进行分值更新
    let deptGradeUpdate2 = [];
    for (let h = 0; h < deptFloatGrade.length; h++) {
      var item = deptFloatGrade[h];
      var condtionObject = { deptName: item.deptName };
      var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade - item.floatGrade;
      deptGradeUpdate2.push({ id: curDeptRiskGrade.id, deptGrade: resultGrade });
    }
    var res4 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdate2, "c5200c80");
    var res5 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", gradeRecordSelfUpdate, "fe940bb1");
    //自定义日志处理
    var object = {
      logType: "自主巡检定时任务",
      mes5: JSON.stringify(legalBills)
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLog", object, "1d7e2886");
    return {};
  }
}
exports({ entryPoint: MyTrigger });