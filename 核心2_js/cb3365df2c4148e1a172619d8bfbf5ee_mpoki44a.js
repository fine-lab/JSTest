viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("GT3AT2.backDesignerFunction.getUserType", {}, function (err, res) {
    let userType = res.data[0].userType;
    if (userType == 1) {
      //当用户类型为供应商时，更改商函的查看状态为已读
      let datauri = "GT3AT2.GT3AT2.zgcftzd_02";
      data.shigongdanweichakanzhuangtai = "1";
      cb.rest.invokeFunction("GT3AT2.backDesignerFunction.supplyReaded", { data, datauri: datauri }, function (err, res) {});
    }
  });
});
viewModel.get("1671686743653_1").on("click", function (data) {
  debugger;
  var args = {
    cCommand: "cmdUnsubmit",
    cAction: "unsubmit",
    cSvcUrl: "/bill/unsubmit",
    cHttpMethod: "POST",
    domainKey: "yourKeyHere"
  };
  viewModel.biz.do("unsubmit", viewModel, args);
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "b9ff01d8";
});