viewModel.get("button111gf") &&
  viewModel.get("button111gf").on("click", function (data) {
    //余额回传--单击
    //余额回传--单击
    //多选参数传递
    debugger;
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (selectedRows.length == 0) {
      cb.utils.alert("请选择数据");
      return false;
    }
    let kits = [];
    selectedRows.forEach((row) => {
      let tmp = {};
      tmp.orderCode = row.code;
      tmp.code = row.id;
      tmp.receiptDate = row.createDate;
      tmp.receiptType = "余额回传";
      kits.push(tmp);
    });
    //调用后端api函数
    cb.rest.invokeFunction("SCMSA.backOpenApiFunction.crmExamine", { data: kits }, function (err, res) {
      console.log(err);
      console.log(res);
      cb.utils.alert(res.result);
    });
  });