viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  //新增下级
  viewModel.get("button19og").on("click", function (data) {
    let id = viewModel.getTreeModel().getSelectedNodes()[0].id;
    let name = viewModel.getTreeModel().getSelectedNodes()[0].name;
    let billData = {
      billtype: "Voucher",
      billno: "sy01_medicalScope_add",
      params: {
        mode: "add",
        parent: id,
        parentName: name
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel);
  });
});