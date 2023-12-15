viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.on("afterMount", function () {
    viewModel.on("afterLoadData", function (args) {
      debugger;
      console.log(viewModel.getParams());
      if (viewModel.getParams().mode == "add") {
        viewModel.get("sourcecode").setValue(viewModel.getParams().code);
        viewModel.get("productcode").setValue(viewModel.getParams().materialId);
        viewModel.get("productcode_code").setValue(viewModel.getParams().materialCode);
        viewModel.get("productname").setValue(viewModel.getParams().materialName);
        viewModel.get("productbatch").setValue(viewModel.getParams().batchcode);
        viewModel.get("productqty").setValue(viewModel.getParams().nastnum);
      }
      //给日期字段赋值
      let batchconclusion = viewModel.get("batchconclusion").getValue();
      let finishbatchprocess = viewModel.get("finishbatchprocess").getValue();
      if (batchconclusion != 2) {
        viewModel.get("disagreereason").setState("visible", false);
      }
      if (finishbatchprocess != 3) {
        viewModel.get("other").setState("visible", false);
      }
    });
  });
  viewModel.get("batchconclusion").on("afterValueChange", function (data) {
    if (data.value.value != 2) {
      viewModel.get("disagreereason").setState("visible", false);
    } else {
      viewModel.get("disagreereason").setState("visible", true);
    }
  });
  viewModel.get("finishbatchprocess").on("afterValueChange", function (data) {
    if (data.value.value != 3) {
      viewModel.get("other").setState("visible", false);
    } else {
      viewModel.get("other").setState("visible", true);
    }
  });
});