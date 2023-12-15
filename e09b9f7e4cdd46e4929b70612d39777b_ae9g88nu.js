let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取ID
    var id = request.id;
    var name = request.name;
    // 获取当前单据的审核状态，未审核不允许下推
    let sqlstrone = "select verifystate from " + name + " where id=" + id;
    let returnsOne = ObjectStore.queryByYonQL(sqlstrone);
    if (returnsOne.length < 1) {
      return { errInfo: "未查询到需要生单的单据！" };
    } else if (returnsOne[0].verifystate != 2) {
      return { errInfo: "单据未审核，请审核后下推！" };
    }
    return { errInfo: "" };
  }
}
exports({ entryPoint: MyAPIHandler });