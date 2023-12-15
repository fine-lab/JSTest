let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.data[0];
    //只修改门户的数据
    if (requestData.salereturnDefineCharacter && requestData.salereturnDefineCharacter.headDefine10 == "是") {
      //退货类型
      let saleReturnSourceType = requestData.saleReturnSourceType;
      //退货原因
      let saleReturnReason = requestData.saleReturnReason;
      let proList = requestData.saleReturnDetails;
      //修改交易类型
      if (saleReturnSourceType == "NONE" && saleReturnReason == "无理由退货") {
        //改为无理由退货
        requestData.set("transactionTypeId", "1845501637107908610");
      }
      if (saleReturnSourceType == "NONE" && saleReturnReason == "质量问题退货") {
        //改为质量问题退货
        requestData.set("transactionTypeId", "1845501740190269443");
      }
      //修改是否新单补货
      if (saleReturnSourceType == "NONE" && saleReturnReason == "无理由退货") {
        proList.forEach((item) => {
          //子表字段“是否新单补货”为“是”
          item.set("newOrderSupplyAgain", "true");
        });
      }
      if (saleReturnSourceType == "NONE" && saleReturnReason == "质量问题退货") {
        proList.forEach((item) => {
          //子表字段“是否新单补货”为“否”
          item.set("newOrderSupplyAgain", "false");
        });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });