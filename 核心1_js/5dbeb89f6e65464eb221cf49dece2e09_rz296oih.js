viewModel.on("beforeSave", function (data) {
  let res = JSON.parse(data.data.data);
  alert(JSON.stringify(res));
  debugger;
});
viewModel.on("customInit", function (data) {
  // 调价单--页面初始化
});