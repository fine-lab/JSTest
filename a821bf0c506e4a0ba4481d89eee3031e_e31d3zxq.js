viewModel.on("customInit", function (data) {
  viewModel.on("afterMount", function () {
    viewModel.get("btnBizFlowPush").on("beforeClick", function () {
      let verifystate = viewModel.get("verifystate").getValue;
      console.log("verifystate>>>>>>>" + verifystate);
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.documentType",
        {
          verifystate: verifystate
        },
        function (err, res) {
          console.log(res.errCode);
          switch (res.errCode) {
            case "1001":
              cb.utils.alert(res.msg);
              break;
            default:
          }
        }
      );
    });
  });
  let mainprocSonList = viewModel.get("SY01_mainproco_sonList");
  viewModel.get("org_id_name").on("afterValueChange", function (args) {
    viewModel.on("modeChange", function (data) {
      if (data === "add") {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("curing_man").setValue(res.staffOfCurrentUser.id);
            viewModel.get("curing_man_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("curing_dept").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("curing_dept_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  viewModel.get("org_id").on("afterValueChange", function (data) {
    if (data === "add") {
      //获取当前用户对应的员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("curing_man").setValue(res.staffOfCurrentUser.id);
          viewModel.get("curing_man_name").setValue(res.staffOfCurrentUser.name);
          viewModel.get("curing_dept").setValue(res.staffOfCurrentUser.deptId);
          viewModel.get("curing_dept_name").setValue(res.staffOfCurrentUser.deptName);
        }
      });
    }
  });
  viewModel.get("warehouse_name") &&
    viewModel.get("warehouse_name").on("beforeBrowse", function (data) {
      // 仓库--参照弹窗打开前
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
      this.setFilter(condition);
    });
  //选择仓库后
  viewModel.get("warehouse_name").on("afterValueChange", function (data) {
    if (data.oldValue != null && data.oldValue.id != data.value.id) {
      viewModel.getGridModel("SY01_mainproco_sonList").clear();
      viewModel.getGridModel("curing_filter_scheme").clear();
      viewModel.getGridModel("curing_filter_scheme_name").clear();
    }
  });
  //选择养护过滤方案后
  viewModel.get("curing_filter_scheme_name").on("afterValueChange", function (data) {
    //根据养护过滤方案查询重点商品养护明细
    let sonTable = viewModel.getGridModel("SY01_mainproco_sonList");
    sonTable.deleteAllRows();
    let param = { filterSchemeId: data.value.id, warehouseId: viewModel.get("warehouse").getValue(), tenantId: data.value.tenant_id, orgId: viewModel.get("finOrg").getValue() };
    param.warehouseName = viewModel.get("warehouse_name").getValue();
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getMainprocoSon", param, function (err, res) {
      if (res != undefined && res.result != undefined) {
        let sonList = res.result;
        for (let i = 0; i < sonList.length; i++) {
          sonList[i].produce_date_show = dateFormat(sonList[i].produce_date_show, "yyyy-MM-dd");
          sonList[i].valid_until_show = dateFormat(sonList[i].valid_until_show, "yyyy-MM-dd");
          delete sonList[i].id;
          if (sonList[i].hasOwnProperty("features")) {
            delete sonList[i].features.id;
          }
        }
        sonTable.setDataSource(sonList);
      } else if (err !== null) {
        cb.utils.alert(err, "error");
      }
    });
  });
  //选择养护过滤方案前
  viewModel.get("curing_filter_scheme_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let warehouse = viewModel.get("warehouse").getValue();
    if (warehouse === "" || typeof warehouse == "undefined") {
      cb.utils.alert("请先选择仓库");
      return false;
    }
    //限制为启用
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "enable",
      op: "eq",
      value1: 1
    });
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: orgId
    });
    condition.simpleVOs.push({
      field: "dr",
      op: "eq",
      value1: "0"
    });
    this.setFilter(condition);
  });
  viewModel.get("curing_man_name").on("beforeBrowse", function () {
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
    this.setFilter(condition);
  });
  mainprocSonList
    .getEditRowModel()
    .get("product_code_materialCode")
    .on("afterValueChange", function (data) {
      let index = mainprocSonList.getFocusedRowIndex();
      //商品ID
      let materialId = mainprocSonList.getEditRowModel().get("product_code").getValue();
      let orgId = viewModel.get("org_id").getValue();
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProductDetail",
        {
          materialId: materialId,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let merchantInfo = res.merchantInfo;
            if (typeof merchantInfo != "undefined") {
              mainprocSonList.setCellValue(index, "product_name", merchantInfo.name); //物料名称
              mainprocSonList.setCellValue(index, "specification", merchantInfo.modelDescription); //规格型号
              mainprocSonList.setCellValue(index, "produc_name", merchantInfo.extend_tym); //通用名
              mainprocSonList.setCellValue(index, "dosage_form", merchantInfo.extend_jx); //剂型ID
              mainprocSonList.setCellValue(index, "dosage_form_dosagaFormName", merchantInfo.extend_jx_dosagaFormName); //剂型名称
              mainprocSonList.setCellValue(index, "manufacturer", merchantInfo.manufacturer); //生成厂家
              mainprocSonList.setCellValue(index, "origin_place", merchantInfo.placeOfOrigin); //产地
              mainprocSonList.setCellValue(index, "license_holder", merchantInfo.extend_ssxkcyr); //上市许可人ID
              mainprocSonList.setCellValue(index, "license_holder_ip_name", merchantInfo.extend_ssxkcyr_ip_name); //上市许可人名称
              mainprocSonList.setCellValue(index, "approval_number", merchantInfo.extend_pzwh); //批准文号
              mainprocSonList.setCellValue(index, "product_unit", merchantInfo.unit); //单位ID
              mainprocSonList.setCellValue(index, "product_unit_name", merchantInfo.unit_Name); //单位名称
              mainprocSonList.setCellValue(index, "packing_material", merchantInfo.extend_bc); //包材ID
              mainprocSonList.setCellValue(index, "packing_material_packing_name", merchantInfo.extend_bc_packing_name); //包材名称
              console.log(merchantInfo);
            }
          }
        }
      );
    });
  //保存前事件
  viewModel.on("beforeSave", function () {
    let errorMsg = "";
    for (let i = 0; i < mainprocSonList.getRows().length; i++) {
      //数量
      let planCuringNum = parseFloat(mainprocSonList.getCellValue(i, "product_num"));
      //关联养护计划数量
      let relateCuringPlanNum = parseFloat(mainprocSonList.getCellValue(i, "relate_curing_plan_num"));
      if (planCuringNum <= 0) {
        errorMsg += "第" + (i + 1) + "行数据 数量不能 <= 0\n";
      } else {
        if (planCuringNum < relateCuringPlanNum) {
          errorMsg += "第" + (i + 1) + "行数据 关联养护计划数量 > 计划养护数量,请重新填写 \n ";
        }
      }
    }
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg);
      return false;
    }
  });
  //下推前事件
  viewModel.on("beforePush", function (data) {
    let verifystate = viewModel.get("verifystate").getValue();
    if (verifystate != 2) {
      cb.utils.alert("该单据未审核");
      return false;
    }
    let errorMsg = "";
    let planCuringObj = {};
    let planCuringArr = [];
    let handerMessage = (n) => (errorMsg += n);
    for (let i = 0; i < mainprocSonList.getRows().length; i++) {
      //重点商品养护子表ID
      let mainprocChildId = mainprocSonList.getCellValue(i, "id");
      //数量
      let planCuringNum = parseFloat(mainprocSonList.getCellValue(i, "product_num"));
      //关联养护计划数量
      let relateCuringPlanNum = parseFloat(mainprocSonList.getCellValue(i, "relate_curing_plan_num"));
      //剩余可生成养护计划数量
      let surPlanCuringQty = parseFloat(planCuringNum - relateCuringPlanNum);
      planCuringObj[mainprocChildId] = surPlanCuringQty;
      planCuringArr.push(planCuringObj);
    }
    let id = viewModel.get("id").getValue(); //主表ID
    var promise = new cb.promise();
    cb.rest.invokeFunction(
      "GT22176AT10.backDefaultGroup.mainProPushCheck",
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
  });
  viewModel.get("curing_scheme").on("afterValueChange", function (data) {
    mainprocSonList.clear();
  });
  viewModel.get("button28ea").on("click", function (data) {
    mainprocSonList.clear();
    let orgId = viewModel.get("org_id").getValue();
    cb.rest.invokeFunction(
      "GT22176AT10.backDefaultGroup.getProductCuringInfo",
      {
        orgId: orgId
      },
      function (err, res) {
        if (typeof res != "undefined") {
          console.log(res);
          let goodsArr = res.goodsArr;
          if (goodsArr.length < 1) {
            cb.utils.alert("没有符合条件的药品");
          }
          for (let i = 0; i < goodsArr.length; i++) {
            if (goodsArr[i] != null && goodsArr[i] != "null") {
              let childProInfo = {
                product_code: goodsArr[i].material,
                product_code_materialCode: goodsArr[i].materialCode,
                product_name: goodsArr[i].materialName,
                product_unit: goodsArr[i].unit,
                product_unit_name: goodsArr[i].unit_Name,
                specification: goodsArr[i].specs,
                produc_name: goodsArr[i].commonNme,
                dosage_form: goodsArr[i].dosageForm,
                dosage_form_dosagaFormName: goodsArr[i].dosageFormName,
                manufacturer: goodsArr[i].manufacturer,
                origin_place: goodsArr[i].producingArea,
                approval_number: goodsArr[i].approvalNumber,
                license_holder: goodsArr[i].listingHolder,
                license_holder_ip_name: goodsArr[i].listingHolderName,
                packing_material: goodsArr[i].packingMaterial, //包材ID
                packing_material_packing_name: goodsArr[i].packingMaterial_packing_name //包材名称
              };
              mainprocSonList.appendRow(childProInfo);
            }
          }
        }
      }
    );
    return;
    let curing_scheme = viewModel.get("curing_scheme").getValue();
    if (curing_scheme == undefined || curing_scheme == "") {
      cb.utils.alert("请先选择[养护方案]");
      return false;
    }
    if (curing_scheme == "1" || curing_scheme == 1) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.getProductCuringInfo",
        {
          orgId: orgId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            console.log(res);
            let goodsArr = res.goodsArr;
            if (goodsArr.length < 1) {
              cb.utils.alert("没有符合条件的药品");
            }
            for (let i = 0; i < goodsArr.length; i++) {
              if (goodsArr[i] != null && goodsArr[i] != "null") {
                let childProInfo = {
                  product_code: goodsArr[i].material,
                  product_code_materialCode: goodsArr[i].materialCode,
                  product_name: goodsArr[i].materialName,
                  product_unit: goodsArr[i].unit,
                  product_unit_name: goodsArr[i].unit_Name,
                  specification: goodsArr[i].specs,
                  produc_name: goodsArr[i].commonNme,
                  dosage_form: goodsArr[i].dosageForm,
                  dosage_form_dosagaFormName: goodsArr[i].dosageFormName,
                  manufacturer: goodsArr[i].manufacturer,
                  origin_place: goodsArr[i].producingArea,
                  approval_number: goodsArr[i].approvalNumber,
                  license_holder: goodsArr[i].listingHolder,
                  license_holder_ip_name: goodsArr[i].listingHolderName,
                  packing_material: goodsArr[i].packingMaterial, //包材ID
                  packing_material_packing_name: goodsArr[i].packingMaterial_packing_name //包材名称
                };
                mainprocSonList.appendRow(childProInfo);
              }
            }
          }
        }
      );
    } else if (curing_scheme == "2" || curing_scheme == 2) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.getNearProinfo",
        {
          orgId: orgId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            console.log(res);
            let goodsArr = res.goodsArr;
            if (goodsArr.length < 1) {
              cb.utils.alert("没有符合条件的药品");
            }
            for (let i = 0; i < goodsArr.length; i++) {
              if (goodsArr[i] != null && goodsArr[i] != "null") {
                let bzqdw;
                if (goodsArr[i].expireDateUnit == 1 || goodsArr[i].expireDateUnit == 2) {
                  bzqdw = goodsArr[i].expireDateUnit;
                } else if (goodsArr[i].expireDateUnit == 6) {
                  bzqdw = goodsArr[i].expireDateUnit;
                }
                let childProInfo = {
                  product_code: goodsArr[i].material,
                  product_code_materialCode: goodsArr[i].materialCode,
                  product_name: goodsArr[i].materialName,
                  lot_number: goodsArr[i].batchNo,
                  product_unit: goodsArr[i].unit,
                  product_unit_name: goodsArr[i].unit_Name,
                  product_num: goodsArr[i].currentqty,
                  stock_num: goodsArr[i].currentqty,
                  specification: goodsArr[i].specs,
                  produc_name: goodsArr[i].commonNme,
                  dosage_form: goodsArr[i].dosageForm,
                  dosage_form_dosagaFormName: goodsArr[i].dosageFormName,
                  manufacturer: goodsArr[i].manufacturer,
                  origin_place: goodsArr[i].producingArea,
                  approval_number: goodsArr[i].approvalNumber,
                  license_holder: goodsArr[i].listingHolder,
                  license_holder_ip_name: goodsArr[i].listingHolderName,
                  packing_material: goodsArr[i].packingMaterial, //包材ID
                  packing_material_packing_name: goodsArr[i].packingMaterial_packing_name, //包材名称
                  guarantee: goodsArr[i].expireDateNo,
                  guarantee_dw: bzqdw,
                  produce_date_show: getDate(goodsArr[i].producedate),
                  valid_until_show: getDate(goodsArr[i].invaliddate)
                };
                mainprocSonList.appendRow(childProInfo);
              }
            }
          }
        }
      );
    }
  });
  mainprocSonList
    .getEditRowModel()
    .get("item204me_batchno")
    .on("beforeBrowse", function () {
      let index = mainprocSonList.getFocusedRowIndex();
      let product = mainprocSonList.getCellValue(index, "product_code");
      let warehouse = mainprocSonList.getEditRowModel().get("warehouse").getValue();
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
  mainprocSonList
    .getEditRowModel()
    .get("item204me_batchno")
    .on("afterValueChange", function () {
      let index = mainprocSonList.getFocusedRowIndex();
      let sourcechild_id = mainprocSonList.getCellValue(index, "sourcechild_id");
      if (typeof sourcechild_id == "undefined" || sourcechild_id == "") {
        let product = mainprocSonList.getCellValue(index, "product_code");
        let batchId = mainprocSonList.getCellValue(index, "lot_id");
        let batch_code = mainprocSonList.getCellValue(index, "lot_number");
        let warehouse = mainprocSonList.getCellValue(index, "warehouse");
        if (typeof product != "undefined" && typeof batch_code != "undefined") {
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
                  mainprocSonList.setCellValue(index, "lot_id", "");
                  mainprocSonList.setCellValue(index, "lot_number", "");
                  mainprocSonList.setCellValue(index, "stock_type_name", "");
                  mainprocSonList.setCellValue(index, "stock_type", "");
                  mainprocSonList.setCellValue(index, "item204me", "");
                  mainprocSonList.setCellValue(index, "item204me_batchno", "");
                  mainprocSonList.setCellValue(index, "produce_date_show", undefined);
                  mainprocSonList.setCellValue(index, "valid_until_show", undefined);
                  return false;
                } else if (sccess_info.length > 0) {
                  for (let i = 0; i < sccess_info.length; i++) {
                    mainprocSonList.setCellValue(index, "stock_type", sccess_info[i].statusId);
                    mainprocSonList.setCellValue(index, "stock_type_name", sccess_info[i].statusName);
                    mainprocSonList.setCellValue(index, "product_num", sccess_info[i].currentqty);
                    mainprocSonList.setCellValue(index, "stock_num", sccess_info[i].currentqty);
                    mainprocSonList.setCellValue(index, "produce_date_show", getDate(sccess_info[i].manufacture_date));
                    mainprocSonList.setCellValue(index, "valid_until_show", getDate(sccess_info[i].due_date));
                  }
                }
              }
            }
          );
        }
      }
    });
  function dateFormat(value, format) {
    if (value == "" || value == null || value == undefined) {
      return "";
    }
    let date = new Date(value);
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "H+": date.getHours(), //hour+8小时
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
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
});