viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  let viewModel = this;
  //获取子表合集
  let grid_model = viewModel.get("user_defined_salesOrder_detailList");
  //获取子表元素
  grid_model.on("afterCellValueChange", (data) => {
    let grid_data = grid_model.getData();
    let total_num = 0;
    let total_price = 0;
    grid_data.forEach((item) => {
      if (item.shuliang) {
        total_num += Number(item.shuliang);
      }
      if (item.jinexiaoji) {
        total_price += Number(item.jinexiaoji);
      }
    });
    viewModel.get("zongshuliang").setValue(total_num);
    viewModel.get("zongjine").setValue(total_price);
  });
});