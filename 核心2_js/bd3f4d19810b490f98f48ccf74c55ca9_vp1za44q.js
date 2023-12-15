let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var jcddid = request.id;
    var billlcode = request.code;
    var upjcdd = [];
    var upsyd = [];
    for (var i = 0; i < jcddid.length; i++) {
      var cbbillCode = {
        id: jcddid[i],
        pingzhenghao: billlcode,
        generateTime: request.date,
        Generate: "true",
        checkStatus: "20"
      };
      upjcdd.push(cbbillCode);
      //查询检测订单
      var detectOrderSql = "select Upstreamid from AT15F164F008080007.AT15F164F008080007.DetectOrder where id='" + jcddid[i] + "'";
      var detectOrderRes = ObjectStore.queryByYonQL(detectOrderSql, "developplatform");
      var sydId = detectOrderRes[0].Upstreamid;
      var updateBgDate = {
        id: sydId,
        bgDate: request.date,
        checkStatus: "20",
        isbg: "true"
      };
      upsyd.push(updateBgDate);
    }
    var cbbillCodeRes = ObjectStore.updateBatch("AT15F164F008080007.AT15F164F008080007.DetectOrder", upjcdd, "71a4dca4");
    var updateBgDateRes = ObjectStore.updateBatch("AT15F164F008080007.AT15F164F008080007.recDetils1", upsyd, "63fb1ae5");
    return { updateBgDateRes };
  }
}
exports({ entryPoint: MyAPIHandler });