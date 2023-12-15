viewModel.get("button14cd") &&
  viewModel.get("button14cd").on("click", function (data) {
    // 按钮--单击
    console.log("bbbbbbbbbbbbb" + viewModel.get("name").getValue());
  });
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 名称--值改变后
    viewModel.get("name").setValue("2222222", true);
  });
viewModel.get("age") &&
  viewModel.get("age").on("afterValueChange", function (data) {
    // 年龄--值改变后
    debugger;
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa" + viewModel.get("name").getValue());
  });
viewModel.get("button19cc") &&
  viewModel.get("button19cc").on("click", function (data) {
    debugger;
    const param = { id: viewModel.get("age").getValue() };
    var result = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.getRestApi", { age: param }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });
viewModel.get("button25lg") &&
  viewModel.get("button25lg").on("click", function (data) {
    debugger;
    const param = { id: viewModel.get("name").getValue() };
    var result = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.postRestApi", { id: param }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });