viewModel.get("utf8_1590988257475166208") &&
  viewModel.get("utf8_1590988257475166208").on("beforeSelect", function (data) {
    // 表格--选择前
    const datas = viewModel.getData();
    debugger;
    console.log("aaaaaaaaaaaaaa" + datas.utf8_1590988257475166208[0].name);
    var object = { code: "000002" };
    var result1 = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.selectByCode", { object: object }, function (err, res) {}, viewModel, { async: false });
    var s = result1.result.resaa[0];
    console.log(s);
    var codes = { code: "000002" };
    var result = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.getRestApi", { codess: codes }, function (err, res) {}, viewModel, { async: false });
    console.log("ccccc" + result.result.res[0].name);
  });