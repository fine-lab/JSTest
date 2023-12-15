viewModel.on("beforeSearch", function (args) {
  var user = this.getAppContext().user;
  var userId = user.userId;
  debugger;
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  commonVOs.push({
    itemName: "mingxi123List_caigouid",
    op: "eq",
    value1: "000000000"
  });
});