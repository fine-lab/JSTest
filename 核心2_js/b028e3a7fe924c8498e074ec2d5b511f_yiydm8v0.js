viewModel.get("button22bd") &&
  viewModel.get("button22bd").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT17ECF0F408480009.aa.testapi", {}, function (err, res) {
      alert(res.s);
    });
  });