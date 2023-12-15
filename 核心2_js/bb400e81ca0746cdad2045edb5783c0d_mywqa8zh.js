viewModel.on("customInit", function (data) {
  // 金建出证合同详情--页面初始化
  viewModel.on("afterLoadData", function (all) {
    let liushuihao = viewModel.get("code").getValue();
    let sfwk = viewModel.get("chuzhenghetonghao").getValue();
    if (sfwk == null) {
      viewModel.get("chuzhenghetonghao").setValue(liushuihao);
    }
    //等级枚举
    var data0 = [
      { value: "1", text: "一级", nameType: "string" },
      { value: "2", text: "二级", nameType: "string" },
      { value: "3", text: "三级", nameType: "string" },
      { value: "4", text: "初级", nameType: "string" },
      { value: "5", text: "中级", nameType: "string" },
      { value: "6", text: "高级", nameType: "string" },
      { value: "999", text: "其他", nameType: "string" }
    ];
    viewModel.get("Grade").setDataSource(data0);
    //证书类型枚举
    var data1 = [
      { value: "1", text: "建造师", nameType: "string" },
      { value: "2", text: "造价工程师", nameType: "string" },
      { value: "3", text: "职称", nameType: "string" },
      { value: "4", text: "技工证", nameType: "string" },
      { value: "5", text: "监理工程师", nameType: "string" },
      { value: "6", text: "特种工", nameType: "string" },
      { value: "7", text: "安全员(只限A、B)", nameType: "string" },
      { value: "8", text: "大证", nameType: "string" },
      { value: "999", text: "其他", nameType: "string" }
    ];
    viewModel.get("certificateType").setDataSource(data1);
    //状态
    var data2 = [
      { value: "1", text: "正常", nameType: "string" },
      { value: "2", text: "作废", nameType: "string" },
      { value: "4", text: "已出证", nameType: "string" },
      { value: "7", text: "合同过期", nameType: "string" },
      { value: "8", text: "完结", nameType: "string" }
    ];
    viewModel.get("hetongzhuangtai").setDataSource(data2);
  });
});
viewModel.on("afterSave", function (allsj) {
  //事件发生之后，可以进行保存成功以后的特色化需求
  var Action = viewModel.originalParams.action;
  var czhtsj = allsj.res;
  if (Action == "add") {
    var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.czhthcf", { czhtsj: czhtsj }, function (err, res) {}, viewModel, { async: false });
  }
});
viewModel.on("beforeSave", function (args) {
  //设置保存前校验
  debugger;
  var datajs = args.data.data;
  let data1 = JSON.parse(datajs);
  //正常和已出证,完结的数据有几条
  var reponse = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.czht", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
  var zt = data1._status;
  var len = reponse.result.body.length;
  var bgcs = data1.ChangeTimes;
  //有几条是正常的数据
  var kltsl = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.czhtwyxjy", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
  var langge = kltsl.result.zczf.length;
  if (zt == "Insert") {
    if (langge >= 1 || len >= bgcs) {
      cb.utils.confirm("该人员还有未出证数据或者已到达变更次数");
      return false;
    } else {
    }
  }
});
viewModel.get("button27eb") &&
  viewModel.get("button27eb").on("click", function (data) {
    // 测试 --单击
    debugger;
    let event = viewModel.getAllData();
    var id = event.id;
    var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.cs520", { id: id }, function (err, res) {}, viewModel, { async: false });
  });