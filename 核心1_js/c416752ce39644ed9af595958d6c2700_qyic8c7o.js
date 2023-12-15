viewModel.get("button58zd") &&
  viewModel.get("button58zd").on("click", function (data) {
    if (["待处理", "不允许报备"].indexOf(viewModel.get("headDef!define27").getValue()) != -1) {
      cb.utils.alert("此商机存在跨BG产品线，" + viewModel.get("headDef!define27").getValue() + "状态不能进行报备！");
      return;
    }
    // 只有软件产品才让输入产品条码
    const prodructName = viewModel
      .getGridModel("opptItemList")
      .getAllData()
      .map((item) => item.productClass_name);
    const isSoftProduct = prodructName.includes("软件/私有云许可");
    const productBarcode = viewModel.get("headDef!define5").getValue();
    const busType = viewModel.get("headDef!define4").getValue();
    const defaultPruductLine = viewModel
      .getGridModel("opptItemList")
      .getAllData()
      .map((item) => item["bodyDef!define1"]);
    const bhapState = viewModel.get("headDef!define6").getValue();
    if (!defaultPruductLine.includes("是") || count(defaultPruductLine, "是") != 1) {
      cb.utils.alert("默认产品线需要有且仅有一个！");
      return false;
    }
    function count(o, t) {
      let n = 0;
      for (let i = 0; i < o.length; i++) {
        if (o[i] == t) n++;
      }
      return n;
    }
    //已冲突待处理的商机不能进行报备
    if (bhapState === "已冲突待处理") {
      cb.utils.alert("已冲突待处理的商机不能进行报备！");
      return false;
    }
    if (isSoftProduct && !productBarcode && busType != "新购") {
      cb.utils.alert("产品条码不能为空!");
      return false;
    }
    // 报备延期--单击
    viewModel.get("button58zd").setDisabled(true);
    setTimeout(function () {
      viewModel.get("button58zd").setDisabled(false);
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
          // 提醒是否需要调整预计签单日期
          cb.utils.alert("请查看是否需要调整预计签单日期");
          try {
            ext_info = message.Status != 0 ? message.Description : message.Body.SaveBhap.result;
            cb.utils.alert(ext_info);
          } catch (e) {}
        }
      }
    );
  });
viewModel.on("afterLoadData", function (event) {
  if (["待处理", "不允许报备"].indexOf(viewModel.get("headDef!define27").getValue()) != -1) {
    viewModel.get("button26ek").setDisabled(true);
    viewModel.get("button58zd").setDisabled(true);
    cb.utils.alert("此商机存在跨BG产品线，" + viewModel.get("headDef!define27").getValue() + "状态不能进行报备！");
  }
  cb.rest.invokeFunction("SFA.APIFUNC.getDeptByStaff", {}, function (err, res) {
    if (res) {
      if (res.result.type === "中端") {
        viewModel.execute("updateViewMeta", { code: "tabpane133zc", visible: true });
      } else {
        viewModel.execute("updateViewMeta", { code: "tabpane133zc", visible: false });
      }
    }
  });
});
viewModel.getGridModel().on("afterDeleteRows", function (rows) {
  // 商机子表数据区--单元格值改变后
  const ProductLines = {
    U8Cloud: "高端",
    U9Cloud: "高端",
    YonSuite: "高端",
    YonBIP: "中端"
  };
  let unDeptDic = {
    高端: "中端",
    中端: "高端"
  };
  let unDic = {
    高端: "1649550265645793283",
    中端: "1649550377314942977"
  };
  cb.rest.invokeFunction("SFA.APIFUNC.getDeptByStaff", {}, function (err, res) {
    if (res) {
      let opptItems = viewModel.get("opptItemList").getAllData();
      for (let oppt in opptItems) {
        if (res.result.type === "高端" && opptItems[oppt]["productLine_name"] === "U8Cloud") {
          cb.utils.alert("U8C不允许高端报备");
          break;
        }
        //中端报备中端产品线及BIP旗舰版（私有云许可除外，报BIP旗舰版需要走审批）
        //高端报备高端产品线及U9C、YS（报U9C、YS需要走审批）
        if (res.result.type === ProductLines[opptItems[oppt]["productLine_name"]]) {
          cb.utils.alert("此商机存在跨BG产品线，请等待处理结果后进行报备！");
          viewModel.get("headDef!define27").setValue("待处理");
          break;
        } else {
          viewModel.get("headDef!define27").clear();
        }
      }
    }
  });
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
    let unDeptDic = {
      高端: "中端",
      中端: "高端"
    };
    let unDic = {
      高端: "1649550265645793283",
      中端: "1649550377314942977"
    };
    if (data.cellName === "bodyDef!define5") {
      let opptItems = viewModel.get("opptItemList").getAllData();
      let model = "";
      for (let item in data.value) {
        model += data.value[item].text + "，";
      }
      viewModel.getGridModel().setCellValue(data.rowIndex, "bodyDef!define6", model.substring(0, model.length - 1));
    }
    cb.rest.invokeFunction("SFA.APIFUNC.getDeptByStaff", {}, function (err, res) {
      if (res) {
        let opptItems = viewModel.get("opptItemList").getAllData();
        for (let oppt in opptItems) {
          if (res.result.type === "高端" && opptItems[oppt]["productLine_name"] === "U8Cloud") {
            cb.utils.alert("U8C不允许高端报备");
            break;
          }
          //中端报备中端产品线及BIP旗舰版（私有云许可除外，报BIP旗舰版需要走审批）
          //高端报备高端产品线及U9C、YS（报U9C、YS需要走审批）
          if (res.result.type === ProductLines[opptItems[oppt]["productLine_name"]]) {
            cb.utils.alert("此商机存在跨BG产品线，请等待处理结果后进行报备！");
            viewModel.get("headDef!define27").setValue("待处理");
            break;
          } else {
            viewModel.get("headDef!define27").clear();
          }
        }
      }
    });
  });