let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let detilsArray = new Array();
    for (var i = 0; i < request.data.currency_daily_repoList.length; i++) {
      // 子表数据
      let details = {
        // 渠道
        channel: request.data.currency_daily_repoList[i].channel,
        // 应收金额
        amountReceivable: request.data.currency_daily_repoList[i].amountReceivable,
        // 实收组成
        paidInComposition: request.data.currency_daily_repoList[i].paidInComposition,
        // 实收金额
        paidInAmount: request.data.currency_daily_repoList[i].paidInAmount,
        //科目编码
        accountCode: request.data.currency_daily_repoList[i].accountCode
      };
      detilsArray.push(details);
    }
    // 主表数据
    let requestBody = {
      // 主组织
      org_id: request.data.org_id,
      // 单据日期
      documentDate: request.data.documentDate,
      // 仓库名称
      warehouse: request.data.wareHouse,
      // 币种
      currency: request.data.currency,
      // 编码
      code: request.data.code,
      // 子表集合
      currency_daily_repoList: detilsArray
    };
    var res = ObjectStore.insert("GT5646AT1.GT5646AT1.shoukuanribao", requestBody, "33055860");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });