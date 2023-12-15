//等级枚举
viewModel.on("afterLoadData", function () {
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
  viewModel.get("CertificateType").setDataSource(data1);
  //客户来源
  var data2 = [
    { value: "1", text: "直线电话", nameType: "string" },
    { value: "2", text: "续单", nameType: "string" },
    { value: "3", text: "维护", nameType: "string" },
    { value: "4", text: "转介绍", nameType: "string" },
    { value: "5", text: "代理", nameType: "string" }
  ];
  viewModel.get("CustomerSource").setDataSource(data2);
});