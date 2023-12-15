run = function (event) {
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel("SY01_unqualison7List");
  // 根据组织过滤物料
  gridModelInfo
    .getEditRowModel()
    .get("product_code_code")
    .on("beforeBrowse", function () {
      debugger;
      // 获取当前编辑行的品牌字段值
      const value1 = viewModel.get("org_id").getValue();
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
      //设置过滤条件
      this.setFilter(condition);
    });
  // 根据组织过滤SKU
  gridModelInfo
    .getEditRowModel()
    .get("skuFinal_name")
    .on("beforeBrowse", function () {
      // 获取当前编辑行的品牌字段值
      const value1 = viewModel.get("org_id").getValue();
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
      //设置过滤条件
      this.setFilter(condition);
    });
  viewModel.get("bustype_name").on("beforeBrowse", function () {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "enable",
      op: "eq",
      value1: 1
    });
    this.setFilter(condition);
  });
  // 添加用户参照的组织过滤
  viewModel.get("staff_name").on("beforeBrowse", function () {
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
  // 供应商组织过滤
  viewModel.get("supplier_name").on("beforeBrowse", function () {
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  gridModelInfo.on("afterStateRuleRunGridActionStates", function () {
    const value = viewModel.get("sydjh").getValue();
    if (value != undefined) {
      // 隐藏行按钮
      const rows = gridModelInfo.getRows(false);
      console.log(rows);
      const actions = gridModelInfo.getCache("actions");
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
          if (action.cItemName == "btnCopyRowSY01_unqualison7") {
            actionState[action.cItemName] = { visible: false };
          }
        });
        actionsStates.push(actionState);
      });
      gridModelInfo.setActionsState(actionsStates);
    }
  });
  viewModel.on("afterLoadData", function () {
    const value = viewModel.get("sydjh").getValue();
    if (value != undefined) {
      gridModelInfo.setColumnState("product_code_code", "bCanModify", false);
      gridModelInfo.setColumnState("approval_number", "bCanModify", false);
      gridModelInfo.setColumnState("skucode", "bCanModify", false);
      gridModelInfo.setColumnState("zhujiliang_name", "bCanModify", false);
      gridModelInfo.setColumnState("unqualified_num", "bCanModify", false);
      gridModelInfo.setColumnState("item203lc_batchno", "bCanModify", false);
      gridModelInfo.setColumnState("batch_no", "bCanModify", false);
      gridModelInfo.setColumnState("warehouse_name", "bCanModify", false);
      gridModelInfo.setColumnState("production_date", "bCanModify", false);
      gridModelInfo.setColumnState("valid_until", "bCanModify", false);
      gridModelInfo.setColumnState("approval_number", "bCanModify", false);
      gridModelInfo.setColumnState("gspshangpinfenlei_name", "bCanModify", false);
      gridModelInfo.setColumnState("packingMaterial_packing_name", "bCanModify", false);
      gridModelInfo.setColumnState("huowei_name", "bCanModify", false);
      gridModelInfo.setColumnState("gspshangpinfenlei_catagoryname", "bCanModify", false);
      gridModelInfo.setColumnState("standard_code", "bCanModify", false);
      gridModelInfo.setColumnState("laiyuandingdanhao", "bCanModify", false);
      gridModelInfo.setColumnState("skuFinal_name", "bCanModify", false);
      gridModelInfo.setColumnState("total_report_qty", "bCanModify", false);
      viewModel.get("org_id_name").setReadOnly(true);
      viewModel.get("customer_name").setReadOnly(true);
      viewModel.get("khlxr").setReadOnly(true);
      viewModel.get("khlxrdh").setReadOnly(true);
      viewModel.get("date").setReadOnly(true);
    }
    let source_billtype = viewModel.get("source_billtype").getValue(); //source_billtype:fa75fcd8
    if (source_billtype == "sy01.fa75fcd8") {
      gridModelInfo.setColumnState("skucode", "bHidden", true);
      gridModelInfo.setColumnState("gspshangpinfenlei_catagoryname", "bHidden", true);
      gridModelInfo.setColumnState("skucode", "bIsNull", true);
    }
    viewModel.on("modeChange", function (data) {
      let staffName = viewModel.get("staff_name").getValue();
      let departmentName = viewModel.get("department_name").getValue();
      if ((data === "add" || data === "edit") && (staffName == "" || staffName == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("staff").setValue(res.staffOfCurrentUser.id);
            viewModel.get("staff_name").setValue(res.staffOfCurrentUser.name);
            if (departmentName == "" || departmentName == null) {
              viewModel.get("department").setValue(res.staffOfCurrentUser.deptId);
              viewModel.get("department_name").setValue(res.staffOfCurrentUser.deptName);
            }
          }
        });
      }
    });
  });
  gridModelInfo
    .getEditRowModel()
    .get("item203lc_batchno")
    .on("beforeBrowse", function () {
      let index = gridModelInfo.getFocusedRowIndex();
      let product = gridModelInfo.getCellValue(index, "product_code");
      if (product == undefined) {
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
        this.setFilter(condition);
      }
    });
  gridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "item203lc_batchno") {
      if (data.value.batchno != undefined) {
        var pdate = new Date(+data.value.producedate);
        var pyear = pdate.getFullYear();
        var pmonth = "";
        if (pdate.getMonth() + 1 < 10) {
          pmonth = "0" + (pdate.getMonth() + 1);
        } else {
          pmonth = pdate.getMonth() + 1;
        }
        var ptdate = "";
        if (pdate.getDate() < 10) {
          ptdate = "0" + pdate.getDate();
        } else {
          ptdate = pdate.getDate();
        }
        var pfinal = pyear + "-" + pmonth + "-" + ptdate;
        if (pfinal == "NaN-NaN-NaN") {
          pfinal = "";
        }
        var ldate = new Date(+data.value.invaliddate);
        var lyear = ldate.getFullYear();
        var lmonth = "";
        if (ldate.getMonth() + 1 < 10) {
          lmonth = "0" + (ldate.getMonth() + 1);
        } else {
          lmonth = ldate.getMonth() + 1;
        }
        var ltdate = "";
        if (ldate.getDate() < 10) {
          ltdate = "0" + ldate.getDate();
        } else {
          ltdate = ldate.getDate();
        }
        var lfinal = lyear + "-" + lmonth + "-" + ltdate;
        if (lfinal == "NaN-NaN-NaN") {
          lfinal = "";
        }
        gridModelInfo.setCellValue(data.rowIndex, "batch_no", data.value.batchno);
        gridModelInfo.setCellValue(data.rowIndex, "production_date", pfinal);
        gridModelInfo.setCellValue(data.rowIndex, "valid_until", lfinal);
      }
    }
    if (data.cellName == "product_code_code") {
      console.log("----------------->>--------------------");
      console.log(data.value.code);
      if (data.value.code == undefined) {
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "product_name", "");
        //产地
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "producing_area", "");
        //批准文号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "approval_number", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_name", "");
        //剂型id
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing", "");
        //剂型
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing_dosagaFormName", "");
        //通用名
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "tongyongming", "");
        //上市许可持有人
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren_id", "");
        //批准文号，注册号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "pizhunwenhaozhucezhenghaobeianpingzhenghao", "");
        //生产厂商   manufacturer
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shengchanchangshang", "");
        // 规格
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "specs", "");
        // 型号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "xinghao", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_catagoryname", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren_ip_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial_packing_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "warehouse", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "warehouse_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "unqualified_num", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "production_date", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "valid_until", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "buhegeyuanyin", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "deal_type", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "skuFinal", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "skuFinal_name", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "skucode", "");
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "handle_way", "");
      }
      //物料id
      let productId = data.value.id;
      let promises = [];
      let materialInfo = {};
      let promiseResult = (n) => (materialInfo = n);
      let orgId = viewModel.get("org_id").getValue();
      promises.push(getMaterialInfo(productId).then(promiseResult));
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProductDetail", { materialId: productId, orgId: orgId }, function (err, res) {
        if (res != undefined) {
          let productInfo = res.merchantInfo;
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log(productInfo);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_catagoryname", productInfo.extend_gsp_spfl_catagoryname);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren", productInfo.extend_ssxkcyr);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren_ip_name", productInfo.extend_ssxkcyr_ip_name);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial", productInfo.extend_bc);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial_packing_name", productInfo.extend_bc_packing_name);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang", productInfo.unit);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang_name", productInfo.unit_Name);
        }
      });
      Promise.all(promises).then(() => {
        //商品名称
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "product_name", materialInfo.name);
        //产地
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "producing_area", materialInfo.placeOfOrigin);
        //批准文号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "approval_number", materialInfo.extend_pzwh);
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei", materialInfo.extend_gsp_spfl);
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_name", materialInfo.extend_gsp_spfl_catagoryname);
        //剂型id
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing", materialInfo.extend_jx);
        //剂型
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing_dosagaFormName", materialInfo.extend_jx_dosagaFormName);
        //通用名
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "tongyongming", materialInfo.extend_tym);
        //上市许可持有人
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren", materialInfo.extend_ssxkcyr);
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren_id", materialInfo.extend_ssxkcyr_ip_name);
        //批准文号，注册号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "pizhunwenhaozhucezhenghaobeianpingzhenghao", materialInfo.extend_pzwh);
        //生产厂商   manufacturer
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shengchanchangshang", materialInfo.manufacturer);
        // 规格
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "specs", materialInfo.modelDescription);
        // 型号
        viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "xinghao", materialInfo.model);
      });
    }
    if (data.cellName == "batch_no" && data.oldValue != data.value) {
      gridModelInfo.setCellValue(data.rowIndex, "item203lc_batchno", null);
      gridModelInfo.setCellValue(data.rowIndex, "item203lc", null);
    }
  });
  viewModel.on("beforeSave", function (data) {
    debugger;
    let sourceBillNo = viewModel.get("source_id").getValue(); //上游单据主表ID
    let refusetype = viewModel.get("bustype").getValue(); //拒收类型
    let upChildBillId = [];
    if (refusetype == 7) {
      let refuseObj = {};
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        let sourcechildId = gridModelInfo.getCellValue(i, "sourcechild_id");
        refuseObj[sourcechildId] = gridModelInfo.getCellValue(i, "unqualified_num");
        if (gridModelInfo.getCellValue(i, "unqualified_num") < 0) {
          cb.utils.alert("不合格登记数量不能小于0");
          return false;
        }
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.unqualifiedqtyverify",
        {
          sourceBillNo: sourceBillNo,
          refusetype: refusetype,
          refuseObj: refuseObj
        },
        function (err, res) {
          console.log("33333333333");
          console.log(res);
          console.log(res.errInfo);
          if (typeof res !== "undefined") {
            if (res.errInfo.length > 0) {
              cb.utils.alert(res.errInfo);
              promise.reject();
            } else {
              promise.resolve();
            }
          }
        }
      );
    }
    return promise;
  });
  viewModel.on("beforePush", function (args) {
    let thisId = viewModel.get("id").getValue();
    var verifystate = viewModel.getAllData().verifystate;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
    var gridModelDetails1 = viewModel.getGridModel("SY01_unqualison7List").get("dataSource");
    var gridModel1 = viewModel.getGridModel("SY01_unqualison7List");
    for (var i = 0; i < gridModelDetails1.length; i++) {
      let qty = gridModelDetails1[i].unqualified_num;
      let tqty = gridModelDetails1[i].total_report_qty;
      if (qty === tqty || qty == 0) {
        cb.utils.alert("没有可下推数量!");
        return false;
      }
    }
    debugger;
    if (args.args.cSvcUrl.indexOf("targetBillNo=c2d5f5ea") > 0) {
      var returnPromise = new cb.promise();
      var id = viewModel.get("id").getValue();
      var uri = "GT22176AT10.GT22176AT10.SY01_pro_uselessv3";
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.checkChildOrderAudit",
        {
          id: id,
          uri: uri
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.Info != undefined && res.Info != null) {
            if (res.Info.length > 0) {
              cb.utils.alert(res.Info, "error");
              return false;
            }
          }
          returnPromise.resolve();
        }
      );
      return returnPromise;
    }
  });
  function getMaterialInfo(materialId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.getProductDetail",
        { materialId: materialId },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.merchantInfo);
          } else if (err !== null) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
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
};