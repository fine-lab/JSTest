viewModel.get("button26rk") &&
  viewModel.get("button26rk").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button36hi") &&
  viewModel.get("button36hi").on("click", function (data) {
    alert(1);
    var proxy = cb.rest.DynamicProxy.create({
      ensure: {
        url: "/print/printPreview",
        method: "post"
      }
    });
    //调用接口后执行的操作
    proxy.ensure({ route: "/report", billno: "7c8790e5", template: "u8c1671697154000", ids: ["1619033491971768323"] }, function (err, result) {
      alert(result);
      if (err) {
      } else {
      }
    });
  });
viewModel.get("button45tb") &&
  viewModel.get("button45tb").on("click", function (data) {
    // 标签打印1--单击
    var param = {
      billtype: "voucher",
      billno: "7c8790e5", //交期计划变更采购商
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        readOnly: true,
        id: "youridHere"
      }
    };
    cb.loader.runCommandLine("bill", param, viewModel);
  });
viewModel.get("button56dd") &&
  viewModel.get("button56dd").on("click", function (data) {
    // 二维码--单击
    let dataJson = viewModel.getGridModel().getEditRowModel().getAllData();
    let dataJsonCopy = JSON.parse(JSON.stringify(dataJson));
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal16sf", // 模态框组件的编码
        viewModel: viewModel
      }
    });
    setTimeout(function () {
      viewModel.get("item83vb").setValue(JSON.stringify(dataJsonCopy));
    }, 300);
  });