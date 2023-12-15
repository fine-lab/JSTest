viewModel.get("button24le") &&
  viewModel.get("button24le").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button24yf") &&
  viewModel.get("button24yf").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button24qg") &&
  viewModel.get("button24qg").on("click", function (data) {
    // 按钮--单击
    debugger;
    var ids = [];
    var selectrow = viewModel.getGridModel().getSelectedRows();
    selectrow.forEach((row) => {
      ids.push(row.id);
    });
    var tt = cb.rest.invokeFunction("62c67105485d474995d9633b98228ee5", { iddata: ids }, function (err, res) {}, viewModel, { async: false });
  });
viewModel.get("button29dh") &&
  viewModel.get("button29dh").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button29sd") &&
  viewModel.get("button29sd").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button29yb") &&
  viewModel.get("button29yb").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button29oe") &&
  viewModel.get("button29oe").on("click", function (data) {
    // 按钮--单击
  });