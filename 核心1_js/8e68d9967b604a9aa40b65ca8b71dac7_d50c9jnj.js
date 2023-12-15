let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateStatusObj = request.updateStatusObj;
    var is_quote = request.is_quote;
    if (is_quote == "1") {
      // 结算，直接更新
      var res1 = ObjectStore.updateBatch("AT160194EA17D00009.AT160194EA17D00009.calcmappingtable", updateStatusObj, "ybf14d8a20");
      return { res1 };
    }
    // 查询是否存在其他的数据引用，存在则不更新物料映射状态
    var detailIds = request.detailIds;
    var calIds = request.calIds;
    let sql = "select detail.id,detail.calId from AT160194EA17D00009.AT160194EA17D00009.saleSettle ";
    sql += " inner join AT160194EA17D00009.AT160194EA17D00009.saleSettleDetail detail on detail.saleSettle_id = id ";
    sql += " where detail.id not in (" + detailIds + ") ";
    sql += " and detail.calId in (" + calIds + ") ";
    sql += " and billStatus = '2' ";
    var detailRes = ObjectStore.queryByYonQL(sql);
    let updateObj = [];
    var res;
    if (detailRes && detailRes.length > 0) {
      for (var i = 0; i < detailRes.length; i++) {
        for (var j = 0; j < updateStatusObj.length; j++) {
          if (!updateStatusObj[j].flag && detailRes[i].detail_calId == updateStatusObj[j].id) {
            updateStatusObj[j].flag = "0";
          }
        }
      }
      for (var z = 0; z < updateStatusObj.length; z++) {
        if (!updateStatusObj[z].flag) {
          updateObj.push(updateStatusObj[z]);
        }
      }
      if (updateObj && updateObj.length > 0) {
        res = ObjectStore.updateBatch("AT160194EA17D00009.AT160194EA17D00009.calcmappingtable", updateObj, "ybf14d8a20");
      }
    } else {
      res = ObjectStore.updateBatch("AT160194EA17D00009.AT160194EA17D00009.calcmappingtable", updateStatusObj, "ybf14d8a20");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });