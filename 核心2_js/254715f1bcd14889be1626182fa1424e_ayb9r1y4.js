let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.importType == 2) {
      let data = param.data;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];
          let id = dataItem.id;
          //合计支出金额
          let totalAmountOfExpenditure = 0;
          let expend_Information_detailsList = dataItem.expend_Information_detailsList;
          let updateList = [];
          if (expend_Information_detailsList.length > 0) {
            for (let j = 0; j < expend_Information_detailsList.length; j++) {
              let detailItem = expend_Information_detailsList[j];
              //支出金额
              let expendAmount = detailItem.expendAmount;
              if (expendAmount) {
                totalAmountOfExpenditure = totalAmountOfExpenditure + expendAmount;
              }
            }
          }
          var object = { id: id, totalAmountOfExpenditure: totalAmountOfExpenditure };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.spending_on_information", object, "95792ca8");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });