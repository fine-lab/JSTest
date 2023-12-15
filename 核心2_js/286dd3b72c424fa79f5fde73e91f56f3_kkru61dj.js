run = function (event) {
  var viewModel = this;
  let gridModel = viewModel.getGridModel("SY01_commodity_infoList");
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      //获取当前用户对应的员工，赋值给复核人员
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getStaffOfCurUser",
        {
          mainOrgId: viewModel.get("org_id").getValue()
        },
        function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("personnel_yh").setValue(res.staffOfCurrentUser.id);
            viewModel.get("personnel_yh_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("department_yh").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("department_yh_name").setValue(res.staffOfCurrentUser.deptName);
          }
        }
      );
    }
  });
  viewModel.get("org_id_name").on("afterValueChange", function (args) {
    debugger;
    let orgId = viewModel.get("org_id").getValue();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getOrgInfo", { orgId: orgId }, function (err, res) {
      if (res != undefined && res.financeOrginfo != undefined) {
        viewModel.get("kjzt").setValue(res.financeOrginfo.id);
        viewModel.get("kjzt_name").setValue(res.financeOrginfo.name.zh_CN);
      }
    });
    //获取当前用户对应的员工，赋值给复核人员
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: orgId }, function (err, res) {
      if (res != undefined && res.staffOfCurrentUser != undefined) {
        viewModel.get("personnel_yh").setValue(res.staffOfCurrentUser.id);
        viewModel.get("personnel_yh_name").setValue(res.staffOfCurrentUser.name);
        viewModel.get("department_yh").setValue(res.staffOfCurrentUser.deptId);
        viewModel.get("department_yh_name").setValue(res.staffOfCurrentUser.deptName);
      }
    });
  });
  viewModel.on("afterMount", function () {
    //通过过滤养护类型选择物料
    viewModel.get("personnel_yh_name").on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "mainJobList.org_id",
        op: "eq",
        value1: orgId
      });
      //设置过滤条件
      this.setFilter(condition);
    });
    gridModel
      .getEditRowModel()
      .get("warehouse_name")
      .on("beforeBrowse", function (data) {
        let orgId = viewModel.get("org_id").getValue();
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "org",
          op: "eq",
          value1: orgId
        });
        //设置过滤条件
        this.setFilter(condition);
      });
    gridModel
      .getEditRowModel()
      .get("proSkuCode_code")
      .on("beforeBrowse", function (data) {
        let orgId = viewModel.get("org_id").getValue();
        let authProduct = gridModel.getEditRowModel().get("commodity_code").getValue();
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push(
          {
            field: "productId",
            op: "eq",
            value1: authProduct
          },
          {
            field: "productId.productApplyRange.orgId",
            op: "eq",
            value1: orgId
          }
        );
        this.setFilter(condition);
      });
    gridModel
      .getEditRowModel()
      .get("position_name")
      .on("beforeBrowse", function (data) {
        let warehouse = gridModel.getEditRowModel().get("warehouse").getValue();
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "warehouseId",
          op: "eq",
          value1: warehouse
        });
        //设置过滤条件
        this.setFilter(condition);
      });
    gridModel
      .getEditRowModel()
      .get("commodity_code_code")
      .on("beforeBrowse", function (data) {
        let orgId = viewModel.get("org_id").getValue();
        let returnPromise = new cb.promise();
        selectMerchandise(orgId).then(
          (data) => {
            let condition = {
              isExtend: true,
              simpleVOs: []
            };
            condition.simpleVOs.push(
              {
                field: "id",
                op: "in",
                value1: data
              },
              {
                field: "productApplyRange.productDetailId.stopstatus",
                op: "in",
                value1: 0
              },
              {
                field: "isDeleted",
                op: "in",
                value1: [0, "0", false, "false"]
              }
            );
            this.setFilter(condition);
            returnPromise.resolve();
          },
          (err) => {
            cb.utils.alert(err, "error");
            returnPromise.reject();
          }
        );
        return returnPromise;
      });
  });
  gridModel.on("afterCellValueChange", function (args) {
    let errorMsg = "";
    let promises = [];
    let cellName = args.cellName;
    let rowIndex = args.rowIndex;
    let rows = gridModel.getRows();
    var row = rows[rowIndex];
    let orgId = viewModel.get("org_id").getValue();
    if (cellName == "commodity_code_code" || cellName == "commodity_code_code") {
      debugger;
      gridModel.setCellValue(rowIndex, "commodity_name", ""); //物料名称
      gridModel.setCellValue(rowIndex, "model", ""); //规格型号
      gridModel.setCellValue(rowIndex, "common_name", ""); //通用名
      gridModel.setCellValue(rowIndex, "dosage", ""); //剂型ID
      gridModel.setCellValue(rowIndex, "dosage_dosagaFormName", ""); //剂型名称
      gridModel.setCellValue(rowIndex, "manufacturer", ""); //生成厂家
      gridModel.setCellValue(rowIndex, "origin", ""); //产地
      gridModel.setCellValue(rowIndex, "holder", ""); //上市许可人ID
      gridModel.setCellValue(rowIndex, "holder_ip_name", ""); //上市许可人名称
      gridModel.setCellValue(rowIndex, "approval_caode", ""); //批准文号
      gridModel.setCellValue(rowIndex, "company", ""); //单位ID
      gridModel.setCellValue(rowIndex, "company_name", ""); //单位名称
      gridModel.setCellValue(rowIndex, "bc", ""); //包材ID
      gridModel.setCellValue(rowIndex, "bc_packing_name", ""); //包材名称
      gridModel.setCellValue(rowIndex, "curing_category", ""); //养护类别ID
      gridModel.setCellValue(rowIndex, "curing_category_curingTypeName", ""); //养护类别名称
      gridModel.setCellValue(rowIndex, "item155bj", ""); //批号选择ID
      gridModel.setCellValue(rowIndex, "item155bj_batchno", ""); //批号选择名称
      gridModel.setCellValue(rowIndex, "batch", ""); //批号ID
      gridModel.setCellValue(rowIndex, "batch_batchno", ""); //批号名称
      gridModel.setCellValue(rowIndex, "batch_code", ""); //批次号
      gridModel.setCellValue(rowIndex, "warehouse", ""); //仓库ID
      gridModel.setCellValue(rowIndex, "warehouse_name", ""); //仓库名称
      gridModel.setCellValue(rowIndex, "position", ""); //仓库ID
      gridModel.setCellValue(rowIndex, "position_name", ""); //仓库名称
      gridModel.setCellValue(rowIndex, "plan_number", ""); //计划养护数量
      gridModel.setCellValue(rowIndex, "stock", ""); //库存合格数量
      gridModel.setCellValue(rowIndex, "stock_state", ""); //库存状态ID
      gridModel.setCellValue(rowIndex, "stock_state_name", ""); //库存状态名称
      let productId = args.value.id;
      let product_name = args.value.cName;
      if (productId != null && typeof productId != "undefined") {
        var promise = new cb.promise();
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: productId, orgId: orgId }, function (err, res) {
          if (typeof res != "undefined") {
            let productInfo = res.proLicInfo;
            if (typeof productInfo != "undefined") {
              gridModel.setCellValue(rowIndex, "commodity_name", args.value.name); //物料名称
              gridModel.setCellValue(rowIndex, "model", args.value.modelDescription); //规格型号
              gridModel.setCellValue(rowIndex, "common_name", productInfo.commonNme); //通用名
              gridModel.setCellValue(rowIndex, "dosage", productInfo.dosageForm); //剂型ID
              gridModel.setCellValue(rowIndex, "dosage_dosagaFormName", productInfo.dosageFormName); //剂型名称
              gridModel.setCellValue(rowIndex, "manufacturer", productInfo.manufacturer); //生成厂家
              gridModel.setCellValue(rowIndex, "origin", productInfo.producingArea); //产地
              gridModel.setCellValue(rowIndex, "holder", productInfo.listingHolder); //上市许可人ID
              gridModel.setCellValue(rowIndex, "holder_ip_name", productInfo.listingHolderName); //上市许可人名称
              gridModel.setCellValue(rowIndex, "approval_caode", productInfo.approvalNumber); //批准文号
              gridModel.setCellValue(rowIndex, "company", args.value.oUnitId); //单位ID
              gridModel.setCellValue(rowIndex, "company_name", args.value.unitName); //单位名称
              gridModel.setCellValue(rowIndex, "bc", productInfo.packingMaterial); //包材ID
              gridModel.setCellValue(rowIndex, "bc_packing_name", productInfo.packingMaterialName); //包材名称
              gridModel.setCellValue(rowIndex, "curing_category", productInfo.curingType); //养护类别ID
              gridModel.setCellValue(rowIndex, "curing_category_curingTypeName", productInfo.curingTypeName); //养护类别名称
              gridModel.setCellValue(rowIndex, "isBatchManage", productInfo.isBatchManage); //批次管理
              gridModel.setCellValue(rowIndex, "isExpiryDateManage", productInfo.isExpiryDateManage); //效期
            }
          }
        });
      }
    }
  });
  gridModel
    .getEditRowModel()
    .get("item155bj_batchno")
    .on("beforeBrowse", function () {
      let index = gridModel.getFocusedRowIndex();
      let product = gridModel.getCellValue(index, "commodity_code");
      let warehouse = gridModel.getEditRowModel().get("warehouse").getValue();
      let orgId = viewModel.get("org_id").getValue();
      if (product == undefined) {
        cb.utils.alert("请先选择物料", "error");
      } else {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        //是否gsp物料
        condition.simpleVOs.push(
          {
            field: "product",
            op: "eq",
            value1: product
          },
          {
            field: "org",
            op: "eq",
            value1: orgId
          }
        );
        this.setFilter(condition);
      }
    });
  gridModel
    .getEditRowModel()
    .get("item155bj_batchno")
    .on("afterValueChange", function () {
      let index = gridModel.getFocusedRowIndex();
      let sourcechild_id = gridModel.getCellValue(index, "sourcechild_id");
      if (typeof sourcechild_id == "undefined" || sourcechild_id == "") {
        let product = gridModel.getCellValue(index, "commodity_code");
        let batchId = gridModel.getCellValue(index, "batch");
        let batch_code = gridModel.getCellValue(index, "batch_code");
        let warehouse = gridModel.getCellValue(index, "warehouse");
        if (typeof product != "undefined" && typeof batch_code != "undefined" && typeof warehouse != "undefined") {
          var promise = new cb.promise();
          cb.rest.invokeFunction(
            "GT22176AT10.backDefaultGroup.getQtyCountByBatch",
            {
              batchId: batchId,
              batchno: batch_code,
              p_id: product,
              warehouse: warehouse
            },
            function (err, res) {
              if (typeof res != "undefined") {
                console.log(res);
                let sccess_info = res.sccess_info;
                if (sccess_info.length < 1) {
                  cb.utils.alert("该批次没有合格的物料,无法生产养护计划");
                  gridModel.setCellValue(index, "batch", "");
                  gridModel.setCellValue(index, "batch_batchno", "");
                  gridModel.setCellValue(index, "batch_code", "");
                  gridModel.setCellValue(index, "stock_state_name", "");
                  gridModel.setCellValue(index, "stock_state", "");
                  gridModel.setCellValue(index, "stock_state_name", "");
                  gridModel.setCellValue(index, "item155bj", "");
                  gridModel.setCellValue(index, "item155bj_batchno", "");
                  gridModel.setCellValue(index, "manufacture_date", undefined);
                  gridModel.setCellValue(index, "due_date", undefined);
                  return false;
                } else if (sccess_info.length > 0) {
                  for (let i = 0; i < sccess_info.length; i++) {
                    gridModel.setCellValue(index, "stock_state", sccess_info[i].statusId);
                    gridModel.setCellValue(index, "stock_state_name", sccess_info[i].statusName);
                    gridModel.setCellValue(index, "plan_number", sccess_info[i].currentqty);
                    gridModel.setCellValue(index, "stock", sccess_info[i].currentqty);
                    gridModel.setCellValue(index, "manufacture_date", getDate(sccess_info[i].manufacture_date));
                    gridModel.setCellValue(index, "due_date", getDate(sccess_info[i].due_date));
                  }
                }
              }
            }
          );
        }
      }
    });
  //保存前校验
  viewModel.on("beforeSave", function (data) {
    let productId = {}; //获取商品ID
    let planNumber = {}; //计划数量
    let warehouse = {}; //仓库ID
    let batchNo = {}; //批次号
    let curPlanId = [];
    let planDate = viewModel.get("plan_date").getValue(); //计划日期
    let curingtypeId = viewModel.get("curingtype").getValue(); //养护类别ID
    let errorMsg = "";
    let handerMessage = (n) => (errorMsg += n);
    for (var i = 0; i < gridModel.getRows().length; i++) {
      //养护计划子表ID
      let mainprocChildId = gridModel.getCellValue(i, "id");
      curPlanId.push(mainprocChildId);
      //养护计划商品ID
      let commodity_code = gridModel.getCellValue(i, "commodity_code");
      productId[mainprocChildId] = commodity_code;
      //仓库ID
      let warehouseId = gridModel.getCellValue(i, "warehouse");
      warehouse[mainprocChildId] = warehouseId;
      //批次号
      let batch_code = gridModel.getCellValue(i, "batch_code");
      batchNo[mainprocChildId] = batch_code;
      //计划数量
      let plan_number = parseFloat(gridModel.getCellValue(i, "plan_number"));
      planNumber[mainprocChildId] = plan_number;
      //关联在库养护计划数量
      let relateCuringPlanNum = parseFloat(gridModel.getCellValue(i, "glzkyhsl"));
      if (planNumber <= 0) {
        errorMsg += "第" + (i + 1) + "行数据 数量不能 <= 0\n";
        cb.utils.alert(errorMsg);
        return false;
      } else {
        if (planNumber <= relateCuringPlanNum) {
          errorMsg += "第" + (i + 1) + "行数据 计划养护数量 <= 关联在库养护计划数量,请重新填写 \n ";
          cb.utils.alert(errorMsg);
          return false;
        }
      }
    }
  });
  //下推前校验
  viewModel.on("beforePush", function (data) {
    let planCuringObj = {};
    let planCuringArr = [];
    let verifystate = viewModel.get("verifystate").getValue();
    if (verifystate == 2) {
      let id = viewModel.get("id").getValue(); //主表ID
      for (let i = 0; i < gridModel.getRows().length; i++) {
        //养护计划子表ID
        let mainprocChildId = gridModel.getCellValue(i, "id");
        //计划数量
        let plan_number = parseFloat(gridModel.getCellValue(i, "plan_number"));
        //关联在库养护计划数量
        let relateCuringPlanNum = parseFloat(gridModel.getCellValue(i, "glzkyhsl"));
        //剩余可生成养护计划数量
        let surPlanCuringQty = parseFloat(plan_number - relateCuringPlanNum);
        planCuringObj[mainprocChildId] = surPlanCuringQty;
        planCuringArr.push(planCuringObj);
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.proCurPlanPushCheck",
        {
          id: id,
          planCuringArr: planCuringArr
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
      return promise;
    } else {
      let errInfo = "该单据未审核,下推失败";
      cb.utils.alert(errInfo);
      return false;
    }
  });
  let selectMerchandise = function (orgId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined" && typeof res.huopinIds != "undefined") {
          data = res.huopinIds;
          resolve(data);
        } else if (typeof err != "undefined") {
          cb.utils.alert(err);
        }
      });
    });
  };
  viewModel.on("modeChange", function (data) {
    let childData = gridModel.getRows();
    if (data == "edit" || data == "browse") {
      gridModel.setState("batch_batchno", false);
      for (let i = 0; i < childData.length; i++) {
        let lotId = gridModel.getCellValue(i, "batch");
        let lotCode = gridModel.getCellValue(i, "batch_code");
        gridModel.setCellValue(i, "item155bj", lotId);
        gridModel.setCellValue(i, "item155bj_batchno", lotCode);
      }
    } else if (data == "browse") {
      gridModel.get("item155bj_batchno").setState("batch_batchno", false);
      gridModel.get("batch_batchno").setState("item155bj_batchno", true);
    } else if (data == "add") {
      gridModel.setState("item155bj_batchno", true);
      gridModel.setState("batch_batchno", false);
    }
  });
  function getDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
};