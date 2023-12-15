var gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", function (data) {
  var zxnum = 0,
    lxnum = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].linestatus == 1) {
      zxnum++;
    } else {
      lxnum++;
    }
  }
  viewModel.get("item46zi").setValue(zxnum);
  viewModel.get("item69ra").setValue(lxnum);
});
gridModel.on("afterDeleteRow", function (rows) {
  let list = gridModel.getAllData();
  let zxnum = 0,
    lxnum = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].linestatus == 1) {
      zxnum++;
    } else {
      lxnum++;
    }
  }
  viewModel.get("item46zi").setValue(zxnum);
  viewModel.get("item69ra").setValue(lxnum);
});
var proxy = viewModel.setProxy({
  queryData: {
    url: "/yonsuite/userconf/authnum",
    method: "get"
  }
});
//传参
var param = {};
proxy.queryData(param, function (err, result) {
  if (!err.success) {
    cb.utils.alert(err.msg, "error");
    return;
  }
  if (err.data != undefined) {
    viewModel.get("item23ab").setValue(err.data.allAuthNum);
    if (err.data.productLicense != undefined && err.data.productLicense != null) {
      //生产许可用户数、在线用户数、离线用户数
      var pallnum = err.data.productLicense.productAuthNum;
      if (pallnum != undefined && pallnum > 0) {
        viewModel.get("item85kf").setVisible(true);
        viewModel.get("item85kf").setValue(pallnum);
        viewModel.get("item102ga").setValue(err.data.productLicense.onlinenum);
        viewModel.get("item102ga").setVisible(true);
        viewModel.get("item120bi").setValue(err.data.productLicense.offlinenum);
        viewModel.get("item120bi").setVisible(true);
      } else {
        viewModel.get("item85kf").setVisible(false);
        viewModel.get("item102ga").setVisible(false);
        viewModel.get("item120bi").setVisible(false);
      }
    }
  }
});