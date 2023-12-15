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
  ctlGridMust();
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
  if (org_id == "1573825602524807244" || org_id == "1573825602524807247" || org_id == "1573825602524807249") {
    //环保
    val = 2;
  } else if (org_id == "1573825602524807175" || org_id == "1573825602524807176" || org_id == "1573825602524807180") {
    //建机
    val = 1;
  } else if (org_id == "1573825602524807245") {
    //游乐
    val = 3;
  }
  viewModel.get("shiyebu").setValue(val);
});
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    let org_id = viewModel.get("org_id").getValue();
    if (org_id == undefined || org_id == "") {
      return;
    }
    let val = 1;
    if (org_id == "1573825602524807244" || org_id == "1573825602524807247" || org_id == "1573825602524807249") {
      //环保
      val = 2;
    } else if (org_id == "1573825602524807175" || org_id == "1573825602524807176" || org_id == "1573825602524807180") {
      //建机
      val = 1;
    } else if (org_id == "1573825602524807245") {
      //游乐
      val = 3;
    }
    viewModel.get("shiyebu").setValue(val);
  });
viewModel.get("jjxxList") &&
  viewModel.get("jjxxList").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("jjxxList");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("jjxxList").getRows()[rowIndex];
    let wlsl = rowData.wlsl;
    wlsl = wlsl == null || wlsl == "" ? 0 : wlsl;
    if (cellName == "wlsl") {
      let danjia = rowData.danjia;
      danjia = danjia == null || danjia == "" ? 0 : danjia;
      rowData.jine = wlsl * danjia;
      gridModel.updateRow(rowIndex, rowData);
    } else if (cellName == "danjia") {
      let danjia = data.value;
      danjia = danjia == null || danjia == "" ? 0 : danjia;
      rowData.jine = wlsl * danjia;
      gridModel.updateRow(rowIndex, rowData);
    } else if (cellName == "jine") {
      let jine = data.value;
      jine = jine == null || jine == "" ? 0 : jine;
      if (wlsl == 0) {
        wlsl = 1;
        rowData.wlsl = 1;
      }
      rowData.danjia = (jine / wlsl).toFixed(2);
      gridModel.updateRow(rowIndex, rowData);
    }
  });
viewModel.on("modeChange", function (data) {
  ctlGridMust();
});
let ctlGridMust = () => {
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 1) {
    //审核中
    let gridModel = viewModel.getGridModel("jjxxList");
    gridModel.setState("bIsNull", false);
  }
};
viewModel.on("afterProcessWorkflow", function (args) {
  let caigoudingdanbianhao_code = viewModel.get("caigoudingdanbianhao_code");
  debugger;
  if (caigoudingdanbianhao_code.__data.bShowIt) {
    caigoudingdanbianhao_code.setState("bIsNull", false);
  } else {
    caigoudingdanbianhao_code.setState("bIsNull", true);
  }
  let PurWarBillNo = viewModel.get("PurWarBillNo");
  debugger;
  if (PurWarBillNo.__data.bShowIt) {
    PurWarBillNo.setState("bIsNull", false);
  } else {
    PurWarBillNo.setState("bIsNull", true);
  }
  let TheContainerType = viewModel.get("TheContainerType");
  debugger;
  if (TheContainerType.__data.bShowIt) {
    TheContainerType.setState("bIsNull", false);
  } else {
    TheContainerType.setState("bIsNull", true);
  }
  //装柜信息附加说明备注字段
  let zhuangguixinxifujiashuoming = viewModel.get("zhuangguixinxifujiashuoming");
  debugger;
  if (zhuangguixinxifujiashuoming.__data.bShowIt) {
    zhuangguixinxifujiashuoming.setState("bIsNull", false);
  } else {
    zhuangguixinxifujiashuoming.setState("bIsNull", true);
  }
  let YHLC_fahuorenyuanList = viewModel.get("YHLC_fahuorenyuanList");
  debugger;
  if (YHLC_fahuorenyuanList.__data.bShowIt) {
    YHLC_fahuorenyuanList.setState("bIsNull", false);
    YHLC_fahuorenyuanList.setState("bCanModify", true);
    YHLC_fahuorenyuanList.setState("disabled", false);
  } else {
    YHLC_fahuorenyuanList.setState("bIsNull", true);
  }
  let YHLC_yanhuorenyuanList = viewModel.get("YHLC_yanhuorenyuanList");
  debugger;
  if (YHLC_yanhuorenyuanList.__data.bShowIt) {
    YHLC_yanhuorenyuanList.setState("bIsNull", false);
    YHLC_yanhuorenyuanList.setState("bCanModify", true);
    YHLC_yanhuorenyuanList.setState("disabled", false);
  } else {
    YHLC_yanhuorenyuanList.setState("bIsNull", true);
  }
  let ShippingList = viewModel.get("ShippingList");
  debugger;
  if (ShippingList.__data.bShowIt) {
    ShippingList.setState("bIsNull", false);
  } else {
    ShippingList.setState("bIsNull", true);
  }
  let ShippingPhotosOrVideos = viewModel.get("ShippingPhotosOrVideos");
  debugger;
  if (ShippingPhotosOrVideos.__data.bShowIt) {
    ShippingPhotosOrVideos.setState("bIsNull", false);
  } else {
    ShippingPhotosOrVideos.setState("bIsNull", true);
  }
  let zhaopianshipingongxiangpanweizhi = viewModel.get("zhaopianshipingongxiangpanweizhi");
  debugger;
  if (zhaopianshipingongxiangpanweizhi.__data.bShowIt) {
    zhaopianshipingongxiangpanweizhi.setState("bIsNull", false);
  } else {
    zhaopianshipingongxiangpanweizhi.setState("bIsNull", true);
  }
});
//子表单自动新增一行
viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel("ZGList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{ zgbz: "无" }];
    gridModel.insertRows(0, rowDatas);
  }
});
viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel("PXList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{ pxbz: "无" }];
    gridModel.insertRows(0, rowDatas);
  }
});