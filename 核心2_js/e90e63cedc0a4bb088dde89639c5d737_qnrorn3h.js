let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取传参
    var ProjectId = request.new1;
    var subject = request.new2;
    var object = { ProjectId: new1, subject: new2 };
    var res = ObjectStore.insert("AT1639DE8C09880005.AT1639DE8C09880005.sw02", object, "9bee4539List");
    var object = { id: request.id };
    //查询单据信息
    var detail = ObjectStore.selectById("AT1639DE8C09880005.AT1639DE8C09880005.sw02", object);
    var data = { billnum: "9bee4539List", data: JSON.stringify(detail) };
    //流程提交，直接用execute方法，动作写submit
    var res2 = ObjectStore.execute("submit", data);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });