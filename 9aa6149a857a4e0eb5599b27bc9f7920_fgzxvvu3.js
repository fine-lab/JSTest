viewModel.on("customInit", function (data) {
  // 销售退货单--页面初始化
  var viewModel = this;
  var errorMsg = "";
  var flag = true;
  var customerInfor;
  const m_gspTransation = "GSP销售退货";
  var isgspzz = false;
  var poacontrol = "0";
  var products = [];
  var agents = [];
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
  cb.rest.invokeFunction2 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  let invokeFunction1 = function (id, data, callback, options) {
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
      //商品改变后 带出存储条件
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
  //客户参照过滤
  viewModel.get("agentId_name").on("beforeBrowse", function () {
    debugger;
    let promises = [];
    let orgid = viewModel.get("salesOrgId").getValue();
    let is_gsp = viewModel.get("extend_gsptype").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    if (is_gsp == 1 || is_gsp == "1" || is_gsp == "true" || is_gsp == true) {
      promises.push(getGspAgentlist(orgid));
      let returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: agents
        });
        this.setFilter(condition);
        returnPromise.resolve();
      });
      return returnPromise;
    } else {
      {
        this.setFilter(condition);
      }
    }
  });
  //物料过滤事件
  detailsModel
    .getEditRowModel()
    .get("realProductCode")
    .on("beforeBrowse", function () {
      let promises = [];
      let orgid = viewModel.get("salesOrgId").getValue();
      var is_gsp = viewModel.get("extend_gsptype").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      if (is_gsp == "1" || is_gsp == 1 || is_gsp == true || is_gsp == "true") {
        promises.push(getGspProductlist(orgid));
        let returnPromise = new cb.promise();
        Promise.all(promises).then(() => {
          condition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: products
          });
          this.setFilter(condition);
          returnPromise.resolve();
        });
        return returnPromise;
      } else {
        this.setFilter(condition);
      }
    });
  //查询GSP参数 授权范围与证照设置
  detailsModel.on("rowColChange", function (args) {
  });
  viewModel.get("agentId_name").on("afterValueChange", function (data) {
  });
  viewModel.on("beforePush", function (params) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var id = viewModel.get("id").getValue();
    var code = viewModel.get("code").getValue();
    var isGSP = viewModel.get("extend_gsptype").getValue();
    if (trues.includes(isGSP)) {
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
  let SetProductInfo = function (materialId, orgid, rowIndex) {
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction1(
      "GT22176AT10.publicFunction.getProLicInfo",
      { materialId: materialId, orgId: orgid },
      function (err, res) {
        if (typeof res !== "undefined") {
          if (res.proLicInfo) {
            if (res.proLicInfo.materialType) {
              detailsModel.setCellValue(rowIndex, "extend_GspPrdType", res.proLicInfo.materialType);
              detailsModel.setCellValue(rowIndex, "extend_GspPrdType_name", res.proLicInfo.materialTypeName);
            }
            //剂型
            if (res.proLicInfo.dosageForm) {
              detailsModel.setCellValue(rowIndex, "extend_DosageForm", res.proLicInfo.dosageForm);
              detailsModel.setCellValue(rowIndex, "extend_DosageForm_dosagaFormName", res.proLicInfo.dosageFormName);
            }
            //通用名
            if (res.proLicInfo.commonNme) {
              detailsModel.setCellValue(rowIndex, "extend_CommonName", res.proLicInfo.commonNme);
            }
            //批准文号
            if (res.proLicInfo.approvalNumber) {
              detailsModel.setCellValue(rowIndex, "extend_LicenseNumber", res.proLicInfo.approvalNumber);
            }
            //上市许可人
            if (res.proLicInfo.listingHolder) {
              detailsModel.setCellValue(rowIndex, "extend_MAH", res.proLicInfo.listingHolder);
              detailsModel.setCellValue(rowIndex, "extend_MAH_ip_name", res.proLicInfo.listingHolderName);
            }
            //产地
            if (res.proLicInfo.producingArea) {
              detailsModel.setCellValue(rowIndex, "extend_ProPlace", res.proLicInfo.producingArea);
            }
            //生产厂商
            if (res.proLicInfo.manufacturer) {
              detailsModel.setCellValue(rowIndex, "extend_Mfrs", res.proLicInfo.manufacturer);
            }
            //是否冷链
            if (res.proLicInfo.coldChainDrugs) {
              detailsModel.setCellValue(rowIndex, "extend_ColdChainDrugs", res.proLicInfo.coldChainDrugs);
            }
            //是否特殊药品
            if (res.proLicInfo.specialDrugs) {
              detailsModel.setCellValue(rowIndex, "extend_SpecialDrugs", res.proLicInfo.specialDrugs);
            }
            //是否麻黄碱药品
            if (res.proLicInfo.ephedrineContaining) {
              detailsModel.setCellValue(rowIndex, "extend_EphedrineIn", res.proLicInfo.ephedrineContaining);
            }
            //是否GSP类型
            detailsModel.setCellValue(rowIndex, "extend_IsGspType", "1");
            //是否二次验收
            if (res.proLicInfo.doubleReview) {
              detailsModel.setCellValue(rowIndex, "extend_DoubleCheck", res.proLicInfo.doubleReview);
            }
            //包材
            if (res.proLicInfo.packingMaterial) {
              detailsModel.setCellValue(rowIndex, "extendPackingMaterial", res.proLicInfo.packingMaterial);
              detailsModel.setCellValue(rowIndex, "extendPackingMaterial_packing_name", res.proLicInfo.packingMaterialName);
            }
            //本位码
            if (res.proLicInfo.standardCode) {
              detailsModel.setCellValue(rowIndex, "extend_standard_code", res.proLicInfo.standardCode);
            }
            //存储条件
            if (res.proLicInfo.storageCondition) {
              detailsModel.setCellValue(rowIndex, "extendStorageCondition", res.proLicInfo.storageCondition, true);
              detailsModel.setCellValue(rowIndex, "extendStorageCondition_storageName", res.proLicInfo.storageConditionName, true);
            }
          }
          returnPromise.resolve();
        } else if (err !== null) {
          cb.utils.alert(err.message);
        }
      },
      undefined,
      { domainKey: "sy01" }
    );
    return returnPromise;
  };
  let gridModelInfo = viewModel.getGridModel("saleReturnDetails");
  viewModel.on("afterLoadData", function () {
    //下推按钮显示
    //获取存储条件 根据收票组织 和物料 到gsp商品档案 获取 在新增时去获取，不需要手填
    if (viewModel.getParams().mode === "add") {
      if (gridModelInfo.getRows().length > 0) {
        let settlementOrgId = viewModel.get("settlementOrgId").getValue(); //收票组织
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let sbMaterial = gridModelInfo.getCellValue(i, "productId"); //商品
          //查询 并赋值
          invokeFunction1(
            "PU.publicFunction.getStorageCon",
            { org: settlementOrgId, material: sbMaterial },
            function (err, res) {
              if (err) {
                console.error(err.message, "error");
              } else {
                let rsdata = res.rsData;
                if (rsdata.length > 0) {
                  gridModelInfo.setCellValue(i, "extendStorageCondition", rsdata[0].storageCondition, true);
                  gridModelInfo.setCellValue(i, "extendStorageCondition_storageName", rsdata[0].storageConditionName, true);
                }
              }
            },
            { domainKey: "sy01" }
          );
        }
      }
    }
    products = [];
    agents = [];
    var mode = viewModel.getParams().mode;
    if (mode != "browse") {
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
      debugger;
      let saleorgid = viewModel.get("salesOrgId").getValue();
      let source = viewModel.get("source").getValue();
      if (source == "voucher_saleoutlist_pull") {
        //销售出库来源的
        for (var i = 0; i < detailsModel.length; i++) {
          let id = detailsModel[i].productId;
          SetProductInfo(id, saleorgid, i);
        }
      }
    }
  });
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
    if (isGSP == "0" || isGSP == false) {
      if (viewModel.get("transactionTypeId_name").getValue() == m_gspTransation) {
        cb.utils.alert("非GSP类型单据，不能选择交易类型为【GSP销售退货】", "error");
        return false;
      }
    }
    if (isGSP == "1" || isGSP == 1) {
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
  function getGspProductlist(orgid) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction2(
        "GT22176AT10.publicFunction.getProListGsp",
        { orgId: orgid },
        function (err, res) {
          if (typeof res !== "undefined") {
            products = res.materialListRes;
            resolve(products);
          } else if (err !== null) {
            cb.utils.alert(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGspAgentlist(orgid) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction2(
        "GT22176AT10.publicFunction.getAgentListGsp",
        { orgId: orgid },
        function (err, res) {
          if (typeof res !== "undefined") {
            agents = res.customerListRes;
            resolve(agents);
          } else if (err !== null) {
            cb.utils.alert(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  viewModel.on("modeChange", function (data) {
    let mId = viewModel.get("id").getValue();
    let orgId = viewModel.get("salesOrgId").getValue();
    if (data === "edit") {
      //获取下游单据数据
      cb.rest.invokeFunction("GT22176AT10.gspofsales.getReturnAccept", { mId: mId, orgId: orgId }, function (err, res) {
        console.log(res);
        console.log(err);
        if (res != undefined) {
          if (res.isTrue) {
            viewModel.getGridModel().setReadOnly(true);
            viewModel.setReadOnly(true);
          }
        }
      });
    }
  });
});