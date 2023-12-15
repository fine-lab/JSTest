let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(ch, request) {
    var result = [];
    for (var i in ch) {
      //子表条件信息
      var chInfo = ch[i];
      //比较字段
      var params = request[chInfo.cparams];
      if (params == undefined) throw new Error("没有找到子流程比较字段");
      switch (chInfo.options) {
        case "like":
          if (params.indexOf(chInfo.vs) != -1) result.push(chInfo.person);
          break;
        case "nolike":
          if (params.indexOf(chInfo.vs) == -1) result.push(chInfo.person);
          break;
        case "=":
          if (params == chInfo.vs) result.push(chInfo.person);
          break;
        case "!=":
          if (params != chInfo.vs) result.push(chInfo.person);
          break;
        default:
          break;
      }
      if (result.length > 0) break;
    }
    return { ch: result };
  }
}
exports({ entryPoint: MyAPIHandler });