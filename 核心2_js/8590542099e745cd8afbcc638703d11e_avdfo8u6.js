viewModel.get("button19rf") &&
  viewModel.get("button19rf").on("click", function (data) {
    // 按钮--单击
    const accountingPeriod = viewModel.get("accountingPeriod").getValue();
    const customerList = viewModel.get("statement_menu_modal_box_customerNameList").getValue();
    if (undefined == accountingPeriod) {
      cb.utils.alert("请输入会计期间");
      return false;
    }
    if (customerList.length == 0) {
      cb.utils.alert("请输入客户名称");
      return false;
    }
    var array = new Array();
    for (var i = 0; i < customerList.length; i++) {
      var one = {
        accountingPeriod: accountingPeriod, //会计期间
        customer: customerList[i].customerName,
        returnStatus: "1"
      };
      array.push(one);
    }
    var saveInsertDatas = cb.rest.invokeFunction("AT1703778C09100004.rule.addCutomerList", { reqBody: array }, function (err, res) {}, viewModel, { async: false });
    if (saveInsertDatas.error) {
      cb.utils.alert(saveInsertDatas.error.message);
      return false;
    }
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    parentViewModel.execute("refresh");
  });