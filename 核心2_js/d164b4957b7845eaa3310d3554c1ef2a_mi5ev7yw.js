//销售退货单相关验证。2023
run = function (event) {
  var viewModel = this;
  var errorMsg = "";
  var flag = true;
  var customerInfor;
  const m_gspTransation = "GSP销售退货";
  var isgspzz = false;
  var poacontrol = "0";
  var detailsModel = viewModel.getGridModel("saleReturnDetails");
  var trues = [];
  trues.push("1");
  trues.push(1);
  trues.push("true");
  trues.push(true);
  //定义函数
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
  detailsModel.on("afterCellValueChange", function (args) {
    let cellName = args.cellName;
    let rowIndex = args.rowIndex;
    let rows = detailsModel.getRows();
    var row = rows[rowIndex];
    let saleorgid = viewModel.get("salesOrgId").getValue();
    if (cellName == "realProductCode") {
      let id = args.value.id;
      SetProductInfo(id, saleorgid, rowIndex);
    }
  });
  //改变GSP类型时控制显示
  viewModel.get("extend_gsptype").on("afterValueChange", function (data) {
    debugger;
    if (data.value == true) {
      if (viewModel.get("transactionTypeId_name").getValue() != m_gspTransation) {
        cb.utils.alert("GSP类型开启时，交易类型必须为【GSP销售退货】", "error");
        viewModel.get("extend_gsptype").setValue(false);
        return false;
      }
    }
  });
  //客户浏览前
  viewModel.get("agentId_name").on("beforeBrowse", function (data) {
    var isGSP = viewModel.get("extend_gsptype").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    if (isGSP == "1") {
      condition.simpleVOs.push({
        field: "extend_isgsp",
        op: "in",
        value1: trues
      });
      condition.simpleVOs.push({
        field: "extend_syzt",
        op: "in",
        value1: trues
      });
      //销售状态非停售
      condition.simpleVOs.push({
        field: "extend_xszt",
        op: "neq",
        value1: "2"
      });
    }
    this.setFilter(condition);
  });
  detailsModel
    .getEditRowModel()
    .get("realProductCode")
    .on("beforeBrowse", function () {
      var isGSP = viewModel.get("extend_gsptype").getValue();
      if (isGSP == "1") {
        var trues = [];
        trues.push("1");
        trues.push(1);
        trues.push("true");
        trues.push(true);
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        //是否gsp物料
        condition.simpleVOs.push({
          field: "extend_is_gsp",
          op: "in",
          value1: trues
        });
        condition.simpleVOs.push({
          field: "extend_syzt",
          op: "eq",
          value1: "1"
        });
        this.setFilter(condition);
      }
    });
  //查询GSP参数 授权范围与证照设置
  detailsModel.on("rowColChange", function (args) {
    var isGSP = viewModel.get("extend_gsptype").getValue();
    if (args.value.columnKey == "realProductCode" && isGSP == "1") {
      let customSalesman = viewModel.get("extend_operator_businesserName").getValue();
      if ((customSalesman == undefined || customSalesman == "") && poacontrol == "1") {
        cb.utils.alert("请输入对方业务员", "error");
        return false;
      }
    }
  });
  viewModel.get("agentId_name").on("afterValueChange", function (data) {
    if (viewModel.get("agentId").getValue() != undefined) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryMerchantInfor", { code: data.value.agent_code, orgId: viewModel.get("salesOrgId").getValue() }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else {
          customerInfor = res.merchantInfo;
          return true;
        }
      });
    }
  });
  viewModel.on("beforePush", function (params) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var id = viewModel.get("id").getValue();
    var code = viewModel.get("code").getValue();
    var isGSP = viewModel.get("extend_gsptype").getValue();
    if (isGSP == "1" || isGSP == 1 || isGSP == true || isGSP == "true") {
      if (params.args.cCaption == "退回验收") {
        promises.push(checkChildOrderAudit(id, "GT22176AT10.GT22176AT10.sy01_gspsalereturn").then(handerMessage));
        promises.push(checkqty(id, code).then(handerMessage));
      }
      if (params.args.cItemName == "btnSalesReturnPush") {
        promises.push(checkSalesReturn(id, code).then(handerMessage));
      }
    }
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        return false;
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  let SetProductInfo2 = function (id, saleorgid, rowIndex) {
    //调用后端函数取商品信息
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.queryproductInfo2", { materialId: id, orgId: saleorgid }, function (err, res) {
      if (res.merchantInfo) {
        if (res.merchantInfo.extend_gsp_spfl) {
          detailsModel.setCellValue(rowIndex, "extend_GspPrdType", res.merchantInfo.extend_gsp_spfl);
          detailsModel.setCellValue(rowIndex, "extend_GspPrdType_name", res.merchantInfo.extend_gsp_spfl_catagoryname);
        }
        //剂型
        if (res.merchantInfo.extend_jx) {
          detailsModel.setCellValue(rowIndex, "extend_DosageForm", res.merchantInfo.extend_jx);
          detailsModel.setCellValue(rowIndex, "extend_DosageForm_dosagaFormName", res.merchantInfo.extend_jx_dosagaFormName);
        }
        //通用名
        if (res.merchantInfo.extend_tym) {
          detailsModel.setCellValue(rowIndex, "extend_CommonName", res.merchantInfo.extend_tym);
        }
        //批准文号
        if (res.merchantInfo.extend_pzwh) {
          detailsModel.setCellValue(rowIndex, "extend_LicenseNumber", res.merchantInfo.extend_pzwh);
        }
        //上市许可人
        if (res.merchantInfo.extend_ssxkcyr) {
          detailsModel.setCellValue(rowIndex, "extend_MAH", res.merchantInfo.extend_ssxkcyr);
          detailsModel.setCellValue(rowIndex, "extend_MAH_ip_name", res.merchantInfo.extend_ssxkcyr_ip_name);
        }
        //产地
        if (res.merchantInfo.placeOfOrigin) {
          detailsModel.setCellValue(rowIndex, "extend_ProPlace", res.merchantInfo.placeOfOrigin);
        }
        //生产厂商
        if (res.merchantInfo.manufacturer) {
          detailsModel.setCellValue(rowIndex, "extend_Mfrs", res.merchantInfo.manufacturer);
        }
        //是否冷链
        if (res.merchantInfo.extend_tsyp) {
          detailsModel.setCellValue(rowIndex, "extend_ColdChainDrugs", res.merchantInfo.extend_llyp);
        }
        //是否特殊药品
        if (res.merchantInfo.extend_tsyp) {
          detailsModel.setCellValue(rowIndex, "extend_SpecialDrugs", res.merchantInfo.extend_tsyp);
        }
        //是否麻黄碱药品
        if (res.merchantInfo.extend_hmhj) {
          detailsModel.setCellValue(rowIndex, "extend_EphedrineIn", res.merchantInfo.extend_hmhj);
        }
        //是否GSP类型
        if (res.merchantInfo.extend_is_gsp) {
          detailsModel.setCellValue(rowIndex, "extend_IsGspType", res.merchantInfo.extend_is_gsp);
        }
        //是否二次验收
        if (res.merchantInfo.extend_srfh) {
          detailsModel.setCellValue(rowIndex, "extend_DoubleCheck", res.merchantInfo.extend_srfh);
        }
        //包材
        if (res.merchantInfo.extend_bc) {
          detailsModel.setCellValue(rowIndex, "extendPackingMaterial", res.merchantInfo.extend_bc);
          detailsModel.setCellValue(rowIndex, "extendPackingMaterial_packing_name", res.merchantInfo.extend_bc_packing_name);
        }
        //本位码
        if (res.merchantInfo.extend_standard_code) {
          detailsModel.setCellValue(rowIndex, "extend_standard_code", res.merchantInfo.extend_standard_code);
        }
      }
      returnPromise.resolve();
    });
    return returnPromise;
  };
  let SetProductInfo = function (id, saleorgid, rowIndex) {
    debugger;
    //调用后端函数取商品信息
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getProductDetail", { materialId: id, orgId: saleorgid }, function (err, res) {
      if (res.merchantInfo) {
        if (res.merchantInfo.extend_gsp_spfl) {
          detailsModel.setCellValue(rowIndex, "extend_GspPrdType", res.merchantInfo.extend_gsp_spfl);
          detailsModel.setCellValue(rowIndex, "extend_GspPrdType_name", res.merchantInfo.extend_gsp_spfl_catagoryname);
        }
        //剂型
        if (res.merchantInfo.extend_jx) {
          detailsModel.setCellValue(rowIndex, "extend_DosageForm", res.merchantInfo.extend_jx);
          detailsModel.setCellValue(rowIndex, "extend_DosageForm_dosagaFormName", res.merchantInfo.extend_jx_dosagaFormName);
        }
        //通用名
        if (res.merchantInfo.extend_tym) {
          detailsModel.setCellValue(rowIndex, "extend_CommonName", res.merchantInfo.extend_tym);
        }
        //批准文号
        if (res.merchantInfo.extend_pzwh) {
          detailsModel.setCellValue(rowIndex, "extend_LicenseNumber", res.merchantInfo.extend_pzwh);
        }
        //上市许可人
        if (res.merchantInfo.extend_ssxkcyr) {
          detailsModel.setCellValue(rowIndex, "extend_MAH", res.merchantInfo.extend_ssxkcyr);
          detailsModel.setCellValue(rowIndex, "extend_MAH_ip_name", res.merchantInfo.extend_ssxkcyr_ip_name);
        }
        //产地
        if (res.merchantInfo.placeOfOrigin) {
          detailsModel.setCellValue(rowIndex, "extend_ProPlace", res.merchantInfo.placeOfOrigin);
        }
        //生产厂商
        if (res.merchantInfo.manufacturer) {
          detailsModel.setCellValue(rowIndex, "extend_Mfrs", res.merchantInfo.manufacturer);
        }
        //是否冷链
        if (res.merchantInfo.extend_tsyp) {
          detailsModel.setCellValue(rowIndex, "extend_ColdChainDrugs", res.merchantInfo.extend_llyp);
        }
        //是否特殊药品
        if (res.merchantInfo.extend_tsyp) {
          detailsModel.setCellValue(rowIndex, "extend_SpecialDrugs", res.merchantInfo.extend_tsyp);
        }
        //是否麻黄碱药品
        if (res.merchantInfo.extend_hmhj) {
          detailsModel.setCellValue(rowIndex, "extend_EphedrineIn", res.merchantInfo.extend_hmhj);
        }
        //是否GSP类型
        if (res.merchantInfo.extend_is_gsp) {
          detailsModel.setCellValue(rowIndex, "extend_IsGspType", res.merchantInfo.extend_is_gsp);
        }
        //是否二次验收
        if (res.merchantInfo.extend_srfh) {
          detailsModel.setCellValue(rowIndex, "extend_DoubleCheck", res.merchantInfo.extend_srfh);
        }
        //包材
        if (res.merchantInfo.extend_bc) {
          detailsModel.setCellValue(rowIndex, "extendPackingMaterial", res.merchantInfo.extend_bc);
          detailsModel.setCellValue(rowIndex, "extendPackingMaterial_packing_name", res.merchantInfo.extend_bc_packing_name);
        }
        //本位码
        if (res.merchantInfo.extend_standard_code) {
          detailsModel.setCellValue(rowIndex, "extend_standard_code", res.merchantInfo.extend_standard_code);
        }
      }
      returnPromise.resolve();
    });
    return returnPromise;
  };
  viewModel.on("afterLoadData", function () {
    debugger;
    var mode = viewModel.getParams().mode;
    if (mode != "browse") {
      if (viewModel.get("extend_gsptype").getValue() == true) {
        updateAmount(viewModel);
      }
      if (viewModel.get("transactionTypeId_name").getValue() == m_gspTransation) {
        viewModel.get("extend_gsptype").setValue(true);
      }
      var orgid = viewModel.get("salesOrgId").getValue();
      var id = viewModel.get("agentId").getValue();
      if (id != undefined) {
        cb.rest.invokeFunction("SCMSA.orderreturncheck.querycusinfo", { id: id }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          } else {
            var agentcode = res.code;
            getcurtomerinfo(agentcode, orgid);
            return true;
          }
        });
      }
      //获取GSP参数信息
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.getGspParameters",
        { saleorgid: orgid },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          } else if (res.gspParameterArray.length > 0) {
            isgspzz = res.gspParameterArray[0].isgspzz;
            poacontrol = res.gspParameterArray[0].poacontrol;
            return true;
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
    }
  });
  var updateAmount = function (viewModel) {
    debugger;
    let gridModel = viewModel.getGridModel("saleReturnDetails").getAllData();
    var grid = viewModel.getGridModel("saleReturnDetails");
    let count = gridModel.length;
    let m_moneydecimal = 2;
    for (let i = 0; i < count; i++) {
      let data = gridModel[i];
      let oriSum = parseFloat(data.oriSum);
      let oriMoney = parseFloat(data.oriMoney);
      oriSum = parseFloat(oriSum).toFixed(m_moneydecimal);
      oriMoney = parseFloat(oriMoney).toFixed(m_moneydecimal);
      let oriTax = oriSum - oriMoney;
      grid.setCellValue(i, "oriTax", parseFloat(oriTax)); //原币税额
      //本币
      let natSum = parseFloat(data.natSum);
      let natMoney = parseFloat(data.natMoney);
      natSum = parseFloat(natSum).toFixed(m_moneydecimal);
      natMoney = parseFloat(natMoney).toFixed(m_moneydecimal);
      let natTax = natSum - natMoney;
      grid.setCellValue(i, "natTax", parseFloat(natTax)); //本币税额
    }
  };
  function getcurtomerinfo(code, orgid) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryMerchantInfor", { code: code, orgId: orgid }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else {
          customerInfor = res.merchantInfo;
          return true;
        }
      });
    });
  }
  viewModel.on("beforeSave", function (data) {
    debugger;
    var isGSP = viewModel.get("extend_gsptype").getValue();
    if ([0, "0", false, "false", undefined, null, ""].includes(isGSP)) {
      if (viewModel.get("transactionTypeId_name").getValue() == m_gspTransation) {
        cb.utils.alert("非GSP类型单据，不能选择交易类型为【GSP销售退货】", "error");
        return false;
      }
    }
    if ([1, "1", true, "true"].includes(isGSP)) {
      if (viewModel.get("transactionTypeId_name").getValue() != m_gspTransation) {
        cb.utils.alert("开启GSP后,交易类型必须为【GSP销售退货】", "error");
        return false;
      }
      var saleorgid = viewModel.get("salesOrgId").getValue();
      var agentId = viewModel.get("agentId").getValue();
      var vouchdate = viewModel.get("vouchdate").getValue();
      var extend_operator = viewModel.get("extend_operator").getValue();
      let rows = viewModel.getGridModel("saleReturnDetails").getRows();
      if (rows == null || rows == undefined) {
        cb.utils.alert("表体不能为空！", "error");
        return false;
      }
    }
  });
  viewModel.on("beforeVoucherdo", function (data) {
    debugger;
    var returnPromise = new cb.promise();
    if (data.params.cCommand == "cmdUnApprove") {
      var isGSP = viewModel.get("extend_gsptype").getValue();
      if (isGSP == "1" || isGSP) {
        var id = viewModel.get("id").getValue();
        var returncheckuri = "GT22176AT10.GT22176AT10.sy01_gspsalereturn";
        cb.rest.invokeFunction1(
          "GT22176AT10.publicFunction.checkChildOrderUnAud",
          { id: id, uri: returncheckuri },
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            }
            if (res.Info && res.Info.length > 0) {
              cb.utils.alert(res.Info, "error");
              return false;
            }
            returnPromise.resolve();
          },
          undefined,
          { domainKey: "sy01" }
        );
      }
    } else {
      return true;
    }
    return returnPromise;
  });
  viewModel.get("transactionTypeId_name").on("afterValueChange", function (data) {
    if (data.value.name == m_gspTransation) {
      viewModel.get("extend_gsptype").setValue(true);
      gridModel.clear();
    } else if (data.value.name != m_gspTransation) {
      viewModel.get("extend_gsptype").setValue(false);
      gridModel.clear();
    }
  });
  function checkChildOrderUnAudit(id, uri) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        { id: id, uri: uri },
        function (err, res) {
          let message = "";
          if (err) {
            message += err.message;
          }
          if (res.Info && res.Info.length > 0) {
            message += res.Info;
          }
          resolve(message);
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
  function checkChildOrderAudit(id, uri) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderAudit",
        { id: id, uri: uri },
        function (err, res) {
          let message = "";
          if (err) {
            message += err.message;
          }
          if (res.Info && res.Info.length > 0) {
            message += res.Info;
          }
          resolve(message);
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
  //红字销售出库单
  function checkSalesReturn(id, code) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("aead5997b99a4aa0afa86955115ce273", { id: id, code: code, type: 2 }, function (err, res) {
        let message = "";
        if (err) {
          message += err.message;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          message += res.errInfo;
        }
        resolve(message);
      });
    });
  }
  function checkqty(id, code) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("aead5997b99a4aa0afa86955115ce273", { id: id, code: code, type: 1 }, function (err, res) {
        let message = "";
        if (err) {
          message += err.message;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          message += res.errInfo;
        }
        resolve(message);
      });
    });
  }
};