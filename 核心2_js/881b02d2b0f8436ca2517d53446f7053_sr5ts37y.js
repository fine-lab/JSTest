viewModel.get("button34lf") &&
  viewModel.get("button34lf").on("click", function (args) {
    // 按钮--单击
    const arrays = viewModel.getGridModel().getSelectedRows();
    if (arrays.length == 0) {
      cb.utils.alert("请至少选择一条数据");
      return false;
    }
    for (const row of arrays) {
      if (row.verifystate == 0) {
        cb.rest.invokeFunction("AT1665917408780003.openApi.gengxinztapi", { id: row.id, shifoushengchengfapiao: "1", verifystate: 2 }, function (err, res) {
          viewModel.execute("refresh");
        });
      }
    }
  });
viewModel.get("button45uf") &&
  viewModel.get("button45uf").on("click", function (data) {
    // 弃审--单击
    const arrays = viewModel.getGridModel().getSelectedRows();
    if (arrays.length == 0) {
      cb.utils.alert("请至少选择一条数据");
      return false;
    }
    for (const row of arrays) {
      if (row.verifystate == 2 && row.shifoushengchengfapiao != "2") {
        cb.rest.invokeFunction("AT1665917408780003.openApi.gengxinztapi", { id: row.id, shifoushengchengfapiao: "3", verifystate: 0 }, function (err, res) {
          viewModel.execute("refresh");
        });
      }
    }
  });