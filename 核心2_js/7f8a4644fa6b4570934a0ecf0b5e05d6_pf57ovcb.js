viewModel.get("button9tk") &&
  viewModel.get("button9tk").on("click", function (data) {
    //查询历史数据--单击
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel"); //查询区固定写法
    let materialId = filterViewModelInfo.get("SelectMaterial").getFromModel().getValue();
    console.log("materialId:", materialId);
    cb.utils.loadingControl.end(); //关闭一次loading
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList", //弹窗的单据类型
        billno: "yb536b7963", //弹窗的单据编号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          materialId: materialId
        }
      },
      viewModel
    );
  });
viewModel.getParams().materialId; //接收参数
viewModel.get("button15ga") &&
  viewModel.get("button15ga").on("click", function (data) {
    console.log("data:", data.id4ActionAuth);
    console.log("::::", data.id4ActionAuth.length);
    if (data.id4ActionAuth.length > 0) {
      cb.rest.invokeFunction("AT17C47D1409580006.wlsltzbackfunction.hongchongvAPI", { id: data.id4ActionAuth }, function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("凭证冲销中，请稍后查看凭证查询列表！", "info");
      });
    } else {
      cb.utils.alert("请选择销售订单数据！", "error");
    }
  });
viewModel.get("button22na") &&
  viewModel.get("button22na").on("click", function (data) {
    console.log("data:", data.id4ActionAuth);
    console.log("::::", data.id4ActionAuth.length);
    if (data.id4ActionAuth.length > 0) {
      cb.rest.invokeFunction("AT17C47D1409580006.wlsltzbackfunction.newQSV", { id: data.id4ActionAuth }, function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("凭证生成中，请稍后查看凭证查询列表！", "info");
      });
    } else {
      cb.utils.alert("请选择销售订单数据！", "error");
    }
  });
viewModel.get("button30eb") &&
  viewModel.get("button30eb").on("click", function (data) {
    console.log("data:", data.id4ActionAuth);
    console.log("::::", data.id4ActionAuth.length);
    if (data.id4ActionAuth.length > 0) {
      cb.rest.invokeFunction("AT17C47D1409580006.wlsltzbackfunction.xsrbVHC", { id: data.id4ActionAuth }, function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("凭证冲销中，请稍后查看凭证查询列表！", "info");
      });
    } else {
      cb.utils.alert("请选择销售日报数据！", "error");
    }
  });
viewModel.get("button39be") &&
  viewModel.get("button39be").on("click", function (data) {
    console.log("data:", data.id4ActionAuth);
    console.log("::::", data.id4ActionAuth.length);
    if (data.id4ActionAuth.length > 0) {
      cb.rest.invokeFunction("AT17C47D1409580006.wlsltzbackfunction.xsrbNewV", { id: data.id4ActionAuth }, function (err, res) {
        viewModel.execute("refresh"); //刷新列表
        cb.utils.alert("凭证生成中，请稍后查看凭证查询列表！", "info");
      });
    } else {
      cb.utils.alert("请选择销售日报数据！", "error");
    }
  });