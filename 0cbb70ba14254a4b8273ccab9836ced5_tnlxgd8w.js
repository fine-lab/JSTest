viewModel.get("all1125ziList") &&
  viewModel.get("all1125ziList").getEditRowModel() &&
  viewModel.get("all1125ziList").getEditRowModel().get("wenben") &&
  viewModel
    .get("all1125ziList")
    .getEditRowModel()
    .get("wenben")
    .on("valueChange", function (data) {
      // 文本--值改变
      alert("HELLO");
    });