viewModel.get("zongbaolianxiren") &&
  viewModel.get("zongbaolianxiren").on("afterValueChange", function (data) {
    // 总包联系人--值改变后
    var tt = cb.rest.invokeFunction("GT102917AT3.API.ceshi", {}, function (err, res) {}, viewModel, { async: false });
    var date = new Date().format("yyyy-MM-dd hh:mm:ss");
  });