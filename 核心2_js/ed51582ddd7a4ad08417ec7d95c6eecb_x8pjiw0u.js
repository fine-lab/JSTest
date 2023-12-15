viewModel.get("button48ab") &&
  viewModel.get("button48ab").on("click", function (data) {
    // 调拨订单--单击
    debugger;
    let isBiaotou = viewModel.get("sumSwitch").getValue();
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    let qingGouIdList = "";
    selectedRows.forEach((dateList) => {
      if (!qingGouIdList.includes(dateList.id)) {
        qingGouIdList = qingGouIdList + dateList.id + ",";
      }
    });
    if (qingGouIdList.length == 0) {
      cb.utils.alert("请至少选择一条数据");
      return false;
    }
    qingGouIdList = qingGouIdList.substring(0, qingGouIdList.length - 1).split(",");
    let inOrg = ""; //调入组织Id
    let inOrgName = ""; //调入组织名称
    let caigouOrg = ""; //调出组织Id：采购组织对应调拨的调出组织
    let caigouOrgName = ""; //调出组织名称
    let currency = ""; //币种id
    let changliang = "true";
    let diaoboZi = "";
    for (var a = 0; a < qingGouIdList.length; a++) {
      let result = cb.rest.invokeFunction("PU.api.getQgdDate", { data: qingGouIdList[a] }, function (err, res) {}, viewModel, { async: false });
      let qinggouData = JSON.parse(result.result.apiResponse);
      if (inOrg != null && inOrg != "" && inOrg != undefined && inOrg != qinggouData.data.org) {
        cb.utils.alert("所选择的数据调入组织不一致，请检查数据！！！");
        return false;
      }
      inOrg = qinggouData.data.org;
      inOrgName = qinggouData.data.org_name;
      currency = qinggouData.data.currency;
      for (var p = 0; p < qinggouData.data.applyOrders.length; p++) {
        let isSelect = true;
        if (!isBiaotou) {
          isSelect = false;
          selectedRows.forEach((dateList) => {
            if (qinggouData.data.applyOrders[p].id == dateList.apporders_id) {
              isSelect = true;
            }
          });
        }
        if (!isSelect) {
          continue;
        }
        if (qinggouData.data.applyOrders[p].purchaseOrg != null && qinggouData.data.applyOrders[p].purchaseOrg_name != null) {
          if (caigouOrg != null && caigouOrg != "" && caigouOrg != undefined && caigouOrg != qinggouData.data.applyOrders[p].purchaseOrg) {
            cb.utils.alert("所选择的数据调出组织不一致，请检查数据！！！");
            return false;
          }
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
          diaoboZi = diaoboZi + '"applyorders_memo": "' + qinggouData.data.applyOrders[p].memo + '",'; //备注
        }
        if (qinggouData.data.applyOrders[p].applyOrdersDefineCharacter.attrext2 != null) {
          diaoboZi = diaoboZi + '"yongtu": "' + qinggouData.data.applyOrders[p].applyOrdersDefineCharacter.attrext2 + '",'; //用途
        }
        if (qinggouData.data.applyOrders[p].applyOrdersDefineCharacter.attrext2_name != null) {
          diaoboZi = diaoboZi + '"yongtuName": "' + qinggouData.data.applyOrders[p].applyOrdersDefineCharacter.attrext2_name + '",'; //用途
        }
        if (qinggouData.data.applyOrders[p].priceUOM != null) {
          diaoboZi = diaoboZi + '"priceUOM": "' + qinggouData.data.applyOrders[p].priceUOM + '",'; //计价单位ID
        }
        if (qinggouData.data.applyOrders[p].priceUOM_Name != null) {
          diaoboZi = diaoboZi + '"priceUOM_name": "' + qinggouData.data.applyOrders[p].priceUOM_Name + '",'; //计价单位名称
        }
        if (qinggouData.data.applyOrders[p].invPriceExchRate != null) {
          diaoboZi = diaoboZi + '"invPriceExchRate": "' + qinggouData.data.applyOrders[p].invPriceExchRate + '",'; //计价换算率
        }
        if (qinggouData.data.applyOrders[p].priceQty != null) {
          diaoboZi = diaoboZi + '"priceQty": "' + qinggouData.data.applyOrders[p].priceQty + '",'; //计价数量
        }
        if (qinggouData.data.applyOrders[p].purUOM != null) {
          diaoboZi = diaoboZi + '"stockUnitId": "' + qinggouData.data.applyOrders[p].purUOM + '",'; //库存单位ID
        }
        if (qinggouData.data.applyOrders[p].purUOM_Name != null) {
          diaoboZi = diaoboZi + '"stockUnit_name": "' + qinggouData.data.applyOrders[p].purUOM_Name + '",'; //库存单位名称
        }
        if (qinggouData.data.applyOrders[p].taxRate != null) {
          diaoboZi = diaoboZi + '"taxRate": "' + qinggouData.data.applyOrders[p].taxRate + '",'; //税率
        }
        //税额
        if (qinggouData.data.applyOrders[p].oriTax != null) {
          diaoboZi = diaoboZi + '"oriTax": "' + qinggouData.data.applyOrders[p].oriTax + '",'; //税额
        }
        diaoboZi = diaoboZi + '"source": "' + "str_qgd" + '",'; //单据类型
        diaoboZi = diaoboZi + '"sourceid": "' + qinggouData.data.id + '",'; //单据主表id
        diaoboZi = diaoboZi + '"sourceautoid": "' + qinggouData.data.applyOrders[p].id + '",'; //单据子表id
        diaoboZi = diaoboZi + '"isCanModPrice": "' + changliang + '",'; //价格可改, true:是、false:否、
        diaoboZi = diaoboZi + '"taxUnitPriceTag": "' + changliang + '"'; //价格含税, true:是、false:否、
        diaoboZi = diaoboZi + "},";
      }
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
    let diaoboziVo = diaoboZi.replace("\n", "");
    let args = {
      billtype: "Voucher", // 单据类型
      billno: "st_transferapply", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (卡片页面区分编辑态edit、新增态add、)
        outorg: caigouOrg, //调出组织id或code
        outorgName: caigouOrgName, //调出组织名称
        outaccount: caigouOrg, //调出会计主体id或code
        outaccountName: caigouOrgName, //调出会计主体Name
        vouchdate: year + "-" + month + "-" + day, //单据日期
        bustype: "2425767377932574", //交易类型
        bustype_name: "调拨", //交易类型名称
        breturn: "false", //调拨退货, true:是、false:否
        inorg: inOrg, //调入组织id或code
        inorgName: inOrgName, //调入组织名称
        inaccount: inOrg, //调入会计主体id或code
        inaccountName: inOrgName, //调入会计主体id或code
        currency: currency, //币种id
        natCurrency: currency, //本币id
        exchRate: "1", //汇率
        dplanshipmentdate: year + "-" + month + "-" + day, //计划发货日期
        dplanarrivaldate: year + "-" + month + "-" + day, //计划到货日期
        kpId: "", //开票Id
        kpName: "", //开票名称
        applyOrders: JSON.parse("[" + diaoboziVo.substring(0, diaoboziVo.length - 1) + "]")
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", args, viewModel);
  });