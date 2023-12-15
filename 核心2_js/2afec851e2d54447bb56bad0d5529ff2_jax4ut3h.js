viewModel.on("customInit", function (data) {
  // 测试单据1详情--页面初始化
  cb.rest.invokeFunction(
    "83212a737c3b438485d12818450f8808",
    {}, //cfe534ef7192411fbe735833122e26b9  核销单  e5b7bf913d8f4c31ae0ee5bafc608684 借款单
    function (err, res) {
      console.log(err);
      console.log(res);
    }
  );
});