viewModel.get("button24mh") &&
  viewModel.get("button24mh").on("click", function (data) {
    const data1 = viewModel.getAllData();
    debugger;
    var selectedData = viewModel.getSelectedNodes();
    console.log(selectedData);
    // 盖章--单击
    cb.rest.invokeFunction("GT2343AT19.backOpenApiFunction.updateSkjsGZ2", {}, function (err, res) {
      console.log(res);
    });
  });