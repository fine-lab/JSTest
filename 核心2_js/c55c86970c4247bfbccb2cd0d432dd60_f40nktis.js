let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res_key = S4();
    var completeDate = request.complete_At;
    var salesOutId = request.out_Id;
    let body = {
      data: {
        resubmitCheckKey: res_key,
        id: salesOutId,
        _status: "Update",
        headDefine: {
          id: salesOutId,
          _status: "Update",
          define14: completeDate,
          define15: "已完工"
        }
      }
    };
    var strResponseOut = openLinker("POST", "https://www.example.com/", "IMP_PES", JSON.stringify(body));
    return { strResponseOut };
  }
}
exports({ entryPoint: MyAPIHandler });