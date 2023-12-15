let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function queryData(sql) {
      return ObjectStore.queryByYonQL(sql);
    }
    function updateData(tablename, data, code) {
      return ObjectStore.updateById("GT60601AT58.GT60601AT58." + tablename, data, code);
    }
    //获取当前日期
    var now = new Date();
    var nowstr = now.getFullYear() + "-";
    if ((now.getMonth() + 1).length == 1) {
      nowstr = nowstr + "0" + (now.getMonth() + 1) + "-";
    } else {
      nowstr = nowstr + (now.getMonth() + 1) + "-";
    }
    if (now.getDate() < 10) {
      nowstr = nowstr + "0" + now.getDate();
    } else {
      nowstr = nowstr + now.getDate();
    }
    //查询收证合同数据--dr:0 状态：【闲置】、【已出证】
    var sql = "select * from GT60601AT58.GT60601AT58.certReceiContract where dr=0 and vstate in(1,2) and contract_due_date='" + nowstr + "'";
    var res = queryData(sql);
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        //将收证合同数据状态改为【合同到期】
        var upateSzht = { id: res[i].id, vstate: "3" };
        updateData("certReceiContract", upateSzht, "301cb08a");
        //依据收证合同主键查询人才库档案数据
        var rckdaSql = "select * from GT60601AT58.GT60601AT58.personDepotArchives where dr=0 and cerStatus in (1,2) and receiContract_code='" + res[i].id + "'";
        var rckdaRes = queryData(rckdaSql);
        if (rckdaRes.length > 0) {
          for (var j = 0; j < rckdaRes.length; j++) {
            //更新人才库档案主表数据
            var upateRckda = { id: rckdaRes[j].id, cerStatus: "3" };
            updateData("personDepotArchives", upateRckda, "207c857b");
            //查询人才库档案轨迹数据
            var rckdagjSql = "select * from GT60601AT58.GT60601AT58.perDepotArchives_c  where dr=0 and issuingContract_status in(1,2) and personDepotArchives_id='" + rckdaRes[j].id + "'";
            var rckdagjRes = queryData(rckdagjSql);
            if (rckdagjRes.length > 0) {
              for (var k = 0; k < rckdagjRes.length; k++) {
                var upateRckdaGj = { id: rckdagjRes[k].id, issuingContract_status: "3" };
                updateData("perDepotArchives_c", upateRckdaGj, "207c857b");
              }
            }
            //查询出证合同数据
            var czhtsql = "select * from GT60601AT58.GT60601AT58.issuingContract where dr=0 and issuingContract_status=2 and receiContract_code='" + rckdaRes[j].id + "'";
            var czhtres = queryData(czhtsql);
            if (czhtres.length > 0) {
              for (var q = 0; q < czhtres.length; q++) {
                //将出证合同数据状态改为【合同到期】
                var upateCzht = { id: czhtres[q].id, issuingContract_status: "3" };
                updateData("issuingContract", upateCzht, "909674b8");
                //依据出证合同查询内部人才库数据
                var rckSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot where dr=0 and innerStatus in (1,2) and issuingContract_code='" + czhtres[q].id + "'";
                var rckRes = queryData(rckSql);
                if (rckRes.length > 0) {
                  for (var a = 0; a < rckRes.length; a++) {
                    //更改内部人才库主表数据
                    var upateRck = { id: rckRes[a].id, innerStatus: "4" };
                    updateData("serCenPerDepot", upateRck, "9a3bc57c");
                    //查询人才库轨迹数据
                    var rckgjSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot_a where dr=0 and circuStatus in (1,2,3) and serCenPerDepot_id='" + rckRes[a].id + "'";
                    var rckgjRes = queryData(rckgjSql);
                    if (rckgjRes.length > 0) {
                      //更新人才库轨迹数据
                      for (var b = 0; j < rckgjRes.length; j++) {
                        var upateGj = { id: rckgjRes[b].id, circuStatus: "4" };
                        updateData("serCenPerDepot_a", upateGj, "9a3bc57c");
                      }
                    }
                    //查询内部流转单数据
                    var lzdSql = "select * from GT60601AT58.GT60601AT58.serCenInnerCircu where dr=0 and innerStatus in(2,3) and cerContract_number='" + rckRes[a].id + "'";
                    var lzdRes = queryData(lzdSql);
                    if (lzdRes.length > 0) {
                      for (var d = 0; d < lzdRes.length; d++) {
                        //更新内部流转单数据
                        var upateLzd = { id: lzdRes[d].id, innerStatus: "4" };
                        updateData("serCenInnerCircu", upateLzd, "27b492a8");
                        //查询完结单数据
                        var wjdSql = "select * from GT60601AT58.GT60601AT58.circulationFinish where dr=0 and innerStatus=3 and entCust_name='" + lzdRes[d].id + "'";
                        var wjdRes = queryData(wjdSql);
                        //更新完结单数据
                        if (wjdRes.length > 0) {
                          for (var p = 0; p < wjdRes.length; p++) {
                            var upateWjd = { id: wjdRes[p].id, innerStatus: "4" };
                            updateData("circulationFinish", upateWjd, "e7f4a94f");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return { nowstr };
  }
}
exports({ entryPoint: MyTrigger });