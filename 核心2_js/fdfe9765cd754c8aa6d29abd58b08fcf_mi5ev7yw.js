run = function (event) {
  var viewModel = this;
  viewModel.on("beforeBatchpush", function (data) {
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //本单据以及子表url,主子表关联子表字段编码
    let billMetaNo = "GT22176AT10.GT22176AT10.SY01_purinstockysv2";
    let entryMetaNo = "GT22176AT10.GT22176AT10.SY01_purinstockys_l";
    let entryLinkMetaNo = "SY01_purinstockysv2_id";
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      //质量复查
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "GT22176AT10.publicFunction.getBillAndEntry";
      //下游单据url
      let LowerBillMetaNo = "GT22176AT10.GT22176AT10.Sy01_quareview";
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        let request = { id: id, uri: LowerBillMetaNo };
        //判断下游单据状态
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        let request2 = { id: id, billMetaNo: billMetaNo, entryMetaNo: entryMetaNo, entryLinkMetaNo: entryLinkMetaNo };
        promises.push(validateBills_fc(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
      }
    } else if (data.params.cSvcUrl.indexOf("targetBillNo=6a247d71") > 0) {
      //拒收
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "GT22176AT10.publicFunction.getBillAndEntry";
      //下游单据url
      let LowerBillMetaNo = "GT22176AT10.GT22176AT10.SY01_medcrefusev2";
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        let request = { id: id, uri: LowerBillMetaNo };
        //判断下游单据状态
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        let request2 = { id: id, billMetaNo: billMetaNo, entryMetaNo: entryMetaNo, entryLinkMetaNo: entryLinkMetaNo };
        promises.push(validateBills_bhg(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
      }
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
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res.Info != "undefined") {
          message = res.Info;
        }
        resolve(message);
      });
    });
  }
  function validateBills_fc(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          if (res.verifystate != 2) {
            message += res.code + "未审核请重新下推";
          } else {
            let pushFlag = false;
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].uncertain_qty - res.entry[i].review_qty > 0) {
                pushFlag = true;
              }
            }
            if (!pushFlag) {
              message += res.code + "无可下推复查数量";
            }
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  function validateBills_bhg(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          if (res.verifystate != 2) {
            message += res.code + "未审核请重新下推";
          } else {
            let pushFlag = false;
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].refuse_qty - res.entry[i].total_refuse_qty - res.entry[i].rejection_qty > 0) {
                pushFlag = true;
              }
            }
            if (!pushFlag) {
              message += res.code + "无可下推拒收数量";
            }
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
};