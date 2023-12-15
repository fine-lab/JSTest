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
  viewModel.on("afterLoadData", function (data) {
    if (viewModel.getParams().mode != "add") {
      return;
    }
    let rows = gridModel.getRows();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].manufacture_date != undefined) {
        let productDate = new Date(rows[i].manufacture_date);
        if (!(productDate instanceof Date && !isNaN(productDate.getTime()))) {
          productDate = new Date(parseInt(rows[i].manufacture_date));
        }
        gridModel.setCellValue(i, "manufacture_date", parseDate(productDate));
      }
      if (rows[i].due_date != undefined) {
        let expireDate = new Date(rows[i].due_date);
        if (!(expireDate instanceof Date && !isNaN(expireDate.getTime()))) {
          expireDate = new Date(parseInt(rows[i].due_date));
        }
        gridModel.setCellValue(i, "due_date", parseDate(expireDate));
      }
    }
  });
  viewModel.get("org_id_name").on("afterValueChange", function (args) {
    let orgId = viewModel.get("org_id").getValue();
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
            let proCode = [];
            for (let i = 0; i < data.length; i++) {
              proCode.push(data[i].productId_code);
            }
            let condition = {
              isExtend: true,
              simpleVOs: []
            };
            condition.simpleVOs.push(
              {
                field: "code",
                op: "in",
                value1: proCode
              },
              {
                field: "productApplyRange.productDetailId.stopstatus",
                op: "in",
                value1: 0
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
  gridModel
    .getEditRowModel()
    .get("commodity_code_code")
    .on("afterValueChange", function (data) {
      let index = gridModel.getFocusedRowIndex();
      //商品ID
      let materialId = gridModel.getEditRowModel().get("commodity_code").getValue();
      if (typeof materialId == "undefined" || materialId == "") {
        gridModel.setCellValue(index, "commodity_name", ""); //物料名称
        gridModel.setCellValue(index, "model", ""); //规格型号
        gridModel.setCellValue(index, "common_name", ""); //通用名
        gridModel.setCellValue(index, "dosage", ""); //剂型ID
        gridModel.setCellValue(index, "dosage_dosagaFormName", ""); //剂型名称
        gridModel.setCellValue(index, "manufacturer", ""); //生成厂家
        gridModel.setCellValue(index, "origin", ""); //产地
        gridModel.setCellValue(index, "holder", ""); //上市许可人ID
        gridModel.setCellValue(index, "holder_ip_name", ""); //上市许可人名称
        gridModel.setCellValue(index, "approval_caode", ""); //批准文号
        gridModel.setCellValue(index, "company", ""); //单位ID
        gridModel.setCellValue(index, "company_name", ""); //单位名称
        gridModel.setCellValue(index, "bc", ""); //包材ID
        gridModel.setCellValue(index, "bc_packing_name", ""); //包材名称
        gridModel.setCellValue(index, "curing_category", ""); //养护类别ID
        gridModel.setCellValue(index, "curing_category_curingTypeName", ""); //养护类别名称
        gridModel.setCellValue(index, "item155bj", ""); //批号选择ID
        gridModel.setCellValue(index, "item155bj_batchno", ""); //批号选择名称
        gridModel.setCellValue(index, "batch", ""); //批号ID
        gridModel.setCellValue(index, "batch_batchno", ""); //批号名称
        gridModel.setCellValue(index, "batch_code", ""); //批次号
        gridModel.setCellValue(index, "warehouse", ""); //仓库ID
        gridModel.setCellValue(index, "warehouse_name", ""); //仓库名称
        gridModel.setCellValue(index, "position", ""); //仓库ID
        gridModel.setCellValue(index, "position_name", ""); //仓库名称
        gridModel.setCellValue(index, "plan_number", ""); //计划养护数量
        gridModel.setCellValue(index, "stock", ""); //库存合格数量
        gridModel.setCellValue(index, "stock_state", ""); //库存状态ID
        gridModel.setCellValue(index, "stock_state_name", ""); //库存状态名称
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProductDetail",
        {
          materialId: materialId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let merchantInfo = res.merchantInfo;
            if (typeof merchantInfo != "undefined") {
              gridModel.setCellValue(index, "commodity_name", merchantInfo.name); //物料名称
              gridModel.setCellValue(index, "model", merchantInfo.modelDescription); //规格型号
              gridModel.setCellValue(index, "common_name", merchantInfo.extend_tym); //通用名
              gridModel.setCellValue(index, "dosage", merchantInfo.extend_jx); //剂型ID
              gridModel.setCellValue(index, "dosage_dosagaFormName", merchantInfo.extend_jx_dosagaFormName); //剂型名称
              gridModel.setCellValue(index, "manufacturer", merchantInfo.manufacturer); //生成厂家
              gridModel.setCellValue(index, "origin", merchantInfo.placeOfOrigin); //产地
              gridModel.setCellValue(index, "holder", merchantInfo.extend_ssxkcyr); //上市许可人ID
              gridModel.setCellValue(index, "holder_ip_name", merchantInfo.extend_ssxkcyr_ip_name); //上市许可人名称
              gridModel.setCellValue(index, "approval_caode", merchantInfo.extend_pzwh); //批准文号
              gridModel.setCellValue(index, "company", merchantInfo.unit); //单位ID
              gridModel.setCellValue(index, "company_name", merchantInfo.unit_Name); //单位名称
              gridModel.setCellValue(index, "bc", merchantInfo.extend_bc); //包材ID
              gridModel.setCellValue(index, "bc_packing_name", merchantInfo.extend_bc_packing_name); //包材名称
              gridModel.setCellValue(index, "curing_category", merchantInfo.extend_yhlb); //养护类别ID
              gridModel.setCellValue(index, "curing_category_curingTypeName", merchantInfo.extend_yhlb_curingTypeName); //养护类别名称
              console.log(merchantInfo);
            }
          }
        }
      );
    });
  gridModel
    .getEditRowModel()
    .get("batch_batchno")
    .on("beforeBrowse", function () {
      let index = gridModel.getFocusedRowIndex();
      let product = gridModel.getCellValue(index, "commodity_code");
      let orgId = viewModel.get("org_id").getValue();
      let warehouse = gridModel.getCellValue(index, "warehouse");
      let position = gridModel.getCellValue(index, "position");
      if (product == undefined) {
        cb.utils.alert("请先选择物料", "error");
        return false;
      } else if (warehouse == undefined) {
        cb.utils.alert("请先选择仓库", "error");
        return false;
      } else {
        if (position == null || position == undefined) {
          //货位为空的时候判断仓库是否开启货位管理
          let returnPromise = new cb.promise();
          queryGoodsWh(warehouse).then((res) => {
            if (res == "1") {
              cb.utils.alert("请先选择货位", "error");
              returnPromise.reject();
            }
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
              },
              {
                field: "warehouse",
                op: "eq",
                value1: warehouse
              }
            );
            this.setFilter(condition);
            returnPromise.resolve();
          });
          return returnPromise;
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
            },
            {
              field: "warehouse",
              op: "eq",
              value1: warehouse
            }
          );
          this.setFilter(condition);
        }
      }
    });
  gridModel
    .getEditRowModel()
    .get("batch_batchno")
    .on("afterValueChange", function (data) {
      let index = gridModel.getFocusedRowIndex();
      let sourcechild_id = gridModel.getCellValue(index, "sourcechild_id");
      if (typeof sourcechild_id == "undefined" || sourcechild_id == "") {
        let product = gridModel.getCellValue(index, "commodity_code");
        let batchId = gridModel.getCellValue(index, "batch");
        let batch_code = gridModel.getCellValue(index, "batch_code");
        let warehouse = gridModel.getCellValue(index, "warehouse");
        let position = gridModel.getCellValue(index, "position");
        //格式化生产日期有效期至
        if (data.value[0].producedate != undefined) {
          gridModel.setCellValue(index, "manufacture_date", getDate(data.value[0].producedate));
        }
        if (data.value[0].invaliddate != undefined) {
          gridModel.setCellValue(index, "due_date", getDate(data.value[0].invaliddate));
        }
        if (typeof product != "undefined" && typeof batch_code != "undefined" && typeof warehouse != "undefined") {
          var promise = new cb.promise();
          cb.rest.invokeFunction(
            "GT22176AT10.backDefaultGroup.getQtyCountByBatch",
            {
              batchId: batchId,
              batchno: batch_code,
              p_id: product,
              warehouse: warehouse,
              position: position,
              proSKU: null
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
                  }
                }
              }
            }
          );
        }
      }
    });
  gridModel
    .getEditRowModel()
    .get("item155bj_batchno")
    .on("afterValueChange", function () {
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
  function queryGoodsWh(warehouseId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.queryGoodsWh", { warehouseId: warehouseId }, function (err, res) {
        if (typeof res != "undefined") {
          if (res.goodsWarehouse.length > 0) {
            resolve("1");
          } else {
            resolve("2");
          }
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  }
  let selectMerchandise = function (orgId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          let resInfo = res.res;
          data = JSON.parse(resInfo).data.recordList;
          resolve(data);
        } else if (typeof err != "undefined") {
          reject(err);
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
  let parseDate = function (date) {
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
  };
};