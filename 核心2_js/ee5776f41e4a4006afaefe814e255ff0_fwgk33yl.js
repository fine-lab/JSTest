viewModel.on("afterLoadData", function (event) {
  debugger;
  const value = viewModel.get("headDef!define10").getValue();
  var myFilter = { isExtend: true, simpleVOs: [] };
  myFilter.simpleVOs.push({
    field: "name",
    op: "eq",
    value1: "1"
  });
  viewModel.get("opptSource_name").setFilter(myFilter);
});
viewModel.on("afterBrowse", function (event) {
  debugger;
  // 归口商机过滤
  var gkFilter = { isExtend: true, simpleVOs: [] };
  gkFilter.simpleVOs.push({
    field: "code",
    op: "eq",
    value1: "10"
  });
  gkFilter.simpleVOs.push({
    field: "code",
    op: "eq",
    value1: "31"
  });
  viewModel.get("headDef!define5_name").setFilter(gkFilter);
});
viewModel.get("button72kc") &&
  viewModel.get("button72kc").on("click", function (data) {
    viewModel.get("button72kc").setDisabled(true);
    setTimeout(function () {
      viewModel.get("button72kc").setDisabled(false);
    }, 1000 * 30);
    // 报备延期--单击
    cb.rest.invokeFunction(
      "SFA.itapi.SaveBhap",
      {
        id: viewModel.get("id").getValue(),
        orgId: "延期"
      },
      function (err, res) {
        if (!err) {
          const message = JSON.parse(res.message);
          try {
            ext_info = message.Status != 0 ? message.Description : message.Body.SaveBhap.result;
            cb.utils.alert(ext_info);
          } catch (e) {}
        }
      }
    );
  });
viewModel.get("opptItemList") &&
  viewModel.get("opptItemList").on("afterCellValueChange", function (data) {
    // 商机子表数据区--单元格值改变后
    const ProductLines = {
      U8Cloud: "高端",
      U9Cloud: "高端",
      YonSuite: "高端",
      YonBIP: "中端"
    };
    let productLineList = [];
    cb.rest.invokeFunction("SFA.backOpenApiFunction.getDeptByStaff", {}, function (err, res) {
      if (res) {
        debugger;
        let opptItems = viewModel.get("opptItemList").getData();
        for (let oppt in opptItems) {
          if (res.deptType === "高端" && opptItems[oppt]["productLine_name"] === "U8Cloud") {
            cb.utils.alert("U8C不允许高端报备");
            viewModel.getGridModel().deleteRows([oppt]);
            break;
          }
          //中端报备中端产品线及BIP旗舰版（私有云许可除外，报BIP旗舰版需要走审批）
          //高端报备高端产品线及U9C、YS（报U9C、YS需要走审批）
          if (res.deptType === ProductLines[opptItems[oppt]["productLine_name"]]) {
            cb.utils.alert("待处理");
            break;
          } else {
            cb.utils.alert("true");
          }
        }
      }
    });
  });
viewModel.get("dept_name").on("afterValueChange", function (data) {
  debugger;
  var data = [
    { value: "1", text: "编史修志", nameType: "string" },
    { value: "2", text: "工作察考", nameType: "string" },
    { value: "3", text: "宣传教育", nameType: "string" }
  ];
  viewModel.get("winLoseOrderState").setDataSource(data);
  var myFilter = { isExtend: true, simpleVOs: [] };
  myFilter.simpleVOs.push({
    field: "name",
    op: "eq",
    value1: "1"
  });
  viewModel.get("opptSource_name").setFilter(myFilter);
});
viewModel.get("org_name").on("afterValueChange", function (data) {
  var myFilter = { isExtend: true, simpleVOs: [] };
  myFilter.simpleVOs.push({
    field: "code",
    op: "eq",
    value1: "10"
  });
  viewModel.get("headDef!define5_name").setFilter(myFilter);
});
viewModel.get("headDef!define5_name") &&
  viewModel.get("headDef!define5_name").on("beforeBrowse", function (data) {
    //商机归口单位--参照弹窗打开前
    debugger;
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "code",
      op: "eq",
      value1: "10"
    });
    viewModel.get("headDef!define5_name").setFilter(myFilter);
  });