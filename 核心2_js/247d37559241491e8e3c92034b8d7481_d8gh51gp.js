let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var zid = param.data[0].id;
    var mainid = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where id = '" + zid + "'";
    var resmain = ObjectStore.queryByYonQL(mainid, "developplatform");
    var mainzid = resmain[0].id;
    //送检形式 自检或委外
    var InspectionForm = resmain[0].InspectionForm;
    //子表
    var sonid = "select * from AT15F164F008080007.AT15F164F008080007.BOMImport where DetectOrder_id = '" + mainzid + "'";
    var resson = ObjectStore.queryByYonQL(sonid, "developplatform");
    for (var i = 0; i < resson.length; i++) {
      var pingzhenghao = resson[i].pingzhenghao != undefined ? resson[i].pingzhenghao : 0;
      var caigoudingdanhao = resson[i].caigoudingdanhao != undefined ? resson[i].caigoudingdanhao : 0;
      var Materialdelivery = resson[i].Materialdelivery != undefined ? resson[i].Materialdelivery : 0;
      if (pingzhenghao != 0) {
        throw new Error(" -- 子表凭证号不为空,不允许删除 -- ");
      } else if (caigoudingdanhao != 0) {
        throw new Error(" -- 子表采购订单号不为空,不允许删除 -- ");
      } else if (Materialdelivery != 0) {
        throw new Error(" -- 子表材料出库单号不为空,不允许删除 -- ");
      }
    }
    var pingzhenghao = resmain[0].pingzhenghao != undefined ? resmain[0].pingzhenghao : 0;
    var caigoudingdanhao = resmain[0].caigoudingdanhao != undefined ? resmain[0].caigoudingdanhao : 0;
    if (pingzhenghao != 0) {
      throw new Error(" -- 凭证号不为空,不允许删除 -- ");
    } else if (caigoudingdanhao != 0) {
      throw new Error(" -- 采购订单号不为空,不允许删除 -- ");
    } else {
      if (InspectionForm == "02") {
        //上游主键   "Upstreamid":"1596244730518700038",
        var Upstreamid = resmain[0].Upstreamid;
        //收样单  checkStatus,isce,isbg,bgDate
        var syid = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where id = '" + Upstreamid + "'";
        var ressy = ObjectStore.queryByYonQL(syid);
        //查询有没有相同的检测订单
        var upperReacheSid = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where Upstreamid = '" + Upstreamid + "'";
        var resupper = ObjectStore.queryByYonQL(upperReacheSid, "developplatform");
        //超过1就不更新
        if (ressy.length != 0 && resupper.length == 1) {
          var object = { id: Upstreamid, checkStatus: "00", isbg: "false", bgDate: "false" };
          var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
        }
      } else if (InspectionForm == "01") {
        //上游主键   "Upstreamid":"1596244730518700038",
        var Upstreamid = resmain[0].Upstreamid;
        //收样单  checkStatus,isce,isbg,bgDate
        var syid = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where id = '" + Upstreamid + "'";
        var ressy = ObjectStore.queryByYonQL(syid);
        //查询有没有相同的检测订单
        var upperReacheSid = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where Upstreamid = '" + Upstreamid + "'";
        var resupper = ObjectStore.queryByYonQL(upperReacheSid, "developplatform");
        //超过1就不更新
        if (ressy.length != 0 && resupper.length == 1) {
          var object = { id: Upstreamid, checkStatus: "05", isbg: "false", bgDate: "false" };
          var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });