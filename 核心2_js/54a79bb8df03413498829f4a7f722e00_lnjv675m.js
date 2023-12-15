viewModel.get("gxsstaff_1788984291337699329") &&
  viewModel.get("gxsstaff_1788984291337699329").on("afterSelect", function (data) {
    //表格--选择后
    let dataLength = data.length;
    if (dataLength > 1) {
      let i = dataLength - 1;
      delete data[i];
      viewModel.getGridModel().unselect(data); //取消选中的行
    }
  });
viewModel.get("gxsstaff_1788984291337699329") &&
  viewModel.get("gxsstaff_1788984291337699329").on("beforeSelectAll", function (data) {
    //表格--全选前
    return false;
  });
viewModel.on("beforeBatchpush", function (args) {
  debugger;
});
viewModel.get("button20qd") &&
  viewModel.get("button20qd").on("click", function (data) {
    //按钮--单击
    viewModel.get("btnBizFlowBatchPush").execute("click");
  });