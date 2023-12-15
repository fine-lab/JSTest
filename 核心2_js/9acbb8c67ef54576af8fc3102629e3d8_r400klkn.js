console.log("---2--");
viewModel.get("interfaceFieldDownload") &&
  viewModel.get("interfaceFieldDownload").on("afterValueChange", function (data) {
    // 接口字段标识(下载)--值改变后
    const valuecode = viewModel.get("interfaceFieldDownload").getValue();
    viewModel.get("interfaceFieldUpload").setValue(valuecode);
    viewModel.get("interfaceFieldImport").setValue(valuecode);
    viewModel.get("fieldIdentification").setValue(valuecode);
  });
viewModel.get("interfaceFieldName") &&
  viewModel.get("interfaceFieldName").on("afterValueChange", function (data) {
    // 接口字段名称--值改变后
    const valuecode = viewModel.get("interfaceFieldName").getValue();
    viewModel.get("fieldName").setValue(valuecode);
  });