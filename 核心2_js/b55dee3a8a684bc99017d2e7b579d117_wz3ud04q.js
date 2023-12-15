// 供应商银行账户维护--页面初始化
viewModel.on("customInit", function (e) {
  //弹框实现/打开页面弹窗的代码
  viewModel.get("button24wd").on("click", function (data) {
    let param = {
      billtype: "voucherList", //列表页面，传的都是 voucherList，定义了页面的央视
      billno: "558892b5", //是需要打开的页面编码，即页面建模的编码
      params: {
        mode: "browse" //打开的模式：编辑态，新增态，浏览态
      }
    };
    cb.loader.runCommandLine("bill", param, viewModel);
  });
});