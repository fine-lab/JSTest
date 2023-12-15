viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.get("button93pj") &&
    viewModel.get("button93pj").on("click", function (data) {
      console.log("点击下单按钮");
      var id = viewModel.get("id").getValue();
      var ShipperCodeKey = viewModel.get("ShipperCodeKey").getValue();
      var ExpType = viewModel.get("ExpType").getValue();
      var PayType = viewModel.get("PayType").getValue();
      var SenderName = viewModel.get("SenderName").getValue();
      var SenderMobile = viewModel.get("SenderMobile").getValue();
      var SenderProvinceName = viewModel.get("SenderProvinceName_name").getValue();
      var SenderCityName = viewModel.get("SenderCityName_name").getValue();
      var SenderExpAreaName = viewModel.get("SenderExpAreaName_name").getValue();
      var SenderAddress = viewModel.get("SenderAddress").getValue();
      var Quantity = viewModel.get("Quantity").getValue();
      var GoodsName = viewModel.get("GoodsName").getValue();
      var Remark = viewModel.get("Remark").getValue();
      var receiveContacter = viewModel.get("receiveContacter").getValue();
      var receiveContacterPhone = viewModel.get("receiveContacterPhone").getValue();
      var agentIdProvince = viewModel.get("agentIdProvince_name").getValue();
      var agentIdCity = viewModel.get("agentIdCity_name").getValue();
      var agentIdExpArea = viewModel.get("agentIdExpArea_name").getValue();
      var agentId_address = viewModel.get("agentId_address").getValue();
      cb.rest.invokeFunction(
        "AT175A93621C400009.backOpenApiFunction.EOrderService",
        {
          id: id,
          ShipperCodeKey: ShipperCodeKey,
          ExpType: ExpType,
          PayType: PayType,
          SenderName: SenderName,
          SenderMobile: SenderMobile,
          SenderProvinceName: SenderProvinceName,
          SenderCityName: SenderCityName,
          SenderExpAreaName: SenderExpAreaName,
          SenderAddress: SenderAddress,
          Quantity: Quantity,
          Remark: Remark,
          GoodsName: GoodsName,
          receiveContacter: receiveContacter,
          receiveContacterPhone: receiveContacterPhone,
          agentIdProvince: agentIdProvince,
          agentIdCity: agentIdCity,
          agentIdExpArea: agentIdExpArea,
          agentId_address: agentId_address
        },
        function (err, res) {
          if (res.result.Reason === "成功") {
            console.log("下单成功！！");
            cb.utils.alert("下单成功");
            viewModel.execute("refresh");
          } else {
            cb.utils.alert(res.result.Reason);
          }
          console.log(res);
          viewModel.execute("refresh");
        }
      );
    });
  //下单按钮是否显示
  viewModel.on("modeChange", function (data) {
    var OrderCode = viewModel.get("OrderCode").getValue();
    if (OrderCode != "" && OrderCode != undefined) {
      viewModel.get("button93pj").setVisible(false);
    } else {
      viewModel.get("button93pj").setVisible(true);
    }
  });
  viewModel.get("button97uc") &&
    viewModel.get("button97uc").on("click", function (data) {
      console.log("点击打印按钮");
      var OrderCode = viewModel.get("OrderCode").getValue();
      var url = "https://www.example.com/";
      const proxy = viewModel.setProxy({
        saveLog: {
          url: url,
          method: "POST",
          header: { "Access-Control-Allow-Origin": "*" },
          options: {
            mask: true,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            uniform: false
          }
        }
      });
      //调用
      var RequestData = [{ OrderCode: "c4bd5906-42ab-4927-8754-d3e0e7a94049", PortName: "HP Lasser MFP 136w" }];
      const params = {
        RequestData: RequestData,
        EBusinessID: "yourIDHere",
        IsPreview: 1,
        DataSign: "NzFjNjg0YzM2ZDBkNmIxNGY2ZDU0ODA2YjY2ZTgyM2M="
      };
      console.log(params);
      proxy.saveLog(params, function (data) {
        console.log("success", data);
      });
    });
  //发货装箱单详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    var viewModel = this;
    //调用api接口(快递查询接口)
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
    if (verifystate === 2) {
      //调用api接口根据客户地址ID获取经纬度
      var id = viewModel.get("id").getValue();
      var agentId_ID = viewModel.get("agentId_ID").getValue();
      var agentId_addressID = viewModel.get("agentId_addressID").getValue();
      cb.rest.invokeFunction("AT175A93621C400009.backOpenApiFunction.getAddressApi", { id: id, agentId_ID: agentId_ID, agentId_addressID: agentId_addressID }, function (err, res) {
        console.log(res.latitude);
        console.log(res.longitude);
      });
    }
  });
});