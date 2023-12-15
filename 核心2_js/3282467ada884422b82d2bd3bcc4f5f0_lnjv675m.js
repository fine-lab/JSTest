viewModel.on("customInit", function (data) {
  // 管理单位资产采集--页面初始化
});
viewModel.on("customInit", function (data) {
  //管理单位资产采集--页面初始化
  viewModel.on("beforeSave", function (args) {
    let data = JSON.parse(args.data.data);
    console.log("data:" + data);
    let assess_position = data.assess_position;
    assess_position = JSON.parse(assess_position);
    let address = assess_position.address;
    data.assess_position = address;
    args.data.data = JSON.stringify(data);
  });
});