run = function (event) {
  var viewModel = this;
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
  var customerInfo = {};
  var gridModel = viewModel.getGridModel("sy01_material_other_reportList");
  var map = {
    extend_gsp_spfl: "customertype",
    //客户分类名称
    extend_gsp_spfl_catagoryname: "customertype_catagoryname",
    //通用名
    extend_tym: "extend_tym",
    //批准文号
    extend_pzwh: "approvalNo",
    //养护类别
    extend_yhlb: "curingtype",
    //养护类别名称
    extend_yhlb_curingTypeName: "curingtype_curingTypeName",
    //存储条件
    extend_cctj: "storageConditions",
    //存储条件名称
    extend_cctj_storageName: "storageConditions_storageName",
    //近效期类别
    extend_jxqlb: "nearPeriodType",
    //近效期类别名称
    extend_jxqlb_nearName: "nearPeriodType_nearName",
    //包材
    extend_bc: "extend_bc",
    //包材名称
    extend_bc_packing_name: "extend_bc_packing_name",
    //剂型
    extend_jx: "dosageform",
    //剂型名称
    extend_jx_dosagaFormName: "dosageform_dosagaFormName",
    //上市许可持有人
    extend_ssxkcyr: "licneser",
    //上市许可持有人名称
    extend_ssxkcyr_ip_name: "licneser_ip_name",
    //生产厂家
    manufacturer: "manufacturer",
    //产地
    placeOfOrigin: "produceArea",
    //处方分类
    extend_cffl: "cffl",
    //质量标准
    extend_zlbz: "qualityStandard",
    //进口药品注册号
    extend_imregisterlicenseNo: "imregisterlicenseNo",
    //本位码
    extend_standard_code: "bwm",
    //药品补充申请批件
    extend_ypbcsqpj: "ypbcsqpj",
    //商品/器械注册批件
    extend_spjxzcpj: "spjxzcpj",
    //生物签发合格证
    extend_swqfhgz: "swqfhgz",
    //说明书
    extend_sms: "sms",
    //商品/器械再注册批件
    extend_spqxzzcpj: "spqxzzcpj",
    //进口许可证
    extend_jkxkz: "jkxkz",
    //进口药材批件
    extend_jkycpj: "jkycpj",
    //药品包装
    extend_ypbz: "ypbz",
    //进口生物制品检验报告书
    extend_jkswzpjybgs: "jkswzpjybgs",
    //进口药品注册证/医药产品注册证/进口药品批件
    extend_jkypzczyy: "jkypzczyy",
    //进口药品通关证/进口药品报告书
    extend_jkyptgz: "jkyptgz",
    //说明书
    extend_jkyp: "jkyp",
    //商品/器械再注册批件
    extend_spqxzzcpj: "spqxzzcpj",
    //冷链药品
    extend_llyp: "llyp",
    //进口药品
    extend_jkyp: "jkyp",
    //注射剂
    extend_zsj: "ypbz",
    //含特殊药品复方制剂
    extend_tsyp: "htsypffz",
    //抗肿瘤药
    extend_kzlyp: "kzly",
    //抗生素
    extend_kss: "kss",
    //注射剂
    extend_zsj: "zsj",
    //二次验收
    extend_srfh: "ecys",
    //含麻黄碱
    extend_hmhj: "hmhj",
    //凭处方单销售
    extend_pcfdxs: "pcfdss",
    //疗效
    extend_spqk: "customerquality"
  };
  viewModel.on("afterLoadData", function () {
    //当单据状态为开立态时
    if (viewModel.get("verifystate").getValue() === 0) {
      let date1 = formatDate(new Date());
      viewModel.get("applydate").setValue(date1);
    }
  });
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
  viewModel.get("customerbillno_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinRes = [];
    promises.push(
      selectMerchandise(orgId).then((res) => {
        huopinRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      let proCode = [];
      for (let i = 0; i < huopinRes.length; i++) {
        for (let j = 0; j < huopinRes.length; j++) {
          proCode.push(huopinRes[i].productId_code);
        }
      }
      if (proCode.length == 0) {
        proCode.push("不存在");
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
          value1: ["false", false, 0, "0"]
        }
      );
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  viewModel.get("sku_code").on("beforeBrowse", function (data) {
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
      selectSySkus().then((res) => {
        skuIds = res;
      })
    );
    Promise.all(promises).then(() => {
      if (skuIds.length == 0) {
        skuIds.push("不存在");
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
  let selectSySkus = function () {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.selectSySkus", {}, function (err, res) {
        if (typeof res != "undefined") {
          let skuIds = res.skuIds;
          resolve(skuIds);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
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
  //值更新查询物料信息
  viewModel.get("customerbillno_name").on("afterValueChange", function (data) {
    //和变更单一样，带出所有的字段
    viewModel.get("customername").setValue(data.value.code);
    let materialId = data.value.id;
    viewModel.get("customerbillno").setValue(materialId);
    let orgId = viewModel.get("org_id").getValue();
    getCustomerInfo(materialId, orgId).then(() => {
      setData(viewModel, customerInfo, map);
    });
    //表头通过参照带入即可
    //给子表赋值操作。
  });
  //增行
  viewModel.get("button16hj").on("click", function () {
    gridModel.appendRow({});
  });
  viewModel.get("button20dj").on("click", function () {
    let indexArr = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(indexArr);
  });
  viewModel.on("beforeSave", function () {
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
  });
  getCustomerInfo = function (materialId, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.getProductDetail",
        {
          materialId: materialId,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            customerInfo = res.merchantInfo;
          } else if (err !== null) {
            alert(err.message);
          }
          resolve();
        }
      );
    });
  };
  setData = function (viewModel, customerInfo, map) {
    for (var key in map) {
      viewModel.get(map[key]).setValue(customerInfo[key]);
    }
  };
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
  gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "end_date") {
      let begin_date = gridModel.getEditRowModel().get("begin_date").getValue();
      let end_date = data.value;
      if (begin_date == undefined || begin_date == "") {
        cb.utils.alert("请先填写开始日期", "error");
        gridModel.clear();
        return false;
      }
      let beginDate = new Date(begin_date);
      let endDate = new Date(end_date);
      let difValue = (endDate - beginDate) / (1000 * 60 * 60 * 24);
      if (difValue < 0 || difValue == 0) {
        cb.utils.alert("失效日期必须大于开始日期", "error");
        gridModel.clear();
        return false;
      }
    }
  });
};