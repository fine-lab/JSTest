var girdModel = viewModel.getGridModel();
girdModel
  .getEditRowModel()
  .get("TasklistNum_renwudanhao")
  .on("beforeValueChange", function (data) {
    // 任务单号--值改变
    debugger;
    let dataSelect = data.obj.select;
    for (var i = dataSelect.length - 1; i >= 0; i--) {
      dataSelect[i];
    }
  });