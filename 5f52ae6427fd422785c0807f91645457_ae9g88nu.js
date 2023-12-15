viewModel.on("customInit", function (data) {
  // 销售发货单--页面初始化
  var viewModel = this;
  viewModel.on("afterMount", function (event) {
    var gridModel = viewModel.getGridModel("deliveryDetails");
    let extendGspTypeBool = () => {
      let gspFlagArray = [true, "true", "1"];
      let extendGspType = viewModel.get("extendGspType").getValue();
      return gspFlagArray.includes(extendGspType);
    };
    viewModel.on("afterLoadData", function () {
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
        cb.rest.invokeFunction1(
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
          undefined,
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
      if (details.getRows().length > 0 && extendGspTypeBool()) {
        let rows = details.getRows();
        for (let i = 0; i < rows.length; i++) {
          let detail = rows[i];
          if ((detail.isBatchManage && detail.batchNo == undefined) || detail.batchNo == "null") {
            cb.utils.alert("第" + (i + 1) + "行：批次管理商品，批次号不能为空");
            return false;
          }
        }
      }
    });
  });
});