viewModel.on("afterMount", function () {
  //物料税率调整_查询历史订单--页面初始化
  const filtervm = viewModel.getCache("FilterViewModel");
  var wlcode = viewModel.get("params").materialId; //取值，提取控件物料编码的值
  console.log("wlcode:", wlcode);
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    //赋予查询区字段初始值
    //给查询条件(物料编码)赋予动态默认值，此值由上一级页面传入
    filtervm.get("SelectMaterial").getFromModel().setValue(wlcode);
  });
});
viewModel.get("button5hd") &&
  viewModel.get("button5hd").on("click", function (data) {
    //拉取历史订单--单击
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel"); //查询区固定写法
    let materialId = filterViewModelInfo.get("SelectMaterial").getFromModel().getValue();
    let vouchdateS = filterViewModelInfo.get("vouchdate").getFromModel().getValue(); //查询字段为日期区间的写法,区间的开始
    let vouchdateE = filterViewModelInfo.get("vouchdate").getToModel().getValue(); //查询字段为日期区间的写法,区间的结束
    console.log("materialId:", materialId);
    cb.utils.loadingControl.end(); //关闭一次loading
    cb.rest.invokeFunction(
      "AT17C47D1409580006.wlsltzbackfunction.SelectMatAPI",
      { materialId, vouchdateS, vouchdateE },
      function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("数据拉取更新中！", "info");
      }
    );
  });
viewModel.get("button11sh") &&
  viewModel.get("button11sh").on("click", function (data) {
    //拉取历史日报--单击
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel"); //查询区固定写法
    let materialId = filterViewModelInfo.get("SelectMaterial").getFromModel().getValue();
    let vouchdateS = filterViewModelInfo.get("vouchdate").getFromModel().getValue(); //查询字段为日期区间的写法,区间的开始
    let vouchdateE = filterViewModelInfo.get("vouchdate").getToModel().getValue(); //查询字段为日期区间的写法,区间的结束
    console.log("materialId:", materialId);
    cb.utils.loadingControl.end(); //关闭一次loading
    cb.rest.invokeFunction(
      "AT17C47D1409580006.wlsltzbackfunction.xsrbLoad",
      { materialId, vouchdateS, vouchdateE },
      function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("数据拉取更新中！", "info");
      }
    );
  });
viewModel.get("button18ec") &&
  viewModel.get("button18ec").on("click", function (data) {
    //关闭--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    parentViewModel.execute("refresh"); //刷新父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭弹窗
  });
viewModel.get("button22sd") &&
  viewModel.get("button22sd").on("click", function (data) {
    //确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    parentViewModel.execute("refresh"); //刷新父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭弹窗
  });