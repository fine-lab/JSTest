viewModel.on("customInit", function (data) {
  // 销售发货单--页面初始化
  var viewModel = this;
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
  viewModel.on("afterMount", function (event) {
    let tenantId = cb.utils.getTenantId();
    if (tenantId != "clfpjof8") {
      viewModel.get("extendIsWms").setVisible(false);
      viewModel.get("extendRemarks").setVisible(false);
    }
    var gridModel = viewModel.getGridModel("deliveryDetails");
    gridModel
      .getEditRowModel()
      .get("extendPosition_name")
      .on("beforeBrowse", function (data) {
        let arr = {};
        let warehouse_id = gridModel.getCellValue(gridModel.getFocusedRowIndex(), "stockId");
        if (warehouse_id == undefined) {
          cb.utils.alert("请先选择仓库", "error");
          return false;
        }
        let returnPromise = new cb.promise();
        cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.checkWareHouse", { warehouse_id: warehouse_id }, function (err, res) {
          console.log("res:" + JSON.stringify(res));
          let errInfo = res.ret;
          if (errInfo == "false") {
            cb.utils.alert("该仓库没有开启货位管理", "error");
            return false;
          }
          returnPromise.resolve();
        });
        return returnPromise;
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "warehouseId",
          op: "eq",
          value1: warehouse_id
        });
        this.setFilter(condition);
      });
    let extendGspTypeBool = () => {
      let gspFlagArray = [true, "true", "1"];
      let extendGspType = viewModel.get("extendGspType").getValue();
      return gspFlagArray.includes(extendGspType);
    };
    viewModel.get("button59lf").on("click", function () {
      var rows = gridModel.getRows();
      let arr = [];
      let is_chai = "false";
      for (let index = 0; index < rows.length; index++) {
        let obj = {};
        if (is_chai == "false") {
          obj.stockId = rows[index].stockId;
          obj.batchNo = rows[index].batchNo;
          obj.productId = rows[index].productId;
          obj.subQty = rows[index].qty;
          obj.skuId = rows[index].skuId;
          arr.push(obj);
          if (obj.batchNo == null || obj.stockId == null || obj.skuId == null) {
            cb.utils.alert("第" + (index + 1) + "行请输入批次和仓库和sku不能为空");
            return false;
          }
        }
      }
      if (is_chai == "false") {
        var returnPromise = new cb.promise();
        //检查累计复核数量是否等于发货数量，如果不等于则下推出库报错，提示需要进行出库复核。
        cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.getPostionInfo", { arr: arr }, function (err, res) {
          console.log("res:" + JSON.stringify(res));
          let result = res.ret;
          let source = [];
          for (let x = 0; x < result.length; x++) {
            let errInfo = result[x].error_message;
            let is_chai = result[x].is_chai;
            let subQty = rows[x].qty;
            if (errInfo != "ok") {
              cb.utils.alert("第" + (x + 1) + "行" + errInfo, "error");
            } else {
              if (is_chai == "false") {
                let currentqty = result[x].currentqty;
                let postion = result[x].data[0].postion;
                let postion_name = result[x].data[0].postion_name;
                if (currentqty < subQty) {
                  cb.utils.alert("第" + (x + 1) + "行货位存量不足");
                } else {
                  cb.utils.alert("第" + (x + 1) + "行货位匹配成功" + postion_name);
                  gridModel.setCellValue(x, "extendPosition_name", postion_name);
                  gridModel.setCellValue(x, "extendPosition", postion);
                }
              } else {
                is_chai = "true";
                let list = result[x].data;
                cb.utils.alert("拆行");
                let leijiQty = 0;
                let qty = 0;
                let shenyu_qty = 0;
                let copyRow = gridModel.getRow(x);
                for (let i = 0; i < list.length; i++) {
                  let new_start = result.length + i;
                  let currentqty = list[i].currentqty;
                  leijiQty += currentqty;
                  if (subQty >= currentqty) {
                    shenyu_qty = subQty - currentqty;
                  } else {
                    qty = subQty - leijiQty;
                  }
                  if (currentqty < subQty) {
                    qty = currentqty;
                  } else {
                    qty = shenyu_qty;
                  }
                  gridModel.appendRow(copyRow);
                  gridModel.setCellValue(new_start, "extendPosition_name", list[i].postion_name);
                  gridModel.setCellValue(new_start, "extendPosition", list[i].postion);
                  gridModel.setCellValue(new_start, "subQty", qty);
                  gridModel.setCellValue(new_start, "priceQty", qty);
                  gridModel.setCellValue(new_start, "qty", qty, true);
                }
                var new_rows = gridModel.getRows();
                source.push(x);
              }
            }
          }
          gridModel.deleteRows(source);
          returnPromise.resolve();
        });
        return returnPromise;
      } else {
        cb.utils.alert("货位分配已经拆行请刷新页面后重新分配");
      }
    });
    viewModel.on("afterLoadData", function () {
      //获取存储条件
      if (gridModel.getRows().length > 0) {
        let settlementOrgId = viewModel.get("stockOrgId").getValue(); //组织
        for (let i = 0; i < gridModel.getRows().length; i++) {
          let sbMaterial = gridModel.getCellValue(i, "productId"); //商品
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
                  gridModel.setCellValue(i, "extendStorageCondition", rsdata[0].storageCondition, true);
                  gridModel.setCellValue(i, "extendStorageCondition_storageName", rsdata[0].storageConditionName, true);
                }
              }
            },
            { domainKey: "sy01" }
          );
        }
      }
      //页面初始化试控制显示
      if (extendGspTypeBool()) {
        gridModel.setColumnState("extendGspPrdType_catagoryname", "visible", true);
        gridModel.setColumnState("extendDosageForm_dosagaFormName", "visible", true);
        gridModel.setColumnState("extendCommonName", "visible", true);
        gridModel.setColumnState("extendLicenseNumber", "visible", true);
        gridModel.setColumnState("extendMAH_ip_name", "visible", true);
        gridModel.setColumnState("extendProPlace", "visible", true);
        gridModel.setColumnState("extendMfrs", "visible", true);
        gridModel.setColumnState("extendTotalCheckNum", "visible", true);
        gridModel.setColumnState("extendTotalQualified", "visible", true);
        gridModel.setColumnState("extendTotalQualifiedPiece", "visible", true);
        gridModel.setColumnState("extendTotalUnqualified", "visible", true);
        gridModel.setColumnState("extend_standard_code", "visible", true);
        gridModel.setColumnState("extendPackingMaterial_packing_name", "visible", true);
      } else {
        gridModel.setColumnState("extendGspPrdType_catagoryname", "visible", false);
        gridModel.setColumnState("extendDosageForm_dosagaFormName", "visible", false);
        gridModel.setColumnState("extendCommonName", "visible", false);
        gridModel.setColumnState("extendLicenseNumber", "visible", false);
        gridModel.setColumnState("extendMAH_ip_name", "visible", false);
        gridModel.setColumnState("extendProPlace", "visible", false);
        gridModel.setColumnState("extendMfrs", "visible", false);
        gridModel.setColumnState("extendTotalCheckNum", "visible", false);
        gridModel.setColumnState("extendTotalQualified", "visible", false);
        gridModel.setColumnState("extendTotalQualifiedPiece", "visible", false);
        gridModel.setColumnState("extendTotalUnqualified", "visible", false);
        gridModel.setColumnState("extend_standard_code", "visible", false);
        gridModel.setColumnState("extendPackingMaterial_packing_name", "visible", false);
      }
      if (extendGspTypeBool()) {
        gridModel.setColumnState("stockName", "bIsNull", false);
      }
    });
    // 下推出库复核数量校验
    let checkOutStockCheckNum = (id, code) => {
      // 校验发货数量-累计复核数量
      return new Promise(function (resolve) {
        let msg = "";
        cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.pushCheck", { id: id, code: code, type: 2 }, function (err, res) {
          if (err) {
            msg = err.message;
          }
          if (res.errInfo !== undefined && res.errInfo.length > 0) {
            msg = res.errInfo;
          }
          resolve(msg);
        });
      });
    };
    //判断是否有下游单据,//下游出库复核单据未审核，不允许下推
    let lowerOrderCheck = (data) => {
      return new Promise(function (resolve) {
        let msg = "";
        invokeFunction1(
          "GT22176AT10.publicFunction.checkChildOrderAudit",
          data,
          function (err, res) {
            if (err) {
              msg = err.message;
            }
            if (res.Info && res.Info.length > 0) {
              msg = res.Info;
            }
            resolve(msg);
          },
          { domainKey: "sy01" }
        );
      });
    };
    //下推检验
    viewModel.on("beforePush", function (args) {
      debugger;
      if (!extendGspTypeBool()) {
        return true;
      }
      var id = args.params.data.id;
      var code = args.params.data.code;
      let cSvcUrl = args.params.cSvcUrl;
      if (cSvcUrl.indexOf("st_salesout") > 0) {
        //下推出库单
        var returnPromise = new cb.promise();
        //检查累计复核数量是否等于发货数量，如果不等于则下推出库报错，提示需要进行出库复核。
        cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.pushCheck", { id: id, code: code, type: 1 }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.errInfo && res.errInfo.length > 0) {
            cb.utils.alert(res.errInfo, "error");
            return false;
          }
          returnPromise.resolve();
        });
        return returnPromise;
      }
      if (cSvcUrl.indexOf("9c79daf5") > 0) {
        let data = { id: id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
        let promiseArray = [];
        let errorMsg = "";
        let handerMessage = (n) => (errorMsg += n);
        promiseArray.push(checkOutStockCheckNum(id, code).then(handerMessage));
        promiseArray.push(lowerOrderCheck(data).then(handerMessage));
        var returnPromise = new cb.promise();
        Promise.all(promiseArray).then(() => {
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
    //弃审检验
    viewModel.on("beforeUnaudit", function (args) {
      debugger;
      if (!extendGspTypeBool()) {
        return true;
      }
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
      var returnPromise = new cb.promise();
      let data = { id: JSON.parse(args.data.data).id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
      //判断是否有下游单据
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        data,
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
      return returnPromise;
    });
    //保存前校验
    viewModel.on("beforeSave", function (args) {
      let details = viewModel.getGridModel("deliveryDetails");
      if (details.getRows().length > 0) {
        let rows = details.getRows();
        let arr = [];
        for (let i = 0; i < rows.length; i++) {
          let detail = rows[i];
          if (extendGspTypeBool()) {
            if ((detail.isBatchManage && detail.batchNo == undefined) || detail.batchNo == "null") {
              cb.utils.alert("第" + (i + 1) + "行：批次管理商品，批次号不能为空");
              return false;
            }
          }
          if (detail.extendPosition != null) {
            let obj = {};
            obj.stockId = detail.stockId;
            obj.batchNo = detail.batchNo;
            obj.productId = detail.productId;
            obj.subQty = detail.subQty;
            obj.skuId = detail.skuId;
            obj.postion = detail.extendPosition;
            obj.line = i + 1;
            arr.push(obj);
            if (obj.batchNo == null || obj.stockId == null || obj.skuId == null) {
              cb.utils.alert("第" + obj.line + "行请输入批次和仓库和sku不能为空");
              return false;
            }
          }
        }
        if (arr.length > 0) {
          var returnPromise = new cb.promise();
          cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.checkPostion", { arr: arr }, function (err, res) {
            console.log("res:" + JSON.stringify(res));
            let errInfo = res.return_data.error_message;
            if (errInfo != "ok") {
              cb.utils.alert(errInfo, "error");
              return false;
            }
            returnPromise.resolve();
          });
          return returnPromise;
        }
      }
    });
    gridModel
      .getEditRowModel()
      .get("extendPosition_name")
      .on("beforeBrowse", function (args) {
        let stockId = gridModel.getEditRowModel().get("stockId").getValue(); //仓库ID
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "warehouseId",
          op: "eq",
          value1: stockId
        });
        this.setFilter(condition);
      });
  });
});