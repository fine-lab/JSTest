viewModel.on("customInit", function (data) {
  // 董事长寄语--页面初始化
  const allData = viewModel.getAllData();
  const id = viewModel.getAppContext().yb9ab447bdList.query.id;
  if (id) {
    const obj = {
      //单据类型：VoucherList为列表类型   voucher为卡片类型
      billtype: "Voucher",
      //单据号
      billno: "yb9ab447bd",
      params: {
        // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
        mode: "browse",
        id: id, //TODO:填写详情id
        domainKey: "yourKeyHere",
        readOnly: true
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", obj, viewModel);
  }
});