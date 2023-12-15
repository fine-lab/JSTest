viewModel.on("afterMount", function () {
  jDiwork.getData({ serviceCode: "18802b06-6f16-4674-bfe1-80b6bb4b0716" }, (data) => {
    //判断是否从单据跳转过来，如果为单据跳转则进入卡片界面，否则正常进入列表界面
    if (cb.utils.isEmpty(data.billno)) {
    } else {
      cb.loader.runCommandLine(
        "bill",
        {
          billtype: "Voucher",
          billno: "91c4cede",
          params: {
            perData: data
          }
        },
        viewModel
      );
    }
  });
});
let proxy = viewModel.setProxy({
  queryData: {
    url: "/scmbc/barprint/orderBytenId",
    method: "GET"
  }
});
let param = {};
proxy.queryData(param, function (err, result) {
  if (result.returnCode == "1") {
    cb.utils.alert(result.returnDesc);
  } else if (result.returnCode == "2") {
    cb.utils.alert(result.returnDesc);
    viewModel.setDisabled(true);
  }
});