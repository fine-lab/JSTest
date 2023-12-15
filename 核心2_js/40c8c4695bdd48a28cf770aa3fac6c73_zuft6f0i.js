let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let cCode; //收发单据号
      var res;
      if (request.cCode) {
        cCode = request.cCode;
        // 更新条件
        var updateWrapper = new Wrapper();
        updateWrapper.eq("Iarriveid", cCode);
        // 待更新字段内容
        var toUpdate = {
          VyState: "U8已审核"
        };
        res = ObjectStore.update("AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01", toUpdate, updateWrapper, "yb89b91af0");
      }
      var rsp = {
        code: 0,
        msg: "调用ys接口成功",
        data: res
      };
      return {
        rsp
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.message
        }
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });