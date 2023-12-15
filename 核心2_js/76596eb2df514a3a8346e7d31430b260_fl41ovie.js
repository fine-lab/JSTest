viewModel.get("button27xe") &&
  viewModel.get("button27xe").on("click", function (data) {
    //合同状态维护--单击
    viewModel.getParams().editMode = "custedit";
    viewModel.biz.do("edit", viewModel);
    //设置页面为编辑态
  });
viewModel.on("modeChange", (args) => {
  if (viewModel.getParams().editMode == "custedit") {
    viewModel.get("hetongbianhao").setDisabled(true);
    //设置字段不可修改
    viewModel.get("hetongmingchen").setDisabled(true);
    viewModel.get("shouzhifangxiang").setDisabled(true);
    viewModel.get("ziduan6").setDisabled(true);
    viewModel.get("new8").setDisabled(true);
    viewModel.get("songshenriqi").setDisabled(true);
  } else {
    viewModel.get("hetongzhuangtai").setDisabled(true);
    viewModel.get("hetongzhuangtaishuoming").setDisabled(true);
    viewModel.get("yishoukuan").setDisabled(true);
    viewModel.get("yifukuan").setDisabled(true);
  }
});
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("beforeclick", function (data) {
    viewModel.getParams().editMode = "edit";
  });