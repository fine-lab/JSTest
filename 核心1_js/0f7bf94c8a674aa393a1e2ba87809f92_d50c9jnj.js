let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    let jsonObject = JSON.parse(requestData);
    let xxwparam = jsonObject.xxwparam;
    if (!xxwparam || !xxwparam.opDate || !xxwparam.snList) {
      return {};
    }
    let opDate = xxwparam.opDate; // 销售结算日期
    let snList = xxwparam.snList; // 销售结算单sn明细
    let inSql = "";
    for (var i = 0; i < snList.length; i++) {
      inSql = inSql + "'" + snList[i] + "'";
      if (i != snList.length - 1) {
        inSql = inSql + ",";
      }
    }
    let querySql = " select id, opDate,code, (select * from saleSettleDetailList) saleSettleDetailList from AT160194EA17D00009.AT160194EA17D00009.saleSettle ";
    querySql += " where opDate = '" + opDate + "' and saleSettleDetailList.sn in (" + inSql + ")  "; // and billStatus = '2'
    let result = ObjectStore.queryByYonQL(querySql, "developplatform");
    let repeatSnSet = new Set();
    if (result && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        let saleSettle = result[i];
        if (saleSettle.id && xxwparam.id && saleSettle.id == xxwparam.id) {
          continue;
        }
        let saleSettleDetailList = saleSettle.saleSettleDetailList;
        if (saleSettleDetailList && saleSettleDetailList.length > 0) {
          for (var j = 0; j < saleSettleDetailList.length; j++) {
            if (saleSettleDetailList[j] && saleSettleDetailList[j].sn && snList.includes(saleSettleDetailList[j].sn)) {
              repeatSnSet.add(saleSettleDetailList[j].sn);
            }
          }
        }
      }
    }
    if (repeatSnSet.size > 0) {
      let errorMsg = "已有结算单, 结算日期:" + opDate + " , SN:";
      let array = Array.from(repeatSnSet);
      errorMsg = errorMsg + array.join(", ");
      throw new Error(errorMsg);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });