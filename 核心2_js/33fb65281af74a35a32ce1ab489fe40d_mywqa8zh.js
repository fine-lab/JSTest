viewModel.on("beforeBatchdelete", function (params) {
  var check = true;
  var selected = JSON.parse(params.data.data);
  selected.forEach((row) => {
    if (undefined != row.currentprogress && "" != row.currentprogress) {
      check = false;
      return;
    }
  });
  return check;
});
viewModel.get("button16kf") &&
  viewModel.get("button16kf").on("click", function (params) {
    // 商机跟进--单击
    var selected = viewModel.getGridModel().getSelectedRows();
    if (selected.length == 1) {
      //获取选中行数据信息
      //传递给被打开页面的数据信息
      let data = {
        billtype: "Voucher", // 单据类型
        billno: "yb82714c80", // 单据号
        params: {
          mode: "edit" // (编辑态edit、新增态add、浏览态browse)
          //传参
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    } else {
      cb.utils.alert("请选择一行数据！");
    }
  });
viewModel.get("button20mc") &&
  viewModel.get("button20mc").on("click", function (data) {
    // 商机详情--单击
    var selected = viewModel.getGridModel().getSelectedRows();
    if (selected.length == 1) {
      //获取选中行数据信息
      var id = selected[0].id;
      //传递给被打开页面的数据信息
      let data = {
        billtype: "Voucher", // 单据类型
        billno: "ybb8dfa2df", // 单据号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          id: id
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    } else {
      cb.utils.alert("请选择一行数据！");
    }
  });