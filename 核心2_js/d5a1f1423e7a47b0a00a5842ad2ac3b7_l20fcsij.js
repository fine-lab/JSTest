viewModel.get("button48ud") &&
  viewModel.get("button48ud").on("click", function (data) {
    // 调拨订单--单击
    debugger;
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    let qingGouId = "";
    selectedRows.forEach((dateList) => {
      qingGouId = dateList.id;
    });
    let result = cb.rest.invokeFunction("PU.backOpenApiFunction.qinggoudanList", { data: qingGouId }, function (err, res) {}, viewModel, { async: false });
    console.log("-------" + result.result.apiResponse);
    let qinggouData = JSON.parse(result.result.apiResponse);
    let caigouOrg = ""; //采购组织对应调拨的调出组织
    let caigouOrgName = "";
    let changliang = "true";
    let diaoboZi = "";
    for (var p in qinggouData.data.applyOrders) {
      //遍历json数组时，这么写p为索引，0,1
      if (qinggouData.data.applyOrders[p].purchaseOrg != null && qinggouData.data.applyOrders[p].purchaseOrg_name != null) {
        caigouOrg = qinggouData.data.applyOrders[p].purchaseOrg;
        caigouOrgName = qinggouData.data.applyOrders[p].purchaseOrg_name;
      }
      diaoboZi = diaoboZi + "{";
      if (qinggouData.data.applyOrders[p].product != null) {
        diaoboZi = diaoboZi + '"product": "' + qinggouData.data.applyOrders[p].product + '",';
      }
      if (qinggouData.data.applyOrders[p].product_cCode != null) {
        diaoboZi = diaoboZi + '"product_cCode": "' + qinggouData.data.applyOrders[p].product_cCode + '",';
      } //物料编码
      if (qinggouData.data.applyOrders[p].product_cName != null) {
        diaoboZi = diaoboZi + '"product_cName": "' + qinggouData.data.applyOrders[p].product_cName + '",'; //物料名称
      }
      if (qinggouData.data.applyOrders[p].product_model != null) {
        diaoboZi = diaoboZi + '"product_model": "' + qinggouData.data.applyOrders[p].product_model + '",'; //型号
      }
      if (qinggouData.data.applyOrders[p].product_modelDescription != null) {
        diaoboZi = diaoboZi + '"modelDescription": "' + qinggouData.data.applyOrders[p].product_modelDescription + '",'; //规格说明
      }
      if (qinggouData.data.applyOrders[p].productsku != null) {
        diaoboZi = diaoboZi + '"productsku": "' + qinggouData.data.applyOrders[p].productsku + '",'; //物料SKUid
      }
      if (qinggouData.data.applyOrders[p].productsku_cCode != null) {
        diaoboZi = diaoboZi + '"productsku_cCode": "' + qinggouData.data.applyOrders[p].productsku_cCode + '",'; //物料SKU编码
      }
      if (qinggouData.data.applyOrders[p].productsku_cName != null) {
        diaoboZi = diaoboZi + '"productsku_cName": "' + qinggouData.data.applyOrders[p].productsku_cName + '",'; //物料SKU名称
      }
      if (qinggouData.data.applyOrders[p].propertiesValue != null) {
        diaoboZi = diaoboZi + '"propertiesValue": "' + qinggouData.data.applyOrders[p].propertiesValue + '",'; //规格
      }
      if (qinggouData.data.applyOrders[p].qty != null) {
        diaoboZi = diaoboZi + '"qty": "' + qinggouData.data.applyOrders[p].qty + '",'; //数量
      }
      if (qinggouData.data.applyOrders[p].unit != null) {
        diaoboZi = diaoboZi + '"unit": "' + qinggouData.data.applyOrders[p].unit + '",'; //主计量id或code
      }
      if (qinggouData.data.applyOrders[p].unit_name != null) {
        diaoboZi = diaoboZi + '"unitName": "' + qinggouData.data.applyOrders[p].unit_name + '",'; //主计量名称
      }
      if (qinggouData.data.applyOrders[p].invExchRate != null) {
        diaoboZi = diaoboZi + '"invExchRate": "' + qinggouData.data.applyOrders[p].invExchRate + '",'; //采购换算率
      }
      if (qinggouData.data.applyOrders[p].subQty != null) {
        diaoboZi = diaoboZi + '"subQty": "' + qinggouData.data.applyOrders[p].subQty + '",'; //采购数量
      }
      if (qinggouData.data.applyOrders[p].unit_Precision != null) {
        diaoboZi = diaoboZi + '"unit_Precision": "' + qinggouData.data.applyOrders[p].unit_Precision + '",'; //主计量精度
      }
      if (qinggouData.data.applyOrders[p].project != null) {
        diaoboZi = diaoboZi + '"project": "' + qinggouData.data.applyOrders[p].project + '",'; //项目id
      }
      if (qinggouData.data.applyOrders[p].project_name != null) {
        diaoboZi = diaoboZi + '"project_name": "' + qinggouData.data.applyOrders[p].project_name + '",'; //项目名称
      }
      if (qinggouData.data.applyOrders[p].memo != null) {
        diaoboZi = diaoboZi + '"applyorders_memo": "' + qinggouData.data.applyOrders[p].memo + '"'; //备注
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
        outorg: caigouOrg, //调出组织id或code
        outorg_name: caigouOrgName, //调出组织名称
        outaccount: caigouOrg, //调出会计主体id或code
        vouchdate: qinggouData.data.vouchdate, //单据日期
        bustype: "A03001", //交易类型
        bustype_name: "调拨", //交易类型名称
        breturn: "false", //调拨退货, true:是、false:否
        inorg: qinggouData.data.org, //调入组织id或code
        inorg_name: qinggouData.data.org_name, //调入组织名称
        inaccount: qinggouData.data.org, //调入会计主体id或code
        currency: qinggouData.data.currency, //币种id
        natCurrency: qinggouData.data.currency, //本币id
        exchRate: "1", //汇率
        dplanshipmentdate: year + "-" + month + "-" + day, //计划发货日期
        dplanarrivaldate: year + "-" + month + "-" + day, //计划到货日期
        memo: qinggouData.data.memo, //备注
        applyOrders: JSON.parse("[" + diaoboZi.substring(0, diaoboZi.length - 1) + "]")
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", args, viewModel);
  });