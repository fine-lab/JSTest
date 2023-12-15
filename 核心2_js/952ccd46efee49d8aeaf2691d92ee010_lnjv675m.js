viewModel.get("button11xg") &&
  viewModel.get("button11xg").on("click", function (data) {
    // 重新生成销售订单--单击
    let rows = model.getSelectedRows();
    console.log("rows", JSON.stringify(rows));
  });