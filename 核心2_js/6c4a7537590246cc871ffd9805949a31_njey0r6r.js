viewModel.get("butyCode") &&
  viewModel.get("butyCode").on("blur", function (data) {
    //单据类型+单据编码--失去焦点的回调
    if (viewModel.get("butyCode").getValue()) {
      const res = viewModel.get("butyCode").getValue().replace("——", "_").replace("+", "/");
      var url = "https://www.example.com/" + res + "?domainKey=znbzbx&apptype=mdf&typecode=approve&tenantId=njey0r6r&source=RBSM&yssource=RBSM";
      window.open(url);
      viewModel.get("butyCode").clear();
    }
  });
viewModel.on("customInit", function (data) {
  //二维码转审批详情详情--页面初始化
  setTimeout(function () {
    document.getElementById("developplatforminputbutyCode").focus();
  }, 180);
});