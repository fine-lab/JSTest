run = function (event) {
  var viewModel = this;
  let sy_rep = "sy01_material_other_reportList";
  let sy_rep_grid = viewModel.getGridModel(sy_rep);
  let validateSyPro = function (type, orgId, materialId, skuId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.sygl.validateSyPro", { type: type, orgId: orgId, materialId: materialId, skuId: skuId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  let validateRangeRepeat = function (rows, idFieldName, value) {
    let set = new Set();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][idFieldName] != "" && rows[i][idFieldName] != null && rows[i][idFieldName] != undefined && rows[i]._status != "Delete") {
        set.add(rows[i][idFieldName]);
      }
    }
    return set.has(value);
  };
  let selectSyProducts = function (typeArray, orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.selectSyProducts", { typeArray: typeArray, orgId: orgId }, function (err, res) {
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
  let getSwitchValue = function (value) {
    if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
      return 0;
    } else {
      return 1;
    }
  };
  let getTemplateInfo = function (materialId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getTemplateInfo", { materialId: materialId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.templateInfo);
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  };
  //获取基础档案物料详情数据
  let queryBaseMaterial = function (materialId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryMaterial", { materialId: materialId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.data);
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  };
  //校验特征
  let validateFeature = function (orgId, materialId, feature) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.validateFeature", { orgId: orgId, materialId: materialId, feature: feature }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res);
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  };
  viewModel.on("modeChange", function (data) {
    if (data === "browse") {
      //设置增行，删行不可见
      viewModel.get("button16hj").setVisible(false);
      viewModel.get("button20dj").setVisible(false);
    } else if (data == "edit") {
      viewModel.get("button16hj").setVisible(true);
      viewModel.get("button20dj").setVisible(true);
    } else if (data == "add") {
      viewModel.get("applydate").setValue(formatDate(new Date()));
    }
    if (data == "add" || data == "edit") {
      let type = viewModel.get("is_sku").getValue();
      if (type == 0) {
        viewModel.get("sku_code").setState("bCanModify", false);
        viewModel.get("tezhengn").setState("bCanModify", false);
      }
      if (type == 1) {
        viewModel.get("sku_code").setState("bCanModify", true);
        viewModel.get("tezhengn").setState("bCanModify", false);
      }
      if (type == 2) {
        viewModel.get("sku_code").setState("bCanModify", false);
        viewModel.get("tezhengn").setState("bCanModify", true);
      }
      let areaValue = viewModel.get("areaResource").getValue();
      if (areaValue == undefined || areaValue == null || areaValue == "") {
        let areaInfo = {
          produceArea: {
            value: "",
            source: ""
          },
          manufacturer: {
            value: "",
            source: ""
          }
        };
        viewModel.get("areaResource").setValue(JSON.stringify(areaInfo));
      }
    }
  });
  var gridModel = viewModel.getGridModel("sy01_material_other_reportList");
  viewModel.on("afterLoadData", function () {
    if (viewModel.getParams().mode == "edit" || viewModel.getParams().mode == "add") {
      let type = viewModel.get("is_sku").getValue();
      if (type == 0) {
        viewModel.get("sku_code").setState("bCanModify", false);
        viewModel.get("tezhengn").setState("bCanModify", false);
      }
      if (type == 1) {
        viewModel.get("sku_code").setState("bCanModify", true);
        viewModel.get("tezhengn").setState("bCanModify", false);
      }
      if (type == 2) {
        viewModel.get("sku_code").setState("bCanModify", false);
        viewModel.get("tezhengn").setState("bCanModify", true);
      }
    }
    //当单据状态为开立态时
    if (viewModel.get("verifystate").getValue() === 0) {
      let date1 = formatDate(new Date());
      viewModel.get("applydate").setValue(date1);
    }
    let areaValue = viewModel.get("areaResource").getValue();
    if (areaValue == undefined || areaValue == null || areaValue == "") {
      let areaInfo = {
        produceArea: {
          value: "",
          source: ""
        },
        manufacturer: {
          value: "",
          source: ""
        }
      };
      viewModel.get("areaResource").setValue(JSON.stringify(areaInfo));
    }
  });
  //而是sku的时候，除了上面的那个，都可以参照到
  //逻辑修改，除了进行过物料维度首营的，其他的都能参照到
  viewModel.get("customerbillno_name").on("beforeBrowse", function (data) {
    let typeArray = [];
    let type = viewModel.get("is_sku").getValue().toString();
    if (type == "0") {
      typeArray = [0, 1, 2];
    } else if (type == "1") {
      typeArray = [0, 2];
    } else if (type == "2") {
      typeArray = [0, 1];
    }
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinIds = [];
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
    let returnPromise = new cb.promise();
    promises.push(
      selectSyProducts(typeArray, orgId).then(
        (res) => {
          productIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
          return returnPromise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (huopinIds.length == 0) {
        huopinIds.push("-1");
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
        }
      );
      condition.simpleVOs.push({
        field: "id",
        op: "nin",
        value1: productIds
      });
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  viewModel.get("sku_code").on("beforeBrowse", function (data) {
    let is_sku = getSwitchValue(viewModel.get("is_sku").getValue());
    let flag = is_sku == 1 ? true : false;
    if (!flag) {
      cb.utils.alert("非sku维度首营!不可选择");
      return false;
    }
    let promises = [];
    let returnPromise = new cb.promise();
    let skuIds = [];
    let orgId = viewModel.get("org_id").getValue();
    let material = viewModel.get("customerbillno").getValue();
    if (material == undefined) {
      cb.utils.alert("请先选择物料");
      return false;
    }
    promises.push(
      selectSySkus(material, orgId).then(
        (res) => {
          skuIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
          return returnPromise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (skuIds.length == 0) {
        skuIds.push("-1");
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "productId",
          op: "eq",
          value1: material
        },
        {
          field: "id",
          op: "nin",
          value1: skuIds
        },
        {
          field: "productId.productApplyRange.orgId",
          op: "eq",
          value1: orgId
        }
      );
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  //填报人过滤
  viewModel.get("applier_name").on("beforeBrowse", function (data) {
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
  let noStopReference = ["customertype_catagoryname", "dosageform_dosagaFormName", "extend_bc_packing_name", "curingtype_curingTypeName", "licneser_ip_name", "storageConditions_storageName"];
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
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    viewModel.get("applydate").setValue(formatDate(new Date()));
  });
  viewModel.get("is_sku").on("beforeValueChange", function (data) {
    if (data.value == 0) {
      viewModel.get("sku_code").setState("bCanModify", false);
      viewModel.get("tezhengn").setState("bCanModify", false);
    }
    if (data.value == 1) {
      viewModel.get("sku_code").setState("bCanModify", true);
      viewModel.get("tezhengn").setState("bCanModify", false);
    }
    if (data.value == 2) {
      viewModel.get("sku_code").setState("bCanModify", false);
      viewModel.get("tezhengn").setState("bCanModify", true);
    }
    if (data.value == null) {
      cb.utils.alert("首营方式不能为空", "error");
      return false;
    }
    let materialId = viewModel.get("customerbillno").getValue();
    if (materialId != undefined && materialId != null && materialId != "") {
      let returnPromise = new cb.promise();
      cb.utils.confirm(
        "切换首营方式需要重新选择物料",
        function () {
          viewModel.get("customerbillno").setValue(null);
          viewModel.get("customerbillno_name").setValue(null);
          viewModel.get("customername").setValue(null);
          viewModel.get("sku").setValue(null);
          viewModel.get("sku_code").setValue(null);
          viewModel.get("skuName").setValue(null);
          viewModel.get("skuCode").setValue(null);
          viewModel.get("produceArea").setValue(null);
          viewModel.get("manufacturer").setValue(null);
          updateViewModel(viewModel, {});
          let areaInfo = {
            produceArea: {
              value: "",
              source: ""
            },
            manufacturer: {
              value: "",
              source: ""
            }
          };
          viewModel.get("areaResource").setValue(JSON.stringify(areaInfo));
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
  viewModel.get("tezhengn").on("afterMount", function (data) {
    let modelArray = viewModel.get("tezhengn").getModels();
    modelArray[0].setReadOnly(true);
    modelArray[0].setState("BIsNull", false);
  });
  viewModel.get("tezhengn").on("beforeValueChange", function (data) {
    //首先要有值，T里面不能为空
    let isNull = true;
    for (let item in data.value) {
      if (data.value[item] != null) {
        isNull = false;
        break;
      }
    }
    if (isNull) {
      cb.utils.alert("特征不能为空", "error");
      return false;
    }
    let template = viewModel.get("template").getValue();
    if (template == undefined) {
      cb.utils.alert("该物料未启用模板", "error");
      return false;
    }
    let materialId = viewModel.get("customerbillno").getValue();
    if (materialId == undefined) {
      cb.utils.alert("请先选择物料", "error");
      return false;
    }
    let orgId = viewModel.get("org_id").getValue();
    let feature = {};
    let modelArray = viewModel.get("tezhengn").getModels();
    for (let i = 0; i < modelArray.length; i++) {
      if (modelArray[i].get("value") != undefined && modelArray[i].get("value") != null) {
        let characterId = modelArray[i].get("characterId");
        feature[characterId] = {};
        feature[characterId]["value"] = modelArray[i].get("value");
      }
    }
    let returnPromise = new cb.promise();
    //依据data.value，判断是否进行过首营
    let fullFeature = {};
    for (let i = 0; i < modelArray.length; i++) {
      let field = modelArray[i].get("cFieldName");
      fullFeature[field] = modelArray[i].get("value");
    }
    validateFeature(orgId, materialId, fullFeature).then(
      (res) => {
        if (res.code != "1002") {
          cb.utils.alert(res.message, "error");
          returnPromise.reject();
        }
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  viewModel.get("tezhengn").on("afterValueChange", function (data) {
    //写到特征obj,写到特征
    let obj = {};
    let feature = {};
    let modelArray = viewModel.get("tezhengn").getModels();
    for (let i = 0; i < modelArray.length; i++) {
      if (modelArray[i].get("value") != undefined && modelArray[i].get("value") != null) {
        let characterId = modelArray[i].get("characterId");
        feature[characterId] = {};
        feature[characterId]["value"] = modelArray[i].get("value");
      }
    }
    obj["key"] = feature;
    obj["value"] = data.value;
    let featureStr = JSON.stringify(obj).trim();
    viewModel.get("tezhengObj").setValue(featureStr);
  });
  //物料值更新
  viewModel.get("customerbillno_name").on("afterValueChange", function (data) {
    //所有的值更新情况
    if ((data.oldValue == null && data.value != null) || data.value == null || (data.oldValue != null && data.value != null && data.value.id != data.oldValue.id)) {
      viewModel.get("materialCode").setValue(data.value.id);
      viewModel.get("materialCode_code").setValue(data.value.code);
      viewModel.get("sku").setValue(null);
      viewModel.get("sku_code").setValue(null);
      viewModel.get("skuName").setValue(null);
      viewModel.get("skuCode").setValue(null);
      viewModel.get("template").setValue(null);
      viewModel.get("template_name").setValue(null);
      updateViewModel(viewModel, {});
    }
    //清空情况
    if (data.value == null) {
      viewModel.get("materialCode").setValue(null);
      viewModel.get("materialCode_code").setValue(null);
      let areaInfo = JSON.parse(viewModel.get("areaResource").getValue());
      areaInfo.produceArea.value = "";
      areaInfo.produceArea.source = "material";
      areaInfo.manufacturer.value = "";
      areaInfo.manufacturer.source = "material";
      viewModel.get("areaResource").setValue(JSON.stringify(areaInfo), true);
    }
    //值更新情况
    if ((data.value != null && data.oldValue == null) || (data.value != null && data.oldValue != null && data.value.id != data.oldValue.id)) {
      getMaterialInfo(data.value.id.toString(), undefined).then(
        (res) => {
          let areaInfo = JSON.parse(viewModel.get("areaResource").getValue());
          areaInfo.produceArea.value = res.info.produceArea;
          areaInfo.manufacturer.value = res.info.manufacturer;
          viewModel.get("areaResource").setValue(JSON.stringify(areaInfo), true);
          // 给规格说明赋值
          viewModel.get("specifications").setValue(res.info.modelDescription, true);
          updateViewModel(viewModel, res.info);
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
      getTemplateInfo(data.value.id.toString()).then(
        (res) => {
          if (res != undefined) {
            viewModel.get("template").setValue(res.id);
            viewModel.get("template_name").setValue(res.name);
          }
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
    }
  });
  viewModel.get("sku_code").on("afterValueChange", function (data) {
    if (data.value == null) {
      let areaInfo = JSON.parse(viewModel.get("areaResource").getValue());
      if (areaInfo.produceArea.source == "sku") {
        viewModel.get("produceArea").setValue(null);
      }
      if (areaInfo.manufacturer.source == "sku") {
        viewModel.get("manufacturer").setValue(null);
      }
    }
    if ((data.value != null && data.oldValue == null) || (data.value != null && data.oldValue != null && data.value.id != data.oldValue.id)) {
      getMaterialInfo(undefined, data.value.id.toString()).then(
        (res) => {
          //顺序切不可错误
          let areaInfo = JSON.parse(viewModel.get("areaResource").getValue());
          if (res.info.produceArea != undefined) {
            areaInfo.produceArea.value = res.info.produceArea;
            areaInfo.produceArea.source = "sku";
          }
          if (res.info.produceArea == undefined) {
            res.info.produceArea = areaInfo.produceArea.value;
          }
          if (res.info.manufacturer != undefined) {
            areaInfo.manufacturer.value = res.info.manufacturer;
            areaInfo.manufacturer.source = "sku";
          }
          if (res.info.manufacturer == undefined) {
            res.info.manufacturer = areaInfo.manufacturer.value;
          }
          viewModel.get("areaResource").setValue(JSON.stringify(areaInfo), true);
          updateViewModel(viewModel, res.info);
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
      let end_date = gridModel.getEditRowModel().get("end_date").getValue();
      let beginDate = new Date(begin_date);
      let endDate = new Date(end_date);
      let difValue = (endDate - beginDate) / (1000 * 60 * 60 * 24);
      if (difValue < 0 || difValue == 0) {
        cb.utils.alert("失效日期必须大于开始日期", "error");
        return false;
      }
    }
    if (data.cellName == "end_date") {
      let begin_date = gridModel.getEditRowModel().get("begin_date").getValue();
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
    let isSku = viewModel.get("is_sku").getValue();
    let skuId = viewModel.get("sku").getValue();
    if (isSku == "1" && skuId == undefined) {
      cb.utils.alert("启用sku维度,sku必填", "error");
      return false;
    }
    let manageOptions = new Set();
    if (viewModel.get("ypbcsqpj").getValue() == 1 || viewModel.get("ypbcsqpj").getValue() == "true") {
      manageOptions.add("药品补充申请批件");
    }
    if (viewModel.get("spjxzcpj").getValue() == 1 || viewModel.get("spjxzcpj").getValue() == "true") {
      manageOptions.add("商品/器械注册批件");
    }
    if (viewModel.get("spqxzzcpj").getValue() == 1 || viewModel.get("spqxzzcpj").getValue() == "true") {
      manageOptions.add("商品/器械再注册批件");
    }
    let rows = viewModel.getGridModel("sy01_material_other_reportList").getRows();
    for (let i = 0; i < rows.length; i++) {
      if (manageOptions.has(rows[i].report_name) && rows[i]._status != "Delete") {
        manageOptions.delete(rows[i].report_name);
      }
    }
    if (manageOptions.size > 0) {
      let errorMsg = "下列管控项目没有对应的资质/报告：";
      manageOptions.forEach(function (element) {
        errorMsg += element + "\n";
      });
      cb.utils.alert(errorMsg, "error");
      return false;
    }
    if (isSku == "0" || isSku == 0) {
    } else if (isSku == "1" || isSku == 1) {
    } else if (isSku == "2" || isSku == 2) {
      let isNull = true;
      let feature = viewModel.get("tezhengn").getValue();
      for (let item in feature) {
        if (feature[item] != null) {
          isNull = false;
          break;
        }
      }
      if (isNull) {
        cb.utils.alert("特征不能为空", "error");
        return false;
      }
    }
    let promises = [];
    let orgId = viewModel.get("org_id").getValue();
    let materialId = viewModel.get("customerbillno").getValue();
    let errMsg = "";
    let returnPromise = new cb.promise();
    if (isSku == 0 || isSku == 1) {
      promises.push(
        validateSyPro(isSku, orgId, materialId, skuId).then(
          (res) => {
            if (res.errCode != 200 && res.errCode != "200") {
              errMsg += res.msg;
              returnPromise.reject();
            }
          },
          (err) => {
            cb.utils.alert(err, "error");
            returnPromise.reject();
            return returnPromise;
          }
        )
      );
    } else if (isSku == 2) {
      let modelArray = viewModel.get("tezhengn").getModels();
      let fullFeature = {};
      for (let i = 0; i < modelArray.length; i++) {
        let field = modelArray[i].get("cFieldName");
        fullFeature[field] = modelArray[i].get("value");
      }
      promises.push(
        validateFeature(orgId, materialId, fullFeature).then(
          (res) => {
            if (res.code != "1002") {
              errMsg += res.message;
              cb.utils.alert(res.message, "error");
              returnPromise.reject();
            }
          },
          (err) => {
            cb.utils.alert(err, "error");
            returnPromise.reject();
          }
        )
      );
    }
    Promise.all(promises).then(() => {
      if (errMsg.length > 0) {
        cb.utils.alert(errMsg, "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  function formatDate(date) {
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
  viewModel.on("beforeUnaudit", function (args) {
    cb.utils.alert("首营单据不允许弃审,如有改动请做变更", "error");
    return false;
  });
  let updateViewModel = function (viewModel, info) {
    viewModel.get("produceArea").setValue(info.produceArea);
    viewModel.get("manufacturer").setValue(info.manufacturer);
  };
  let getMaterialInfo = function (materialId, skuId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.sygl.getProduceArea", { materialId: materialId, skuId: skuId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
};