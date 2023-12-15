viewModel.on("customInit", function (data) {
  //费用结算单--页面初始化
  viewModel.getGridModel("settlementApplyInfs").on("beforeSetDataSource", function (args) {
    debugger;
    for (let i = 0; i < args.length; i++) {
      let row = args[i];
      row.settlementapplyinfoDefineCharacter__XSDD003_name; //销售组
      row.settlementapplyinfoDefineCharacter__XSDD001_name; //销售办公室
    }
  });
  viewModel.on("afterLoadData", function (data) {});
});