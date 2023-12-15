//开始
run = function (event) {
  var viewModel = this;
  viewModel.on("modeChange", function (data) {
    if (data === "browse") {
      //设置增行，删行不可见
      viewModel.get("button17ge").setVisible(false);
      viewModel.get("button22ac").setVisible(false);
    } else if (data == "edit") {
      viewModel.get("button17ge").setVisible(true);
      viewModel.get("button22ac").setVisible(true);
    }
  });
  viewModel.on("afterMount", function () {
  });
  viewModel.get("customerbillno_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "extend_is_gsp",
        op: "in",
        value1: [1, true, "1", "true"]
      },
      {
        field: "extend_syzt",
        op: "eq",
        value1: 1
      }
    );
    this.setFilter(condition);
  });
  var beforeChange = {};
  var afterChange = {};
  var materialInfo = {};
  //获取表格model
  var changeGridModel = viewModel.getGridModel("Sy01_changeRecordList");
  var reportGridModel = viewModel.getGridModel("sy01_material_change_reportList");
  const propertyMap = {
    approvalNo: {
      customerFieldName: "extend_pzwh",
      fieldChineseName: "批准文号"
    },
    produceArea: {
      customerFieldName: "placeOfOrigin",
      fieldChineseName: "产地"
    },
    quaStandard: {
      customerFieldName: "extend_zlbz",
      fieldChineseName: "质量标准"
    },
    customerquality: {
      customerFieldName: "extend_spqk",
      fieldChineseName: "商品性能、质量、用途、疗效"
    },
    manufacturer_name: {
      customerFieldName: "manufacturer",
      fieldChineseName: "生产厂家"
    },
    extend_tym: {
      customerFieldName: "extend_tym",
      fieldChineseName: "通用名"
    },
    imregisterlicenseNo: {
      customerFieldName: "extend_imregisterlicenseNo",
      fieldChineseName: "进口药品注册号"
    },
    bwm: {
      customerFieldName: "extend_standard_code",
      fieldChineseName: "本位码"
    },
    isAntitumordrugs: {
      customerFieldName: "extend_kzlyp",
      fieldChineseName: "抗肿瘤药"
    },
    isimporteddrugs: {
      customerFieldName: "extend_jkyp",
      fieldChineseName: "进口药品"
    },
    iscoldchain: {
      customerFieldName: "extend_llyp",
      fieldChineseName: "冷链药品"
    },
    isinjection: {
      customerFieldName: "extend_zsj",
      fieldChineseName: "商品性能、质量、用途、疗效"
    },
    hanteshuyaopin: {
      customerFieldName: "extend_tsyp",
      fieldChineseName: "特殊药品"
    },
    isantibiotic: {
      customerFieldName: "extend_kss",
      fieldChineseName: "抗生素"
    },
    isotcsale: {
      customerFieldName: "extend_pcfdxs",
      fieldChineseName: "凭处方单销售"
    },
    issecacceptance: {
      customerFieldName: "extend_srfh",
      fieldChineseName: "二次验收"
    },
    hmhj: {
      customerFieldName: "extend_hmhj",
      fieldChineseName: "含麻黄碱"
    },
    ypbcsqpj: {
      customerFieldName: "extend_ypbcsqpj",
      fieldChineseName: "药品补充申请批件"
    },
    spqxzcpj: {
      customerFieldName: "extend_spjxzcpj",
      fieldChineseName: "商品/器械注册批件"
    },
    swqfhgz: {
      customerFieldName: "extend_swqfhgz",
      fieldChineseName: "生物签发合格证"
    },
    sms: {
      customerFieldName: "extend_sms",
      fieldChineseName: "说明书"
    },
    spqxzzcpj: {
      customerFieldName: "extend_spqxzzcpj",
      fieldChineseName: "商品/器械再注册批件"
    },
    jkxkz: {
      customerFieldName: "extend_jkxkz",
      fieldChineseName: "进口许可证"
    },
    jkycpj: {
      customerFieldName: "extend_jkycpj",
      fieldChineseName: "进口药材批件"
    },
    ypbz: {
      customerFieldName: "extend_ypbz",
      fieldChineseName: "药品包装"
    },
    jkswzpjybgs: {
      customerFieldName: "extend_jkswzpjybgs",
      fieldChineseName: "进口生物制品检验报告书"
    },
    jkypzczs: {
      customerFieldName: "extend_jkypzczyy",
      fieldChineseName: "进口药品注册证/医药产品注册证/进口药品批件"
    },
    jkyptgzs: {
      customerFieldName: "extend_jkyptgz",
      fieldChineseName: "进口药品通关证/进口药品报告书"
    },
    cffl: {
      customerFieldName: "extend_cffl",
      fieldChineseName: "处方分类"
    },
    specifications: {
      customerFieldName: "modelDescription",
      fieldChineseName: "规格"
    },
    customerquality: {
      customerFieldName: "extend_spqk",
      fieldChineseName: "疗效"
    },
    nearType: {
      customerFieldName: "extend_jxqlb",
      fieldChineseName: "近效期类别ID",
      baseDataName: "nearName"
    },
    storageConditions: {
      customerFieldName: "extend_cctj",
      fieldChineseName: "存储条件ID",
      baseDataName: "storageName"
    },
    curingtype: {
      customerFieldName: "extend_yhlb",
      fieldChineseName: "养护类别ID",
      baseDataName: "curingTypeName"
    },
    dosageform: {
      customerFieldName: "extend_jx",
      fieldChineseName: "剂型ID",
      baseDataName: "dosagaFormName"
    },
    licenser: {
      customerFieldName: "extend_ssxkcyr",
      fieldChineseName: "上市许可证持有人ID",
      baseDataName: "ip_name"
    },
    bc_packing_name: {
      customerFieldName: "extend_bc_packing_name",
      fieldChineseName: "包材",
      baseDataName: "packing_name"
    }
  };
  for (let key in propertyMap) {
    viewModel.get(key).on("afterValueChange", function (data) {
      let oldValue = FieldToStr(materialInfo[propertyMap[key]["customerFieldName"]]);
      let dataValue = data.value;
      let newValue;
      if (typeof dataValue != "undefined" && dataValue != null) {
        if (typeof dataValue == "object") {
          newValue = FieldToStr(dataValue.text);
        } else {
          newValue = FieldToStr(dataValue);
        }
      } else {
        newValue = FieldToStr(data.value);
      }
      if (propertyMap[key].hasOwnProperty("baseDataName")) {
        newValue = FieldToStr(data.value[propertyMap[key]["baseDataName"]]);
      }
      //先循环，判断有无此字段，以及相关索引
      let exsitIndex = -1;
      let deleteFlag = false;
      for (let i = 0; i < changeGridModel.getRows().length; i++) {
        if (changeGridModel.getRows()[i].changeFieldName == propertyMap[key]["fieldChineseName"]) {
          exsitIndex = i;
          if (compareValue(oldValue, newValue)) {
            deleteFlag = true;
          }
          break;
        }
      }
      if (exsitIndex >= 0 && deleteFlag == false) {
        changeGridModel.setCellValue(exsitIndex, "afterChangeName", newValue);
      } else if (deleteFlag == true) {
        //如果相同需要删除
        changeGridModel.deleteRows([exsitIndex]);
      } else if ((exsitIndex = -1)) {
        if (oldValue.length > 200) {
          oldValue = oldValue.substring(0, 200);
        }
        if (newValue.length > 200) {
          newValue = newValue.substring(0, 200);
        }
        let obj = {
          changeFieldName: propertyMap[key]["fieldChineseName"],
          beforeChangeName: oldValue,
          afterChangeName: newValue
        };
        changeGridModel.appendRow(obj);
      }
    });
  }
  //值更新查询商品信息
  viewModel.get("customerbillno_name").on("afterValueChange", function (data) {
    if (data.value.id == undefined) {
      return;
    }
    let materialId = viewModel.get("customerbillno").getValue();
    let orgId = viewModel.get("org_id").getValue();
    let proCode = viewModel.get("product_name").getValue(); //商品编码
    getWLInfo(materialId, orgId, proCode);
    updateBillInfo();
    changeGridModel.clear();
  });
  getWLInfo = function (materialId, orgId, proCode) {
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getProductDetail",
      {
        materialId: materialId,
        orgId: orgId,
        proCode: proCode
      },
      function (err, res) {
        console.log(res);
        debugger;
        console.log(err);
        if (typeof res !== "undefined") {
          materialInfo = res.merchantInfo;
          viewModel.get("extend_tym").setValue(materialInfo.extend_tym); //通用名
          viewModel.get("nearType").setValue(materialInfo.extend_jxqlb); //近效期类别
          viewModel.get("nearType_nearName").setValue(materialInfo.extend_jxqlb_nearName); //近效期类别名称
          viewModel.get("storageConditions").setValue(materialInfo.extend_cctj); //存储条件
          viewModel.get("storageConditions_storageName").setValue(materialInfo.extend_cctj_storageName); //存储条件名称
          viewModel.get("dosageform").setValue(materialInfo.extend_jx); //剂型
          viewModel.get("dosageform_dosagaFormName").setValue(materialInfo.extend_jx_dosagaFormName); //剂型名称
          viewModel.get("curingtype").setValue(materialInfo.extend_yhlb); //养护类别
          viewModel.get("curingtype_curingTypeName").setValue(materialInfo.extend_yhlb_curingTypeName); //养护类别名称
          viewModel.get("licenser").setValue(materialInfo.extend_ssxkcyr); //上市许可证持有人
          viewModel.get("licenser_ip_name").setValue(materialInfo.extend_ssxkcyr_ip_name); //上市许可证持有人名称
          viewModel.get("produceArea").setValue(materialInfo.placeOfOrigin); //产地
          viewModel.get("approvalNo").setValue(materialInfo.extend_pzwh); //批准文号
          viewModel.get("bwm").setValue(materialInfo.extend_standard_code); //本位码
          viewModel.get("manufacturer_name").setValue(materialInfo.manufacturer); //生产厂商
          viewModel.get("cffl").setValue(materialInfo.extend_cffl); //处方分类
          viewModel.get("customerquality").setValue(materialInfo.extend_spqk); //商品性能、质量、用途、疗效
          viewModel.get("imregisterlicenseNo").setValue(materialInfo.extend_imregisterlicenseNo); //进口药品注册号
          viewModel.get("quaStandard").setValue(materialInfo.extend_zlbz); //质量标准
          viewModel.get("ypbcsqpj").setValue(materialInfo.extend_ypbcsqpj); //药品补充申请批件
          viewModel.get("spqxzcpj").setValue(materialInfo.extend_spjxzcpj); //商品/器械注册批件
          viewModel.get("swqfhgz").setValue(materialInfo.extend_swqfhgz); //生物签发合格证
          viewModel.get("sms").setValue(materialInfo.extend_sms); //说明书
          viewModel.get("spqxzzcpj").setValue(materialInfo.extend_spqxzzcpj); //商品/器械再注册批件
          viewModel.get("jkxkz").setValue(materialInfo.extend_jkxkz); //进口许可证
          viewModel.get("jkycpj").setValue(materialInfo.extend_jkycpj); //进口药材批件
          viewModel.get("ypbz").setValue(materialInfo.extend_ypbz); //药品包装
          viewModel.get("jkswzpjybgs").setValue(materialInfo.extend_jkswzpjybgs); //进口生物制品检验报告书
          viewModel.get("jkypzczs").setValue(materialInfo.extend_jkypzczyy); //进口药品注册证/医药陈品注册证/进口药品报告书
          viewModel.get("hmhj").setValue(materialInfo.extend_hmhj); //含麻黄碱
          viewModel.get("jkyptgzs").setValue(materialInfo.extend_jkyptgz); //进口药品通关证/进口药品报告书
          viewModel.get("isimporteddrugs").setValue(materialInfo.extend_jkyp); //进口药品
          viewModel.get("iscoldchain").setValue(materialInfo.extend_llyp); //冷链药品
          viewModel.get("isinjection").setValue(materialInfo.extend_zsj); //注射剂
          viewModel.get("issecacceptance").setValue(materialInfo.extend_srfh); //二次验收
          viewModel.get("hanteshuyaopin").setValue(materialInfo.extend_tsyp); //含特殊药品复方制
          viewModel.get("isAntitumordrugs").setValue(materialInfo.extend_kzlyp); //抗肿瘤药
          viewModel.get("isantibiotic").setValue(materialInfo.extend_kss); //抗生素
          viewModel.get("isotcsale").setValue(materialInfo.extend_pcfdxs); //凭处方单销售
          viewModel.get("pro_type").setValue(materialInfo.extend_gsp_spfl); //GSP商品分类
          viewModel.get("pro_type_catagoryname").setValue(materialInfo.extend_gsp_spfl_catagoryname); //GSP商品分类名称
          viewModel.get("bc").setValue(materialInfo.extend_bc); //包材
          viewModel.get("bc_packing_name").setValue(materialInfo.extend_bc_packing_name); //包材名称
          reportGridModel.deleteAllRows();
          let materialReports = materialInfo.SY01_wl_cpzzList;
          if (materialReports != undefined) {
            let recordList = [];
            for (let i = 0; i < materialReports.length; i++) {
              let item = {};
              item.report = materialReports[i].extend_report;
              item.report_name = materialReports[i].extend_report_name;
              item.begin_date = materialReports[i].extend_pzrq;
              item.end_date = materialReports[i].extend_yxqz;
              debugger;
              item.file = materialReports[i].extend_fille;
              item.related_id = materialReports[i].id;
              recordList.push(item);
            }
            reportGridModel.setState("dataSourceMode", "local");
            reportGridModel.setDataSource(recordList);
          }
        } else if (err !== null) {
          alert("物料查询接口报错:999");
        }
      }
    );
  };
  viewModel.on("beforeSave", function () {
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
  updateBillInfo = function () {
    viewModel.get("approvalNo").setValue(materialInfo.unit);
  };
  viewModel.on("beforeUnaudit", function (args) {
    cb.utils.alert("首营单据不允许弃审,如有改动请做变更", "error");
    return false;
  });
};
//结束