let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取人员所在部门编码
    //更新跨BG报备状态
    let body = {
      fullname: "sfa.oppt.OpptDef",
      data: [{ id: "youridHere", define27: "待处理" }]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });