let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取传参
    var new1 = request.xingbie;
    var new2 = request.xingming;
    var object = { xingbie: new1, xingming: new2 };
    var res = ObjectStore.insert("GT101670AT8.GT101670AT8.sjsjb", object, "5950dc15List");
    //查询单据信息
    var detail = ObjectStore.selectById("GT101670AT8.GT101670AT8.sjsjb", res);
    var data = { billnum: "5950dc15List", data: JSON.stringify(detail) };
    //流程提交，直接用execute方法，动作写submit
    var res2 = ObjectStore.execute("submit", data);
    return { res2 };
  }
}
exports({ entryPoint: MyAPIHandler });