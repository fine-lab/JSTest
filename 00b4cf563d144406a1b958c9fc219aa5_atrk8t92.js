viewModel.get("button18ra") &&
  viewModel.get("button18ra").on("click", function (data) {
    // 按钮--单击
    if (viewModel.getGridModel().getRow(0).orderSale != "Y") {
      cb.utils.alert("订单已暂停");
      return;
    }
    cb.rest.invokeFunction("AT168255FC17080007.houduanhanshu.chaxun", { id: viewModel.getGridModel().getRow(0).id, orderSale: "N" }, function (err, res) {
      if (err) {
        cb.utils.alert(err);
      } else if (res) {
        viewModel.execute("refresh");
        cb.utils.alert("暂停下单成功");
      }
    });
  });
viewModel.get("button32qd") &&
  viewModel.get("button32qd").on("click", function (data) {
    // 开始订单--单击
    // 按钮--单击
    if (viewModel.getGridModel().getRow(0).orderSale == "Y") {
      cb.utils.alert("订单已开启");
      return;
    }
    cb.rest.invokeFunction("AT168255FC17080007.houduanhanshu.chaxun", { id: viewModel.getGridModel().getRow(0).id, orderSale: "Y" }, function (err, res) {
      if (err) {
        cb.utils.alert(err);
      } else if (res) {
        viewModel.execute("refresh");
        cb.utils.alert("开启下单成功");
      }
    });
  });
viewModel.on("customInit", function (data) {
  // 订单控制--页面初始化
  viewModel.getGridModel().on("afterSetDataSource", function () {
    if (viewModel.getGridModel().getRow(0).orderSale == "Y") {
      viewModel.get("button32qd")?.setVisible(false);
      viewModel.get("button18ra")?.setVisible(true);
    } else {
      viewModel.get("button18ra")?.setVisible(false);
      viewModel.get("button32qd")?.setVisible(true);
    }
  });
});