function btn_loadInvStock(event) {
  var viewModel = this;
  var appKey = "yourKeyHere";
  var appSecret = "yourSecretHere";
  var access_token = "";
  var gridModel = viewModel.getGridModel();
  //获取Token
  cb.rest.invokeFunction("GT15688AT14.backDefaultGroup.GetToken", { appKey: appKey, appSecret: appSecret }, function (err, res) {
    access_token = res.access_token;
    console.log("access_token:" + access_token);
    let billdate = viewModel.get("billdate").getValue();
    let ware_id = viewModel.get("warecode").getValue();
    let ware_name = viewModel.get("warecode_name").getValue();
    var param = {
      billdate: billdate + " 08:00:00",
      ware_id: ware_id,
      ware_name: ware_name,
      access_token: access_token
    };
    var comUnit = [];
    //查询计量单位
    cb.rest.invokeFunction("GT15688AT14.backDefaultGroup.queryComUnit", param, function (err, res) {
      if (res.code == "200") {
        comUnit = res.data.recordList;
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
            inv.invid = orgInvList[i].product;
            inv.skuid = orgInvList[i].productsku;
            inv.skucode = orgInvList[i].productsku_code;
            inv.skuname = orgInvList[i].productsku_name;
            //库存单位
            inv.unitid = orgInvList[i].unit;
            for (let j = 0; j < comUnit.length; j++) {
              if (comUnit[j].id === inv.unitid) {
                inv.unitcode = comUnit[j].code;
                inv.unitname = comUnit[j].name;
                inv.unitcode_st = inv.unitcode;
                inv.unitname_st = inv.unitname;
                break;
              }
            }
            //账面数量
            inv.bookqty = orgInvList[i].currentqty;
            //默认盘点数量==账面数量
            inv.checkqty = inv.bookqty;
            gridModel.insertRow(i, inv);
          }
        });
      } else {
        cb.utils.alert("查询计量单位失败");
      }
      console.log(JSON.stringify(res));
    });
  });
}