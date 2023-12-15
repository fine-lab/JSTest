viewModel.get("entrustingParty") &&
  viewModel.get("entrustingParty").on("afterValueChange", function (data) {
    // 委托单位--值改变后
    cb.rest.invokeFunction("", {}, function (err, res) {});
  });
viewModel.get("entrustingParty") &&
  viewModel.get("entrustingParty").on("beforeValueChange", function (data) {
    // 委托单位--值改变前
  });
viewModel.get("safeReserve") &&
  viewModel.get("safeReserve").on("afterValueChange", function (data) {
    // 安全储备金--值改变后
    var a = "";
    var b = null;
    var c = 1;
    cb.utils.isEmpty(a);
    cb.utils.isEmpty(b);
    cb.utils.isEmpty(c);
  });