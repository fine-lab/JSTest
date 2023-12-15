viewModel.on("customInit", function (data) {
  // 绑定操作员--页面初始化
  cb.rest.invokeFunction(
    "GT37846AT3.backOpenApiFunction.permission_value",
    { id: "youridHere" },
    function (err, res) {
      console.log(res.data[0].CurrentLicense);
      console.log(res.data[0].WarningPermit);
      console.log(res.data[0].PurchasePermit);
      let currentLicense = res.data[0].CurrentLicense; //当前许可
      let warningPermit = res.data[0].WarningPermit; //预警许可
      let purchasePermit = res.data[0].PurchasePermit; //购买许可
      if (currentLicense >= warningPermit && currentLicense < purchasePermit) {
        cb.utils.alert("许可不足");
      } else if (currentLicense >= purchasePermit) {
        cb.utils.alert("许可不足,请及时购买");
      }
    }
  );
});