viewModel.get("button67qk") &&
  viewModel.get("button67qk").on("click", function (data) {
    // 测试--单击
    let datas = {
      billtype: "Voucher", // 单据类型
      billno: "yb5ff79496", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (卡片页面区分编辑态edit、新增态add、)
        code: "2532008961347840" //TODO:填写详情id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", datas, viewModel);
  });