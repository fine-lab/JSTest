viewModel.on("afterAddProduct", function (args) {
  let storeId = viewModel.getAppContext().user.storeId;
  let orgId = viewModel.getAppContext().user.orgId;
  let storetax = cb.rest.invokeFunction("RM.API.getTaxByStore", { org: orgId, store: storeId }, function (err, res) {}, viewModel, {
    async: false
  });
  if (storetax.result.code == "200") {
    try {
      args.exportData.dataSource.forEach((data) => {
        data["retailVouchDetailExtend!taxRate"] = storetax.result.ntaxrate;
      });
    } catch (e) {
      cb.utils.alert(e.toString());
    }
  }
});
viewModel.on("beforeSaveService", function (args) {
  debugger;
  try {
    let saveInfo = JSON.parse(args.config.params.data);
    if (saveInfo.rm_retailvouch) {
      saveInfo.rm_retailvouch["retailVouchCustom!define2"] = saveInfo.rm_retailvouch.iMemberid_name;
    }
    args.config.params.data = JSON.stringify(saveInfo);
  } catch (e) {
    cb.utils.alert(e.toString());
  }
});
viewModel.on("beforeExecBottomActionLogic", function (args) {
  if (args.key == "DoSaleByVipPoint") {
  }
});
viewModel.get("fPointPay").on("beforeValueChange", function (data) {
  //抵扣积分改变事件
  console.log("积分改变", data);
});