let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求体中的参数
    let floatIntergal = request.floatIntergal;
    let deptId = request.deptId;
    //查询相应的值并对值
    var condtionObject = { deptId: deptId };
    var resGrade = ObjectStore.selectByMap("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", condtionObject);
    var curDeptRiskGrade = resGrade[0];
    var resultGrade = curDeptRiskGrade.deptGrade + floatIntergal;
    var object = { id: curDeptRiskGrade.id, deptGrade: resultGrade };
    var result = ObjectStore.updateById("GT43053AT3.GT43053AT3.synthDeptGradeV1_2", object, "c5200c80");
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });