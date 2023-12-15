let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //出证合同主键
    var updateIssContId = request.updateId;
    //人才库主键
    var updatePerDeportId = request.updatePerDeportId;
    //将出证合同数据状态改为【合同作废】
    var upateCzht = { id: updateIssContId, issuingContract_status: "4" };
    ObjectStore.updateById("GT60601AT58.GT60601AT58.issuingContract", upateCzht, "909674b8");
    //依据人才库查询收证合同
    var querrckQql = "select * from GT60601AT58.GT60601AT58.personDepotArchives	where id=" + updatePerDeportId;
    var rckRes = ObjectStore.queryByYonQL(querrckQql);
    //回写收证合同状态为【闲置】
    var upateSzhtobject = { id: rckRes[0].receiContract_code, vstate: "1" };
    ObjectStore.updateById("GT60601AT58.GT60601AT58.certReceiContract", upateSzhtobject, "301cb08a");
    //更新人才库档案主表数据状态为【闲置】
    var upateRckda = { id: updatePerDeportId, cerStatus: "1" };
    ObjectStore.updateById("GT60601AT58.GT60601AT58.personDepotArchives", upateRckda, "207c857b");
    //查询人才库档案轨迹数据
    var rckdagjSql = "select * from GT60601AT58.GT60601AT58.perDepotArchives_c  where dr=0 and issuingContract_status=2 and personDepotArchives_id='" + updatePerDeportId + "'";
    var rckdagjRes = ObjectStore.queryByYonQL(rckdagjSql);
    if (rckdagjRes.length > 0) {
      for (var k = 0; k < rckdagjRes.length; k++) {
        //更改轨迹数据为【合同作废】
        var upateRckdaGj = { id: rckdagjRes[k].id, issuingContract_status: "4" };
        ObjectStore.updateById("GT60601AT58.GT60601AT58.perDepotArchives_c", upateRckdaGj, "207c857b");
      }
    }
    //依据出证合同查询内部人才库数据
    var rcqSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot where dr=0 and innerStatus in (1,2) and issuingContract_code='" + updateIssContId + "'";
    var rcqRes = ObjectStore.queryByYonQL(rcqSql);
    //更改人才库主表数据
    if (rcqRes.length > 0) {
      var upateRck = { id: rcqRes[0].id, innerStatus: "5" };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot", upateRck, "9a3bc57c");
      //查询人才库轨迹数据
      var gjSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot_a where dr=0 and circuStatus in (1,2,3) and serCenPerDepot_id='" + rcqRes[0].id + "'";
      var gjRes = ObjectStore.queryByYonQL(gjSql);
      if (gjRes.length > 0) {
        //更新人才库轨迹数据
        for (var j = 0; j < gjRes.length; j++) {
          var upateGj = { id: gjRes[j].id, circuStatus: "5" };
          ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot_a", upateGj, "9a3bc57c");
        }
      }
      //查询内部流转单数据
      var lzdSql = "select * from GT60601AT58.GT60601AT58.serCenInnerCircu where dr=0 and innerStatus in(2,3) and cerContract_number='" + rcqRes[0].id + "'";
      var lzdRes = ObjectStore.queryByYonQL(lzdSql);
      if (lzdSql.length > 0) {
        //更新内部流转单数据
        for (var z = 0; z < lzdRes.length; z++) {
          var upateLzd = { id: lzdRes[z].id, innerStatus: "5" };
          ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenInnerCircu", upateLzd, "27b492a8");
          //查询完结单数据
          var wjdSql = "select * from GT60601AT58.GT60601AT58.circulationFinish where dr=0 and innerStatus=3 and entCust_name='" + lzdRes[z].id + "'";
          var wjdRes = ObjectStore.queryByYonQL(wjdSql);
          //更新完结单数据
          if (wjdRes.length > 0) {
            for (var p = 0; p < wjdRes.length; p++) {
              var upateWjd = { id: wjdRes[p].id, innerStatus: "5" };
              ObjectStore.updateById("GT60601AT58.GT60601AT58.circulationFinish", upateWjd, "e7f4a94f");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });