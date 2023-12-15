let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.importType == 2) {
      let data = param.data;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];
          let id = dataItem.id;
          //合计金额
          let amountInTotal = 0;
          //安全储备金
          let safeReserve = 0;
          //最终结算金额
          let finalSettlementAmount = 0;
          let additionalStatementDetailsList = dataItem.additionalStatementDetailsList;
          let updateList = [];
          if (additionalStatementDetailsList.length > 0) {
            for (let j = 0; j < additionalStatementDetailsList.length; j++) {
              let detailItem = additionalStatementDetailsList[j];
              //应结算金额
              let settlementAmount = detailItem.settlementAmount;
              if (settlementAmount) {
                amountInTotal = amountInTotal + settlementAmount;
              }
              //已预支金额
              let amountAdvanced = detailItem.amountAdvanced;
              //本次应结算金额=应结算-已预支金额
              let settlementAmountThisTime = 0;
              if (settlementAmount && amountAdvanced) {
                settlementAmountThisTime = settlementAmount - amountAdvanced;
              }
              let body = {
                id: detailItem.id,
                settlementAmountThisTime: settlementAmountThisTime,
                amountAdvanced: amountAdvanced,
                _status: "Update"
              };
              updateList.push(body);
            }
          }
          //安全储备金 =合计金额*10%
          safeReserve = amountInTotal * 0.1;
          //最终结算金额 = 合计金额-储备金
          finalSettlementAmount = amountInTotal - safeReserve;
          var object = { id: id, amountInTotal: amountInTotal, safeReserve: safeReserve, finalSettlementAmount: finalSettlementAmount, additionalStatementDetailsList: updateList };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.additionalStatement", object, "a8d3fa5b");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });