let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code + "OrgAdmin";
    let name = request.name + "组织管理";
    //通过上下文获取当前的用户信息
    let func1 = extrequire("GT34544AT7.dept.deptInsert");
    request.code = code;
    request.name = name;
    let res1 = func1.execute(request);
    var res = res1.res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });