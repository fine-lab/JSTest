viewModel.get("paymentrequestSubform20221228List") &&
  viewModel.get("paymentrequestSubform20221228List").on("afterCellValueChange", function (data) {
    // 表格-付款申请单子表hzy--单元格值改变后
    //获取值
    let a = viewModel.getGridModel().getData();
    let b = 0;
    for (let x = 0; x < a.length; x++) {
      b = parseInt(b) + parseInt(a[x].hetong_new5);
    }
    viewModel.get("orderamount").setValue(b);
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
    console.log("开始调用");
    cb.rest.invokeFunction("AT168516D809980006.backOpenApiFunction.postStatus", { dataValue: dataValue }, function (err, res) {
      console.log("错误：" + JSON.stringify(err));
      console.log("成功：" + JSON.stringify(res));
      if (err == null) {
        return false;
      } else {
        alert(res.str);
      }
    });
  });