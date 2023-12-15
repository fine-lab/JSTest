viewModel.get("button32kj") &&
  viewModel.get("button32kj").on("click", function (data) {
    // 汇总生成凭证--单击
  });
viewModel.get("button40di") &&
  viewModel.get("button40di").on("click", function (data) {
    // 生成凭证--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const extant = girdModel.getSelectedRows();
    //检查是否已经生成
    var isNull = extant[0].isVoucher;
    if (extant.length > 1) {
      cb.utils.alert(" -- 请生成单条凭证 -- ", "error");
      return;
    } else if (extant.length < 1) {
      cb.utils.alert(" -- 请选择需要生成的凭证 -- ", "error");
      return;
    }
    if (isNull === "1") {
      cb.utils.alert(" -- 该凭证已经生成 -- ", "error");
      return;
    }
    var returnValue = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.ExpenseVouche", { data: extant }, function (err, res) {}, girdModel, { async: false });
    if (returnValue.error) {
      cb.utils.alert(returnValue.error.message);
    }
    var zid = returnValue.result.voucherid;
    if (returnValue.result.jsonALL.code == 200) {
      cb.utils.alert(" -- 生成凭证成功 -- ");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button45bc") &&
  viewModel.get("button45bc").on("click", function (data) {
    // 按钮--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const extant = girdModel.getSelectedRows();
    var ceshivalue = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.ceshi", {}, function (err, res) {}, viewModel, { async: false });
  });
viewModel.get("button45jd") &&
  viewModel.get("button45jd").on("click", function (data) {
    // 按钮--单击
    debugger;
    var ceshivalue = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.ceshi", {}, function (err, res) {}, viewModel, { async: false });
  });