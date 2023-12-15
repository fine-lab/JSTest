run = function (event) {
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel("SY01_unqualison7List");
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  // 根据组织过滤仓库
  gridModelInfo
    .getEditRowModel()
    .get("warehouse_name")
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
        field: "org",
        op: "eq",
        value1: value1
      });
      //设置过滤条件
      this.setFilter(condition);
    });
  // 根据组织过滤物料
  gridModelInfo
    .getEditRowModel()
    .get("product_code_code")
    .on("beforeBrowse", function () {
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
    debugger;
    const value = viewModel.get("sydjh").getValue();
    var mode = viewModel.getParams().mode;
    //设置默认库存状态
    if (mode == "add") {
      let rows = gridModelInfo.getRows();
      for (let i = 0; i < rows.length; i++) {
        let currentstockstate = gridModelInfo.getCellValue(i, "stockstate");
        if (currentstockstate == null || currentstockstate == undefined) {
          setStockStateout(null, "不合格", 2, i);
        }
      }
      let orgid = viewModel.get("org_id").getValue();
      getFinaceOrg(orgid);
    }
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
      let warehouse = gridModelInfo.getCellValue(index, "warehouse");
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
        return true;
      }
      //物料id
      let productId = data.value.id;
      let promises = [];
      let materialInfo = {};
      debugger;
      let orgId = viewModel.get("org_id").getValue();
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { materialId: productId, orgId: orgId }, function (err, res) {
        console.log();
        if (res != undefined) {
          let productInfo = res.proLicInfo;
          //名称
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "product_name", data.value.name);
          //上市许可持有人
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren", productInfo.listingHolder);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shangshixukeren_ip_name", productInfo.listingHolderName);
          //生产厂商
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shengchanchangshang", productInfo.manufacturer);
          //产地
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "producing_area", productInfo.producingArea);
          //批准文号
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "approval_number", productInfo.approvalNumber);
          //规格说明
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_catagoryname", productInfo.specs);
          // 规格
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "specs", data.value.modelDescription);
          // 型号
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "xinghao", data.value.model);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei", productInfo.materialType);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "gspshangpinfenlei_name", productInfo.materialTypeName);
          //计量单位
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang", data.value.oUnitId);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "zhujiliang_name", data.value.unitName);
          //剂型
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing", productInfo.dosageForm);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "jixing_dosagaFormName", productInfo.dosageFormName);
          //通用名
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "tongyongming", productInfo.commonNme);
          //包材
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial", productInfo.packingMaterial);
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "packingMaterial_packing_name", productInfo.packingMaterialName);
          //是否效期
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shifuyouxiaoqiguanli", productInfo.isExpiryDateManage);
          //是否批次
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "shifupiciguanli", productInfo.isBatchManage);
          //保质期
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "baozhiqi", productInfo.expireDateNo);
          //保质期单位
          viewModel.getGridModel("SY01_unqualison7List").setCellValue(data.rowIndex, "bzqdw", productInfo.expireDateUnit);
        }
      });
    }
    if (data.cellName == "batch_no" && data.oldValue != data.value) {
      gridModelInfo.setCellValue(data.rowIndex, "item203lc_batchno", null);
      gridModelInfo.setCellValue(data.rowIndex, "item203lc", null);
    }
  });
  viewModel.on("beforeSave", function (data) {
    let sourceBillNo = viewModel.get("source_id").getValue(); //上游单据主表ID
    let refusetype = viewModel.get("bustype").getValue(); //拒收类型
    let upChildBillId = [];
    debugger;
    for (var k = 0; k < gridModelInfo.getRows().length; k++) {
      let unqualified_num = gridModelInfo.getCellValue(k, "unqualified_num");
      if (unqualified_num == "0") {
        cb.utils.alert("第" + (k + 1) + "行不合格数量为0,不可保存！");
        return false;
      }
    }
    var source_billtype = viewModel.get("source_billtype").getValue(); // 无来源或者养护来的 要校验SKU 效期、批次
    if (source_billtype == "" || source_billtype == undefined || source_billtype == null || source_billtype == "sy01.fa75fcd8") {
      debugger;
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        // 判断效期管理
        var shifuyouxiaoqiguanli = gridModelInfo.getCellValue(i, "shifuyouxiaoqiguanli");
        var production_date = gridModelInfo.getCellValue(i, "production_date");
        var valid_until = gridModelInfo.getCellValue(i, "valid_until");
        if (shifuyouxiaoqiguanli == "1") {
          if (production_date == undefined || production_date == null || production_date == "") {
            cb.utils.alert("第" + (i + 1) + "行生产日期不能为空！");
            return false;
          }
        }
        // 判断批次管理
        var shifupiciguanli = gridModelInfo.getCellValue(i, "shifupiciguanli");
        var batch_no = gridModelInfo.getCellValue(i, "batch_no");
        if (shifupiciguanli == "1") {
          if (batch_no == undefined || batch_no == null || batch_no == "") {
            cb.utils.alert("第" + (i + 1) + "行批次不能为空！");
            return false;
          }
        }
        // 判断SKU不能为空
        var skuFinal = gridModelInfo.getCellValue(i, "skuFinal");
        if (skuFinal == undefined || skuFinal == null || skuFinal == "") {
          cb.utils.alert("第" + (i + 1) + "行SKU不能为空！");
          return false;
        }
      }
    }
    if (refusetype == 7) {
      let refuseObj = {};
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        let sourcechildId = gridModelInfo.getCellValue(i, "sourcechild_id");
        refuseObj[sourcechildId] = gridModelInfo.getCellValue(i, "unqualified_num");
        if (gridModelInfo.getCellValue(i, "unqualified_num") < 0) {
          cb.utils.alert("第" + (i + 1) + "行不合格登记数量不能小于0");
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
    if (args.args.cSvcUrl.indexOf("targetBillNo=st_stockstatuschange") > 0) {
      var bIsStockState = viewModel.get("bIsStockState").getValue();
      if (bIsStockState == "1") {
        cb.utils.alert("已经生成调整单，不允许在次操作！");
        return false;
      }
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        let warehouse = gridModelInfo.getCellValue(i, "warehouse");
        if (warehouse == undefined) {
          cb.utils.alert("下推库存调整单仓库不能为空！");
          return false;
        }
        let stockstate = gridModelInfo.getCellValue(i, "stockstate");
        if (stockstate == undefined) {
          cb.utils.alert("下推库存调整单,目标库存状态不能为空！");
          return false;
        }
      }
    }
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
      invokeFunction1(
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
  function setStockStateout(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.id) {
          gridModelInfo.setCellValue(rowIndex, "stockstate", res.info.id);
          gridModelInfo.setCellValue(rowIndex, "stockstate_name", res.info.name);
        }
      });
    });
  }
  function getFinaceOrg(orgid) {
    return new Promise(function () {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getFinaceOrg", { orgid: orgid }, function (err, res) {
        if (res.info) {
          viewModel.get("finOrg").setValue(res.info[0].finorgid);
          viewModel.get("finOrg_name").setValue(res.info[0].finorgid_name);
        }
      });
    });
  }
  function setrowStockUnit(orgid, productid, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.GetustockUnit", { orgId: orgid, productid: productid }, function (err, res) {
        if (res.info) {
          gridModelInfo.setCellValue(rowIndex, "stockUnit", res.info.stockUnit);
          gridModelInfo.setCellValue(rowIndex, "stockUnit_Name", res.info.stockUnit_Name);
        }
      });
    });
  }
};