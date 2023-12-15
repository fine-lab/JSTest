viewModel.get("button19zj") &&
  viewModel.get("button19zj").on("click", function (data) {
    // 测试--单击
    cb.rest.invokeFunction("GT53685AT3.org.syncOrg", {}, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("button39ig") &&
  viewModel.get("button39ig").on("click", function (data) {
    //修改编码为3位--单击
    let result = cb.rest.invokeFunction("GT53685AT3.org.changeOrgCodeNO", {}, function (err, res) {}, viewModel, { async: false });
    let chage = result.result.changeobj;
    console.log(chage);
  });