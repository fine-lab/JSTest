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
          let shedSettlementStatementDetailList = dataItem.shedSettlementStatementDetailList;
          let updateList = [];
          if (shedSettlementStatementDetailList.length > 0) {
            for (let j = 0; j < shedSettlementStatementDetailList.length; j++) {
              let detailItem = shedSettlementStatementDetailList[j];
              //搭棚费小计
              let shedFeeSubtotal = detailItem.shedFeeSubtotal;
              if (shedFeeSubtotal) {
                amountInTotal = amountInTotal + shedFeeSubtotal;
              }
              //已预支金额
              let amountAdvanced = detailItem.amountAdvanced;
              if (amountAdvanced) {
                totalAdvanceAmount = totalAdvanceAmount + amountAdvanced;
              }
              //结算金额
              let settlementAmount = 0;
              if (shedFeeSubtotal && amountAdvanced) {
                settlementAmount = shedFeeSubtotal - amountAdvanced;
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
            shedSettlementStatementDetailList: updateList
          };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.shedSettlementForm", object, "e30c0412");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });