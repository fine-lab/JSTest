viewModel.get("button2nh") &&
  viewModel.get("button2nh").on("click", function (data) {
    //按钮--单击
    debugger;
    //批改范围
    let scopeCorrection = viewModel.get("scope_correction").__data.value;
    //批改项
    let correct = viewModel.get("correct").__data.value;
    //批改为
    let value = viewModel.get("value").__data.value;
    //获取需要批改选中的数据
    let selectData = viewModel.originalParams.selectData;
    //获取需要批改选中的数据是选中的表头，还是表头+表体
    let isBiaotou = viewModel.originalParams.isBiaotou;
    //获取需要批改选中的数据来源是哪里：销售出库：xsck    调拨订单：dbdd
    let isSource = viewModel.originalParams.isSource;
    var scddApiResult = cb.rest.invokeFunction(
      "AT18526ADE08800003.api.saveBefore",
      { isSource: isSource, isBiaotou: isBiaotou, selectData: selectData, value: value },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    if (scddApiResult.error != undefined) {
      alert("" + scddApiResult.error.message);
    }
    if (scddApiResult.result != undefined && scddApiResult.result.message != undefined) {
      alert("" + scddApiResult.result.message);
    }
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    parentViewModel.execute("refresh"); //刷新父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });