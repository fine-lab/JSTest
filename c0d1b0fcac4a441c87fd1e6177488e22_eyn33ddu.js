viewModel.get("wenben") &&
  viewModel.get("wenben").on("beforeValueChange", function (data) {
    //文本--值改变前
    alert("我是一个前端函数");
  });