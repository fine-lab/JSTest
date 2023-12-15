viewModel.get("m_s_process_uses_1494472465226137608") &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel() &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel().get("end_time") &&
  viewModel
    .get("m_s_process_uses_1494472465226137608")
    .getEditRowModel()
    .get("end_time")
    .on("valueChange", function (data) {
      // 结束时间--失去焦点的回调
      debugger;
      alert("hhhhhhh");
      const value = viewModel.get("end_time").getValue();
      alert(value);
    });
viewModel.get("m_s_process_uses_1494472465226137608") &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel() &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel().get("end_day") &&
  viewModel
    .get("m_s_process_uses_1494472465226137608")
    .getEditRowModel()
    .get("end_day")
    .on("blur", function (data) {
      // 结束工作日--失去焦点的回调
    });
viewModel.get("m_s_process_uses_1494472465226137608") &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel() &&
  viewModel.get("m_s_process_uses_1494472465226137608").getEditRowModel().get("end_time") &&
  viewModel
    .get("m_s_process_uses_1494472465226137608")
    .getEditRowModel()
    .get("end_time")
    .on("blur", function (data) {
      // 结束时间--失去焦点的回调
      debugger;
    });
viewModel.get("m_s_process_uses_1494472465226137608") &&
  viewModel.get("m_s_process_uses_1494472465226137608").on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    debugger;
  });