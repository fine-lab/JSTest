let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //一张单子结束的时候将这张单子的分支加回去GT43053AT3.backDefaultGroup.monitorRiskRecover
    //处理自主巡检中部门自己巡检但是没有问题的情况
    //遍历巡检表，找到已经结束但是还没有处理的单子
    //正式上线的写法应该为select code from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where verifystate = 2 and endFlag = 0
    var legalBills = ObjectStore.queryByYonQL(
      "select code,endFlag,id,RiskFactorDescription,remark,Inspectioncategory,Finderdepartment from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where verifystate = 2"
    );
    //根据code进行部门积分计算
    //查询内容
    let mesTemp = [];
    let deptGradeUpdate = [];
    let endFlagUpdate = [];
    let floatGradeRecords = [];
    for (let i = 0; i < legalBills.length; i++) {
      var object = { itemCode: legalBills[i].code };
      var gradeRecords = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", object);
      //遍历积分历史对积分进行汇总
      var itemCodeFloatGrade = 0;
      for (let j = 0; j < gradeRecords.length; j++) {
        itemCodeFloatGrade = itemCodeFloatGrade + parseFloat(gradeRecords[j].operationGrade);
      }
      //对积分进行部门积分表的恢复
      var condtionObject = { deptName: gradeRecords[0].deptName };
      var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade + itemCodeFloatGrade;
      //记录合规的自主巡检单据；无；合格；有异常
      if (legalBills[i].RiskFactorDescription == "无") {
        if (legalBills[i].remark == "合格") {
          //表示经过EHS确认后确实没有异常
          resultGrade = resultGrade + 10;
          floatGradeRecords.push({
            deptId: legalBills[i].Finderdepartment,
            deptName: "",
            itemCode: "无",
            operationGrade: 10,
            operationType: "自主巡检无异常通过",
            objectName: "无",
            objectCode: "无",
            finderName: "无",
            finderDept: "无",
            finderName: "无",
            finderDept: "无"
          });
        } else {
          //表示经过EHS确认后有异常
          resultGrade = resultGrade - 10;
          floatGradeRecords.push({
            deptId: legalBills[i].Finderdepartment,
            deptName: "",
            itemCode: "无",
            operationGrade: -10,
            operationType: "自主巡检无异常不通过",
            objectName: "无",
            objectCode: "无",
            finderName: "无",
            finderDept: "无",
            finderName: "无",
            finderDept: "无"
          });
        }
      }
      deptGradeUpdate.push({ id: curDeptRiskGrade.id, deptGrade: resultGrade });
      //更新表的状态
      endFlagUpdate.push({ id: legalBills[i].id, endFlag: 1 });
    }
    var res4 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdate, "c5200c80");
    var res5 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.riskPotCheckV1_4", endFlagUpdate, "330f5eb7");
    //获取部门信息
    const selectDept = 'select deptId,deptName from GT43053AT3.GT43053AT3.synthDeptGradeV1_2 where dr ="0" ';
    var depts = ObjectStore.queryByYonQL(selectDept);
    for (let u = 0; u < floatGradeRecords.length; u++) {
      let item = floatGradeRecords[u];
      for (let p = 0; p < depts.length; p++) {
        if (item.deptId == depts[p].deptId) {
          item.deptName = depts[p].deptName;
        }
      }
    }
    var res1 = ObjectStore.insert("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", floatGradeRecords, "fe940bb1");
    //自定义日志处理
    var object = {
      logType: "自主巡检定时任务",
      mes5: JSON.stringify(floatGradeRecords)
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLog", object, "1d7e2886");
    return {};
  }
}
exports({ entryPoint: MyTrigger });