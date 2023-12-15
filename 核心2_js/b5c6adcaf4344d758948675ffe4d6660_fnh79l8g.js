viewModel.on("customInit", function (data) {
  // 楼栋档案--页面初始化
  viewModel.get("btnAdd").setDisabled(true);
});
viewModel.on("afterLoadData", function (data) {
  viewModel.get("btnAdd").setDisabled(true);
});
viewModel.get("pub_building_1531410850414329860") &&
  viewModel.get("pub_building_1531410850414329860").on("afterSelect", function (data) {
    // 搜索树--选择后
    var dataLen = data.length;
    console.log(dataLen);
    if (dataLen == 0) {
      viewModel.get("btnAdd").setDisabled(true);
    } else {
      viewModel.get("btnAdd").setDisabled(false);
    }
    window._ourObj = data;
    console.log("选择的节点：");
    console.log(data);
  });