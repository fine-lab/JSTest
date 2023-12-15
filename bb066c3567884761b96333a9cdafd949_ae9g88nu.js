run = function (event) {
  var viewModel = this;
  let rows = viewModel.getGridModel("sy01_test_entryList");
  viewModel.get("new1").on("afterValueChange", function (data) {
    rows.deleteAllRows();
  });
  //物料
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    viewModel.get("item77zh").setValue(viewModel.get("org_id_name").getValue());
    let rows = viewModel.getGridModel("sy01_test_entryList");
    let girdData = [
      {
        _status: "Insert",
        new1: "第一条"
      },
      {
        _status: "Insert",
        new1: "第二条"
      }
    ];
    rows.setDataSource(girdData);
  });
};