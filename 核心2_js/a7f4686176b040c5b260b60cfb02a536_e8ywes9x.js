function s(event) {
  var viewModel = this;
  viewModel.get("taxno").setValue("");
  //选择数据后，根据选择到的数据
  var supplier = viewModel.get("supplier").getValue();
  var supplier_name = viewModel.get("supplier_name").getValue();
  if (supplier !== null && supplier !== "") {
    cb.rest.invokeFunction("618054e4795749f8a0f24dd5a8a7ed8c", { supplier: supplier }, function (err, res) {
      var id = res.id;
      if (id === "") {
        cb.utils.alert("供应商银行账户非启用状态，请检查!");
        viewModel.get("supplier_name").setValue("");
        viewModel.get("supplier").setValue("");
      }
    });
  }
}