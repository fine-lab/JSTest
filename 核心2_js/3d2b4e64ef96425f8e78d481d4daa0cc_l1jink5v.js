let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mainObj = param.data[0];
    let actionSource = context.billnum;
    let actionName = context.action.toLowerCase();
    if (mainObj.fdOrderSource === "经销商") {
      if (["a497e816", "a497e816List"].indexOf(actionSource) >= 0 && actionName.indexOf("unsubmit") >= 0) {
        return {};
      }
    }
    if (mainObj.id != undefined) {
      //根据返利UID查找记录
      var sql = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where rpId = '" + mainObj.id + "'";
      var rebateList = ObjectStore.queryByYonQL(sql);
      var updateRecords = [];
      var idStr = "";
      var updateObj = {};
      for (var prop = 0; prop < rebateList.length; prop++) {
        if (rebateList[prop].rpParentId != undefined) {
          idStr = idStr.replace(rebateList[prop].rpParentId + ",", "");
          idStr += rebateList[prop].rpParentId + ",";
          if (updateObj[rebateList[prop].rpParentId] == undefined) {
            updateObj[rebateList[prop].rpParentId] = 0;
          }
          updateObj[rebateList[prop].rpParentId] += rebateList[prop].rgExQuantity;
        }
      }
      if (idStr.length <= 0) {
        return {};
      }
      idStr = idStr.substring(0, idStr.length - 1);
      //查询parent 记录
      var upRes = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MRebateProductsLog where id in (" + idStr + ") ");
      for (var prop = 0; prop < upRes.length; prop++) {
        var updateRow = {};
        updateRow.id = upRes[prop].id;
        updateRow.rpAftQuantity = upRes[prop].rpAftQuantity + updateObj[upRes[prop].id];
        updateRecords.push(updateRow);
      }
      //删除记录
      var res = ObjectStore.deleteBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", rebateList);
      //更新记录
      var res = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", updateRecords);
      if (updateRecords.length == 0 || res.length != updateRecords.length) {
        throw new Error("提交失败：更新记录为空");
      }
      //更新前置订单
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });