viewModel.get("position_positionname") &&
  viewModel.get("position_positionname").on("afterValueChange", function (data) {
    // 任职职位--值改变后
    let positionid = viewModel.get("position").getValue();
    viewModel.get("employappnum").setValue(positionid);
    cb.rest.invokeFunction("2d4264c0717d439b8b2883944945d8a6", { positionid: positionid }, function (err, res) {
      debugger;
      var data = res.data;
      viewModel.get("officeorg").setValue(data.org);
      viewModel.get("officeduty").setValue(data.duty);
      viewModel.get("officeorg_orgname").setValue(data.orgname);
      viewModel.get("officeduty_dutyname").setValue(data.dutyname);
      viewModel.get("viroffice").setValue(data.orgname + data.dutyname);
    });
  });