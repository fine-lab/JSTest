viewModel.get("button24oj") &&
  viewModel.get("button24oj").on("click", function (data) {
    // 按钮--单击
    // 强制删除--单击
    let idarr = ["1604309725603168264", "1598227442045550596", "1556128267092099077", "1557408639792709641"];
    cb.rest.invokeFunction("8866d3e87ce04931a6508587e28ab419", { data: idarr }, function (err, res) {
      debugger;
    });
  });