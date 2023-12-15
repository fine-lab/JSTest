viewModel.get("button22kc") &&
  viewModel.get("button22kc").on("click", function (data) {
    // 按钮--单击
  });
// 点击保存和新增
viewModel.get("btnSave") &&
  viewModel.get("btnSaveAndAdd").on("click", function (data) {
    cb.rest.invokeFunction("", {}, function (err, res) {});
  });
cb.rest.invokeFunctionS = function (id, data, callback, viewModel, options) {
  if (!options) {
    var options = {};
  }
  options.domainKey = "yourKeyHere";
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  return proxy.doProxy(data, callback);
};
viewModel.on("afterSave", function () {
  cb.rest.invokeFunctionS("3b79ff11597d40fb92a4ca87aed47944", { data: viewModel.getAllData() }, function (err, res) {
    if (result.code == "200") {
      cb.utils.alert("回写成功", "success");
    }
  });
});