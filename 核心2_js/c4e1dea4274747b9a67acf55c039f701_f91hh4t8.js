viewModel.get("button19ji") &&
  viewModel.get("button19ji").on("click", function (data) {
    // 盖章--单击
    const value = viewModel.get("id").getValue();
    const bill = viewModel.getAllData();
    console.log(bill);
    cb.rest.invokeFunction("GT2343AT19.ui.createNCCCtAr", { bill }, function (err, res) {
      debugger;
    });
  });