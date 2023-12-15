let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容,订单状态中的审核态为1
    var object = { verifystate: 1 };
    let res = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.YHC004", object);
    var resString = JSON.stringify(res);
    //批量更新延时回复部门的积分
    let curDateTime = new Date(); //执行超期判断的当前时间
    let riskBillCon = []; //部门积分表的更新数据
    let recordCon = []; //部门积分多维记录表更新数据
    //筛选符合条件的部门，并组装相应的数据
    for (var i = 0; i < res.length; i++) {
      //正式环境的时候这个判断就可以去掉了
      if ((res[i].Inspectioncategory == "1" || res[i].Inspectioncategory == "2") && res[i].def3 != undefined && res[i].def3 != null && res[i].def3 != "") {
        let marginTime = curDateTime - new Date(res[i].def3);
        if (marginTime >= 10) {
          //组装部门积分多维记录表的跟新数据86400000
          //从扣分记录表查询有关此条记录的面向名称以及发现者名称
          var mesRecordCon = { itemCode: res[i].code };
          var mesResult = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.multDimensDeducV1_6", mesRecordCon);
          recordCon.push({
            objectName: mesResult[0].objectName,
            finderName: mesResult[0].finderName,
            finderDept: res[i].Finderdepartment,
            deptName: res[i].ResponsibleDepart,
            itemCode: res[i].code,
            operationGrade: -0.5,
            operationType: "回复延期"
          });
          //组装更改隐患排查表def3——回复超时扣分字段的信息
          var tempDate = new Date(new Date(res[i].ref3) + 86400000);
          riskBillCon.push({
            id: res[i].id,
            def3: tempDate
          });
        }
      }
    }
    //更新部门积分记录表
    let recordRest = "";
    try {
      recordRest = ObjectStore.insertBatch("GT37369AT26.GT37369AT26.multDimensDeducV1_6", recordCon, "d42eba1f");
    } catch (e) {}
    //更新部门积分表
    //遍历积分记录表中的数据，统计出各部门的浮动总分
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
      var tempRes = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.DeptRiskGrade", objectTemp);
      deptGradeCon[v].id = tempRes[0].id;
      deptGradeCon[v].deptGrade += tempRes[0].deptGrade;
    }
    //更新部门积分表
    let riskDeptRest = "";
    try {
      riskDeptRest = ObjectStore.updateBatch("GT37369AT26.GT37369AT26.DeptRiskGrade", deptGradeCon, "d7fc3747");
    } catch (e) {}
    //跟新安全隐患巡检表
    let riskBillRest = "";
    try {
      riskBillRest = ObjectStore.updateBatch("GT37369AT26.GT37369AT26.YHC004", riskBillCon, "476062fd");
    } catch (e) {}
    //调试存储日志
  }
}
exports({ entryPoint: MyTrigger });