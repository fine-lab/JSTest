viewModel.on("afterMount", function (data) {
  var id = viewModel.getParams().shopid;
  console.log("============>", id);
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  console.log("============>", filtervm);
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    let md = filtervm.get("shop");
    console.log("============>", md);
    md.getFromModel().setValue(id);
    console.log("============>", md);
    filtervm.get("search").fireEvent("click");
  });
});
viewModel.on("customInit", function (data) {
  //订单列表模态框--页面初始化
});