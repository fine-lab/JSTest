//开始
run = function (event) {
  var viewModel = this;
  let sy_rep = "sy01_material_change_reportList";
  let sy_rep_grid = viewModel.getGridModel(sy_rep);
  let changeGridModel = viewModel.getGridModel("Sy01_changeRecordList");
  let reportGridModel = viewModel.getGridModel("sy01_material_change_reportList");
  let validateRangeRepeat = function (rows, idFieldName, value) {
    let set = new Set();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][idFieldName] != "" && rows[i][idFieldName] != null && rows[i][idFieldName] != undefined && rows[i]._status != "Delete") {
        set.add(rows[i][idFieldName]);
      }
    }
    return set.has(value);
  };
  let updateViewModel = function (viewModel, proLicInfo) {
    viewModel.get("pro_type").setValue(proLicInfo.materialType); //GSP商品分类
    viewModel.get("pro_type_catagoryname").setValue(proLicInfo.materialTypeName); //GSP商品分类名称
    viewModel.get("materialTypeName").setValue(proLicInfo.materialTypeName); //GSP商品分类名称
    viewModel.get("storageConditions").setValue(proLicInfo.storageCondition); //存储条件
    viewModel.get("storageConditions_storageName").setValue(proLicInfo.storageConditionName); //存储条件名称
    viewModel.get("storage_conditions_name").setValue(proLicInfo.storageConditionName); //存储条件名称
    viewModel.get("dosageform").setValue(proLicInfo.dosageForm); //剂型
    viewModel.get("dosageform_dosagaFormName").setValue(proLicInfo.dosageFormName); //剂型名称
    viewModel.get("dosageform_name").setValue(proLicInfo.dosageFormName); //剂型名称
    viewModel.get("licenser").setValue(proLicInfo.listingHolder); //上市许可证持有人
    viewModel.get("licenser_ip_name").setValue(proLicInfo.listingHolderName); //上市许可证持有人名称
    viewModel.get("licenser_name").setValue(proLicInfo.listingHolderName); //上市许可证持有人名称
    // 近效期类别不考虑
    viewModel.get("bc").setValue(proLicInfo.packingMaterial); //包材
    viewModel.get("bc_packing_name").setValue(proLicInfo.packingMaterialName); //包材名称
    viewModel.get("extend_bc_name").setValue(proLicInfo.packingMaterialName); //包材名称
    //养护
    viewModel.get("curingtype").setValue(proLicInfo.curingType);
    viewModel.get("curingtype_curingTypeName").setValue(proLicInfo.curingTypeName);
    viewModel.get("curingtype_name").setValue(proLicInfo.curingTypeName);
    viewModel.get("extend_tym").setValue(proLicInfo.commonNme); //通用名
    viewModel.get("specifications").setValue(proLicInfo.specs); //规格
    viewModel.get("produceArea").setValue(proLicInfo.producingArea); //产地
    viewModel.get("approvalNo").setValue(proLicInfo.approvalNumber); //批准文号
    viewModel.get("bwm").setValue(proLicInfo.standardCode); //本位码
    viewModel.get("manufacturer_name").setValue(proLicInfo.manufacturer); //生产厂商
    viewModel.get("customerquality").setValue(proLicInfo.commodityPerformance); //商品性能、质量、用途、疗效
    viewModel.get("quaStandard").setValue(proLicInfo.qualityStandard); //质量标准
    viewModel.get("cffl").setValue(proLicInfo.prescriptionType); //处方分类
    viewModel.get("ypbcsqpj").setValue(proLicInfo.drugSuppleApply); //药品补充申请批件
    viewModel.get("spqxzcpj").setValue(proLicInfo.commodityDeviceRegistration); //商品/器械注册批件
    viewModel.get("swqfhgz").setValue(proLicInfo.biologicalCertification); //生物签发合格证
    viewModel.get("sms").setValue(proLicInfo.instructions); //说明书
    viewModel.get("spqxzzcpj").setValue(proLicInfo.commodityRegistrationApproval); //商品/器械再注册批件
    viewModel.get("jkxkz").setValue(proLicInfo.importLicense); //进口许可证
    viewModel.get("jkycpj").setValue(proLicInfo.importedMedicinalMaterials); //进口药材批件
    viewModel.get("ypbz").setValue(proLicInfo.drugPackaging); //药品包装
    viewModel.get("jkswzpjybgs").setValue(proLicInfo.importedBiologicalProducts); //进口生物制品检验报告书
    viewModel.get("jkypzczs").setValue(proLicInfo.importDrugRegistrationCertificate); //进口药品注册证/医药陈品注册证/进口药品报告书
    viewModel.get("hmhj").setValue(proLicInfo.ephedrineContaining); //含麻黄碱
    viewModel.get("jkyptgzs").setValue(proLicInfo.reportOnImportedDrugs); //进口药品通关证/进口药品报告书
    viewModel.get("isimporteddrugs").setValue(proLicInfo.importedDrugs); //进口药品
    viewModel.get("iscoldchain").setValue(proLicInfo.coldChainDrugs); //冷链药品
    viewModel.get("isinjection").setValue(proLicInfo.injection); //注射剂
    viewModel.get("issecacceptance").setValue(proLicInfo.doubleReview); //二次验收
    viewModel.get("hanteshuyaopin").setValue(proLicInfo.specialDrugs); //含特殊药品复方制
    viewModel.get("isAntitumordrugs").setValue(proLicInfo.antitumorDrugs); //抗肿瘤药
    viewModel.get("isantibiotic").setValue(proLicInfo.antibiotic); //抗生素
    viewModel.get("isotcsale").setValue(proLicInfo.salesByPrescription); //凭处方单销售
    viewModel.get("imregisterlicenseNo").setValue(proLicInfo.importDrugsRegisterNo); //凭处方单销售
    viewModel.get("recordNo").setValue(proLicInfo.recordNo); //凭处方单销售
    viewModel.get("zyypStandard").setValue(proLicInfo.zyypStandard); //凭处方单销售
    viewModel.get("zypfStandard").setValue(proLicInfo.zypfStandard); //凭处方单销售
    viewModel.get("psychotropic").setValue(proLicInfo.psychotropic); //精神药品
    viewModel.get("radiation").setValue(proLicInfo.radiation); //放射药品
    viewModel.get("poison").setValue(proLicInfo.poison); //毒性药品
    viewModel.get("narcotic").setValue(proLicInfo.narcotic); //麻醉药品
    reportGridModel.deleteAllRows();
    let materialReports = proLicInfo.SY01_material_file_childList;
    if (materialReports != undefined && materialReports.length > 0) {
      let recordList = [];
      for (let i = 0; i < materialReports.length; i++) {
        let item = {};
        item.report = materialReports[i].qualifyReport;
        item.report_name = materialReports[i].qualifyReportName;
        item.reportName = materialReports[i].qualifyReportName;
        item.begin_date = materialReports[i].startDate;
        item.end_date = materialReports[i].validUntil;
        item.file = materialReports[i].enclosure;
        item.related_id = materialReports[i].id;
        item._status = "Insert";
        recordList.push(item);
      }
      reportGridModel.setDataSource(recordList);
    }
    changeGridModel.deleteAllRows();
  };
  let getSwitchValue = function (value) {
    if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
      return 0;
    } else {
      return 1;
    }
  };
  let selectMerchandise = function (orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.huopinIds);
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  };
  let selectSyProducts = function (isSku, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.selectSyProducts", { isSku: isSku, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          let productIds = res.productIds;
          resolve(productIds);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let selectSySkus = function (material, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.selectSySkus", { material: material, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          let skuIds = res.skuIds;
          resolve(skuIds);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let getProLicInfo = function (isSku, materialId, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProLicInfo", { isSku: isSku, materialId: materialId, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.proLicInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  let getProSkuLicInfo = function (materialId, sku, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getProSkuLicInfo", { materialId: materialId, sku: sku, orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.proLicInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  viewModel.get("customerbillno_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinIds = [];
    let is_sku = getSwitchValue(viewModel.get("isSku").getValue()) == 0 ? false : true;
    let productIds = [];
    promises.push(
      selectMerchandise(orgId).then(
        (res) => {
          huopinIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      )
    );
    promises.push(
      selectSyProducts(is_sku, orgId).then(
        (res) => {
          productIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      )
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (huopinIds.length == 0) {
        huopinIds.push(-1);
      }
      if (productIds.length == 0) {
        productIds.push(-1);
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "id",
          op: "in",
          value1: huopinIds
        },
        {
          field: "productApplyRange.productDetailId.stopstatus",
          op: "in",
          value1: ["false", false, 0, "0"]
        },
        {
          field: "id",
          op: "in",
          value1: productIds
        }
      );
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  viewModel.get("applier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let dept_id = viewModel.get("applydep").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    if (dept_id != undefined && dept_id != null && dept_id != "") {
      condition.simpleVOs.push({
        field: "mainJobList.dept_id",
        op: "eq",
        value1: dept_id
      });
    }
    this.setFilter(condition);
  });
  viewModel.get("sku_code").on("beforeBrowse", function (data) {
    let is_sku = getSwitchValue(viewModel.get("isSku").getValue());
    let flag = is_sku == 1 ? true : false;
    if (!flag) {
      cb.utils.alert("非sku维度首营!不可选择");
      return false;
    }
    let promises = [];
    let returnPromise = new cb.promise();
    let skuIds = [];
    let material = viewModel.get("customerbillno").getValue();
    let org_id = viewModel.get("org_id").getValue();
    if (material == undefined) {
      cb.utils.alert("请先选择物料");
      return false;
    }
    promises.push(
      selectSySkus(material, org_id).then(
        (res) => {
          skuIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      )
    );
    Promise.all(promises).then(() => {
      if (skuIds.length == 0) {
        skuIds.push(-1);
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gsp物料
      condition.simpleVOs.push(
        {
          field: "productId",
          op: "eq",
          value1: material
        },
        {
          field: "productId.productApplyRange.orgId",
          op: "eq",
          value1: org_id
        },
        {
          field: "id",
          op: "in",
          value1: skuIds
        }
      );
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  let noStopReference = ["pro_type_catagoryname", "dosageform_dosagaFormName", "bc_packing_name", "curingtype_curingTypeName", "licenser_ip_name", "storageConditions_storageName"];
  for (let i = 0; i < noStopReference.length; i++) {
    viewModel.get(noStopReference[i]).on("beforeBrowse", function (data) {
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "enable",
        op: "in",
        value1: [1, "1"]
      });
      this.setFilter(condition);
    });
  }
  //值更新查询商品信息
  viewModel.get("isSku").on("beforeValueChange", function (data) {
    let materialId = viewModel.get("customerbillno").getValue();
    if (materialId != undefined && materialId != null && materialId != "") {
      let returnPromise = new cb.promise();
      cb.utils.confirm(
        "切换sku维度需要重新选择物料",
        function () {
          viewModel.get("customerbillno").setValue(null);
          viewModel.get("customerbillno_name").setValue(null);
          viewModel.get("materialCode").setValue(null);
          viewModel.get("product_name").setValue(null);
          viewModel.get("sku").setValue(null);
          viewModel.get("sku_code").setValue(null);
          viewModel.get("sku_name").setValue(null);
          viewModel.get("skuCode").setValue(null);
          updateViewModel(viewModel, {});
          returnPromise.resolve();
        },
        function (args) {
          returnPromise.reject();
        }
      );
      return returnPromise;
    } else {
      return true;
    }
  });
  viewModel.get("customerbillno_name").on("afterValueChange", function (data) {
    //清空,真正的值更新oldValue.id 和  value新的value.id一致
    let is_sku = getSwitchValue(viewModel.get("isSku").getValue());
    let flag = is_sku == 1 ? true : false;
    let orgId = viewModel.get("org_id").getValue();
    if (data.value == null) {
      updateViewModel(viewModel, {});
    } else if (data.oldValue == null || data.value.id != data.oldValue.id) {
      viewModel.get("sku").setValue(null);
      viewModel.get("sku_code").setValue(null);
      viewModel.get("sku_name").setValue(null);
      viewModel.get("skuCode").setValue(null);
      if (!flag) {
        let materialId = data.value == null ? -1 : data.value.id;
        getProLicInfo(flag, materialId, orgId).then(
          (proLicInfo) => {
            updateViewModel(viewModel, proLicInfo);
          },
          (err) => {
            cb.utils.alert(err, "error");
          }
        );
      }
    }
  });
  viewModel.get("sku_code").on("afterValueChange", function (data) {
    //清空,真正的值更新oldValue.id 和  value新的value.id一致
    let material = viewModel.get("customerbillno").getValue();
    let orgId = viewModel.get("org_id").getValue();
    if (data.value == null) {
      updateViewModel(viewModel, {});
    } else if (data.oldValue == null || data.value.id != data.oldValue.id) {
      let sku = data.value == null ? -1 : data.value.id;
      getProSkuLicInfo(material, sku, orgId).then(
        (proLicInfo) => {
          updateViewModel(viewModel, proLicInfo);
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
    }
  });
  sy_rep_grid.on("beforeCellValueChange", function (data) {
    let rows = sy_rep_grid.getRows();
    let flag = true;
    if (data.cellName == "report_name" && data.value.id != undefined) {
      flag = !validateRangeRepeat(rows, "report", data.value.id);
    }
    if (!flag) {
      cb.utils.alert("已有相同选项,请勿重复选择!");
      return false;
    }
    if (data.cellName == "begin_date") {
      let begin_date = data.value;
      let end_date = sy_rep_grid.getEditRowModel().get("end_date").getValue();
      let beginDate = new Date(begin_date);
      let endDate = new Date(end_date);
      let difValue = (endDate - beginDate) / (1000 * 60 * 60 * 24);
      if (difValue < 0 || difValue == 0) {
        cb.utils.alert("失效日期必须大于开始日期", "error");
        return false;
      }
    }
    if (data.cellName == "end_date") {
      let begin_date = sy_rep_grid.getEditRowModel().get("begin_date").getValue();
      let end_date = data.value;
      let beginDate = new Date(begin_date);
      let endDate = new Date(end_date);
      let difValue = (endDate - beginDate) / (1000 * 60 * 60 * 24);
      if (difValue < 0 || difValue == 0) {
        cb.utils.alert("失效日期必须大于开始日期", "error");
        return false;
      }
    }
  });
  viewModel.on("beforeSave", function () {
    let is_sku = getSwitchValue(viewModel.get("isSku").getValue());
    let flag = is_sku == 1 ? true : false;
    let sku = viewModel.get("sku").getValue();
    if (flag) {
      if (sku == undefined || sku == null || sku == "") {
        cb.utils.alert("sku维度按钮打开的情况下,sku必填", "error");
        return false;
      }
    }
    let manageOptions = new Set();
    if (viewModel.get("ypbcsqpj").getValue() == 1) {
      manageOptions.add("药品补充申请批件");
    }
    if (viewModel.get("spqxzcpj").getValue() == 1) {
      manageOptions.add("商品/器械注册批件");
    }
    if (viewModel.get("spqxzzcpj").getValue() == 1) {
      manageOptions.add("商品/器械再注册批件");
    }
    let rows = viewModel.getGridModel("sy01_material_change_reportList").getRows();
    for (let i = 0; i < rows.length; i++) {
      if (manageOptions.has(rows[i].report_name) && rows[i]._status != "Delete") {
        manageOptions.delete(rows[i].report_name);
      }
    }
    if (manageOptions.size > 0) {
      let errorMsg = "下列管控项目没有对应的资质/报告：";
      manageOptions.forEach(function (element) {
        errorMsg += element;
      });
      cb.utils.alert(errorMsg, "error");
      return false;
    }
  });
  compareValue = function (oldValue, newValue) {
    oldValue = oldValue.trim();
    newValue = newValue.trim();
    if (oldValue == newValue) return true;
    if (oldValue === "false" && newValue === "") return true;
    if (newValue === "false" && oldValue === "") return true;
    return false;
  };
  FieldToStr = function (obj) {
    if (obj == null || typeof obj == "undefined") {
      obj = "";
    } else {
      obj = obj.toString();
    }
    return obj;
  };
  viewModel.on("beforeUnaudit", function (args) {
    cb.utils.alert("首营单据不允许弃审,如有改动请做变更", "error");
    return false;
  });
};
//结束