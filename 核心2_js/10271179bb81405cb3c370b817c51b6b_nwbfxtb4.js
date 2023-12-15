viewModel.get("managementClass_name") &&
  viewModel.get("managementClass_name").on("afterValueChange", function (data) {
    //产品类别--值改变后
    debugger;
    const alldata = viewModel.getAllData();
    cb.rest.invokeFunction("0af6d0af4e864344856a35d2379abc9a", { data: alldata }, function (err, res) {
      if (res != undefined) {
        var kaifarenid = res.resyuangong[0].id;
        var kaifarenmc = res.resyuangong[0].name;
        var kaifarenbm = res.resyuangong[0].code;
        viewModel.get("kaifaren").setValue(kaifarenid);
        viewModel.get("kaifaren_name").setValue(kaifarenmc);
        viewModel.get("kaifarenbianma").setValue(kaifarenbm);
      } else {
        viewModel.get("kaifaren").setValue("");
        viewModel.get("kaifaren_name").setValue("");
        viewModel.get("kaifarenbianma").setValue("");
      }
    });
  });