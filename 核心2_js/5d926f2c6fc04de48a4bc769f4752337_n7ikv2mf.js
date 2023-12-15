viewModel.on("customInit", function (data) {
  // 数据处理--页面初始化
  // 费用承担部门 选择条件
  viewModel.get("item46nf_name").on("beforeBrowse", function (args) {
    debugger;
    args.externalData = {
      serviceCode: "ycPurContract",
      orgId: "yourIdHere",
      deptId: "yourIdHere"
    };
  });
});