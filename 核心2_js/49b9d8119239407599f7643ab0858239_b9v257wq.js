//删除
viewModel.on("beforeDelete", function (params) {
  debugger;
  cb.utils.alert("触发删除", JSON.stringify(params));
});