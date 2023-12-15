viewModel.get("zhengshuleixing") &&
  viewModel.get("zhengshuleixing").on("afterValueChange", function (data) {
    // 证书类型--值改变后
    debugger;
    const value = viewModel.get("zhengshuleixing").getValue();
    if (value == "1") {
      //建造师
      var data = [
        { value: "1", text: "一级", nameType: "string" },
        { value: "3", text: "二级", nameType: "string" },
        { value: "999", text: "其他", nameType: "string" }
      ];
      viewModel.get("dengji").setDataSource(data);
      var data1 = [
        { value: "7", text: "供应商", nameType: "string" },
        { value: "2", text: "续单", nameType: "string" },
        { value: "4", text: "转介绍", nameType: "string" }
      ];
      viewModel.get("CustomerSource").setDataSource(data1);
    } else if (value == "3") {
      //职称
      var data = [
        { value: "4", text: "初级", nameType: "string" },
        { value: "5", text: "中级", nameType: "string" },
        { value: "6", text: "高级", nameType: "string" }
      ];
      viewModel.get("dengji").setDataSource(data);
    } else if (value == "7") {
      //安全员
      var data = [
        { value: "8", text: "A", nameType: "string" },
        { value: "9", text: "B", nameType: "string" },
        { value: "10", text: "C1", nameType: "string" },
        { value: "11", text: "C2", nameType: "string" }
      ];
      viewModel.get("dengji").setDataSource(data);
    } else if (value == "10") {
      //技工
      var data = [
        { value: "12", text: "技师", nameType: "string" },
        { value: "4", text: "初级", nameType: "string" },
        { value: "5", text: "中级", nameType: "string" },
        { value: "6", text: "高级", nameType: "string" }
      ];
      viewModel.get("dengji").setDataSource(data);
    } else if (value == "6") {
      //特种工
      var data = [
        { value: "6", text: "公司员工", nameType: "string" },
        { value: "9", text: "员工家属", nameType: "string" },
        { value: "7", text: "供应商", nameType: "string" },
        { value: "999", text: "其他", nameType: "string" }
      ];
      viewModel.get("CustomerSource").setDataSource(data);
    }
  });
viewModel.on("customInit", function (data) {
  // 收证合同详情--页面初始化
  viewModel.on("afterLoadData", function () {
    var data = [
      { value: "1", text: "建造师", nameType: "string" },
      { value: "3", text: "职称", nameType: "string" },
      { value: "6", text: "特种工", nameType: "string" },
      { value: "7", text: "安全员", nameType: "string" },
      { value: "10", text: "技工", nameType: "string" }
    ];
    viewModel.get("zhengshuleixing").setDataSource(data);
  });
  viewModel.on("afterLoadData", function () {
    debugger;
    const liushuihao = viewModel.get("code").getValue();
    var date = new Date();
    var year = date.getFullYear();
    var ss = "FWSZ" + year + "-" + liushuihao;
    viewModel.get("ReceiptNo").setValue(ss);
  });
});
viewModel.get("Phone") &&
  viewModel.get("Phone").on("afterValueChange", function (data) {
    // 电话--值改变后
  });
viewModel.on("afterSave", function (args) {
  //保存后
  debugger;
  var zt = viewModel.originalParams.action;
  var sj = args.res;
  if (zt == "add") {
    var pp = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.sjhth", { sj: sj }, function (err, res) {}, viewModel, { async: false });
  }
});