viewModel.on("customInit", function (data) {
  var viewModel = this;
  //快递接口许可量提醒
  cb.rest.invokeFunction(
    "AT175A93621C400009.backOpenApiFunction.permission_value",
    { id: "youridHere" },
    function (err, res) {
      console.log(res.data[0].CurrentLicense);
      console.log(res.data[0].WarningPermit);
      console.log(res.data[0].PurchasePermit);
      let currentLicense = res.data[0].CurrentLicense; //当前许可
      let warningPermit = res.data[0].WarningPermit; //预警许可
      let purchasePermit = res.data[0].PurchasePermit; //购买许可
      if (currentLicense >= warningPermit && currentLicense < purchasePermit) {
        cb.utils.alert("快递查询许可不足");
      } else if (currentLicense >= purchasePermit) {
        cb.utils.alert("快递查询许可不足,请及时购买");
      }
    }
  );
  //下单按钮是否显示
  // 在适当的地方定义一个标志
  var shouldInitialize = true;
  // 在保存前的事件中设置标志为false
  viewModel.on("beforeSave", function (args) {
    shouldInitialize = false;
  });
  // 在保存后的事件中检查标志，只在标志为true时执行初始化逻辑
  viewModel.on("afterSave", function (args) {
    if (shouldInitialize) {
      console.log("保存后");
    }
    // 重置标志为true，以便下一次初始化
    shouldInitialize = true;
  });
  //发货装箱单详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    var viewModel = this;
    if (shouldInitialize) {
      console.log("页面初始化");
      var WuLiuDanHao = viewModel.get("WuLiuDanHao").getValue();
      var id = viewModel.get("id").getValue();
      var CourierServicesCode = viewModel.get("CourierServicesCode").getValue();
      var receiveContacterPhone = viewModel.get("receiveContacterPhone").getValue();
      var YeWu_state = viewModel.get("YeWu_state").getValue();
      console.log(id);
      console.log(YeWu_state);
      if (YeWu_state != 3 && CourierServicesCode != "" && CourierServicesCode != null) {
        console.log("调用快递查询接口");
        console.log(WuLiuDanHao);
        console.log(CourierServicesCode);
        console.log(receiveContacterPhone);
        //调用api接口(快递查询接口)
        cb.rest.invokeFunction(
          "AT175A93621C400009.backOpenApiFunction.ExpressageAPI",
          { id: id, WuLiuDanHao: WuLiuDanHao, CourierServicesCode: CourierServicesCode, receiveContacterPhone: receiveContacterPhone },
          function (err, res) {
            console.log(res);
          }
        );
      }
    }
    //根据单据状态显示/隐藏按钮，提交、撤回、审批。
    var verifystate = viewModel.get("verifystate").getValue();
    console.log("单据状态：" + verifystate);
    if (verifystate === 1) {
      viewModel.get("button109pc").setVisible(false);
      viewModel.get("button137ba").setVisible(true);
      viewModel.get("button164ed").setVisible(true);
    } else if (verifystate === 2) {
      viewModel.get("button109pc").setVisible(false);
      viewModel.get("button137ba").setVisible(false);
      viewModel.get("button164ed").setVisible(true);
    } else if (verifystate === 4) {
      viewModel.get("button109pc").setVisible(true);
      viewModel.get("button137ba").setVisible(true);
      viewModel.get("button164ed").setVisible(true);
    } else if (verifystate === 0) {
      viewModel.get("button109pc").setVisible(true);
      viewModel.get("button137ba").setVisible(false);
      viewModel.get("button164ed").setVisible(false);
    }
  });
});