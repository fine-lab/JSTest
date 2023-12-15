viewModel.get("button19pd") &&
  viewModel.get("button19pd").on("click", function (data) {
    // 删除全部--单击
    debugger;
    var BOMresponse = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.querySafetyStock", {}, function (err, res) {}, viewModel, { async: false });
    if (BOMresponse.result.arr) {
      var array = BOMresponse.result.arr;
      for (var i = 0; i < array.length; i++) {
        var del = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.batchDelStock", { arr: array[i] }, function (err, res) {}, viewModel, { async: false });
      }
      alert("单据删除成功");
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });