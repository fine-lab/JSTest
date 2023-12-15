viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存按钮,保存后改写线索中的购销线索状态
    debugger;
    cb.rest.invokeFunction(
      "GT65927AT11.APIFUNC.updateClueNet",
      {
        id: viewModel.getParams().patrol_id,
        clueNet: viewModel.get("is_not").getValue()[0] === "is" ? "是" : ""
      },
      function (err, res) {
        if (err) console.log(err);
      }
    );
  });
viewModel.get("btnSaveAndAdd") &&
  viewModel.get("btnSaveAndAdd").on("click", function (data) {
    // 保存按钮,保存后改写线索中的购销线索状态
    debugger;
    cb.rest.invokeFunction(
      "GT65927AT11.APIFUNC.updateClueNet",
      {
        id: viewModel.getParams().patrol_id,
        clueNet: viewModel.get("is_not").getValue()[0] === "is" ? "是" : ""
      },
      function (err, res) {
        if (err) console.log(err);
      }
    );
  });