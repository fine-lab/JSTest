function getDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentDate;
}
viewModel.on("beforeSearch", (args) => {
  let startDate = viewModel.getCache("FilterViewModel").get("ziduan3").getFromModel().getValue();
  let endDate = viewModel.getCache("FilterViewModel").get("ziduan3").getToModel().getValue();
  if (startDate) {
    if (!endDate) {
      endDate = getDate();
    }
    //删除commonvos中的ziduan3
    let commonVOs = args.params.condition.commonVOs;
    let newCommonVOs = commonVOs.filter((item, index) => {
      return item.itemName !== "ziduan3";
    });
    args.params.condition.commonVOs = newCommonVOs;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "ziduan3",
          op: "egt",
          value1: startDate
        },
        {
          field: "ziduan3",
          op: "elt",
          value1: endDate
        }
      ]
    });
  }
});