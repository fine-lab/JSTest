let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var arrayRes = request.resuu;
    var idd = arrayRes.id;
    //查状态
    var sql = "select zhuangtai from AT15F164F008080007.AT15F164F008080007.DeviceManagement where id = '" + idd + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length != 0) {
      if (res[0].zhuangtai == "1") {
        var object = { id: idd, zhuangtai: "0" };
        var res1 = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DeviceManagement", object, "f7ca41a7");
      } else {
        throw new Error("异常");
      }
    } else {
      var object = { id: idd, zhuangtai: "0" };
      var res1 = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DeviceManagement", object, "f7ca41a7");
      return { res1 };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });