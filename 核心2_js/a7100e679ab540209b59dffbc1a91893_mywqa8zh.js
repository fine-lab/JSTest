let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var zhuangtai1 = request.zhuangtai;
    var verifystate = request.verifystate;
    //服务中心
    var zhengshuhetonghao = request.zhengshuhetonghao;
    var sql = 'select * from GT8313AT35.GT8313AT35.ServiceCentre where ReceiptNo = "' + zhengshuhetonghao + '"';
    var res = ObjectStore.queryByYonQL(sql);
    var resid = res[0].id;
    //内部收证
    var sql2 = 'select * from GT8313AT35.GT8313AT35.Jzs where ReceiptNo = "' + zhengshuhetonghao + '"';
    var res2 = ObjectStore.queryByYonQL(sql2);
    //内部流转
    var sql4 = 'select * from GT8313AT35.GT8313AT35.nblzst where zhengshuhetonghao ="' + resid + '"';
    var res4 = ObjectStore.queryByYonQL(sql4);
    if (res2[0].zhuangtai != undefined) {
      var zt = res2[0].zhuangtai;
    }
    if (zt == "7") {
      for (var r = 0; r < res4.length; r++) {
        var res4id = res4[r].id;
        var object = { id: res4id, zhuangtai: "7" };
        var res7 = ObjectStore.updateById("GT8313AT35.GT8313AT35.nblzst", object, "337e255e");
      }
      for (var i = 0; i < res.length; i++) {
        var idd = res[i].id;
        var object = { id: idd, zhuangtai: "7" };
        var res6 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
      }
    } else {
      var id = res[0].id;
      if (zhuangtai1 == "6") {
        if (verifystate == "0") {
          //开立态
          var object = { id: id, zhuangtai: "3" };
          var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
        } else if (verifystate == "1") {
          //待审批
          var object = { id: id, zhuangtai: "3" };
          var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
        } else if (verifystate == "2") {
          //已审批
          var object = { id: id, zhuangtai: "6" };
          var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
        }
      } else if (zhuangtai1 == "8") {
        var object = { id: id, zhuangtai: "3" };
        var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", object, "fbdcef39");
      }
    }
    return { res7 };
  }
}
exports({ entryPoint: MyAPIHandler });