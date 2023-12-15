viewModel.get("paymentrequestSubform20221228List") &&
  viewModel.get("paymentrequestSubform20221228List").on("afterCellValueChange", function (data) {
    // 表格-付款申请单子表hzy--单元格值改变后
    //获取值
    let a = viewModel.getGridModel().getData();
    console.log("获取的值为：" + a.length);
    let b = 0;
    for (let x = 0; x < a.length; x++) {
      b = parseInt(b) + parseInt(a[x].hetong_new5);
    }
    console.log("总金额的值为：" + b);
    viewModel.get("orderamount").setValue(b);
  });
viewModel.on("customInit", function (data) {
  // 付款申请单hzy详情--页面初始化
});
viewModel.on("beforeValidate", function (args) {
  let a = viewModel.getGridModel().getData();
  if (a.length == 0) {
    alert("没有填写子表内容");
  }
});
viewModel.get("button27vc") &&
  viewModel.get("button27vc").on("click", function (data) {
    // 提交--单击
    // 提交--单击
    //获取对应的数据
    var dataValue = viewModel.getData();
    // 调用api
    cb.rest.invokeFunction("AT168516D809980006.backOpenApiFunction.postStatus", { dataValue: dataValue }, function (err, res) {
      console.log(err);
      console.log(res);
      alert(res.str);
    });
  });