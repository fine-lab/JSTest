let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿到数据
    var data = param.data[0];
    var { id } = data;
    var { ProjectNo } = data;
    var { SaveType } = data;
    var { QuoteBillNo } = data;
    var { VersionNo } = data;
    //新增或另存
    if (SaveType == 1 || SaveType == 3) {
      const query_sql = "select id,VersionNo,HistoryVersionNo from GT9604AT11.GT9604AT11.QuoteBill_M where 1=1 and QuoteBillNo like '" + ProjectNo + "'";
      var res = ObjectStore.queryByYonQL(query_sql);
      var maxVersionNo = 1;
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].VersionNo === "undefined" || res[i].VersionNo === null || res[i].VersionNo === "") {
            continue;
          }
          if (parseInt(res[i].VersionNo) >= maxVersionNo) {
            maxVersionNo = parseInt(res[i].VersionNo);
          }
        }
        maxVersionNo++;
      }
      var newVersionNo = maxVersionNo;
      var newHistoryVersionNo = 1;
      var versionNoStr = "0" + newVersionNo;
      var s1 = versionNoStr.substring(versionNoStr.length - 2, versionNoStr.length);
      var s2 = String.fromCharCode(newHistoryVersionNo + 64);
      var QuoteBillNo1 = ProjectNo + "-DT" + s1 + "-" + s2;
      var parentNo = ProjectNo + "-DT" + s1;
      var object = { id: id, QuoteBillNo: QuoteBillNo1, VersionNo: newVersionNo, HistoryVersionNo: newHistoryVersionNo, ParentNo: parentNo };
      res = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object);
    }
    //修改
    if (SaveType == 2) {
      versionNoStr = "0" + VersionNo;
      s1 = versionNoStr.substring(versionNoStr.length - 2, versionNoStr.length);
      var subBillNo = ProjectNo + "-DT" + s1 + "-";
      parentNo = ProjectNo + "-DT" + s1;
      const query_sql1 = "select id,HistoryVersionNo,IsMaster from GT9604AT11.GT9604AT11.QuoteBill_M where 1=1 and QuoteBillNo like '" + subBillNo + "'";
      res = ObjectStore.queryByYonQL(query_sql1);
      var maxHVersionNo = 1;
      if (res.length > 0) {
        for (i = 0; i < res.length; i++) {
          res[i].IsMaster = "0";
          if (res[i].HistoryVersionNo === "undefined" || res[i].HistoryVersionNo === null || res[i].HistoryVersionNo === "") {
            continue;
          }
          if (parseInt(res[i].HistoryVersionNo) >= maxHVersionNo) {
            maxHVersionNo = parseInt(res[i].HistoryVersionNo);
          }
        }
        //更新主报价单状态
        var resMsg = ObjectStore.updateBatch("GT9604AT11.GT9604AT11.QuoteBill_M", res);
        maxHVersionNo++;
      }
      //修改待新增的历史报价编号，以及报价单编号；
      var QuoteBillNo2 = subBillNo + String.fromCharCode(maxHVersionNo + 64);
      object = { id: id, QuoteBillNo: QuoteBillNo2, HistoryVersionNo: maxHVersionNo, ParentNo: parentNo };
      res = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });