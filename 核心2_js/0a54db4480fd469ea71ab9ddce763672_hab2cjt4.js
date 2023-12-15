let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询符合条件的数据GT43053AT3.backDefaultGroup. jiaefnxiangkouhcu
    const legalBills = "select code,Inspectioncategory from GT43053AT3.GT43053AT3.riskPotCheckV1_4 where verifystate = 1";
    let riskBills = ObjectStore.queryByYonQL(legalBills);
    //赛选符合条件的积分记录
    //巡检类型枚举：EHS巡检——1；高阶主管巡检——2；部门主管巡检——3；部门自主巡检——4
    //数据更新变量
    let tempMes = [];
    for (let i = 0; i < riskBills.length; i++) {
      if (riskBills[i].Inspectioncategory == 1) {
        //如果是EHS巡检则跳过
        continue;
      }
      //查询所需要的的数据
      var itemConction = {
        itemCode: riskBills[i].code
      };
      //查询出积分记录
      var itemRecords = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", itemConction);
      let floatRecordsInsert = [];
      let floatRecordsUpdate = [];
      //遍历积分记录,利用def3字段存储此条记录已经恢复的分值
      if (riskBills[i].Inspectioncategory == 2 && false) {
        //高阶主管的巡检
        for (let j = 0; j < itemRecords.length; j++) {
          var recordItem = itemRecords[j];
          //判断当前积分是否需要进行积分消减
          var curItemDef3 = parseFloat(recordItem.def3 == undefined ? "0" : recordItem.def3);
          var curItemSurplus = curItemDef3 + parseFloat(recordItem.operationGrade);
          if (curItemSurplus >= 0.5) {
            //进行0.5类型积分的扣除
            floatRecordsUpdate.push({
              id: recordItem.id,
              def3: curItemDef3 - 0.5 + ""
            });
            floatRecordsInsert.push({
              deptName: recordItem.deptName,
              deptId: recordItem.deptId,
              itemCode: recordItem.itemCode,
              operationGrade: -0.5,
              operationType: "高阶+自主常规加分项扣除",
              objectName: recordItem.objectName,
              objectCode: recordItem.objectCode,
              finderName: recordItem.finderName,
              finderDept: recordItem.finderDept,
              def1: recordItem.def1
            });
          } else if (curItemSurplus > 0) {
            //进行小于0.5类型积分的扣除
            floatRecordsUpdate.push({
              id: recordItem.id,
              def3: -recordItem.operationGrade + curItemDef3 + ""
            });
            floatRecordsInsert.push({
              deptName: recordItem.deptName,
              deptId: recordItem.deptId,
              itemCode: recordItem.itemCode,
              operationGrade: -curItemSurplus,
              operationType: "高阶+自主常规加分项扣除",
              objectName: recordItem.objectName,
              objectCode: recordItem.objectCode,
              finderName: recordItem.finderName,
              finderDept: recordItem.finderDept,
              def1: recordItem.def1
            });
          }
        }
        //对相关数据进行更新
        var objectTemp = { deptName: floatRecordsInsert[0].deptName };
        var tempRes = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", objectTemp);
        var deptGradeUpdate = {
          id: tempRes[0].id,
          deptGrade: tempRes[0].deptGrade
        };
        for (var v = 0; v < floatRecordsInsert.length; v++) {
          deptGradeUpdate.deptGrade += floatRecordsInsert[v].operationGrade;
        }
        var res0 = ObjectStore.updateById("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdate, "c5200c80");
        var res1 = ObjectStore.insertBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", floatRecordsInsert, "fe940bb1");
        var res2 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", floatRecordsUpdate, "fe940bb1");
      }
      if (riskBills[i].Inspectioncategory == 4) {
        //部门自主巡检
        //高阶主管的巡检
        for (let j = 0; j < itemRecords.length; j++) {
          if (itemRecords[j].operationType != "严重等级+面向权重") {
            continue;
          }
          var recordItem = itemRecords[j];
          //判断当前积分是否需要进行积分消减
          var curItemDef3 = parseFloat(recordItem.def3 == undefined ? "0" : recordItem.def3);
          var curItemSurplus = curItemDef3 + parseFloat(recordItem.operationGrade);
          if (curItemSurplus >= 0.5) {
            //进行0.5类型积分的扣除
            floatRecordsUpdate.push({
              id: recordItem.id,
              def3: curItemDef3 - 0.5 + ""
            });
            floatRecordsInsert.push({
              deptName: recordItem.deptName,
              deptId: recordItem.deptId,
              itemCode: recordItem.itemCode,
              operationGrade: -0.5,
              operationType: "高阶+自主常规加分项扣除",
              objectName: recordItem.objectName,
              objectCode: recordItem.objectCode,
              finderName: recordItem.finderName,
              finderDept: recordItem.finderDept,
              def1: recordItem.def1
            });
          } else if (curItemSurplus > 0) {
            //进行小于0.5类型积分的扣除
            floatRecordsUpdate.push({
              id: recordItem.id,
              def3: keepTwoDecimal(-recordItem.operationGrade + curItemDef3)
            });
            floatRecordsInsert.push({
              deptName: recordItem.deptName,
              deptId: recordItem.deptId,
              itemCode: recordItem.itemCode,
              operationGrade: keepTwoDecimal(-curItemSurplus),
              operationType: "高阶+自主常规加分项扣除",
              objectName: recordItem.objectName,
              objectCode: recordItem.objectCode,
              finderName: recordItem.finderName,
              finderDept: recordItem.finderDept,
              def1: recordItem.def1
            });
          }
        }
        //对相关数据进行更新
        var objectTemp = { deptName: floatRecordsInsert[0].deptName };
        var tempRes = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", objectTemp);
        var deptGradeUpdate = {
          id: tempRes[0].id,
          deptGrade: tempRes[0].deptGrade
        };
        for (var v = 0; v < floatRecordsInsert.length; v++) {
          deptGradeUpdate.deptGrade += floatRecordsInsert[v].operationGrade;
        }
        tempMes.push(floatRecordsInsert, floatRecordsUpdate, deptGradeUpdate);
        var res0 = ObjectStore.updateById("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", deptGradeUpdate, "c5200c80");
        var res1 = ObjectStore.insertBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", floatRecordsInsert, "fe940bb1");
        var res2 = ObjectStore.updateBatch("GT43053AT3.GT43053AT3.multDimDeduTypeV1_2", floatRecordsUpdate, "fe940bb1");
      }
    }
    //数据保留两位小数
    function keepTwoDecimal(num) {
      var result = parseFloat(num);
      if (isNaN(result)) {
        console.log("传递参数错误，请检查！");
        return false;
      }
      result = Math.round(num * 100) / 100;
      return result;
    }
    //自定义日志处理GT43053AT3.backDefaultGroup.jiafenkouchuV1_2
    var object = {
      logType: "积分恢复",
      mes5: JSON.stringify(tempMes)
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLogV1_2", object, "501280b5");
    return {};
  }
}
exports({ entryPoint: MyTrigger });