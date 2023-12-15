let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //监控订单中的超时回复GT43053AT3.backDefaultGroup.monitorRiskOvertime
    //查询内容,订单状态中的审核态为1
    const legalBills = "select Correctivemeasures,PlannedDate,Inspectioncategory,approveBegin,id from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where verifystate = 1";
    let riskBills = ObjectStore.queryByYonQL(legalBills);
    //批量更新延时回复部门的积分
    const dayValue = 86400000;
    let currentTime = new Date().getTime();
    let oneDayBefore = currentTime - dayValue;
    let riskBillCon = []; //部门积分表的更新数据
    let recordCon = []; //部门积分多维记录表更新数据
    let megflag = "";
    for (var i = 0; i < riskBills.length; i++) {
      //正式环境的时候这个判断就可以去掉了
      if (riskBills[i].Inspectioncategory == "1" || riskBills[i].Inspectioncategory == "2") {
        let itemTime = new Date(parseFloat(riskBills[i].approveBegin)).getTime();
        //上线之后的内容应该为：itemTime < oneDayBefore
        if (itemTime <= oneDayBefore && riskBills[i].Correctivemeasures == undefined) {
          //组装部门积分多维记录表的跟新数据86400000
          //从扣分记录表查询有关此条记录的面向名称以及发现者名称
          var mesRecordCon = { itemCode: riskBills[i].code };
          var mesResult = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", mesRecordCon);
          var tempMes = mesResult[0];
          recordCon.push({
            deptName: tempMes.deptName,
            deptId: tempMes.deptId,
            itemCode: tempMes.itemCode,
            operationGrade: -0.5,
            operationType: "超时回复",
            objectName: tempMes.objectName,
            objectCode: tempMes.objectCode,
            finderName: tempMes.finderName,
            finderDept: tempMes.finderDept,
            def1: tempMes.def1
          });
          //组装更改隐患排查表def3——回复超时扣分字段的信息
          var tempDate = itemTime + 86400000 + "";
          riskBillCon.push({
            id: riskBills[i].id,
            approveBegin: tempDate
          });
        }
      }
    }
    var res1 = ObjectStore.insertBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", recordCon, "fe940bb1");
    //更新部门积分表
    //遍历积分记录表中的数据，统计出各部门的浮动总分
    let doFlag = "";
    let deptGradeCon = [];
    for (var j = 0; j < recordCon.length; j++) {
      let flag = true;
      for (var k = 0; k < deptGradeCon.length; k++) {
        if (deptGradeCon[k].id == recordCon[j].deptName) {
          deptGradeCon[k].deptGrade += -0.5;
          flag = false;
          break;
        }
      }
      if (flag) {
        deptGradeCon.push({
          id: recordCon[j].deptName,
          deptGrade: -0.5
        });
      }
    }
    //将deptGradeCon中的名称替换为部门积分中的id
    for (var v = 0; v < deptGradeCon.length; v++) {
      var objectTemp = { deptName: deptGradeCon[v].id };
      var tempRes = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", objectTemp);
      deptGradeCon[v].id = tempRes[0].id;
      deptGradeCon[v].deptGrade += tempRes[0].deptGrade;
    }
    var riskDeptRest = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeCon, "c5200c80");
    //跟新安全隐患巡检表
    var riskBillRest = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.riskPotCheckV1_4", riskBillCon, "330f5eb7");
    //自定义日志处理
  }
}
exports({ entryPoint: MyTrigger });