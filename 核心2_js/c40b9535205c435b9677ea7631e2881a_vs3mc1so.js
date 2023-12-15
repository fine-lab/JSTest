let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let detilsArray = new Array();
    let deliveryChannelArray = new Array();
    let billingTypeArray = new Array();
    let foodSubjectKeyList = new Array();
    let discountList = new Array();
    // 初始实收金额
    var paidInAmount1 = 0;
    // 初始流水金额
    var runningAmount1 = 0;
    for (var i = 0; i < request.data.currency_daily_repoList.length; i++) {
      // 子表 结账方式数据
      let details = {
        // 渠道
        channel: request.data.currency_daily_repoList[i].channel,
        // 应收金额
        amountReceivable: request.data.currency_daily_repoList[i].amountReceivable,
        // 实收组成
        paidInComposition: request.data.currency_daily_repoList[i].paidInComposition,
        // 实收金额
        paidInAmount: request.data.currency_daily_repoList[i].paidInAmount,
        // 科目编码
        accountCode: request.data.currency_daily_repoList[i].accountCode,
        // 优惠金额
        discountAmount: request.data.currency_daily_repoList[i].discountAmount
      };
      detilsArray.push(details);
    }
    for (var i = 0; i < request.data.deliveryChannelList.length; i++) {
      // 子表 外卖渠道数据
      let details1 = {
        // 渠道
        deliveryChannel: request.data.deliveryChannelList[i].deliveryChannel,
        // 应收金额
        amountReceivable: request.data.deliveryChannelList[i].amountReceivable,
        // 实收组成
        paidInComposition: request.data.deliveryChannelList[i].paidInComposition,
        // 实收金额
        paidInAmount: request.data.deliveryChannelList[i].paidInAmount,
        // 优惠金额
        discountAmount: request.data.deliveryChannelList[i].discountAmount
      };
      paidInAmount1 = paidInAmount1 + details1.paidInAmount;
      runningAmount1 = runningAmount1 + details1.amountReceivable;
      deliveryChannelArray.push(details1);
    }
    for (var i = 0; i < request.data.billingTypeList.length; i++) {
      // 子表 账单类型数据
      let details2 = {
        // 账单类型
        billType: request.data.billingTypeList[i].billingType,
        // 应收金额
        amountReceivable: request.data.billingTypeList[i].amountReceivable,
        // 实收组成
        paidInComposition: request.data.billingTypeList[i].paidInComposition,
        // 实收金额
        paidInAmount: request.data.billingTypeList[i].paidInAmount,
        // 优惠金额
        discountAmount: request.data.billingTypeList[i].discountAmount
      };
      billingTypeArray.push(details2);
    }
    for (var i = 0; i < request.data.foodSubjectKeyList.length; i++) {
      // 子表 菜品收入科目数据
      let details3 = {
        // 菜品收入科目类型
        shourukemu: request.data.foodSubjectKeyList[i].foodSubjectType,
        // 菜品收入金额
        shourujine: request.data.foodSubjectKeyList[i].foodSubjectPrice
      };
      foodSubjectKeyList.push(details3);
    }
    for (var i = 0; i < request.data.discountList.length; i++) {
      // 子表 优惠组成数据
      let details4 = {
        // 优惠类型
        youhuileixing: request.data.discountList[i].discountType,
        // 优惠金额
        youhuijine: request.data.discountList[i].discountPrice
      };
      discountList.push(details4);
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
      // 人均消费
      perCapitaConsumption: paidInAmount1 / request.data.passengerFlow,
      // 单均消费
      averageConsumption: paidInAmount1 / request.data.numberOfBills,
      // 帐单数
      numberOfBills: request.data.numberOfBills,
      // 客流
      passengerFlow: request.data.passengerFlow,
      // 优惠金额
      discountAmount: runningAmount1 - paidInAmount1,
      // 实收金额
      paidInAmount: paidInAmount1,
      // 流水金额
      runningAmount: runningAmount1,
      // 子表集合
      currency_daily_repoList: detilsArray,
      deliveryChannelList: deliveryChannelArray,
      billingTypeList: billingTypeArray,
      foodRevenueAccountList: foodSubjectKeyList,
      PreferentialPositionList: discountList
    };
    var res = ObjectStore.insert("GT5646AT1.GT5646AT1.shoukuanribao", requestBody, "7891976a");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });