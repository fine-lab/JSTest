viewModel.get("button37lf") &&
  viewModel.get("button37lf").on("click", function (data) {
    // 物理删除--单击
    cb.rest.invokeFunction("GT29AT27.api.deleteBatch", {}, function (err, res) {
      alert(res);
      alert("删除成功");
    });
  });