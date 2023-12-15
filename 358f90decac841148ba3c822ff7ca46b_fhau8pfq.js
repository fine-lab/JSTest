viewModel.on("customInit", function (data) {
  let billno = data.__data.params.cardKey;
  // 页面初始化后，跳转至表单页
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucher",
      billno: billno,
      params: { mode: "add" }
    },
    viewModel
  );
});