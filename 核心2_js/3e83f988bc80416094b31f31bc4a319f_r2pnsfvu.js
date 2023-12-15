function initExt(event) {
  let viewModel = this;
  console.log("%c%s: %o", "color:red", "主子拉平refer-afterInit", event);
  viewModel.on("afterMount", function (event) {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function (event) {
      console.log("%c%s: %o", "color:red", "filterArea-afterInit", event);
      filtervm.get("org_id").getFromModel().setReadOnly(true);
    });
  });
}