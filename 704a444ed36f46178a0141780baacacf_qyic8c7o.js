viewModel.get("button13lb") &&
  viewModel.get("button13lb").on("click", function (data) {
    // 测试--单击
    cb.rest.invokeFunction("AT16A11A2C17080008.API.updateDataLAD", {}, function (err, res) {
      debugger;
    });
  });
viewModel.get("custinfo_1631252347756216321") &&
  viewModel.get("custinfo_1631252347756216321").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    // 设置cell状态
    viewModel
      .getGridModel()
      .getAllData()
      .forEach((item, index) => {
        //如下为判断原客户经理是否确认，依照判断结果是否允许接收人操作；
        // 如果原客户经理为空，允许接收人编辑。
      });
    function setCellState(index, flag) {
      viewModel.getGridModel().setCellState(index, "receiveIsTrue", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveAttachment", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveTime", "readOnly", flag);
      viewModel.getGridModel().setCellState(index, "receiveRemark", "readOnly", flag);
    }
  });
viewModel.get("button19we") &&
  viewModel.get("button19we").on("click", function (data) {
    cb.rest.invokeFunction("AT16A11A2C17080008.API.updateDataLAD", {}, function (err, res) {
      debugger;
    });
  });