let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //参数接收
    //字段1
    var zd1 = request.zd1;
    //字段2
    var zd2 = request.zd2;
    //字段3
    var zd3 = request.zd3;
    //构建低代码线索单对象
    var obj = { new1: zd1, new2: zd2, test1110: zd3 };
    //插入对象
    var res = ObjectStore.insert("AT17F8BB9616F8000B.AT17F8BB9616F8000B.zs824", obj, "zs824");
    if (res != null) {
      var billID = res.id;
      if (billID != null) {
        //调用工作流。wfobj：单据id
        let wfobj = { id: billID };
        let detail = ObjectStore.selectById("AT17F8BB9616F8000B.AT17F8BB9616F8000B.zs824", wfobj);
        let data = { billnum: "zs824", data: JSON.stringify(detail) };
        //参数 submit固定值
        let res1 = ObjectStore.execute("submit", data);
        if (res1 != null && "undefined" != res1) {
          //调用工作流结束
          return { data: res1.id };
        }
      }
    }
    return { data: "保存线索失败" };
  }
}
exports({ entryPoint: MyAPIHandler });