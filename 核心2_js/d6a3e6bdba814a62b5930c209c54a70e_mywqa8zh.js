viewModel.on("customInit", function (data) {
  // 企业信息详情--页面初始化
  viewModel.on("afterLoadData", function (event) {
    //用于卡片页面，页面初始化赋值等操作
    let qyhth = viewModel.get("code").getValue();
    viewModel.get("ziduan1").setValue(qyhth);
    var data1 = [
      {
        value: "1",
        text: "直线电话",
        nameType: "string"
      },
      {
        value: "4",
        text: "转介绍",
        nameType: "string"
      },
      {
        value: "10",
        text: "公司资源",
        nameType: "string"
      }
    ];
    viewModel.get("kehulaiyuan").setDataSource(data1);
  });
});
viewModel.on("afterAddRow", function (params) {
  debugger;
  //表格的childrenfield属性值
  var data = [
    { value: "1", text: "一级", nameType: "string" },
    { value: "2", text: "二级", nameType: "string" },
    { value: "3", text: "三级", nameType: "string" },
    { value: "4", text: "初级", nameType: "string" },
    { value: "5", text: "中级", nameType: "string" },
    { value: "6", text: "高级", nameType: "string" },
    { value: "999", text: "其他", nameType: "string" }
  ];
  var gridModel = viewModel.getGridModel();
  gridModel.setState("zhengshudengji", "local"); // 确保是local模式
  gridModel.setDataSource(data);
});
viewModel.get("button33vh") &&
  viewModel.get("button33vh").on("click", function (data) {
    // 按钮--单击
    debugger;
    const eve = viewModel.getAllData();
    var id = eve.id;
    var iscache = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.cs520", { id: id }, function (err, res) {}, viewModel, { async: false });
    var a = "";
    var a = iscache.result.zxcg[0];
    viewModel.setCache("isSelfExecute", a);
    var b = viewModel.getCache("isSelfExecute", ziduan1);
  });