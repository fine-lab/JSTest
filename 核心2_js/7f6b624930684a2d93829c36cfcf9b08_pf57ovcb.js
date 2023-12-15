//单据保存提交前清除签收相关自定义项数据
viewModel.on("beforeSave", function (args) {
  let acc = JSON.parse(args.data.data);
  acc["headFreeItem!define14"] = "";
  viewModel.get("headFreeItem!define14").setValue("");
  acc["headFreeItem!define12"] = "";
  viewModel.get("headFreeItem!define12").setValue("");
  acc["headFreeItem!define16"] = "";
  viewModel.get("headFreeItem!.define16").setValue("");
  acc["headFreeItem!define15"] = "";
  viewModel.get("headFreeItem!define15").setValue("");
  acc["headFreeItem!define13"] = "";
  viewModel.get("headFreeItem!define13").setValue("");
  acc["headFreeItem!define17"] = "";
  viewModel.get("headFreeItem!define17").setValue("");
  acc["headFreeItem!define18"] = "";
  viewModel.get("headFreeItem!define18").setValue("");
  args.data.data = JSON.stringify(acc);
});