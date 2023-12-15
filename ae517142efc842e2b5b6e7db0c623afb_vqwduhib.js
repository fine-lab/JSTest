viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  // 申请人参照组织过滤
  viewModel.get("applicant_name").on("beforeBrowse", function () {
    // 获取组织id
    const orgId = viewModel.get("org_id").getValue();
    const applydepId = viewModel.get("apply_for_dept").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    if (applydepId != null) {
      condition.simpleVOs.push({
        field: "mainJobList.dept_id",
        op: "eq",
        value1: applydepId
      });
    } else {
      condition.simpleVOs.push({
        field: "mainJobList.org_id",
        op: "eq",
        value1: orgId
      });
    }
    this.setFilter(condition);
  });
  // 根据组织过滤SKU
  gridModel
    .getEditRowModel()
    .get("sussku_name")
    .on("beforeBrowse", function (args) {
      // 获取当前编辑行的品牌字段值
      const value1 = viewModel.get("org_id").getValue();
      const productId = gridModel.getEditRowModel().get("matter_code").getValue();
      //主要代码
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productId.productApplyRange.orgId",
        op: "eq",
        value1: value1
      });
      condition.simpleVOs.push({
        field: "productId",
        op: "eq",
        value1: productId
      });
      //设置过滤条件
      this.setFilter(condition);
    });
  // 根据组织过滤物料
  gridModel
    .getEditRowModel()
    .get("matter_code_code")
    .on("beforeBrowse", function () {
      // 获取当前编辑行的品牌字段值
      let promises = [];
      let materialInfo = [];
      let value1 = viewModel.get("org_id").getValue();
      promises.push(getGSPPros(value1)); //.then((materialInfo = res) => {})
      let returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        //主要代码
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "productOrgs.orgId",
          op: "eq",
          value1: value1
        });
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: materialIds
        });
        //设置过滤条件
        this.setFilter(condition);
        returnPromise.resolve();
      });
      return returnPromise;
    });
  viewModel.get("apply_for_dept_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("apply_for_dept_name").setState("externalData", externalData);
  });
  //部门切换，或清空，清空验收员
  viewModel.get("apply_for_dept_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("applicant").setValue(null);
      viewModel.get("applicant_name").setValue(null);
    }
  });
  gridModel
    .getEditRowModel()
    .get("item168ji_product")
    .on("beforeBrowse", function () {
      let index = gridModel.getFocusedRowIndex();
      let product = gridModel.getCellValue(index, "matter_code");
      let warehouse = gridModel.getCellValue(index, "warehouse");
      if (warehouse == undefined || warehouse == null || warehouse == "") {
        cb.utils.alert("请先选择仓库", "error");
        return false;
      }
      if (product == undefined || product == "") {
        cb.utils.alert("请先选择物料", "error");
      } else {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        //是否gsp物料
        condition.simpleVOs.push({
          field: "product",
          op: "eq",
          value1: product
        });
        condition.simpleVOs.push({
          field: "warehouse",
          op: "eq",
          value1: warehouse
        });
        this.setFilter(condition);
      }
    });
  // 保存时调用页面后端函数
  viewModel.on("beforeSave", function (data) {
    var gridModelInfo = viewModel.getGridModel();
    var rowdata = [];
    // 获取各行的内容
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      var tmpobj = {
        id: gridModelInfo.getCellValue(i, "id"), //主键
        matter_code: gridModelInfo.getCellValue(i, "matter_code"), // 商品编码
        suspension_type: gridModelInfo.getCellValue(i, "suspension_type"), // 停售类型
        qty: gridModelInfo.getCellValue(i, "qty"), // 停售数量
        isGoodsPosition: gridModelInfo.getCellValue(i, "item198he"), // 是否货位管理 -仓库属性
        isBatchManage: gridModelInfo.getCellValue(i, "isBatchManage"), // 是否批次管理
        outgoodsposition: gridModelInfo.getCellValue(i, "outgoodsposition"), // 货位
        warehouse: gridModelInfo.getCellValue(i, "warehouse"), // 仓库
        sussku: gridModelInfo.getCellValue(i, "sussku"), // SKu
        batch_no: gridModelInfo.getCellValue(i, "batch_no") // 批号
      };
      rowdata.push(tmpobj); //添加行到rowdata
    }
    // 声明异步
    var returnPromise = new cb.promise();
    var param = {
      verifystate: viewModel.get("verifystate").getValue(), // 审批状态 0 开立 1审批中 2 已审批
      org_id: viewModel.get("org_id").getValue(), // 组织
      detaillist: rowdata // 表体
    };
    // 调用校验API函数
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkStopSallFormAPI", param, function (err, res) {
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
  });
  // 下推时调用后端函数校验 所有行是否都存在了下游单据
  viewModel.on("beforePush", function (args) {
    var id = viewModel.get("id").getValue();
    var code = viewModel.get("code").getValue();
    if (args.args.cSvcUrl.indexOf("targetBillNo=st_stockstatuschange") > 0) {
      var returnPromise = new cb.promise();
      var uri = "GT22176AT10.GT22176AT10.SY01_drugsuspension";
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkstoporder", { id: id, uri: uri }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.Info && res.Info.length > 0) {
          cb.utils.alert(res.Info, "error");
          return false;
        }
        returnPromise.resolve();
      });
      return returnPromise;
    }
    if (args.args.cSvcUrl.indexOf("targetBillNo=d15737c7") > 0) {
      var returnPromise = new cb.promise();
      var id = viewModel.get("id").getValue();
      var code = viewModel.get("code").getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.stopSailPushResume", { id: id, code: code }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          cb.utils.alert(res.errInfo, "error");
          return false;
        }
        returnPromise.resolve(); // 回调
      });
      return returnPromise;
    }
  });
  // 补齐物料选择后的属性
  gridModel.on("afterCellValueChange", function (data) {
    debugger;
    let rows = gridModel.getRows();
    switch (data.cellName) {
      case "matter_code_code":
        if (data.value != data.oldValue) {
          let org_id = viewModel.get("finOrg").getValue();
          let rowIndex = data.rowIndex;
          let matterId = gridModel.getCellValue(rowIndex, "matter_code");
          if (matterId == undefined) {
            break;
          }
          cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: matterId, orgId: org_id }, function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            } else if (res) {
              productInfo = res.proLicInfo;
              if (productInfo != undefined) {
                setGridMatterChange(rowIndex, productInfo);
              } else {
                gridModel.setCellValue(data.rowIndex, "productbc", ""); // 包材
                gridModel.setCellValue(data.rowIndex, "productbc_packing_name", ""); // 包材名称
                gridModel.setCellValue(data.rowIndex, "jixing", ""); // 剂型
                gridModel.setCellValue(data.rowIndex, "jixing_dosagaFormName", ""); // 剂型名称
                gridModel.setCellValue(data.rowIndex, "broad_heading", ""); // 通用名
                gridModel.setCellValue(data.rowIndex, "approval", ""); // 批准文号
                gridModel.setCellValue(data.rowIndex, "possessor", ""); // 上市许可持有人
                gridModel.setCellValue(data.rowIndex, "possessor_ip_name", ""); // 上市许可持有人姓名
                gridModel.setCellValue(data.rowIndex, "drug_address", ""); // 产地
                gridModel.setCellValue(data.rowIndex, "shengchanchangshang", ""); // 生产厂商
                gridModel.setCellValue(data.rowIndex, "standard_code", ""); // 本位码
                // 原厂字段
                gridModel.setCellValue(data.rowIndex, "expireDateNo", ""); // 保质期
                gridModel.setCellValue(data.rowIndex, "expireDateUnit", ""); // 保质单位
                gridModel.setCellValue(data.rowIndex, "isBatchManage", ""); // 是否批次管理
                gridModel.setCellValue(data.rowIndex, "isExpiryDateManage", ""); // 是否效期管理
                // 清空批次号SKU
                gridModel.setCellValue(data.rowIndex, "item168ji_batchno", ""); // 选择批号
                gridModel.setCellValue(data.rowIndex, "batch_no", ""); // 批号
                gridModel.setCellValue(data.rowIndex, "produce_time", ""); // 生产日期
                gridModel.setCellValue(data.rowIndex, "deadline_time", ""); // 保质期
              }
            }
          });
          gridModel.setCellValue(data.rowIndex, "productbc", ""); // 包材
          gridModel.setCellValue(data.rowIndex, "productbc_packing_name", ""); // 包材名称
          gridModel.setCellValue(data.rowIndex, "jixing", ""); // 剂型
          gridModel.setCellValue(data.rowIndex, "jixing_dosagaFormName", ""); // 剂型名称
          gridModel.setCellValue(data.rowIndex, "broad_heading", ""); // 通用名
          gridModel.setCellValue(data.rowIndex, "approval", ""); // 批准文号
          gridModel.setCellValue(data.rowIndex, "possessor", ""); // 上市许可持有人
          gridModel.setCellValue(data.rowIndex, "possessor_ip_name", ""); // 上市许可持有人姓名
          gridModel.setCellValue(data.rowIndex, "drug_address", ""); // 产地
          gridModel.setCellValue(data.rowIndex, "shengchanchangshang", ""); // 生产厂商
          gridModel.setCellValue(data.rowIndex, "standard_code", ""); // 本位码
          // 原厂字段
          gridModel.setCellValue(data.rowIndex, "expireDateNo", ""); // 保质期
          gridModel.setCellValue(data.rowIndex, "expireDateUnit", ""); // 保质单位
          gridModel.setCellValue(data.rowIndex, "isBatchManage", ""); // 是否批次管理
          gridModel.setCellValue(data.rowIndex, "isExpiryDateManage", ""); // 是否效期管理
          // 清空批次号SKU
          gridModel.setCellValue(data.rowIndex, "sussku", ""); // SKU
          gridModel.setCellValue(data.rowIndex, "sussku_name", ""); // SKU名称
          gridModel.setCellValue(data.rowIndex, "item135ue", ""); // SKU编码
          gridModel.setCellValue(data.rowIndex, "item168ji_batchno", ""); // 选择批号
          gridModel.setCellValue(data.rowIndex, "batch_no", ""); // 批号
          gridModel.setCellValue(data.rowIndex, "produce_time", ""); // 生产日期
          gridModel.setCellValue(data.rowIndex, "deadline_time", ""); // 保质期
        }
        break;
      case "warehouse_name":
        if (data.value != data.oldValue) {
          // 清空货位
          gridModel.setCellValue(data.rowIndex, "outgoodsposition", ""); // 货位ID
          gridModel.setCellValue(data.rowIndex, "outgoodsposition_name", ""); // 货位
          gridModel.setCellValue(data.rowIndex, "item269ui", ""); // 货位编码
          // 清空批次号
        }
        break;
      case "sussku_name":
        if (data.value != data.oldValue) {
          // 清空批次号
          gridModel.setCellValue(data.rowIndex, "item168ji_batchno", ""); // 选择批号
          gridModel.setCellValue(data.rowIndex, "batch_no", ""); // 批号
          gridModel.setCellValue(data.rowIndex, "produce_time", ""); // 生产日期
          gridModel.setCellValue(data.rowIndex, "deadline_time", ""); // 保质期
          let org_id = viewModel.get("finOrg").getValue();
          let rowIndex = data.rowIndex;
          let id = data.value.id;
          let matterId = gridModel.getCellValue(rowIndex, "matter_code");
          debugger;
          if (id == undefined) {
            id = matterId;
          }
          cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: matterId, orgId: org_id, isSku: true, skuId: id }, function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            } else if (res) {
              let productInfo = res.proLicInfo;
              if (productInfo == undefined) {
                cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: matterId, orgId: org_id }, function (err, res) {
                  if (err) {
                    cb.utils.alert(err.message, "error");
                    return false;
                  } else if (res) {
                    productInfo = res.proLicInfo;
                    if (productInfo != undefined) {
                      setGridMatterChange(rowIndex, productInfo);
                    } else {
                      gridModel.setCellValue(data.rowIndex, "productbc", ""); // 包材
                      gridModel.setCellValue(data.rowIndex, "productbc_packing_name", ""); // 包材名称
                      gridModel.setCellValue(data.rowIndex, "jixing", ""); // 剂型
                      gridModel.setCellValue(data.rowIndex, "jixing_dosagaFormName", ""); // 剂型名称
                      gridModel.setCellValue(data.rowIndex, "broad_heading", ""); // 通用名
                      gridModel.setCellValue(data.rowIndex, "approval", ""); // 批准文号
                      gridModel.setCellValue(data.rowIndex, "possessor", ""); // 上市许可持有人
                      gridModel.setCellValue(data.rowIndex, "possessor_ip_name", ""); // 上市许可持有人姓名
                      gridModel.setCellValue(data.rowIndex, "drug_address", ""); // 产地
                      gridModel.setCellValue(data.rowIndex, "shengchanchangshang", ""); // 生产厂商
                      gridModel.setCellValue(data.rowIndex, "standard_code", ""); // 本位码
                      // 原厂字段
                      gridModel.setCellValue(data.rowIndex, "expireDateNo", ""); // 保质期
                      gridModel.setCellValue(data.rowIndex, "expireDateUnit", ""); // 保质单位
                      gridModel.setCellValue(data.rowIndex, "isBatchManage", ""); // 是否批次管理
                      gridModel.setCellValue(data.rowIndex, "isExpiryDateManage", ""); // 是否效期管理
                      // 清空批次号SKU
                      gridModel.setCellValue(data.rowIndex, "item168ji_batchno", ""); // 选择批号
                      gridModel.setCellValue(data.rowIndex, "batch_no", ""); // 批号
                      gridModel.setCellValue(data.rowIndex, "produce_time", ""); // 生产日期
                      gridModel.setCellValue(data.rowIndex, "deadline_time", ""); // 保质期
                    }
                  }
                });
              } else {
                setGridMatterChange(rowIndex, productInfo);
              }
            }
          });
        }
        break;
      case "item168ji_product":
        debugger;
        if (data.value.producedate != undefined) {
          gridModel.setCellValue(data.rowIndex, "produce_time", toDate(data.value.producedate));
        }
        if (data.value.invaliddate != undefined) {
          gridModel.setCellValue(data.rowIndex, "deadline_time", toDate(data.value.invaliddate));
        }
        break;
      case "item168ji_batchno":
        debugger;
        try {
          if (gridModel.getCellValue(data.rowIndex, "produce_time") != undefined) {
            gridModel.setCellValue(data.rowIndex, "produce_time", toDate(gridModel.getCellValue(data.rowIndex, "produce_time")));
          }
          if (gridModel.getCellValue(data.rowIndex, "deadline_time") != undefined) {
            gridModel.setCellValue(data.rowIndex, "deadline_time", toDate(gridModel.getCellValue(data.rowIndex, "deadline_time")));
          }
        } catch (e) {}
        break;
    }
  });
  function toDate(time) {
    var now = new Date(time),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
  }
  function setGridMatterChange(rowIndex, productInfo) {
    gridModel.setCellValue(rowIndex, "productbc", productInfo.packingMaterial); // 包材
    gridModel.setCellValue(rowIndex, "productbc_packing_name", productInfo.packingMaterialName); // 包材名称
    gridModel.setCellValue(rowIndex, "jixing", productInfo.dosageForm); // 剂型
    gridModel.setCellValue(rowIndex, "jixing_dosagaFormName", productInfo.dosageFormName); // 剂型名称
    gridModel.setCellValue(rowIndex, "broad_heading", productInfo.commonNme); // 通用名
    gridModel.setCellValue(rowIndex, "approval", productInfo.approvalNumber); // 批准文号
    gridModel.setCellValue(rowIndex, "possessor", productInfo.listingHolder); // 上市许可持有人
    gridModel.setCellValue(rowIndex, "possessor_ip_name", productInfo.listingHolderName); // 上市许可持有人姓名
    gridModel.setCellValue(rowIndex, "drug_address", productInfo.producingArea); // 产地
    gridModel.setCellValue(rowIndex, "shengchanchangshang", productInfo.manufacturer); // 生产厂商
    gridModel.setCellValue(rowIndex, "standard_code", productInfo.standardCode); // 本位码
    // 原厂字段
    gridModel.setCellValue(rowIndex, "expireDateNo", productInfo.expireDateNo); // 保质期
    gridModel.setCellValue(rowIndex, "expireDateUnit", productInfo.expireDateUnit); // 保质单位
    gridModel.setCellValue(rowIndex, "isBatchManage", productInfo.isBatchManage == true || productInfo.isBatchManage == "1" ? "1" : "0"); // 是否批次管理
    gridModel.setCellValue(rowIndex, "isExpiryDateManage", productInfo.isExpiryDateManage == true || productInfo.isExpiryDateManage == "1" ? "1" : "0"); // 是否效期管理
    // 清空批次号
    gridModel.setCellValue(rowIndex, "item168ji_batchno", ""); // 选择批号
    gridModel.setCellValue(rowIndex, "batch_no", ""); // 批号
    gridModel.setCellValue(rowIndex, "produce_time", ""); // 生产日期
    gridModel.setCellValue(rowIndex, "deadline_time", ""); // 保质期
  }
  // 根据是否批次管理判断批号是否可以编辑
  gridModel.on("rowColChange", function (args) {
    var rowIndex = args.value.rowIndex;
    if (args.value.columnKey == "item168ji_batchno") {
      //批次号管理，判断是否批次管理处理是否可以编辑
      var canbEdit = gridModel.getCellValue(rowIndex, "isBatchManage");
      if (canbEdit == true || canbEdit == "1") {
        return true;
      } else {
        return false;
      }
    }
    // 根据是否货位管理 设置货位可以编辑
    if (args.value.columnKey == "outgoodsposition_name") {
      var canbEdit = gridModel.getCellValue(rowIndex, "item198he");
      if (canbEdit == true || canbEdit == "1") {
        return true;
      } else {
        return false;
      }
    }
  });
  // 页面部门、员工默认赋值当前登录人
  viewModel.on("afterLoadData", function (args) {
    viewModel.on("modeChange", function (data) {
      let user = viewModel.get("applicant").getValue();
      if ((data === "add" || data === "edit") && (user == "" || user == null)) {
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("applicant").setValue(res.staffOfCurrentUser.id);
            viewModel.get("applicant_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("apply_for_dept").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("apply_for_dept_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  function getGSPPros(orgid) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProListGsp", { orgId: orgid }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
        } else {
          materialIds = res.materialListRes;
          resolve(materialIds);
        }
      });
    });
  }
});