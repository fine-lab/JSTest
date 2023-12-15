viewModel.get("button6yj") &&
  viewModel.get("button6yj").on("click", function (data) {
    // 企业信息同步--单击
    const rowData = viewModel.getGridModel().getRows()[data.index];
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/org?domainKey=isv-rc1",
        method: "POST"
      }
    });
    //传参
    var param = { orgId: rowData.id };
    proxy.settle(param, function (err, result) {
      if (err) {
        if (err.code === 1) {
          cb.utils.alert("操作成功");
          viewModel.execute("refresh");
        } else {
          cb.utils.alert(err.msg, "error");
        }
      }
    });
  });
viewModel.get("button11ij") &&
  viewModel.get("button11ij").on("click", function (data) {
    // 实名认证--单击
    const rowData = viewModel.getGridModel().getRows()[data.index];
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/org/realName?domainKey=isv-rc1",
        method: "POST"
      }
    });
    //传参
    var param = { orgId: rowData.id };
    proxy.settle(param, function (err, result) {
      if (err.code === 1) {
        cb.utils.alert("跳转到实名认证窗口");
        // 打开实名认证窗口
        window.open(err.content.address);
      } else {
        cb.utils.alert(err.msg, "error");
      }
    });
  });