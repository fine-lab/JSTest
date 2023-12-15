viewModel.get("button31ji") &&
  viewModel.get("button31ji").on("click", function (data) {
    // 按钮--单击
    viewModel.execute("updateViewMeta", { code: "licenseDetailsCardTableGroup", cStyle: '{"visible":false}' });
    var ss = viewModel.getGridModel();
    alert(JSON.stringify(ss));
  });
viewModel.get("Name") &&
  viewModel.get("Name").on("afterValueChange", function (data) {
    //证书名称--值改变后
    debugger;
    var ss = data.value;
    if (ss === "11") {
      viewModel.execute("updateViewMeta", { code: "licenseDetailsCardTableGroup", cStyle: '{"visible":false}' });
    }
  });