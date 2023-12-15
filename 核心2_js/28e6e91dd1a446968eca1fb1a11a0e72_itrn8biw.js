viewModel.get("button18mj") &&
  viewModel.get("button18mj").on("click", function (data) {
    // 开启订单--单击
    if (viewModel.getGridModel().getRow(0).orderSale == "1") {
      cb.utils.alert("订单已开启下单");
      return;
    }
    cb.rest.invokeFunction(
      "AT1716B0DE09100008.api.chaxun",
      { id: viewModel.getGridModel().getRow(0).id, orderSale: "Y", approve: viewModel.getGridModel().getRow(0).approve == 1 ? "Y" : "N" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err);
        } else if (res) {
          viewModel.execute("refresh");
          cb.utils.alert("开启下单成功");
        }
      }
    );
  });
viewModel.get("button28vg") &&
  viewModel.get("button28vg").on("click", function (data) {
    // 暂停订单--单击
    if (viewModel.getGridModel().getRow(0).orderSale != "1") {
      cb.utils.alert("订单已暂停下单");
      return;
    }
    cb.rest.invokeFunction(
      "AT1716B0DE09100008.api.chaxun",
      { id: viewModel.getGridModel().getRow(0).id, orderSale: "N", approve: viewModel.getGridModel().getRow(0).approve == 1 ? "Y" : "N" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err);
        } else if (res) {
          viewModel.execute("refresh");
          cb.utils.alert("暂停下单成功");
        }
      }
    );
  });
viewModel.on("customInit", function (data) {
  // 订单控制--页面初始化
  viewModel.getGridModel().on("afterSetDataSource", function () {
    if (viewModel.getGridModel().getRow(0).orderSale == "1") {
      viewModel.get("button18mj")?.setVisible(false);
      viewModel.get("button28vg")?.setVisible(true);
    } else {
      viewModel.get("button28vg")?.setVisible(false);
      viewModel.get("button18mj")?.setVisible(true);
    }
    if (viewModel.getGridModel().getRow(0).approve == "1") {
      viewModel.get("button38rk")?.setVisible(false);
      viewModel.get("button49oe")?.setVisible(true);
    } else {
      viewModel.get("button49oe")?.setVisible(false);
      viewModel.get("button38rk")?.setVisible(true);
    }
  });
});
viewModel.get("button38rk") &&
  viewModel.get("button38rk").on("click", function (data) {
    // 开启审批--单击
    if (viewModel.getGridModel().getRow(0).approve == "1") {
      cb.utils.alert("订单已开启审批");
      return;
    }
    cb.rest.invokeFunction(
      "AT1716B0DE09100008.api.chaxun",
      { id: viewModel.getGridModel().getRow(0).id, orderSale: viewModel.getGridModel().getRow(0).orderSale == 1 ? "Y" : "N", approve: "Y" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err);
        } else if (res) {
          viewModel.execute("refresh");
          cb.utils.alert("开启审批成功");
        }
      }
    );
  });
viewModel.get("button49oe") &&
  viewModel.get("button49oe").on("click", function (data) {
    // 暂停审批--单击
    if (viewModel.getGridModel().getRow(0).approve != "1") {
      cb.utils.alert("订单已暂停审批");
      return;
    }
    cb.rest.invokeFunction(
      "AT1716B0DE09100008.api.chaxun",
      { id: viewModel.getGridModel().getRow(0).id, orderSale: viewModel.getGridModel().getRow(0).orderSale == 1 ? "Y" : "N", approve: "N" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err);
        } else if (res) {
          viewModel.execute("refresh");
          cb.utils.alert("暂停审批成功");
        }
      }
    );
  });