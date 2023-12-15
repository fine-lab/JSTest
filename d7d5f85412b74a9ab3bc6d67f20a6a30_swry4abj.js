viewModel.get("wenben") &&
  viewModel.get("wenben").on("beforeValueChange", function (data) {
    //文本--值改变前
    alert("xxx");
  });
viewModel.get("wenben") &&
  viewModel.get("wenben").on("afterValueChange", function (data) {
    //文本--值改变后
    alert("xxx");
  });