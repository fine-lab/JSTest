viewModel.get("button26zg") &&
  viewModel.get("button26zg").on("click", function (data) {
    // 查询--单击
    var gridModel = viewModel.getGridModel();
    const index = gridModel.getSelectedRows();
    var list = JSON.stringify(index);
    let listdata = JSON.parse(list);
    debugger;
    if (index.length == 0) {
      cb.utils.alert("请选择要查询的单号");
    } else {
      cb.rest.invokeFunction("GT1691AT14.frontDesignerFunction.dykd100", { data: listdata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });