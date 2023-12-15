viewModel.on("customInit", function (data) {
  // 金建收证合同z详情--页面初始化
  viewModel.on("afterLoadData", function (alldate) {
    let szht = viewModel.get("CertificateReceivingContractNo").getValue();
    if (szht == null) {
      let liushuihao = viewModel.get("code").getValue();
      viewModel.get("CertificateReceivingContractNo").setValue(liushuihao);
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
    //客户来源
    var data2 = [
      { value: "1", text: "直线电话", nameType: "string" },
      { value: "2", text: "续单", nameType: "string" },
      { value: "3", text: "维护", nameType: "string" },
      { value: "4", text: "转介绍", nameType: "string" },
      { value: "5", text: "代理", nameType: "string" }
    ];
    viewModel.get("CustomerSource").setDataSource(data2);
    var data3 = [
      { value: "1", text: "正常", nameType: "string" },
      { value: "2", text: "作废", nameType: "string" },
      { value: "3", text: "闲置", nameType: "string" },
      { value: "7", text: "合同过期", nameType: "string" },
      { value: "8", text: "完结", nameType: "string" }
    ];
    viewModel.get("state").setDataSource(data3);
  });
});
viewModel.on("afterAddRow", function (params) {
  debugger;
  const data = viewModel.getAllData();
  var dj = data.Grade;
  var zy = data.major;
  var zslx = data.certificateType;
  let gridModel = viewModel.getGridModel();
  gridModel.setColumnValue("dengji", dj);
  gridModel.setColumnValue("zhuanye", zy);
  gridModel.setColumnValue("zhengshuleixing", zslx);
});
viewModel.on("beforeSave", function (args) {
  //设置保存前校验
  debugger;
  var datajs = args.data.data;
  let data1 = JSON.parse(datajs);
  var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.szht", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
  var zt = data1._status;
  var len = reponse.result.pon.length;
  if (zt == "Insert") {
    if (len >= 1) {
      cb.utils.alert("该人员还有任务不能再次被引用!");
      return false;
    } else {
    }
  }
});
viewModel.on("afterSave", function (allsj) {
  //事件发生之后，可以进行保存成功以后的特色化需求
  debugger;
  var tsxj = viewModel.originalParams.action;
  var szhtsj = allsj.res;
  if (tsxj == "add") {
    var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.szht", { szhtsj: szhtsj }, function (err, res) {}, viewModel, { async: false });
  }
});