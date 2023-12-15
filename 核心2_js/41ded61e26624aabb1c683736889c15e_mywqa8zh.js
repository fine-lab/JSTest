viewModel.on("customInit", function (data) {
  // 金建收证合同变更申请详情--页面初始化
  viewModel.on("afterLoadData", function () {
    var de = [
      {
        value: "1",
        text: "一级",
        nameType: "string"
      },
      {
        value: "2",
        text: "二级",
        nameType: "string"
      },
      {
        value: "3",
        text: "三级",
        nameType: "string"
      },
      {
        value: "4",
        text: "初级",
        nameType: "string"
      },
      {
        value: "5",
        text: "中级",
        nameType: "string"
      },
      {
        value: "6",
        text: "高级",
        nameType: "string"
      },
      {
        value: "999",
        text: "其他",
        nameType: "string"
      }
    ];
    viewModel.get("Grade").setDataSource(de);
  });
});
viewModel.on("beforeSave", function (args) {
  //设置保存前校验
  debugger;
  var datajs = args.data.data;
  let data = JSON.parse(datajs);
  var reponse = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.szhtbg", { data: data }, function (err, res) {}, viewModel, { async: false });
  var zt = data._status;
  var len = reponse.result.bsj.length;
  if (zt == "Insert") {
    if (len < 1) {
    } else {
      cb.utils.confirm("还有相同变更申请没有提交！");
      return false;
    }
  }
});
viewModel.get("button19kj") &&
  viewModel.get("button19kj").on("click", function (data) {
    // 按钮--单击
    debugger;
    let event = viewModel.getAllData();
    var id = event.id;
    var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.cs520", { id: id }, function (err, res) {}, viewModel, { async: false });
  });