viewModel.on("customInit", function (data) {
  // 工作移交--页面初始化
});
viewModel.on("beforeSave", function (data) {
  debugger;
  let obj = {
    oldOwner_name: viewModel.get("oldOwner_name").getValue(),
    oldOwner: viewModel.get("oldOwner").getValue(),
    oldOwnerOrg_name: viewModel.get("oldOwnerOrg_name").getValue(),
    newOwner_name: viewModel.get("newOwner_name").getValue(),
    newOwner: viewModel.get("newOwner").getValue(),
    newOwnerOrg_name: viewModel.get("newOwnerOrg_name").getValue()
  };
  const opptIdList = viewModel
    .get("workHandOverOpptDetailList")
    .getAllData()
    .map((item) => item.oppt);
  const cliIdList = viewModel
    .get("workHandOverCustDetailList")
    .getAllData()
    .map((item) => item.customer);
  if (opptIdList) {
    obj["opptIdList"] = opptIdList;
  }
  if (cliIdList) {
    obj["cliIdList"] = cliIdList;
  }
  cb.rest.invokeFunction(
    "ACT.transfer.TransferStaff",
    obj,
    function (err, res) {
      debugger;
    }
  );
});