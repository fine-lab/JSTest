viewModel.get("button25pg") &&
  viewModel.get("button25pg").on("click", function (data) {
    // 按钮啊--单击
    //获取选择到的行
    var rows = viewModel.getGridModel().getSelectedRows();
    // 函数API地址
    var apiUrl = "GT45627AT16.ssgl.sstzdsp";
    // 需要查询的收款单id和
    let request = {
      entity: rows[0]
    };
    if (rows.length > 1) {
      cb.utils.alert("一次只能审核一条数据", "error");
    } else {
      if (rows[0].documents_state === "开立态") {
        cb.rest.invokeFunction(apiUrl, request, function (err, res) {
          if (res.testMassage == "success") {
            cb.utils.alert("审核完成", "success");
            viewModel.execute("refresh");
          }
        });
      } else {
        cb.utils.alert("请务重复审批", "error");
      }
    }
  });