viewModel.on("customInit", function (data) {
  // 询价单--页面初始化
  viewModel.on("afterLoadData", function () {
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (true) {
      //新增状态ycSouringInquiry.backDesignerFunction.queryPraybill
      var hids = [];
      var reqids = [];
      var planTotalMny = viewModel.get("planTotalMny").getValue();
      viewModel.get("budgetMny").setValue(planTotalMny);
    }
  });
});
viewModel.on("customInit", function (data) {
  //询价单--页面初始化
  cb.rest.invokeFunction("ycSouringInquiry.backDesignerFunction.queryBuyOfferSql", {}, function (err, res) {
    debugger;
  });
});