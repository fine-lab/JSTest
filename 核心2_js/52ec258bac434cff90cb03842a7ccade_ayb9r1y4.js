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
          //总预支金额
          let totalAdvanceAmount = 0;
          //安全储备金
          let safeReserve = 0;
          //最终结算金额
          let finalSettlementAmount = 0;
          let detailsOfLiftingStatementList = dataItem.detailsOfLiftingStatementList;
          let updateList = [];
          if (detailsOfLiftingStatementList.length > 0) {
            for (let j = 0; j < detailsOfLiftingStatementList.length; j++) {
              let detailItem = detailsOfLiftingStatementList[j];
              //已预支金额
              let amountAdvanced = detailItem.amountAdvanced;
              if (amountAdvanced) {
                totalAdvanceAmount = totalAdvanceAmount + amountAdvanced;
              }
              //吊装费小计
              let hoistingFeeSubtotal = detailItem.hoistingFeeSubtotal;
              //结算金额
              let settlementAmount = 0;
              if (hoistingFeeSubtotal && amountAdvanced) {
                settlementAmount = hoistingFeeSubtotal - amountAdvanced;
                amountInTotal = amountInTotal + settlementAmount;
              }
              let body = {
                id: detailItem.id,
                settlementAmount: settlementAmount,
                _status: "Update"
              };
              updateList.push(body);
            }
          }
          //安全储备金 =合计金额*10%
          safeReserve = 0;
          //最终结算金额 = 合计金额-总预支金额-储备金-其他金额
          let otherExpenses = dataItem.otherExpenses;
          if (!otherExpenses) {
            otherExpenses = 0;
          }
          finalSettlementAmount = amountInTotal - totalAdvanceAmount - safeReserve - otherExpenses;
          var object = {
            id: id,
            amountInTotal: amountInTotal,
            totalAdvanceAmount: totalAdvanceAmount,
            safeReserve: safeReserve,
            finalSettlementAmount: finalSettlementAmount,
            detailsOfLiftingStatementList: updateList
          };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.liftTheBalanceSheet", object, "5f546a23");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });