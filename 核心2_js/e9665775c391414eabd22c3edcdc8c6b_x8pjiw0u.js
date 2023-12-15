viewModel.get("button93aa") &&
  viewModel.get("button93aa").on("click", function (data) {
    // 调拨订单--单击
    debugger;
    let selectRows = viewModel.getGridModel().getSelectedRows();
    let cgrkId = viewModel.originalParams.id + "";
    let result = cb.rest.invokeFunction("ST.api.cgrkList", { data: cgrkId }, function (err, res) {}, viewModel, { async: false });
    console.log("-------" + result.result.apiResponse);
    let cgrkData = JSON.parse(result.result.apiResponse);
    let ruId = "";
    let ruName = "";
    let changliang = "true";
    let diaoboZi = "";
    for (var p = 0; p < cgrkData.data.purInRecords.length; p++) {
      //遍历json数组时，这么写p为索引，0,1
      let isSelect = false;
      for (var q in selectRows) {
        if (selectRows[q].id == cgrkData.data.purInRecords[p].id) {
          isSelect = true;
        }
      }
      if (selectRows.length == 0) {
        isSelect = true;
      }
      if (!isSelect) {
        continue;
      }
      let shkhName = cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext3_name; //收货客户
      let xqzzName = cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext40_name; //需求组织
      if (shkhName != null && xqzzName != null) {
        ruName = shkhName;
      } else if (shkhName != null) {
        ruName = shkhName;
      } else if (xqzzName != null) {
        ruName = xqzzName;
      }
      if (ruName != null) {
        let resultRu = cb.rest.invokeFunction("ST.api.getIdByName", { ruName: ruName }, function (err, res) {}, viewModel, { async: false });
        if (resultRu.result.res.length > 0) {
          ruId = resultRu.result.res[0].id;
          ruName = resultRu.result.res[0].name;
        }
      }
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
        diaoboZi = diaoboZi + '"applyorders_memo": "' + cgrkData.data.purInRecords[p].memo + '",'; //备注
      }
      if (cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext2 != null) {
        diaoboZi = diaoboZi + '"yongtu": "' + cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext2 + '",'; //用途
      }
      if (cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext2_name != null) {
        diaoboZi = diaoboZi + '"yongtuName": "' + cgrkData.data.purInRecords[p].purInRecordsDefineCharacter.attrext2_name + '",'; //用途
      }
      if (cgrkData.data.purInRecords[p].priceUOM != null) {
        diaoboZi = diaoboZi + '"priceUOM": "' + cgrkData.data.purInRecords[p].priceUOM + '",'; //计价单位ID
      }
      if (cgrkData.data.purInRecords[p].priceUOM_name != null) {
        diaoboZi = diaoboZi + '"priceUOM_name": "' + cgrkData.data.purInRecords[p].priceUOM_name + '",'; //计价单位名称
      }
      if (cgrkData.data.purInRecords[p].stockUnitId != null) {
        diaoboZi = diaoboZi + '"stockUnitId": "' + cgrkData.data.purInRecords[p].stockUnitId + '",'; //库存单位ID
      }
      if (cgrkData.data.purInRecords[p].stockUnit_name != null) {
        diaoboZi = diaoboZi + '"stockUnit_name": "' + cgrkData.data.purInRecords[p].stockUnit_name + '",'; //库存单位名称
      }
      if (cgrkData.data.purInRecords[p].batchno != null) {
        diaoboZi = diaoboZi + '"batchno": "' + cgrkData.data.purInRecords[p].batchno + '",'; //批次号
      }
      if (cgrkData.data.purInRecords[p].producedate != null) {
        diaoboZi = diaoboZi + '"producedate": "' + cgrkData.data.purInRecords[p].producedate + '",'; //生产日期
      }
      if (cgrkData.data.purInRecords[p].invPriceExchRate != null) {
        diaoboZi = diaoboZi + '"invPriceExchRate": "' + cgrkData.data.purInRecords[p].invPriceExchRate + '",'; //计价换算率
      }
      if (cgrkData.data.purInRecords[p].priceQty != null) {
        diaoboZi = diaoboZi + '"priceQty": "' + cgrkData.data.purInRecords[p].priceQty + '",'; //计价数量
      }
      if (cgrkData.data.purInRecords[p].taxRate != null) {
        diaoboZi = diaoboZi + '"taxRate": "' + cgrkData.data.purInRecords[p].taxRate + '",'; //税率
      }
      //税额
      if (cgrkData.data.purInRecords[p].oriTax != null) {
        diaoboZi = diaoboZi + '"oriTax": "' + cgrkData.data.purInRecords[p].oriTax + '",'; //税额
      }
      diaoboZi = diaoboZi + '"source": "' + "str_cgrk" + '",'; //单据类型
      diaoboZi = diaoboZi + '"sourceid": "' + cgrkData.data.id + '",'; //单据主表id
      diaoboZi = diaoboZi + '"sourceautoid": "' + cgrkData.data.purInRecords[p].id + '",'; //单据子表id
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
    let kpId = cgrkData.data.purInRecordDefineCharacter.attrext4;
    let kpName = cgrkData.data.purInRecordDefineCharacter.attrext4_name;
    let diaoboziVo = diaoboZi.replace("\n", "");
    let args = {
      billtype: "Voucher", // 单据类型
      billno: "st_transferapply", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (卡片页面区分编辑态edit、新增态add、)
        outorg: cgrkData.data.purchaseOrg, //调出组织id或code
        outorgName: cgrkData.data.purchaseOrg_name, //调出组织名称
        outaccount: cgrkData.data.purchaseOrg, //调出会计主体id或code
        outaccountName: cgrkData.data.purchaseOrg_name, //调出会计主体name
        vouchdate: cgrkData.data.vouchdate, //单据日期
        bustype: "2425767377932574", //交易类型
        bustype_name: "调拨", //交易类型名称
        breturn: "false", //调拨退货, true:是、false:否
        inorg: ruId, //调入组织id或code
        inorgName: ruName, //调入组织名称
        inaccount: ruId, //调入会计主体id或code
        inaccountName: ruName, //调入会计主体name
        currency: cgrkData.data.currency, //币种id
        natCurrency: cgrkData.data.currency, //本币id
        exchRate: "1", //汇率
        dplanshipmentdate: year + "-" + month + "-" + day, //计划发货日期
        dplanarrivaldate: year + "-" + month + "-" + day, //计划到货日期
        memo: cgrkData.data.memo, //备注
        kpId: kpId, //开票Id
        kpName: kpName, //开票名称
        applyOrders: JSON.parse("[" + diaoboziVo.substring(0, diaoboziVo.length - 1) + "]")
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", args, viewModel);
  });