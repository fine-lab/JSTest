run = function (event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (data) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      console.log(data);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate == 2 || data.state == 1) {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //本单据以及子表url,主子表关联子表字段编码
    let billMetaNo = "GT22176AT10.GT22176AT10.SY01_puroutreviewv2";
    let entryMetaNo = "GT22176AT10.GT22176AT10.SY01_gjtcfh_l";
    let entryLinkMetaNo = "SY01_puroutreviewv2_id";
    //质量复查
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
    } else if (data.params.cSvcUrl.indexOf("targetBillNo=a099fc40") > 0) {
      //不合格
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "GT22176AT10.publicFunction.getBillAndEntry";
      //下游单据url
      let LowerBillMetaNo = "GT22176AT10.GT22176AT10.SY01_bad_drugv7";
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
          if (!(res.verifystate == 2 || res.state == 1)) {
            message += res.code + "未审核请取消选择";
          } else {
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].uncertain_qty - res.entry[i].review_qty <= 0) {
                message += res.code + "的第" + (i + 1) + "行中检验不确定数量-累计复查数量<=0,无法下推,请重试";
              }
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
          if (!(res.verifystate == 2 || res.state == 1)) {
            message += res.code + "未审核请取消选择";
          } else {
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].unqualifie_qty - res.entry[i].review_unqualifie_qty - res.entry[i].unqualifie_register <= 0) {
                message += res.code + "的第" + (i + 1) + "行中检验不合格数量-累计质量复查不合格数量-累计不合格登记数量<=0,无法下推,请重试";
              }
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