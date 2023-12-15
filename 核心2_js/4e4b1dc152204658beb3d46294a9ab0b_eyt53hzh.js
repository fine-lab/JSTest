run = function (event) {
  var viewModel = this;
  let sy_rep = "sy01_material_other_reportList";
  let sy_rep_grid = viewModel.getGridModel(sy_rep);
  let validateSyPro = function (isSku, orgId, materialId, skuId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.sygl.validateSyPro", { isSku: isSku, orgId: orgId, materialId: materialId, skuId: skuId }, function (err, res) {
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
  let selectMerchandise = function (orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          let resInfo = res.res;
          data = JSON.parse(resInfo).data.recordList;
          resolve(data);
        } else if (typeof err != "undefined") {
          reject(err.msg);
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
  viewModel.on("modeChange", function (data) {
    if (data === "browse") {
      //设置增行，删行不可见
      viewModel.get("button16hj").setVisible(false);
      viewModel.get("button20dj").setVisible(false);
    } else if (data == "edit") {
      viewModel.get("button16hj").setVisible(true);
      viewModel.get("button20dj").setVisible(true);
    }
  });
  var gridModel = viewModel.getGridModel("sy01_material_other_reportList");
  viewModel.on("afterLoadData", function () {
    //当单据状态为开立态时
    if (viewModel.get("verifystate").getValue() === 0) {
      let date1 = formatDate(new Date());
      viewModel.get("applydate").setValue(date1);
    }
  });
  //无论是不是sku维度，商品都不能再参照到  selectSyProducts(false, orgId)
  //是sku，nin  selectSyProducts(false, orgId)
  //非sku，nin  selectSyProducts(undefined, orgId)
  //而是sku的时候，除了上面的那个，都可以参照到
  viewModel.get("customerbillno_name").on("beforeBrowse", function (data) {
    let is_sku = getSwitchValue(viewModel.get("is_sku").getValue());
    let flag = is_sku == 1 ? true : false;
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinRes = [];
    let productIds = [];
    promises.push(
      selectMerchandise(orgId).then(
        (res) => {
          huopinRes = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      )
    );
    let returnPromise = new cb.promise();
    if (flag) {
      promises.push(
        selectSyProducts(false, orgId).then(
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
    } else {
      promises.push(
        selectSyProducts(undefined, orgId).then(
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
    }
    Promise.all(promises).then(() => {
      let huopinIds = [];
      for (let i = 0; i < huopinRes.length; i++) {
        huopinIds.push(huopinRes[i].productId);
      }
      if (huopinIds.length == 0) {
        huopinIds.push("不存在");
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
        skuIds.push("不存在");
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
  viewModel.get("is_sku").on("beforeValueChange", function (data) {
    let returnPromise = new cb.promise();
    cb.utils.confirm(
      "切换sku维度需要重新选择物料",
      function () {
        viewModel.get("customerbillno").setValue(null);
        viewModel.get("customerbillno_name").setValue(null);
        viewModel.get("customername").setValue(null);
        viewModel.get("sku").setValue(null);
        viewModel.get("sku_code").setValue(null);
        viewModel.get("skuName").setValue(null);
        viewModel.get("skuCode").setValue(null);
        returnPromise.resolve();
      },
      function (args) {
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  viewModel.get("customerbillno_name").on("afterValueChange", function (data) {
    //清空,真正的值更新oldValue.id 和  value新的value.id一致
    if (data.value == null || data.oldValue == null || data.value.id != data.oldValue.id) {
      viewModel.get("sku").setValue(null);
      viewModel.get("sku_code").setValue(null);
      viewModel.get("skuName").setValue(null);
      viewModel.get("skuCode").setValue(null);
    }
  });
  //增行
  viewModel.get("button16hj").on("click", function () {
    gridModel.appendRow({});
  });
  viewModel.get("button20dj").on("click", function () {
    let indexArr = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(indexArr);
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
    if (getSwitchValue(isSku) == 1 && skuId == undefined) {
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
    let currentState = viewModel.getParams().mode;
    if (currentState == "add") {
      let promises = [];
      let flag = isSku == 1 ? true : false;
      let orgId = viewModel.get("org_id").getValue();
      let materialId = viewModel.get("customerbillno").getValue();
      let info = {};
      let returnPromise = new cb.promise();
      promises.push(
        validateSyPro(flag, orgId, materialId, skuId).then(
          (res) => {
            info = res;
          },
          (err) => {
            cb.utils.alert(err, "error");
            returnPromise.reject();
            return returnPromise;
          }
        )
      );
      Promise.all(promises).then(() => {
        if (info.errCode != 200 && info.errCode != "200") {
          cb.utils.alert(info.msg, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    }
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
};