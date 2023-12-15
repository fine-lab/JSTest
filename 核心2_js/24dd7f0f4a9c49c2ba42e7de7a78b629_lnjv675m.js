viewModel.on("customInit", function (data) {
  // 商铺零售详情--页面初始化
  viewModel.on("afterSave", function (args) {
    let billdata = args.res;
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
    }
    let data = {
      orderDefineCharacter: {
        attrext16: billdata.salestaff, //员工（业务人员）
        attrext36: billdata.memberAcc,
        attrext23: billdata.accelement, //会计要素
        attrext22: billdata.paytype, //付款方式
        attrext6: billdata.saleType, //销售类型
        attrext26: billdata.id, //主表ID
        attrext37: billdata.memberAccCode,
        attrext29: billdata.code //主表编码
      },
      resubmitCheckKey: guid, //幂等性随机数                                                  必传的随机数
      salesOrgId: billdata.org_id, //销售组织                                                 公式
      transactionTypeId: billdata.OrdertransType, //交易类型                                  写死的
      vouchdate: billdata.billdate, //单据日期
      code: billdata.code, //单据编号
      agentId: "yourIdHere", //当前为零星散户ID
      corpContact: billdata.salestaff, //销售人员--当前员工
      settlementOrgId: billdata.org_id, //开票组织
      "orderPrices!currency": "G001ZM0000DEFAULTCURRENCT00000000001", //币种
      "orderPrices!exchRate": 1, //汇率
      "orderPrices!exchangeRateType": "lnjv675m", //汇率类型
      "orderPrices!natCurrency": "G001ZM0000DEFAULTCURRENCT00000000001", //本币
      "orderPrices!taxInclusive": true, //单价含税
      invoiceAgentId: "yourIdHere", //开票客户
      payMoney: billdata.payMoney, //合计含税金额
      _status: "Insert",
      retailAgentName: billdata.retailAgentName //散户名称
    };
    data.orderDetails = [];
    let GxyRetailDetailList = billdata.GxyRetailDetailList;
    for (let i = 0; i < GxyRetailDetailList.length; i++) {
      let details = GxyRetailDetailList[i];
      let detail = {
        orderDetailDefineCharacter: {
          attrext30: billdata.id, //主表ID
          attrext31: billdata.code, //主表编码
          attrext7: billdata.saleType, //销售类型
          attrext28: details.id, //子表id
          attrext39: billdata.memberAccCode,
          attrext38: billdata.memberAcc
        },
        "orderDetailPrices!natSum": details.natSum, //本币含税成交价
        "orderDetailPrices!natMoney": details.natMoney, //本币无税金额
        "orderDetailPrices!oriTax": details.natTax, //税额
        "orderDetailPrices!natUnitPrice": details.natUnitPrice, //本币无税单价
        "orderDetailPrices!oriMoney": details.natMoney, //无税金额
        "orderDetailPrices!natTaxUnitPrice": details.natTaxUnitPrice, //本币含税单价
        "orderDetailPrices!natTax": details.natTax, //本币税额
        "orderDetailPrices!oriUnitPrice": details.natUnitPrice, //无税成交价
        productId: details.product, //商品
        masterUnitId: details.qty, //主计量单位
        invExchRate: 4, //销售换算率
        unitExchangeTypePrice: 0, //浮动销售
        iProductAuxUnitId: details.qty, //销售单位
        invPriceExchRate: 1, //计价换算率
        oriSum: details.natSum, //含税金额
        priceQty: details.subQty, //数量
        stockOrgId: billdata.org_id, //库存组织
        iProductUnitId: details.qty, //计价单位
        orderProductType: "SALE", //商品售卖类型
        subQty: details.subQty, //销售数量
        consignTime: billdata.billdate, //计划发货日期
        skuId: details.productSKU, //商品SKUid
        skuCode: details.skuCode,
        taxId: details.taxItems, //税目税率
        qty: details.subQty, //数量
        settlementOrgId: billdata.org_id, //开票组织
        oriTaxUnitPrice: details.natTaxUnitPrice, //含税成交价
        unitExchangeType: 0, //浮动计价
        _status: "Insert",
        stockId: billdata.stock //仓库
      };
      data.orderDetails.push(detail);
    }
    cb.rest.invokeFunction("GT5AT34.salesOrder.save", { data }, function (err, res) {
      if (res.res.code == "200") {
        let sysData = res.res.data;
        let master = {
          id: billdata.id,
          OrderID: sysData.id,
          OrderCode: sysData.code,
          billdate: billdata.billdate
        };
        let suns = [];
        for (let i = 0; i < billdata.GxyRetailDetailList.length; i++) {
          let sun = {
            id: billdata.GxyRetailDetailList[i].id,
            OrderID: sysData.id,
            OrderCode: sysData.code,
            OrderDetailID: sysData.orderDetails[i].id
          };
          suns.push(sun);
        }
        cb.rest.invokeFunction("GT5AT34.salesOrder.huixie", { master: master, suns: suns }, function (err, res) {
          if (res) {
          } else {
            let param999 = { title: "零售收银同步销售订单后回写失败", content: "单据编号:\n" + data.code };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
          }
        });
      } else if (res.res.code == "999") {
        let param999 = { title: "零售收银同步销售订单失败", content: "单据编号:\n" + data.code };
        let func999 = extrequire("GT34544AT7.common.push");
        let res999 = func999.execute(param999);
        cb.utils.alert(res.res.message);
      }
    });
    let item1393kj = billdata.item1393kj; //是否打印
    if (item1393kj == "1") {
      let obj = {
        billtype: "VoucherList", // 单据类型
        billno: "a8ff19b0List", // 单据号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          code: billdata.code
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    }
  });
});
viewModel.get("GxyRetailDetailList") &&
  viewModel.get("GxyRetailDetailList").on("afterCellValueChange", function (data) {
    // 表格-供销云零售单据明细--单元格值改变后
    let rowData = viewModel.getGridModel().getRow(data.rowIndex);
    if (data.cellName == "_productId_name") {
      let dataArr = viewModel.getGridModel().getData();
      let dataArrLength = dataArr.length;
      if (dataArrLength > 1) {
        viewModel.getGridModel().setCellValue(data.rowIndex, "subQty", 1); //数量
        var barCode2 = dataArr[dataArrLength - 1].barCode; //商品编码
        var barCode1 = dataArr[dataArrLength - 2].barCode;
      }
      if (dataArrLength == 1 || (barCode2 != null && barCode1 != null)) {
        viewModel.getGridModel().setCellValue(data.rowIndex, "subQty", 1); //数量
        viewModel.getGridModel().setCellValue(data.rowIndex, "natUnitPrice", rowData.natTaxUnitPrice / (1 + rowData.taxRate / 100)); //本币无税单价
        viewModel.getGridModel().setCellValue(data.rowIndex, "natMoney", rowData.natTaxUnitPrice / (1 + rowData.taxRate / 100)) * rowData.subQty;
        viewModel.getGridModel().appendRow();
        viewModel.getGridModel().setCellState(data.rowIndex, "_productId_name", "readOnly", true);
      }
    } else if (data.cellName == "isComplete") {
      if (rowData.subQty != "0" || rowData.subQty != 0) {
        //用户手动修改
        if (data.value.value == "1") {
          viewModel.getGridModel().setCellValue(data.rowIndex, "subQty", rowData.item1439vi); //整件-单品件数
          viewModel.getGridModel().setCellValue(data.rowIndex, "natSum", rowData.item1469af); //整件金额
          viewModel.getGridModel().setCellValue(data.rowIndex, "natTaxUnitPrice", rowData.item1500oh); //整件-单品-单价
          viewModel.getGridModel().setCellState(data.rowIndex, "subQty", "readOnly", true);
          viewModel.getGridModel().setCellState(data.rowIndex, "isComplete", "readOnly", true);
          let upperRowData;
          upperRowData = viewModel.getGridModel().getRow(data.rowIndex); //将要赋值的数据行
          let natMoney = 0; //本币无税金额
          natMoney = rowData.item1469af / (1 + upperRowData.taxRate / 100); //本币无税金额
          let natSum = rowData.item1469af;
          let natTax = rowData.item1469af - natMoney; //本币税额
          viewModel.getGridModel().setCellValue(data.rowIndex, "natUnitPrice", rowData.item1500oh / (1 + rowData.taxRate / 100));
          viewModel.getGridModel().setCellValue(data.rowIndex, "natMoney", natMoney);
          viewModel.getGridModel().setCellValue(data.rowIndex, "natSum", natSum); //
          viewModel.getGridModel().setCellValue(data.rowIndex, "natTax", natTax); //本币税额
          let allData = viewModel.getGridModel().getData();
          let payMoney = 0;
          let payMoneyOrigTaxfree = 0;
          let natTaxL = 0;
          for (let i = 0; i < allData.length; i++) {
            payMoney += allData[i].subQty * allData[i].natTaxUnitPrice;
            payMoneyOrigTaxfree += allData[i].natMoney;
            natTaxL += allData[i].natTax;
          }
          viewModel.get("payMoney").setValue(payMoney); //合计含税金额
          viewModel.get("payMoneyOrigTaxfree").setValue(payMoneyOrigTaxfree); //合计无税金额
          viewModel.get("realMoney").setValue(payMoney); //应收金额
          viewModel.get("orderPayMoney").setValue(payMoney); //商品实付金额
          viewModel.get("GiveMoney").setValue(payMoney); //顾客实付金额
          viewModel.get("totalOriTax").setValue(natTaxL); //顾客实付金额
          viewModel.get("particularlyMoney").setValue(-payMoney); //顾客实付金额
        }
      }
    } else if (data.cellName == "subQty") {
      if (data.oldValue != undefined && data.value == 0) {
        cb.utils.alert("数量不能修改为0!");
        viewModel.getGridModel().setCellValue(data.rowIndex, "subQty", data.oldValue);
      }
    }
  });
viewModel.get("button52fh") &&
  viewModel.get("button52fh").on("click", function (data) {
    // 保存单据--单击
    //将是否打印修改为是
    viewModel.get("item1393kj").setValue("1");
    //删除多余的字表记录
    let gridModel = viewModel.getGridModel();
    let dataArr = gridModel.getData();
    let dataArrLength = dataArr.length;
    for (let i = dataArrLength - 1; i >= 0; i--) {
      if (dataArr[i].productCode == undefined) {
        gridModel.deleteRows(dataArrLength - 1);
      } else {
        break;
      }
    }
    viewModel.get("button38gh").execute("click");
  });
viewModel.get("button53ya") &&
  viewModel.get("button53ya").on("click", function (data) {
    // 保存并新增--单击
    let gridModel = viewModel.getGridModel();
    let dataArr = gridModel.getData();
    let dataArrLength = dataArr.length;
    for (let i = dataArrLength - 1; i >= 0; i--) {
      if (dataArr[i].productCode == undefined) {
        gridModel.deleteRows(dataArrLength - 1);
      } else {
        break;
      }
    }
    viewModel.get("button38gh").execute("click");
  });
viewModel.get("GxyRetailDetailList") &&
  viewModel.get("GxyRetailDetailList").on("afterSetDataSource", function (data) {
    // 表格-供销云零售单据明细--设置数据源后
    console.log("设置数据源后事件触发");
    console.log("data", data);
    for (let i = 0; i < data.length; i++) {
      viewModel.getGridModel().setCellValue(i, "item1307xk", data[i].product);
      viewModel.getGridModel().setCellValue(i, "_productId_name", data[i].productName);
    }
  });