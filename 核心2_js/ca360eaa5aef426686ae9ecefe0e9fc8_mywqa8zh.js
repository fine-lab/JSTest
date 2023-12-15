viewModel.get("btnAddRowbusinfllowrecord") &&
  viewModel.get("btnAddRowbusinfllowrecord").on("click", function (data) {
    // 增行--单ji
    var currentprogress = viewModel.get("currentprogress").getValue();
    if (undefined == currentprogress || "" == currentprogress) {
      cb.utils.alert("请选择当前进度！");
    } else {
      var nextfllowdate = viewModel.get("nextfllowdate").getValue();
      viewModel.getGridModel().appendRow({ nextfllowdate: nextfllowdate, currentprogress: currentprogress });
    }
  });
viewModel.get("button4gg") &&
  viewModel.get("button4gg").on("click", function (data) {
    // 确定--单击
    debugger;
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    let id = parentViewModel.getGridModel().getSelectedRows()[0].id;
    const alldata = viewModel.getAllData();
    alldata.id = id;
    cb.rest.invokeFunction("AT17FBDED60848000A.businessfun.fllowrecordsave", { businessinfos: alldata }, function (err, res) {
      if (err != null) {
        console.log(err);
      }
    });
    parentViewModel.execute("refresh"); //刷新父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });