let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var d = new Date();
    var year = d.getFullYear() + "-";
    var month = ("0" + (d.getMonth() + 1)).slice(-2) + "-";
    var day = ("0" + d.getDate()).slice(-2);
    let dateStr = year + month + day; //yyyy-MM-dd
    return { dateStr };
  }
}
exports({ entryPoint: MyAPIHandler });