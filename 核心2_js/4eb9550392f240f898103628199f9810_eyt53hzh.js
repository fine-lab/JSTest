run = function (event) {
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel("SY01_quareventryv1List");
  // 添加用户参照的组织过滤
  viewModel.get("reviewer_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  viewModel.on("afterLoadData", function (event) {
    //先全放出来，后面依据业务隐藏，不然有缓存，会导致前一个业务隐藏了，后一个业务需要显示时，不能默认显示
    gridModelInfo.setColumnState("fcbhgsl", "visible", true);
    viewModel.on("modeChange", function (data) {
      if (data === "add" || data == "edit") {
        let org_id = viewModel.get("org_id").getValue();
        let rows = gridModelInfo.getRows();
        for (let i = rows.length - 1; i >= 0; i--) {
          if (rows[i].newReviewQty == 0) {
            gridModelInfo.deleteRows([i]);
          }
        }
        rows = gridModelInfo.getRows();
        for (let i = 0; i < rows.length; i++) {
          gjrkys_getCustomerInfo(rows[i].product, org_id).then((proLicInfo) => {
            gridModelInfo.setCellValue(i, "expireDateNo", proLicInfo.expireDateNo);
            gridModelInfo.setCellValue(i, "expireDateUnit", proLicInfo.expireDateUnit);
          });
        }
      }
    });
    //页面字段的显示隐藏
    let extendSourceBilltype = () => {
      // 判断上游单据类型
      let sourceBilltype = viewModel.get("source_billtype").getValue();
      if (sourceBilltype == "sy01.71134f47" || sourceBilltype == "sy01.a2835a96") {
        return true;
      } else {
        return false;
      }
    };
    //页面字段的显示隐藏
    let extendSourceBillType1 = () => {
      // 判断上游单据类型
      let sourceBilltype = viewModel.get("source_billtype").getValue();
      if (sourceBilltype != "sy01.71134f47" && sourceBilltype != "sy01.a2835a96") {
        return true;
      } else {
        return false;
      }
    };
    // 是否需要显示拒收数量拒收数量属性
    if (extendSourceBilltype()) {
      gridModelInfo.setColumnState("reject_qty", "visible", true);
      gridModelInfo.setColumnState("fcbhgsl", "visible", false);
    } else {
      gridModelInfo.setColumnState("reject_qty", "visible", false);
    }
    // 是否需要显示不合格数量
    if (extendSourceBillType1()) {
      gridModelInfo.setColumnState("reject_qty", "visible", false);
      gridModelInfo.setColumnState("fcbhgsl", "visible", true);
    } else {
      gridModelInfo.setColumnState("reject_qty", "visible", true);
    }
    //页面字段的显示隐藏
    let extendXSTH = () => {
      // 判断上游单据类型
      let sourceBilltype = viewModel.get("source_billtype").getValue();
      if (sourceBilltype == "sy01.71134f47") {
        return true;
      } else {
        return false;
      }
    };
    // 销售退回需要放开
    if (extendXSTH()) {
      gridModelInfo.setColumnState("fcbhgsl", "visible", true);
    }
    viewModel.on("modeChange", function (data) {
      let recheckMan = viewModel.get("reviewer").getValue();
      if ((data === "add" || data === "edit") && (recheckMan == "" || recheckMan == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("reviewer").setValue(res.staffOfCurrentUser.id);
            viewModel.get("reviewer_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("reviewdep").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("reviewdep_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  viewModel.on("beforeSave", function (data) {
    try {
      let error_info = [];
      let reviewType = viewModel.get("review_type").getValue(); //复查类型
      //采购正向流程
      if (reviewType == 1) {
        let sourceEntryIdObj = {};
        let sourceEntryId_reviewQty = [];
        for (var i = 0; i < gridModelInfo.getRows().length; i++) {
          //来源单据Id
          let sourceEntryId = gridModelInfo.getCellValue(i, "sourcechild_id"); //上游单据子表ID
          //检验数量
          let reviewQty = parseFloat(gridModelInfo.getCellValue(i, "newReviewQty")) == NaN ? 0 : parseFloat(gridModelInfo.getCellValue(i, "newReviewQty"));
          sourceEntryIdObj[sourceEntryId] = reviewQty;
          //复核合格数量
          let qualifieQty = parseFloat(gridModelInfo.getCellValue(i, "fchgsl")) == NaN ? 0 : parseFloat(gridModelInfo.getCellValue(i, "fchgsl"));
          //复核拒收
          let unqualifieQty = parseFloat(gridModelInfo.getCellValue(i, "reject_qty")) == NaN ? 0 : parseFloat(gridModelInfo.getCellValue(i, "reject_qty"));
          if (qualifieQty + unqualifieQty != reviewQty) {
            error_info.push("第" + (i + 1) + "行数据 复查合格数量+复查拒收数量 != 检验数量,请重新填写\n");
            cb.utils.alert(error_info);
            return false;
          }
        }
        sourceEntryId_reviewQty.push(sourceEntryIdObj);
        var promise = new cb.promise();
        cb.rest.invokeFunction(
          "GT22176AT10.backDefaultGroup.recheck_qty_verify",
          {
            sourceEntryId_reviewQty: sourceEntryId_reviewQty,
            reviewType: "1"
          },
          function (err, res) {
            if (typeof res !== "undefined") {
              let finalError = error_info.concat(res.err_info);
              if (finalError.length > 0) {
                cb.utils.alert(finalError);
                promise.reject();
              } else {
                promise.resolve();
              }
            }
          }
        );
        return promise;
      }
      //采购退货流程
      else if (reviewType == 2) {
        let sourceEntryIdObj = {};
        let sourceEntryId_reviewQty = [];
        for (var i = 0; i < gridModelInfo.getRows().length; i++) {
          //来源单据Id
          let sourceEntryId = gridModelInfo.getCellValue(i, "sourcechild_id"); //上游单据子表ID
          //检验数量
          let reviewQty = parseFloat(gridModelInfo.getCellValue(i, "newReviewQty"));
          sourceEntryIdObj[sourceEntryId] = reviewQty;
          //复核合格数量
          let qualifieQty = parseFloat(gridModelInfo.getCellValue(i, "fchgsl"));
          //复核不合格数量
          let unqualifieQty = parseFloat(gridModelInfo.getCellValue(i, "fcbhgsl"));
          if (qualifieQty + unqualifieQty != reviewQty) {
            error_info.push("第" + (i + 1) + "行数据 复查合格数量+复查不合格数量 != 检验数量,请重新填写\n");
            cb.utils.alert(error_info);
            return false;
          }
        }
        sourceEntryId_reviewQty.push(sourceEntryIdObj);
        var promise = new cb.promise();
        cb.rest.invokeFunction(
          "GT22176AT10.backDefaultGroup.recheck_qty_verify",
          {
            sourceEntryId_reviewQty: sourceEntryId_reviewQty,
            reviewType: "2"
          },
          function (err, res) {
            if (typeof res !== "undefined") {
              let finalError = error_info.concat(res.err_info);
              if (finalError.length > 0) {
                cb.utils.alert(finalError);
                promise.reject();
              } else {
                promise.resolve();
              }
            }
          }
        );
        return promise;
      }
      //质量复查流程
      if (reviewType == 5) {
        let sourceEntryIdObj = {};
        let sourceEntryId_reviewQty = [];
        for (var i = 0; i < gridModelInfo.getRows().length; i++) {
          //来源单据Id
          let sourceEntryId = gridModelInfo.getCellValue(i, "sourcechild_id"); //上游单据子表ID
          //检验数量
          let reviewQty = parseFloat(gridModelInfo.getCellValue(i, "newReviewQty"));
          sourceEntryIdObj[sourceEntryId] = reviewQty;
          //复核合格数量
          let qualifieQty = parseFloat(gridModelInfo.getCellValue(i, "fchgsl"));
          //复核不合格数量
          let unqualifieQty = parseFloat(gridModelInfo.getCellValue(i, "fcbhgsl"));
          if (qualifieQty + unqualifieQty != reviewQty) {
            error_info.push("第" + (i + 1) + "行数据 复查合格数量+复查不合格数量 != 检验数量,请重新填写\n");
            cb.utils.alert(error_info);
            return false;
          }
        }
        sourceEntryId_reviewQty.push(sourceEntryIdObj);
        var promise = new cb.promise();
        cb.rest.invokeFunction(
          "GT22176AT10.backDefaultGroup.recheck_qty_verify",
          {
            sourceEntryId_reviewQty: sourceEntryId_reviewQty,
            reviewType: "5"
          },
          function (err, res) {
            if (typeof res !== "undefined") {
              let finalError = error_info.concat(res.err_info);
              if (finalError.length > 0) {
                cb.utils.alert(finalError);
                promise.reject();
              } else {
                promise.resolve();
              }
            }
          }
        );
        return promise;
      }
      var rowdata = [];
      // 获取各行的内容
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        var tmpobj = {
          id: gridModelInfo.getCellValue(i, "id"),
          sourcechild_id: gridModelInfo.getCellValue(i, "sourcechild_id"), //上游单据子表ID
          reviewQty: parseFloat(gridModelInfo.getCellValue(i, "newReviewQty")), // 复查数量
          qualifieQty: parseFloat(gridModelInfo.getCellValue(i, "fchgsl")), //复查合格数量
          unqualifieQty: parseFloat(gridModelInfo.getCellValue(i, "fcbhgsl")), //复查不合格数量
          rejectQty: parseFloat(gridModelInfo.getCellValue(i, "reject_qty")) // 复查拒收数量
        };
        rowdata.push(tmpobj); //添加行到变量
      }
      // 上游单据类型判断 若上游单据为销售退回
      if (viewModel.get("source_billtype").getValue() == "sy01.71134f47") {
        // 获取退回检验单的ID
        var thisId = viewModel.get("id").getValue(); //当前单据ID
        var thisCode = viewModel.get("code").getValue(); //当前单据编码
        //声明异步
        var returnPromise = new cb.promise();
        var param = { id: thisId, code: thisCode, billType: "return", griddata: rowdata };
        // 调用校验API函数
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.quarviewSaveValid", param, function (err, res) {
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
        // 单据类型判断，若上游单据为销售复核
      } else if (viewModel.get("source_billtype").getValue() == "sy01.9c79daf5") {
        // 获取退回检验单的ID
        var thisId = viewModel.get("id").getValue(); //当前单据ID
        var thisCode = viewModel.get("code").getValue(); //当前单据编码
        //声明异步
        var returnPromise = new cb.promise();
        var param = { id: thisId, code: thisCode, billType: "out", griddata: rowdata };
        // 调用校验API函数
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.quarviewSaveValid", param, function (err, res) {
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
    } catch (e) {
      cb.utils.alert(e.message, "error");
      return false;
    }
  });
  gjrkys_getCustomerInfo = function (materialId, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProLicInfo",
        {
          materialId: materialId,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.proLicInfo);
          } else if (err !== null) {
            alert(err.message);
          }
        }
      );
    });
  };
};