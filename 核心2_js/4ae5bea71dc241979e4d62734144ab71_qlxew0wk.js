viewModel.on("beforeSearch", function (args) {
  var user = this.getAppContext().user;
  var userId = user.userId;
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  commonVOs.push({
    itemName: "miaoshu",
    op: "eq",
    value1: userId
  });
});