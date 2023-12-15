viewModel.on("customInit", function (data) {
  // 金建人才库档案详情--页面初始化
  viewModel.on("afterLoadData", function () {
    debugger;
    const alldata = viewModel.getAllData();
    //状态
    var data2 = [
      { value: "1", text: "正常", nameType: "string" },
      { value: "2", text: "作废", nameType: "string" },
      { value: "3", text: "闲置", nameType: "string" },
      { value: "4", text: "已出证", nameType: "string" },
      { value: "7", text: "合同过期", nameType: "string" },
      { value: "8", text: "完结", nameType: "string" }
    ];
    viewModel.get("state").setDataSource(data2);
  });
});