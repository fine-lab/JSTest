viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  var viewModel = this;
  //获取子表元素
  let gridModelSun = viewModel.get("xiaoshoudingdan_detail_1List");
  //获取子表数据
  gridModelSun.on("afterCellValueChange", (data) => {
    let gridData = gridModelSun.getData();
    let totalNum = 0;
    let totalPrice = 0;
    gridData.forEach((item) => {
      if (item.shuliang) {
        totalNum += Number(item.shuliang);
      }
      if (item.chanpinjiashuiheji) {
        totalPrice += Number(item.chanpinjiashuiheji);
      }
    });
    viewModel.get("zongshuliang").setValue(totalNum);
    viewModel.get("jiashuiheji").setValue(totalPrice);
  });
});