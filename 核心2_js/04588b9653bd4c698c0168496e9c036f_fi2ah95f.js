let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求体中的参数
    let floatIntergal = request.floatIntergal;
    let deptId = request.deptId;
    //查询相应的值并对值
    var condtionObject = { deptId: deptId };
    var resGrade = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.DeptRiskGrade", condtionObject);
    var curDeptRiskGrade = resGrade[0];
    var resultGrade = curDeptRiskGrade.deptGrade + floatIntergal;
    var object = { id: curDeptRiskGrade.id, deptGrade: resultGrade };
    var result = ObjectStore.updateById("GT37369AT26.GT37369AT26.DeptRiskGrade", object, "d7fc3747");
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });