viewModel.get("interfaceFieldDownload") &&
  viewModel.get("interfaceFieldDownload").on("afterValueChange", function (data) {
    // 接口字段标识(下载)--值改变后
    viewModel.get("interfaceFieldUpload").setValue(data.value);
    viewModel.get("interfaceFieldImport").setValue(data.value);
    viewModel.get("fieldIdentification").setValue(data.value);
  });
viewModel.get("interfaceFieldName") &&
  viewModel.get("interfaceFieldName").on("afterValueChange", function (data) {
    // 接口字段名称--值改变后
    viewModel.get("fieldName").setValue(data.value);
    viewModel.get("fieldExplain").setValue(data.value);
  });