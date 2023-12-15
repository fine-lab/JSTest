let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    // 改返利政策-余额数据
    for (let i = 0; i < datas.length; i++) {
      var objectupd = {
        id: datas[i].id,
        balance: datas[i].PolApplAmount
      };
      var updatarehate = ObjectStore.updateById("AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys", objectupd, "2a32a530List");
    }
    return { updatarehate };
  }
}
exports({ entryPoint: MyAPIHandler });