viewModel.get("button28zj") &&
  viewModel.get("button28zj").on("click", function (data) {
    // 手动同步sap--单击
    console.log("data:", data.id4ActionAuth);
    console.log("::::", data.id4ActionAuth.length);
    if (data.id4ActionAuth.length > 0) {
      cb.rest.invokeFunction("AT17C47D1409580006.shibin.hmsynpayMeApi", { id: data.id4ActionAuth }, function (err, res) {
        cb.utils.alert("同步中，请稍后查看列表！", "info");
        viewModel.execute("refresh"); //刷新列表
      });
    } else {
      cb.utils.alert("请选择列表数据！", "error");
    }
  });
viewModel.get("button11dj") &&
  viewModel.get("button11dj").on("click", function (data) {
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let accentityId = filterViewModelInfo.get("accentity").getFromModel().getValue();
    let sCode = filterViewModelInfo.get("code").getFromModel().getValue();
    let vouchdateS = filterViewModelInfo.get("vouchdate").getFromModel().getValue();
    let vouchdateE = filterViewModelInfo.get("vouchdate").getToModel().getValue();
    console.log("accentityId:", accentityId);
    console.log("sCode:", sCode);
    console.log("vouchdateS:", vouchdateS);
    console.log("vouchdateE:", vouchdateE);
    cb.utils.loadingControl.end(); //关闭一次loading
    let result = cb.rest.invokeFunction("AT17C47D1409580006.shibin.paymentloadApi", { accentityId, sCode, vouchdateS, vouchdateE }, function (err, res) {
      viewModel.execute("refresh"); //刷新列表
      cb.utils.alert("数据拉取更新成功！若查询条件【会计主体】【单据编号】【单据日期】中有值则按照查询条件拉取付款数据，若上述查询条件无值则拉取最近两天的付款数据。", "info");
    });
  });
viewModel.get("button17ui") &&
  viewModel.get("button17ui").on("click", function (data) {
    // 同步sap--单击
    cb.rest.invokeFunction("AT17C47D1409580006.shibin.synpaymentApi", {}, function (err, res) {
      viewModel.execute("refresh"); //刷新列表
    });
  });
viewModel.get("button24le") &&
  viewModel.get("button24le").on("click", function (data) {
    // 生成凭证--单击
    cb.rest.invokeFunction("AT17C47D1409580006.shibin.paymentvoucheApi", {}, function (err, res) {
      viewModel.execute("refresh"); //刷新列表
    });
  });
viewModel.get("button37tj") &&
  viewModel.get("button37tj").on("click", function (data) {
    // 测试--单击
    cb.rest.invokeFunction("AT17C47D1409580006.shibin.testApi", {}, function (err, res) {
      debugger;
    });
  });
//联查凭证 前端脚本，暂时注释