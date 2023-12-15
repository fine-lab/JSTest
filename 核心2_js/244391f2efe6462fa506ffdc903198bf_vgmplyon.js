viewModel.get("button24fh") &&
  viewModel.get("button24fh").on("click", function (data) {
    // 按钮--单击
    let param = {};
    param["dept_id"] = "1524861618136547335";
    param["dept_name"] = "实验室";
    cb.rest.invokeFunction("AT165369EC09000003.apifunc.TopScore", { param: param }, function (err, res) {
      debugger;
    });
  });