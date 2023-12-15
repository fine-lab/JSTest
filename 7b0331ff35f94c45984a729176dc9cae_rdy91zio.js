viewModel.get("button18ia") &&
  viewModel.get("button18ia").on("click", function (data) {
    //状态回传--单击
    console.log("状态回传");
    var rows = viewModel.getGridModel().getSelectedRows();
    // 状态回传--单击
    cb.rest.invokeFunction(
      "CKAM.rule.statusReturnVApi",
      { name: rows },
      function (err, res) {
        console.log(err);
        console.log(res);
        cb.utils.alert("回传成功");
      }
    );
  });