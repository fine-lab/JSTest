// 检索之前进行条件过滤
viewModel.on("beforeSearch", function (args) {
  const orgName = "南京润辰科技有限公司";
  cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.queyUsccByYonQL", { orgName: orgName }, function (err, res) {
    debugger;
    var result = res.response;
  });
  args.isExtend = true;
  //通用检查查询条件
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "receiverUscc",
    value1: "91320114MA1W7JU846"
  });
});