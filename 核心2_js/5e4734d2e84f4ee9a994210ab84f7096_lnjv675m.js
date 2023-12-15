viewModel.get("button43nd") &&
  viewModel.get("button43nd").on("click", function (data) {
    //新增系统部门--单击
    data = viewModel.getGridModel().getSelectedRows(); //获取当前页已选中行的数据
    if (data.length > 0) {
      cb.rest.invokeFunction("GT34544AT7.dept.adDByOwnArr", { data: data }, function (err, res) {
        if (err) {
          console.log("err", JSON.stringify(err));
          cb.utils.alert("同步失败！\n" + err.message, "error");
        }
        if (res) {
          console.log("res", JSON.stringify(res));
          cb.utils.alert("同步成功！", "success");
        }
      });
    } else {
      cb.utils.alert("请选择至少一条数据！", "info");
    }
  });