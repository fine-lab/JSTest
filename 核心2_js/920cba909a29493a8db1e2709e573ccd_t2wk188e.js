function button12cb_onClick(event) {
  var viewModel = this;
  var appKey = "yourKeyHere";
  var appSecret = "yourSecretHere";
  var access_token = "";
  var gridModel = viewModel.getGridModel();
  cb.rest.invokeFunction("GT15688AT14.backDefaultGroup.GetToken", { appKey: appKey, appSecret: appSecret }, function (err, res) {
    access_token = res.access_token;
    console.log("access_token:" + access_token);
    let billdate = viewModel.get("billdate").getValue();
    let ware_id = viewModel.get("warecode").getValue();
    var param = {
      billdate: billdate,
      ware_id: ware_id,
      access_token: access_token
    };
    var comUnit = [];
    //查询计量单位
    cb.rest.invokeFunction("GT15688AT14.backDefaultGroup.queryComUnit", param, function (err, res) {
      comUnit = res.data;
      console.log(JSON.stringify(res));
    });
    //现存量查询
    cb.rest.invokeFunction("GT15688AT14.backDefaultGroup.QueryInvStockBy", param, function (err, res) {
      console.log(JSON.stringify(res));
      let orgInvList = res.invList;
      let desInvList = [];
      for (let i = 0; i < orgInvList.length; i++) {
        let inv = {};
        inv.invcode = orgInvList[i].product_code;
        inv.invname = orgInvList[i].product_name;
        inv.invcode_name = orgInvList[i].product;
        inv.skucode = orgInvList[i].productsku_code;
        inv.skuname = orgInvList[i].productsku_name;
        inv.bookqty = orgInvList[i].currentqty;
        desInvList[i] = inv;
      }
      gridModel.setData(desInvList);
    });
  });
}