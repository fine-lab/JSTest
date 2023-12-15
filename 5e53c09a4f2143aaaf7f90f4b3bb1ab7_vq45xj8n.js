viewModel.get("detail!destination") &&
  viewModel.get("detail!destination").on("blur", function (data) {
    //出差地点--失去焦点的回调
    cb.rest.invokeFunction("HRTMESS.a123.newapi", {}, function (err, res) {
      alert(res.s);
    });
  });