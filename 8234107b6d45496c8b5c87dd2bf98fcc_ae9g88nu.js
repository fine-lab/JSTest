viewModel.on("customInit", function (data) {
  // 销售出库单--页面初始化
  var viewModel = this;
  cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  const m_gspTransation = "GSP销售出库";
  let extendGspTypeBool = () => {
    let extendGspTypeValue = viewModel.get("extendGspType").getValue();
    if (extendGspTypeValue === true || extendGspTypeValue == "true" || extendGspTypeValue == "1") {
      return true;
    } else {
      return false;
    }
  };
  function isCuring(rows) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.saleValidateCuring",
        {
          rows: rows
        },
        function (err, res) {
          if (res != undefined) {
            resolve(res.str);
          } else if (err != undefined) {
            resolve(err.message);
          }
        },
        undefined,
        {
          domainKey: "sy01"
        }
      );
    });
  }
  let splitLineAssignValue = (gridModel, gridModelDetail, outCheckResult, rowindex) => {
    let qualifiedQty = outCheckResult.checkQualifiedNum + outCheckResult.totalQualityQualifiedNum;
    gridModel.setCellValue(rowindex, "batchno", outCheckResult.batchNo);
    gridModel.setCellValue(rowindex, "extendStorageCondition", outCheckResult.storageCondition);
    gridModel.setCellValue(rowindex, "extendStorageCondition_storageName", outCheckResult.storageConditionName);
    gridModel.setCellValue(rowindex, "producedate", outCheckResult.mrfDate);
    gridModel.setCellValue(rowindex, "invaliddate", outCheckResult.validityTo);
    gridModel.setCellValue(rowindex, "qty", qualifiedQty); //基本计量
    gridModel.setCellValue(rowindex, "extendTotalQualified", qualifiedQty);
    gridModel.setCellValue(rowindex, "extendHgQty", qualifiedQty);
    gridModel.setCellValue(rowindex, "extendBHgQty", outCheckResult.checkUnqualifiedNum);
    if (gridModelDetail.invExchRate > 0) {
      gridModel.setCellValue(rowindex, "subQty", qualifiedQty / gridModelDetail.invExchRate);
      gridModel.setCellValue(rowindex, "contactsQuantity", qualifiedQty);
      gridModel.setCellValue(rowindex, "contactsPieces", qualifiedQty / gridModelDetail.invExchRate);
      let priceQty = qualifiedQty / gridModelDetail.invPriceExchRate;
      gridModel.setCellValue(rowindex, "priceQty", priceQty);
    }
  };
  //销售出库复核单拆行逻辑
  let batchSplitPromise = (gridModel, gridModelDetail, rowindex) => {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.queryVerifystate",
        {
          id: gridModelDetail.sourceautoid,
          invoiceOrg: viewModel.get("invoiceOrg").getValue()
        },
        function (err, res) {
          let outCheckResults = JSON.parse(res.res);
          if (null != outCheckResults && outCheckResults != undefined) {
            if (outCheckResults.length == 1) {
              splitLineAssignValue(gridModel, gridModelDetail, outCheckResults[0], rowindex);
            } else if (outCheckResults.length > 1) {
              for (let j = 0; j < outCheckResults.length; j++) {
                let outCheckResult = outCheckResults[j];
                if (j == 0) {
                  splitLineAssignValue(gridModel, gridModelDetail, outCheckResult, rowindex);
                } else if (j > 0) {
                  let newRow = gridModelDetail;
                  let qualifiedQty = outCheckResult.checkQualifiedNum + outCheckResult.totalQualityQualifiedNum;
                  newRow.batchno = outCheckResult.batchNo;
                  nweRow.extendStorageCondition = outCheckResult.storageCondition;
                  nweRow.extendStorageCondition_storageName = outCheckResult.storageConditionName;
                  newRow.producedate = outCheckResult.mrfDate;
                  newRow.invaliddate = outCheckResult.validityTo;
                  newRow.qty = qualifiedQty;
                  newRow.extendTotalQualified = qualifiedQty;
                  newRow.extendHgQty = qualifiedQty;
                  newRow.extendBHgQty = outCheckResult.checkUnqualifiedNum;
                  if (gridModelDetail.invExchRate > 0) {
                    newRow.subQty = qualifiedQty / gridModelDetail.invExchRate;
                    newRow.contactsQuantity = qualifiedQty;
                    newRow.contactsPieces = qualifiedQty / gridModelDetail.invExchRate;
                    let priceQty = qualifiedQty / gridModelDetail.invPriceExchRate;
                    newRow.priceQty = priceQty;
                  }
                  resolve(newRow);
                }
              }
            }
          }
          resolve(undefined);
        },
        undefined,
        {
          domainKey: "sy01"
        }
      );
    });
  };
  viewModel.on("afterMount", function (event) {
    var extendGspTypeValue = viewModel.get("extendGspType").getValue();
    var gridModel = viewModel.getGridModel("details");
    //如果GSP类型，转换下传数量和件数
    viewModel.on("afterLoadData", function (data) {
      debugger;
      //是否开启udi管理
      udiIsOpen();
      //页面初始化试控制显示
      if (extendGspTypeBool()) {
        gridModel.setColumnState("extendGspPrdType_catagoryname", "visible", true);
        gridModel.setColumnState("extendDosageForm_dosagaFormName", "visible", true);
        gridModel.setColumnState("extendCommonName", "visible", true);
        gridModel.setColumnState("extendLicenseNumber", "visible", true);
        gridModel.setColumnState("extendMAH_ip_name", "visible", true);
        gridModel.setColumnState("extendProPlace", "visible", true);
        gridModel.setColumnState("extendMfrs", "visible", true);
        gridModel.setColumnState("extendTotalQualified", "visible", true);
        gridModel.setColumnState("extendDoubleCheck", "visible", true);
        gridModel.setColumnState("extendHgQty", "visible", true);
        gridModel.setColumnState("extendBHgQty", "visible", true);
        gridModel.setColumnState("extend_standard_code", "visible", true);
        gridModel.setColumnState("extendPackingMaterial_packing_name", "visible", true);
        if (data.srcBillType != "1") {
          gridModel.setColumnState("extendTotalQualified", "visible", false);
          gridModel.setColumnState("extendHgQty", "visible", false);
          gridModel.setColumnState("extendBHgQty", "visible", false);
        }
      } else {
        gridModel.setColumnState("extendGspPrdType_catagoryname", "visible", false);
        gridModel.setColumnState("extendDosageForm_dosagaFormName", "visible", false);
        gridModel.setColumnState("extendCommonName", "visible", false);
        gridModel.setColumnState("extendLicenseNumber", "visible", false);
        gridModel.setColumnState("extendMAH_ip_name", "visible", false);
        gridModel.setColumnState("extendProPlace", "visible", false);
        gridModel.setColumnState("extendMfrs", "visible", false);
        gridModel.setColumnState("extendTotalQualified", "visible", false);
        gridModel.setColumnState("extendDoubleCheck", "visible", false);
        gridModel.setColumnState("extendHgQty", "visible", false);
        gridModel.setColumnState("extendBHgQty", "visible", false);
        gridModel.setColumnState("extend_standard_code", "visible", false);
        gridModel.setColumnState("extendPackingMaterial_packing_name", "visible", false);
      }
      if (data.bizFlow_name == "普通销售（无发货）") {
        return true;
      }
      debugger;
      var gridModelDetails = viewModel.getGridModel("details").getAllData();
      if (extendGspTypeBool() && viewModel.getParams().mode == "add") {
        for (let i = 0; i < gridModelDetails.length; i++) {
          if (parseFloat(gridModelDetails[i].extendTotalQualified) != 0 && parseFloat(gridModelDetails[i].extendHgQty)) {
            gridModel.setCellValue(i, "qty", gridModelDetails[i].extendHgQty); //基本计量
            gridModel.setCellValue(i, "extendHgState", "1"); //合格状态
            if (gridModelDetails[i].invExchRate > 0) {
              gridModel.setCellValue(i, "subQty", gridModelDetails[i].extendHgQty / gridModelDetails[i].invExchRate);
              gridModel.setCellValue(i, "contactsQuantity", gridModelDetails[i].extendHgQty);
              gridModel.setCellValue(i, "contactsPieces", gridModelDetails[i].extendHgQty / gridModelDetails[i].invExchRate);
              let priceQty = gridModelDetails[i].extendHgQty / gridModelDetails[i].invPriceExchRate;
              gridModel.setCellValue(i, "priceQty", priceQty);
            }
          }
        }
      }
      //销售发货下推销售出库拆行操作（从销售出库复核取值）
      if (extendGspTypeBool() && data.srcBillType == "1" && viewModel.getParams().mode == "add") {
        let newRows = [];
        let batchSplitPromises = [];
        let addNewRow = (n) => {
          if (undefined != n) {
            newRows.push(n);
          }
        };
        for (let i = 0; i < gridModelDetails.length; i++) {
          batchSplitPromises.push(batchSplitPromise(gridModel, gridModelDetails[i], i).then(addNewRow));
        }
        let returnPromise = new cb.promise();
        Promise.all(batchSplitPromises).then(() => {
          if (newRows.length > 0) {
            gridModel.insertRows(gridModel.getRows().length, newRows);
          }
          updateAmount(viewModel);
          returnPromise.resolve();
        });
        return returnPromise;
      }
      debugger;
      //销售退货下推出库
      if (data.srcBillType == "3") {
        if ((extendGspTypeValue === true || extendGspTypeValue == "true" || extendGspTypeValue == "1") && viewModel.getParams().mode == "add") {
          for (var i = 0; i < gridModelDetails.length; i++) {
            if (parseFloat(gridModelDetails[i].extendBHgQty) != 0) {
              var bhgqty = parseFloat(gridModelDetails[i].extendBHgQty);
              let row = gridModelDetails[i];
              index = gridModel.getRowsCount();
              gridModel.insertRow(index, row);
              gridModel.setCellValue(index, "qty", bhgqty);
              gridModel.setCellValue(index, "extendBHgState", "1"); //不合格状态
              if (gridModelDetails[i].invExchRate > 0) {
                gridModel.setCellValue(index, "subQty", gridModelDetails[i].extendBHgQty / gridModelDetails[i].invExchRate);
                gridModel.setCellValue(index, "contactsQuantity", gridModelDetails[i].extendBHgQty);
                gridModel.setCellValue(index, "contactsPieces", gridModelDetails[i].extendBHgQty / gridModelDetails[i].invExchRate);
                gridModel.setCellValue(index, "priceQty", gridModelDetails[i].extendBHgQty / gridModelDetails[i].invPriceExchRate);
              }
            }
          }
        }
        //补齐数据
        var gridModelDetails2 = viewModel.getGridModel("details").getAllData();
        let batchPromises = [];
        for (let i = 0; i < gridModelDetails2.length; i++) {
          debugger;
          batchPromises.push(batchSplitPromise2(gridModel, gridModelDetails2[i], i));
        }
        let returnPromise = new cb.promise();
        Promise.all(batchPromises).then(() => {
          returnPromise.resolve();
        });
        if ((extendGspTypeValue === true || extendGspTypeValue == "true" || extendGspTypeValue == "1") && viewModel.getParams().mode == "add") {
          updateAmount(viewModel);
        }
        return returnPromise;
      }
    });
    viewModel.on("beforeSave", function (data) {
      if (extendGspTypeBool()) {
        let gridModelDetails = viewModel.getGridModel("details").getAllData();
        let rows = {};
        //是否批次 是否有效期未持久化,新增字段保存
        for (let i = 0; i < gridModelDetails.length; i++) {
          let row = gridModelDetails[i];
          gridModel.setCellValue(i, "extendIsBatchManage", row.isBatchManage ? "1" : "0");
          gridModel.setCellValue(i, "extendIsExpiryManage", row.isExpiryDateManage ? "1" : "0");
          rows[row.id] = {
            material_id: row.product,
            batch: row.batchno,
            index: i + 1,
            material_name: row.product_cName
          };
        }
        //判断是否对应的  物料+批次  有养护计划(未养护完成)
        let errorMsg = "";
        let promises = [];
        let handerMessage = (n) => (errorMsg += n);
        //如果是正向的，需要判断是否养护
        if (gridModel.getCellValue(0, "qty") > 0) {
          promises.push(isCuring(rows).then(handerMessage));
        }
        var returnPromise = new cb.promise();
        Promise.all(promises).then(() => {
          if (errorMsg.length > 0) {
            cb.utils.alert(errorMsg, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        });
        return returnPromise;
      }
    });
  });
  //销售出库复核单拆行逻辑
  let batchSplitPromise2 = (gridModel, gridModelDetail, rowindex) => {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.backDefaultGroup.getreturncheckrow",
        {
          id: gridModelDetail.sourceautoid
        },
        function (err, res) {
          let returncheckResults = res.List;
          if (null != returncheckResults && returncheckResults != undefined) {
            if (returncheckResults.length > 0) {
              splitLineAssignValue2(gridModel, gridModelDetail, returncheckResults[0], rowindex);
            }
          }
        },
        undefined,
        {
          domainKey: "sy01"
        }
      );
    });
  };
  let splitLineAssignValue2 = (gridModel, gridModelDetail, outCheckResult, rowindex) => {
    if (outCheckResult.batchNo != undefined && outCheckResult.batchNo != null) {
      gridModel.setCellValue(rowindex, "batchno", outCheckResult.batchNo);
    }
    if (outCheckResult.productDate != undefined && outCheckResult.productDate != null) {
      gridModel.setCellValue(rowindex, "producedate", outCheckResult.productDate);
    }
    if (outCheckResult.dtminvalidDate != undefined && outCheckResult.dtminvalidDate !== null) {
      gridModel.setCellValue(rowindex, "invaliddate", outCheckResult.dtminvalidDate);
    }
    if (outCheckResult.location != undefined && outCheckResult.location != null) {
      gridModel.setCellValue(rowindex, "goodsposition", outCheckResult.location);
    }
    if (outCheckResult.qualifiedstate != undefined && outCheckResult.qualifiedstate != null) {
      if (gridModelDetail.extendHgState == "1") {
        gridModel.setCellValue(rowindex, "stockStatusDoc", outCheckResult.qualifiedstate);
        gridModel.setCellValue(rowindex, "stockStatusDoc_name", outCheckResult.qualifiedstate_statusName);
      }
    }
    if (outCheckResult.noqualifiedstate != undefined && outCheckResult.noqualifiedstate != null) {
      if (gridModelDetail.extendBHgState == "1") {
        gridModel.setCellValue(rowindex, "stockStatusDoc", outCheckResult.noqualifiedstate);
        gridModel.setCellValue(rowindex, "stockStatusDoc_name", outCheckResult.noqualifiedstate_statusName);
      }
    }
  };
  viewModel.on("beforePush", function (args) {
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var gridModel = viewModel.getGridModel();
    let extend_ispush = viewModel.get("extend_ispush").getValue();
    if (args.args.cSvcUrl.indexOf("targetBillNo=7a479fc4") > 0) {
      if (extend_ispush == "false") {
        cb.utils.alert("不能重复下推药品运输单!", "error");
        return false;
      }
    }
    //下推出库复核判断，有下游单据，则不允许下推
    if (args.args.cSvcUrl.indexOf("9c79daf5") > 0) {
      if (args.params.data.srcBillType != "2") {
        cb.utils.alert("此流程不允许下推【出库复核】", "error");
        return false;
      }
      let data = {
        id: args.params.data.id,
        uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6"
      };
      //判断是否有下游单据
      var returnPromise = new cb.promise();
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        data,
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.Info && res.Info.length > 0) {
            cb.utils.alert("销售出库复核已有相应单据！", "error");
            return false;
          }
          returnPromise.resolve();
        },
        undefined,
        {
          domainKey: "sy01"
        }
      );
      return returnPromise;
    }
  });
  var updateAmount = function (viewModel) {
    debugger;
    let grid = viewModel.getGridModel("details");
    let gridModel = viewModel.getGridModel("details").getAllData();
    let count = gridModel.length;
    let m_moneydecimal = 2;
    for (let i = 0; i < count; i++) {
      let data = gridModel[i];
      let taxUnitPriceTag = data.taxUnitPriceTag;
      let priceQty = parseFloat(data.priceQty); //计价数量
      let TaxRate = parseFloat(data.taxRate) / 100;
      if (taxUnitPriceTag == false) {
        //以无税为准
        //原币
        let oriUnitPrice = parseFloat(data.oriUnitPrice); //原币无税单价
        let oriMoney = priceQty * oriUnitPrice; //原币无税金额
        oriMoney = parseFloat(oriMoney).toFixed(m_moneydecimal);
        //默认应税外加
        let oriTax = oriMoney * TaxRate; //原币税额
        oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
        let oriSum = parseFloat(oriMoney) + parseFloat(oriTax); //原币含税金额
        let oriTaxUnitPrice = parseFloat(oriSum) / parseFloat(priceQty); //原币含税单价
        grid.setCellValue(i, "oriMoney", parseFloat(oriMoney)); //原币无税金额
        grid.setCellValue(i, "oriTax", parseFloat(oriTax)); //原币税额
        grid.setCellValue(i, "oriSum", parseFloat(oriSum)); //原币含税金额
        grid.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice); //原币含税单价
        //本币
        let natUnitPrice = parseFloat(data.natUnitPrice); //本币无税单价
        let natMoney = priceQty * natUnitPrice; //本币无税金额
        natMoney = parseFloat(natMoney).toFixed(m_moneydecimal);
        //默认应税外加
        let natTax = natMoney * TaxRate; //本币税额
        natTax = parseFloat(natTax).toFixed(m_moneydecimal);
        let natSum = parseFloat(natMoney) + parseFloat(natTax); //本币含税金额
        let natTaxUnitPrice = parseFloat(natSum) / parseFloat(priceQty); //本币含税单价
        grid.setCellValue(i, "natMoney", parseFloat(natMoney)); //本币无税金额
        grid.setCellValue(i, "natSum", parseFloat(natSum)); //本币含税金额
        grid.setCellValue(i, "natTax", parseFloat(natTax)); //本币税额
        grid.setCellValue(i, "natTaxUnitPrice", natTaxUnitPrice); //本币含税单价
      } else {
        //含税优先
        let oriTaxUnitPrice = parseFloat(data.oriTaxUnitPrice); //原币含税单价
        let oriSum = priceQty * oriTaxUnitPrice; //原币含税金额
        oriSum = parseFloat(oriSum).toFixed(m_moneydecimal);
        //默认应税外加
        let oriTax = (oriSum / (1 + TaxRate)) * TaxRate; //原币税额
        oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
        let oriMoney = parseFloat(oriSum) - parseFloat(oriTax); //原币无税金额
        let oriUnitPrice = oriMoney / priceQty; //原币无税单价
        grid.setCellValue(i, "oriMoney", parseFloat(oriMoney)); //原币无税金额
        grid.setCellValue(i, "oriTax", parseFloat(oriTax)); //原币税额
        grid.setCellValue(i, "oriSum", parseFloat(oriSum)); //原币含税金额
        grid.setCellValue(i, "oriUnitPrice", parseFloat(oriUnitPrice)); //原币无税单价
        //本币
        let natTaxUnitPrice = parseFloat(data.natTaxUnitPrice); //本币含税单价
        let natSum = priceQty * natTaxUnitPrice; //本币含税金额
        natSum = parseFloat(natSum).toFixed(m_moneydecimal);
        //默认应税外加
        let natTax = (natSum / (1 + TaxRate)) * TaxRate; //本币税额
        natTax = parseFloat(natTax).toFixed(m_moneydecimal);
        let natMoney = parseFloat(natSum) - parseFloat(natTax); //本币无税金额
        let natUnitPrice = natMoney / priceQty; //本币无税单价
        grid.setCellValue(i, "natSum", parseFloat(natSum)); //本币含税金额
        grid.setCellValue(i, "natMoney", parseFloat(natMoney)); //本币无税金额
        grid.setCellValue(i, "natTax", parseFloat(natTax)); //本币税额
        grid.setCellValue(i, "natUnitPrice", parseFloat(natUnitPrice)); //本币含税单价
      }
    }
  };
  viewModel.on("afterSave", function () {
    //事件发生之后， 进行保存成功以后的保存
    saveUdidata();
  });
  let djType = "销售出库";
  let invokeFunctionUdi = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  viewModel.get("button71of") &&
    viewModel.get("button71of").on("click", function (data) {
      const djCode = viewModel.get("code").getValue();
      let datars = {
        billtype: "VoucherList", // 单据类型
        billno: "a0a62540", // 单据号
        domainKey: "sy01",
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态browse)
          //传参
          danjuType: djType,
          danjuNum: djCode
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", datars, viewModel);
    });
  //判断udi管理是否开启 按钮默认不显示，开启则显示
  let udiIsOpen = function () {
    //查询UDI追溯配置表
    invokeFunctionUdi(
      "GT22176AT10.publicFunction.getUDITrace",
      {},
      function (err, res) {
        if (err != null && typeof err != "undefined" && err !== "") {
          viewModel.get("button71of").setVisible(false);
          return false;
        }
        viewModel.get("button71of").setVisible(false); //默认关闭
        let cofingRs = res.configurationRs;
        for (i = 0; i < cofingRs.length; i++) {
          if (djType === cofingRs[i].billNameText) {
            viewModel.get("button71of").setVisible(true);
            break;
          }
        }
        if (viewModel.getParams().mode !== "add") {
          viewModel.get("button71of").setVisible(false);
        }
      },
      {
        domainKey: "sy01"
      }
    );
  };
  //保存udi到数据中心
  function saveUdidata() {
    // 保存udi--保存后触发
    let udiInfoValueRs = viewModel.get("item942qe").getValue(); //获取保存的上下文
    console.log(udiInfoValueRs);
    if (typeof udiInfoValueRs == "undefined" || udiInfoValueRs == null || udiInfoValueRs === "") {
      return;
    }
    let udiInfoValue = udiInfoValueRs.tableData;
    if (udiInfoValue.length <= 0) {
      return;
    }
    //保存后 记录 udi信息
    let newdate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    for (i = 0; i < udiInfoValue.length; i++) {
      for (jxmxi = 0; jxmxi < udiInfoValue[i].udi_admin_djxx_jxmxList.length; jxmxi++) {
        //解析明细
        let adminJxmxList = udiInfoValue[i].udi_admin_djxx_jxmxList[jxmxi];
        let djbh = viewModel.get("code").getValue();
        let saveInfo = {
          id: guid(),
          trackingDirection: "去向", //跟踪方向
          billName: djType, //单据名称
          billNo: djbh, //单据编号
          rowIndex: "", //行号
          material: adminJxmxList.item298sh, //物料
          unit: adminJxmxList.item375ze, //计量单位
          qty: adminJxmxList.jiexishuliang, //数量
          optDate: newdate, //操作时间
          UDIFile_id: "" //UDI主档
        };
        invokeFunctionUdi(
          "GT22176AT10.publicFunction.saveUdiDataTrack",
          {
            UDI: adminJxmxList.item96wg,
            udiDataObject: saveInfo
          },
          function (err, res) {
            if (err != null) {
              console.log("---------采购入库-udi--保存data失败");
              return false;
            } else {
              console.log("---------采购入库-udi--保存data成功！");
            }
          },
          {
            domainKey: "sy01"
          }
        );
      }
    }
  }
  function dateFormat(date, format) {
    date = new Date(date);
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "H+": date.getHours() + 8, //hour+8小时
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  //生成uuid
  function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
});