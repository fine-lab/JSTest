viewModel.get("button18yd") &&
  viewModel.get("button18yd").on("click", function (data) {
    // 导出明暗码--单击
    let rows = viewModel.get("item515ld").getValue();
    if (cb.utils.isEmpty(rows)) {
      cb.utils.alert("请输入需要导出的明暗码数量！");
      return;
    }
    if (cb.utils.isEmpty(viewModel.get("name").getValue())) {
      viewModel.get("name").setValue("导出明暗码" + rows + "个");
    }
    cb.utils.alert("一次导出明暗码条数越多，耗时越长。\n\n请等待导出文件的生成...", "info");
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/barprint/findMinganSet",
        method: "POST"
      }
    });
    let param = [];
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      const queryUrl = cb.utils.getServiceUrl() + "/files/scmbc/barprint/exportPassword?domainKey=qilibcscm";
      const sendData = { rows: rows, tenantId: cb.rest.AppContext.tenant.tenantId, filename: viewModel.get("name").getValue() };
      const { common } = viewModel.biz.action();
      const endDown = common.createDownloadForm(queryUrl, sendData);
    });
  });