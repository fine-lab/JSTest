viewModel.get("htxqhtjbxx_1508586836002865156") &&
  viewModel.get("htxqhtjbxx_1508586836002865156").getEditRowModel() &&
  viewModel.get("htxqhtjbxx_1508586836002865156").getEditRowModel().get("item75oh") &&
  viewModel
    .get("htxqhtjbxx_1508586836002865156")
    .getEditRowModel()
    .get("item75oh")
    .on("valueChange", function (data) {
      // 当前审批人--值改变
    });
viewModel.get("button23ob").on("click", (args) => {
  let row = viewModel.getGridModel().getRow(args.index);
  cb.rest.invokeFunction("GT1577AT358.api.updateOrg", { id: row.id, startorg: row.startorg }, function (err, res) {
    debugger;
  });
});