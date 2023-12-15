viewModel.get("button11ue") &&
  viewModel.get("button11ue").on("click", function (data) {
    // 同步删除明细--单击
    let startDate = viewModel.get("item62mb").getValue();
    let endDate = viewModel.get("item120ei").getValue();
    if (startDate == "" || endDate == "" || startDate == undefined || endDate == undefined) {
      cb.utils.alert("请选择正确的时间区间", "info");
      return;
    }
    startDateTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    endDateTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    if (endDateTime - startDateTime < 0) {
      cb.utils.alert("请选择正确的时间区间", "info");
      return;
    }
    var proxy = viewModel.setProxy({
      settle: {
        url: "/scmbc/barcodeflow/check",
        method: "get"
      }
    });
    //传参
    var param = {
      startDate,
      endDate
    };
    proxy.settle(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      viewModel.execute("refresh");
    });
  });