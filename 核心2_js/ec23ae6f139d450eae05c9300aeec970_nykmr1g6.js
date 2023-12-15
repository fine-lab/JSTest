run = function (event) {
  //到货单，页面初始化函数
  var viewModel = this;
  var gridModelInfo = viewModel.getGridModel("arrivalOrders");
  viewModel.on("modeChange", function (data) {
    let is_gsp = viewModel.get("extend_is_gsp").getValue();
    if (data == "add" && (is_gsp == 1 || is_gsp == "1")) {
      //如果是gsp
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getBillType", { formId: "yourIdHere", codeName: "A35002" }, function (err, res) {
        if (res) {
          let typeInfo = JSON.parse(res.result).data[0];
          viewModel.get("busType").setValue(typeInfo.id);
          viewModel.get("busType_name").setValue(typeInfo.name);
        }
      });
    }
  });
  viewModel.on("beforePush", function (data) {
    try {
      let errorMsg = "";
      let promises = [];
      let handerMessage = (n) => (errorMsg += n);
      cb.rest.invokeFunction1 = function (id, data, callback, options) {
        var proxy = cb.rest.DynamicProxy.create({
          doProxy: {
            url: "/web/function/invoke/" + id,
            method: "POST",
            options: options
          }
        });
        proxy.doProxy(data, callback);
      };
      if (data.args.cCaption == "入库验收") {
        if (viewModel.get("status").getValue() != 1) {
          errorMsg += "单据未审核,不能下推购进入库验收";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
          let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" };
          promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        }
        let pushFlag = false;
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let acceptqty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "acceptqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "acceptqty"));
          //累计检验数量  先使用  关联抽样数量
          let checkQty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_associate_sample_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_associate_sample_qty"));
          if (acceptqty - checkQty > 0) {
            pushFlag = true;
          }
        }
        if (!pushFlag) {
          errorMsg += "无可验收数量\n";
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
      let is_gsp = viewModel.get("extend_is_gsp").getValue();
      if (data.args.cCaption == "入库" && (is_gsp == 1 || is_gsp == "1" || is_gsp == true || is_gsp == "true")) {
        let pushFlag = false;
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          // 实发数量!=累计检验合格数量+累计检验拒收数量   不允许下推。
          //实发数量
          let acceptqty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "acceptqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "acceptqty"));
          //累计检验合格数量
          let extend_qualified_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_qualified_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_qualified_qty"));
          //累计拒收数量
          let extend_unqualified_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_unqualified_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_unqualified_qty"));
          if (acceptqty != extend_qualified_qty + extend_unqualified_qty) {
            errorMsg += "第" + (i + 1) + "累计验收合格数量+累计验收拒收数量!=实收数量,不允许下推(还有物料没有验收完成)";
          }
          let totalInQuantity = isNaN(parseFloat(gridModelInfo.getCellValue(i, "totalInQuantity"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "totalInQuantity"));
          if (extend_qualified_qty - totalInQuantity > 0) {
            pushFlag = true;
          }
        }
        if (!pushFlag) {
          errorMsg += "无可入库数量\n";
        }
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          return false;
        }
      }
    } catch (e) {
      console.error(e.name);
      console.error(e.message);
      cb.utils.alert(e.message, "error");
      return false;
    }
  });
  viewModel.on("beforeUnaudit", function () {
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction1(
      "GT22176AT10.publicFunction.checkChildOrderUnAud",
      { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        if (typeof res.Info != "undefined") {
          cb.utils.alert(res.Info, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      },
      { domainKey: "sy01" }
    );
    return returnPromise;
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          //数量
          let message = "";
          if (typeof res.Info != "undefined") {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  //到货单，页面初始化函数
};