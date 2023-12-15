viewModel.get("button93nc") &&
  viewModel.get("button93nc").on("click", function (data) {
    // 调拨订单--单击
    debugger;
    let cgrkId = viewModel.originalParams.id + "";
    let result = cb.rest.invokeFunction("ST.api.cgrkList", { data: cgrkId }, function (err, res) {}, viewModel, { async: false });
    console.log("-------" + result.result.apiResponse);
    let cgrkData = JSON.parse(result.result.apiResponse);
    let changliang = "true";
    let diaoboZi = "";
    for (var p in cgrkData.data.purInRecords) {
      //遍历json数组时，这么写p为索引，0,1
      diaoboZi = diaoboZi + "{";
      if (cgrkData.data.purInRecords[p].product != null) {
        diaoboZi = diaoboZi + '"product": "' + cgrkData.data.purInRecords[p].product + '",';
      }
      if (cgrkData.data.purInRecords[p].product_cCode != null) {
        diaoboZi = diaoboZi + '"product_cCode": "' + cgrkData.data.purInRecords[p].product_cCode + '",';
      } //物料编码
      if (cgrkData.data.purInRecords[p].product_cName != null) {
        diaoboZi = diaoboZi + '"product_cName": "' + cgrkData.data.purInRecords[p].product_cName + '",'; //物料名称
      }
      if (cgrkData.data.purInRecords[p].product_model != null) {
        diaoboZi = diaoboZi + '"product_model": "' + cgrkData.data.purInRecords[p].product_model + '",'; //型号
      }
      if (cgrkData.data.purInRecords[p].product_modelDescription != null) {
        diaoboZi = diaoboZi + '"modelDescription": "' + cgrkData.data.purInRecords[p].product_modelDescription + '",'; //规格说明
      }
      if (cgrkData.data.purInRecords[p].productsku != null) {
        diaoboZi = diaoboZi + '"productsku": "' + cgrkData.data.purInRecords[p].productsku + '",'; //物料SKUid
      }
      if (cgrkData.data.purInRecords[p].productsku_cCode != null) {
        diaoboZi = diaoboZi + '"productsku_cCode": "' + cgrkData.data.purInRecords[p].productsku_cCode + '",'; //物料SKU编码
      }
      if (cgrkData.data.purInRecords[p].productsku_cName != null) {
        diaoboZi = diaoboZi + '"productsku_cName": "' + cgrkData.data.purInRecords[p].productsku_cName + '",'; //物料SKU名称
      }
      if (cgrkData.data.purInRecords[p].propertiesValue != null) {
        diaoboZi = diaoboZi + '"propertiesValue": "' + cgrkData.data.purInRecords[p].propertiesValue + '",'; //规格
      }
      if (cgrkData.data.purInRecords[p].qty != null) {
        diaoboZi = diaoboZi + '"qty": "' + cgrkData.data.purInRecords[p].qty + '",'; //数量
      }
      if (cgrkData.data.purInRecords[p].unit != null) {
        diaoboZi = diaoboZi + '"unit": "' + cgrkData.data.purInRecords[p].unit + '",'; //主计量id或code
      }
      if (cgrkData.data.purInRecords[p].unit_name != null) {
        diaoboZi = diaoboZi + '"unitName": "' + cgrkData.data.purInRecords[p].unit_name + '",'; //主计量名称
      }
      if (cgrkData.data.purInRecords[p].invExchRate != null) {
        diaoboZi = diaoboZi + '"invExchRate": "' + cgrkData.data.purInRecords[p].invExchRate + '",'; //采购换算率
      }
      if (cgrkData.data.purInRecords[p].subQty != null) {
        diaoboZi = diaoboZi + '"subQty": "' + cgrkData.data.purInRecords[p].subQty + '",'; //采购数量
      }
      if (cgrkData.data.purInRecords[p].unit_Precision != null) {
        diaoboZi = diaoboZi + '"unit_Precision": "' + cgrkData.data.purInRecords[p].unit_Precision + '",'; //主计量精度
      }
      if (cgrkData.data.purInRecords[p].project != null) {
        diaoboZi = diaoboZi + '"project": "' + cgrkData.data.purInRecords[p].project + '",'; //项目id
      }
      if (cgrkData.data.purInRecords[p].project_name != null) {
        diaoboZi = diaoboZi + '"project_name": "' + cgrkData.data.purInRecords[p].project_name + '",'; //项目名称
      }
      if (cgrkData.data.purInRecords[p].memo != null) {
        diaoboZi = diaoboZi + '"applyorders_memo": "' + cgrkData.data.purInRecords[p].memo + '"'; //备注
      }
      diaoboZi = diaoboZi + '"isCanModPrice": "' + changliang + '",'; //价格可改, true:是、false:否、
      diaoboZi = diaoboZi + '"taxUnitPriceTag": "' + changliang + '"'; //价格含税, true:是、false:否、
      diaoboZi = diaoboZi + "},";
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let args = {
      billtype: "Voucher", // 单据类型
      billno: "st_transferapply", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (卡片页面区分编辑态edit、新增态add、)
        outorg: cgrkData.data.purchaseOrg, //调出组织id或code
        outorg_name: cgrkData.data.purchaseOrg_name, //调出组织名称
        outaccount: cgrkData.data.purchaseOrg, //调出会计主体id或code
        vouchdate: cgrkData.data.vouchdate, //单据日期
        bustype: "A03001", //交易类型
        bustype_name: "调拨", //交易类型名称
        breturn: "false", //调拨退货, true:是、false:否
        inorg: cgrkData.data.org, //调入组织id或code
        inorg_name: cgrkData.data.org_name, //调入组织名称
        inaccount: cgrkData.data.org, //调入会计主体id或code
        currency: cgrkData.data.currency, //币种id
        natCurrency: cgrkData.data.currency, //本币id
        exchRate: "1", //汇率
        dplanshipmentdate: year + "-" + month + "-" + day, //计划发货日期
        dplanarrivaldate: year + "-" + month + "-" + day, //计划到货日期
        memo: cgrkData.data.memo, //备注
        applyOrders: JSON.parse("[" + diaoboZi.substring(0, diaoboZi.length - 1) + "]")
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", args, viewModel);
  });