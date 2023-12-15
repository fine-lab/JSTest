let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    // 判断状态(0为确认按钮，1为取消确认按钮)
    var state = request.state;
    var cancelNames = request.cancelNames;
    if (state == 0) {
      var notarizeobject = { id: id, enable: "1", ConfirmingPerson: cancelNames };
      var notarizeresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", notarizeobject, "31ae1c7b");
    } else {
      var cancelobject = { id: id, enable: "0", ConfirmingPerson: "" };
      var cancelresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", cancelobject, "31ae1c7b");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });