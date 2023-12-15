viewModel.on("customInit", function (data) {
  // 采购订单退货
  viewModel.on("beforeBatchpush", function (args) {
    let gridModel = viewModel.getGridModel();
    let selectData = gridModel.getSelectedRows();
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    let apiUrl = "GT22176AT10.publicFunction.getBillInfo";
    let selectDataFiltered = [];
    let temp = [];
    for (let i = 0; i < selectData.length; i++) {
      if (temp.indexOf(selectData[i].id) > -1) {
        break;
      } else {
        selectDataFiltered.push(selectData[i]);
        temp.push(selectData[i].id);
      }
    }
    for (let i = 0; i < selectDataFiltered.length; i++) {
      //判断本单据是否能下推退库单
      let request = {
        billNo: "purchaseOrder",
        Ids: [selectDataFiltered[i].id]
      };
      promises.push(validate_tk(apiUrl, request).then(handerMessage));
      //判断自己的每行数据状态
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
  });
  let validate_tk = function (apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res.info !== "undefined") {
          res = res.info[0];
          if ([0, "0", false, "false", undefined, "undefined"].includes(res.extend_is_gsp)) {
            resolve(message);
            return;
          }
          let pushFlag = false;
          for (let i = 0; i < res.entry.length; i++) {
            if (parseToFloat(-res.entry[i].qty) != parseToFloat(res.entry[i].extend_review_qualified_qty) + parseToFloat(res.entry[i].extend_review_unqualified_qty)) {
              message += res.code + "第" + (i + 1) + "行累计退出复核合格数量+累计退出复核不合格数量!=数量,不允许下推(还有物料没有复核完成)";
            }
            if (parseToFloat(res.entry[i].extend_review_qualified_qty) - parseToFloat(res.entry[i].totalReturnInQty) > 0) {
              pushFlag = true;
            }
          }
          if (message.length == 0 && pushFlag == false) {
            message += res.code + "无可退库数量,已全部退库完成";
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  };
  let parseToFloat = function (num) {
    if (num == undefined || num == null) {
      return 0;
    }
    if (typeof num === "string") {
      num = parseFloat(num);
      if (isNaN(num)) return 0;
      return num;
    }
    return parseFloat(num);
  };
});