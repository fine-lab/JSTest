viewModel.get("button22hb") &&
  viewModel.get("button22hb").on("click", function (data) {
    //市信息同步--单击
    cb.rest.invokeFunction("AT16388E3408680009.Custom.City", { r: 2 }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });