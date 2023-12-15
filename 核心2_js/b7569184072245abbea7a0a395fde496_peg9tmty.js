var fileKey = null;
viewModel.get("parameter_file").on("afterFileUploadSuccess", function (fileRes) {
  debugger;
  fileKey = fileRes.file.fileKey;
});
// 保存前事件
viewModel.on("beforeSave", function (args) {
  // 附件地址
  if (fileKey) {
    data.parameter_value = fileKey;
  }
  args.data.data = JSON.stringify(data);
});