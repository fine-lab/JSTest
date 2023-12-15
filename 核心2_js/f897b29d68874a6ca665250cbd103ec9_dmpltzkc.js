viewModel.get("khleibie_name") &&
  viewModel.get("khleibie_name").on("afterValueChange", function (data) {
    //客户类别--值改变后
    const lbieid = data.value.id;
    cb.rest.invokeFunction("4d473cf6d57b4d8bb5dd12a9e59503c1", { khlb_id: lbieid }, function (err, res) {});
  });