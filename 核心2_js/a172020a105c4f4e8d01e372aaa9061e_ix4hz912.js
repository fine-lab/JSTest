viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel("JCYSList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [
      { ItemsForAcceptance: "产品质量-整体尺寸", AcceptanceOfTheContent: "是否与方案图纸—致" },
      { ItemsForAcceptance: "产品质量-配置品牌", AcceptanceOfTheContent: "是否与合同要求—致" },
      { ItemsForAcceptance: "产品质量-焊缝", AcceptanceOfTheContent: "焊高按照国家标准;无焊接缺陷" },
      { ItemsForAcceptance: "产品质量-油漆", AcceptanceOfTheContent: "颜色与合同要求—致;厚度、光洁度达标" },
      { ItemsForAcceptance: "产品质量-包装", AcceptanceOfTheContent: "保证国内、国外运输无磕碰;无受潮生锈" },
      { ItemsForAcceptance: "说明书", AcceptanceOfTheContent: "自主品牌说明书" },
      { ItemsForAcceptance: "随机资料-合格证 ", AcceptanceOfTheContent: "检测报告;合格证 " },
      { ItemsForAcceptance: "随机资料-随机图纸 ", AcceptanceOfTheContent: " 机械图纸;电气图纸 " },
      { ItemsForAcceptance: "零件箱--零配件 ", AcceptanceOfTheContent: "发货清单 " },
      { ItemsForAcceptance: "零件箱-额外配件 ", AcceptanceOfTheContent: "合同特殊要求的配件 " }
    ];
    gridModel.insertRows(0, rowDatas);
  }
  gridModel = viewModel.getGridModel("GNYSList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [
      { FunctionalTest: "空载试机是否正常" },
      { FunctionalTest: "启动电源总开关,操作各按钮,指示灯是否正常" },
      { FunctionalTest: "电机:启动、运转、声音、是否异常 " },
      { FunctionalTest: "压力表显示是否正常运行 " },
      { FunctionalTest: "电气系统是否正常运行 " },
      { FunctionalTest: "液压系统是否正常运行 " },
      { FunctionalTest: "分部试验情况是否正常 " },
      { FunctionalTest: "整机试验情况是否正常 " }
    ];
    gridModel.insertRows(0, rowDatas);
  }
});
viewModel.on("afterRule", function (event) {
  let org_id_name = viewModel.get("org_id_name").getValue();
  if (org_id_name == undefined || org_id_name == "") {
    return;
  }
  let shiyebu = viewModel.get("shiyebu").getValue();
  if (shiyebu != undefined && shiyebu != "") {
    return;
  }
  let org_id = viewModel.get("org_id").getValue();
  let val = 1;
  if (org_id == "1568715003641462912" || org_id == "1568715003641462914" || org_id == "1568715003641462918") {
    //环保
    val = 2;
  } else if (org_id == "1568715003641462819" || org_id == "1568715003641462820" || org_id == "1568715003641462822") {
    //建机
    val = 1;
  } else if (org_id == "1568715003641462917") {
    //游乐
    val = 3;
  }
  viewModel.get("shiyebu").setValue(val);
});