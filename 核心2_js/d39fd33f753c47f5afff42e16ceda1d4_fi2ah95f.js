let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //脚本相关变量说明
    //巡检类型枚举：EHS巡检——1；高阶主管巡检——2；部门主管巡检——3；部门自主巡检——4
    //获取页面数值
    let pageFormData = param.data[0];
    //获取具体计算所需信息
    let itemInspectioncategory = pageFormData.Inspectioncategory; //巡检类型
    let itemCode = pageFormData.code; //此条信息的code值
    let itemSeriousLevel = pageFormData.SeriousLevel;
    let itemDirectionName = pageFormData.Direction_name;
    let itemDirectionId = pageFormData.Direction;
    let objectWeight = pageFormData.def1;
    let itemTargetDeptName = pageFormData.ResponsibleDepart;
    let itemFinder = pageFormData.Finder_name;
    let itemFinderDept = pageFormData.Finderdepartment;
    //具体针对巡检单中的数据进行分值逻辑计算
    let reduceScore = 0;
    if (itemInspectioncategory == "1") {
      //当前巡检类型为EHS巡检
      reduceScore = itemSeriousLevel == "H" ? -1.5 : itemSeriousLevel == "M" ? -1 : -0.5;
      reduceScore = reduceScore * objectWeight;
    }
    if (itemInspectioncategory == "2") {
      //当前巡检类型为高阶主管巡检
      reduceScore = 0.5;
    }
    if (itemInspectioncategory == "3") {
      //当前巡检类型为部门主管巡检
    }
    if (itemInspectioncategory == "4") {
      //当前巡检类型为部门自主巡检
      //分析要改动分值的部门
      if (pageFormData.Finderdepartment != pageFormData.ResponsibleDepart) {
        itemTargetDeptName = pageFormData.Finderdepartment;
      }
      reduceScore = 1;
    }
    //输出计算维度结果
    //针对计算的结果更新相关表实体
    //更新部门-面向二维扣分记录表;实体中的创建时间字段是由系统自动生成的
    var condtionObject1 = { itemCode: itemCode };
    var countItem = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.multDimensDeducV1_6", condtionObject1);
    if (countItem.length != 0) {
      //判断此次的保存操作是新增还是修改
      //修改延期引起的数据变化扣分
      //获取页面上有关整改日期的数据
      let beforePlanDate = pageFormData.def2; //修改前的整改日期
      let afterPlanDate = pageFormData.PlannedDate; //修改后的整改日期
      reduceScore = -0.5;
      //针对计算的结果更新相关表实体
      //更新部门-面向二维扣分记录表;实体中的创建时间字段是由系统自动生成的
      if (beforePlanDate == "" || beforePlanDate == undefined || beforePlanDate == afterPlanDate || beforePlanDate > afterPlanDate) {
        //如果是第一次填写日期或是两次填写的日期值相同则不进行扣分
        return { mes: "是第一次填写整改日期或是日期没有延后所以不进行具体扣分" };
      }
      var object = {
        deptName: itemTargetDeptName,
        itemCode: itemCode,
        operationGrade: reduceScore,
        operationType: "整改延期",
        objectName: itemDirectionName,
        finderName: itemFinder,
        finderDept: itemFinderDept
      };
      var res = ObjectStore.insert("GT37369AT26.GT37369AT26.multDimensDeducV1_6", object, "d42eba1f");
      //跟新部门积分表-先查询出当前部门积分、再对部门的积分表做更改
      var condtionObject = { deptName: itemTargetDeptName };
      var resGrade = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.DeptRiskGrade", condtionObject);
      var curDeptRiskGrade = resGrade[0];
      var resultGrade = curDeptRiskGrade.deptGrade + reduceScore;
      var object = { id: curDeptRiskGrade.id, deptGrade: resultGrade };
      ObjectStore.updateById("GT37369AT26.GT37369AT26.DeptRiskGrade", object, "d7fc3747");
      return { mes: "整改日期延期进行扣分" };
    }
    //更新操作记录表
    var object = {
      deptName: itemTargetDeptName,
      itemCode: itemCode,
      operationGrade: reduceScore,
      operationType: "严重等级+面向权重",
      objectName: itemDirectionName,
      finderName: itemFinder,
      finderDept: itemFinderDept
    };
    var res = ObjectStore.insert("GT37369AT26.GT37369AT26.multDimensDeducV1_6", object, "d42eba1f");
    //跟新部门积分表-先查询出当前部门积分、再对部门的积分表做更改
    var condtionObject = { deptName: itemTargetDeptName };
    var resGrade = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.DeptRiskGrade", condtionObject);
    var curDeptRiskGrade = resGrade[0];
    if (curDeptRiskGrade == null) {
      throw new Error("请确认责任者或发现者的部门是否在部门积分表内！");
    }
    var resultGrade = curDeptRiskGrade.deptGrade + reduceScore;
    var object = { id: curDeptRiskGrade.id, deptGrade: resultGrade };
    ObjectStore.updateById("GT37369AT26.GT37369AT26.DeptRiskGrade", object, "d7fc3747");
    //更新面向维度积分表
    //跟新部门积分表-先查询出当前部门积分、再对部门的积分表做更改
    var condtionObject = { objectName: itemDirectionName };
    var resGrade = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.ObjectGradeV1_1", condtionObject);
    var curObjectGrade = resGrade[0];
    var resultGrade = curObjectGrade.objectGtade + reduceScore;
    var object = { id: curObjectGrade.id, objectGtade: resultGrade };
    ObjectStore.updateById("GT37369AT26.GT37369AT26.ObjectGradeV1_1", object, "ee74e823");
    return { mes: "新条目保存成功" };
  }
}
exports({ entryPoint: MyTrigger });