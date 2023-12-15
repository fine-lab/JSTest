viewModel.get("button44fa") &&
  viewModel.get("button44fa").on("click", function (data) {
    // 删除--单击
  });
viewModel.get("button59hb") &&
  viewModel.get("button59hb").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button71ia") &&
  viewModel.get("button71ia").on("click", function (data) {
    // 删行--单击
  });
viewModel.get("button44fa") &&
  viewModel.get("button44fa").on("customInit", function (data) {
    // 删除--单击
  });
viewModel.on("customInit", function (data) {});
// 商机详情--保存前
viewModel.on("beforeSave", function (data) {
  debugger;
  var gridModel = viewModel.get("jy_opp_detileList");
  //获取行数据集合
  const rows = gridModel.getRows();
  let yjqyje = 0;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].signing_amount != undefined && Number(rows[i].signing_amount) != NaN) {
      yjqyje += Number(rows[i].signing_amount);
    }
  }
  //赋值
  var param = JSON.parse(data.data.data);
  param.amount = yjqyje;
  data.data.data = JSON.stringify(param);
});