run = function (event) {
  //首营客户变更审批单----页面初始化
  var viewModel = this;
  //自动带出变更人(默认组织正确的情况)
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      //获取当前用户对应的员工，赋值给复核人员
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
        if (res != undefined && res.staffOfCurrentUser != undefined) {
          viewModel.get("applier").setValue(res.staffOfCurrentUser.id);
          viewModel.get("applier_name").setValue(res.staffOfCurrentUser.name);
        }
      });
    }
  });
  //获取表格model
  var changeGridModel = viewModel.getGridModel("Sy01_khbg_bgjlList");
  let lincense_Grid = viewModel.getGridModel("SY01_khbgsp_xgzzList");
  let lincense_fwGrid = viewModel.getGridModel("SY01_khbgsp_xgzz_fwList");
  let reportGridModel = viewModel.getGridModel("sy01_customer_change_reportList");
  let sqwtsList = viewModel.getGridModel("SY01_khbgsp_sqwtsList");
  let auth_fwGrid = viewModel.getGridModel("SY01_khbgsp_sqwts_lList");
  changeGridModel.setShowCheckbox(false);
  lincense_Grid.setShowCheckbox(false);
  lincense_fwGrid.setShowCheckbox(false);
  sqwtsList.setShowCheckbox(false);
  auth_fwGrid.setShowCheckbox(false);
  viewModel.get("btnAddRowSY01_khbgsp_xgzz").on("click", function (data) {
    const indexCell = lincense_Grid.getFocusedRowIndex();
    let customer = viewModel.get("customer").getValue();
    let customer_name = viewModel.get("customer_name").getValue(); //供应商名称
    let customerNo = viewModel.get("customerNo").getValue(); //供应商编码
    lincense_Grid.setCellValue(indexCell, "customer_id", customer);
    lincense_Grid.setCellValue(indexCell, "customer_code", customerNo);
    lincense_Grid.setCellValue(indexCell, "customer_name", customer_name);
  });
  viewModel.get("btnAddRowSY01_khbgsp_sqwts").on("click", function (data) {
    const indexCell = lincense_Grid.getFocusedRowIndex();
    let customer = viewModel.get("customer").getValue();
    let customer_name = viewModel.get("customer_name").getValue(); //供应商名称
    let customerNo = viewModel.get("customerNo").getValue(); //供应商编码
    sqwtsList.setCellValue(indexCell, "customer_id", customer);
    sqwtsList.setCellValue(indexCell, "customer_code", customerNo);
    sqwtsList.setCellValue(indexCell, "customer_name", customer_name);
  });
  viewModel.get("button39ic").on("click", function (data) {
    const indexCell = reportGridModel.getFocusedRowIndex();
    let customer = viewModel.get("customer").getValue();
    let customer_name = viewModel.get("customer_name").getValue(); //供应商名称
    let customerNo = viewModel.get("customerNo").getValue(); //供应商编码
    reportGridModel.setCellValue(indexCell, "customer_id", customer);
    reportGridModel.setCellValue(indexCell, "customer_code", customerNo);
    reportGridModel.setCellValue(indexCell, "customer_name", customer_name);
  });
  var beforeChange = {};
  var afterChange = {};
  var customerInfo = {};
  const propertyMap = {
    qualitysystem: {
      customerFieldName: "extend_zlbztx",
      fieldChineseName: "质量保证体系"
    },
    electron_supervision_code: {
      customerFieldName: "extend_dzjgbm",
      fieldChineseName: "电子监管编码"
    },
    customertype_typename: {
      customerFieldName: "extend_khfl",
      fieldChineseName: "gsp客户分类",
      baseDataName: "typename"
    },
    importantlicense: {
      customerFieldName: "extend_zyzz",
      fieldChineseName: "重要证号"
    },
    isgsp1: {
      customerFieldName: "extend_is_gsp",
      fieldChineseName: "GSP认证证书"
    },
    xgyz1: {
      customerFieldName: "extend_xgyz",
      fieldChineseName: "印章及随货同行票样"
    },
    caigouweituoshu1: {
      customerFieldName: "extend_caigouweituoshu",
      fieldChineseName: "采购委托书"
    },
    qyswdjz1: {
      customerFieldName: "extend_qyswdjz",
      fieldChineseName: "企业税务登记证"
    },
    gxysgz1: {
      customerFieldName: "extend_gxysgz",
      fieldChineseName: "购销员上岗证"
    },
    zlbzxy1: {
      customerFieldName: "extend_zlbzxy",
      fieldChineseName: "质量保证协议"
    },
    gxysfz1: {
      customerFieldName: "extend_gxysfz",
      fieldChineseName: "购销员身份证"
    },
    zzjgdz1: {
      customerFieldName: "extend_zzjgdz",
      fieldChineseName: "组织机构代证"
    },
    yaopinjingyingqiyexukezheng: {
      customerFieldName: "extend_ypjyqyxkz",
      fieldChineseName: "药品经营企业许可证"
    },
    ndbg: {
      customerFieldName: "extend_ndbg",
      fieldChineseName: "年度报告"
    },
    gxht: {
      customerFieldName: "extend_gxht",
      fieldChineseName: "购销合同"
    }
  };
  for (let key in propertyMap) {
    viewModel.get(key).on("afterValueChange", function (data) {
      let oldValue = FieldToStr(customerInfo[propertyMap[key]["customerFieldName"]]);
      let newValue = FieldToStr(data.value);
      if (propertyMap[key].hasOwnProperty("baseDataName")) {
        newValue = FieldToStr(data.value[propertyMap[key]["baseDataName"]]);
      }
      //先循环，判断有无此字段，以及相关索引
      let exsitIndex = -1;
      let deleteFlag = false;
      for (let i = 0; i < changeGridModel.getRows().length; i++) {
        if (changeGridModel.getRows()[i].alterFieldName == propertyMap[key]["fieldChineseName"]) {
          exsitIndex = i;
          if (compareValue(oldValue, newValue)) {
            deleteFlag = true;
          }
          break;
        }
      }
      if (exsitIndex >= 0 && deleteFlag == false) {
        changeGridModel.setCellValue(exsitIndex, "afterAlterName", newValue);
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
          alterFieldName: propertyMap[key]["fieldChineseName"],
          beforeAlterName: oldValue,
          afterAlterName: newValue
        };
        changeGridModel.appendRow(obj);
      }
    });
  }
  const gridArray = ["SY01_khbgsp_xgzzList", "SY01_khbgsp_xgzz_fwList", "SY01_khbgsp_sqwtsList", "SY01_khbgsp_sqwts_lList"];
  for (let i = 0; i < gridArray.length; i++) {
    viewModel.getGridModel(gridArray[i]).on("afterCellValueChange", function (data) {
      let oldValue = FieldToStr(data.oldValue);
      let newValue = FieldToStr(data.value);
      //先循环，判断有无此字段，以及相关索引
      let exsitIndex = -1;
      let deleteFlag = false;
      for (let i = 0; i < changeGridModel.getRows().length; i++) {
        if (changeGridModel.getRows()[i].alterFieldName == "第" + data.rowIndex + "行数据：" + data.cellName) {
          exsitIndex = i;
          if (compareValue(oldValue, newValue)) {
            deleteFlag = true;
          }
          break;
        }
      }
      if (exsitIndex >= 0 && deleteFlag == false) {
        changeGridModel.setCellValue(exsitIndex, "afterAlterName", newValue);
      } else if (deleteFlag == true) {
        //如果相同需要删除
        changeGridModel.deleteRows([exsitIndex]);
      } else if ((exsitIndex = -1)) {
        let obj = {
          alterFieldName: "第" + data.rowIndex + "行数据：" + data.cellName,
          beforeAlterName: oldValue,
          afterAlterName: newValue
        };
        changeGridModel.appendRow(obj);
      }
    });
  }
  //挂载查询客户信息
  //值更新查询客户信息
  viewModel.get("customer_name").on("afterValueChange", function (data) {
    //如果没变化，则不变
    if (data.value != undefined && data.oldValue != undefined && data.value.id == data.oldValue.id) {
      return;
    }
    console.log(data);
    let customerCode = data.value.code;
    viewModel.get("customerNo").setValue(customerCode);
    let orgId = viewModel.get("org_id").getValue();
    getCustomerInfo(customerCode, orgId).then(() => {
      setSubData(viewModel, customerInfo);
      changeGridModel.clear();
      //表头通过参照带入即可
      //给子表赋值操作。
      let customer = viewModel.get("customer").getValue();
      let customer_name = viewModel.get("customer_name").getValue(); //供应商名称
      let customer_bill_no = viewModel.get("customerNo").getValue(); //供应商编码
      let licRows = lincense_Grid.getRows();
      let WTSRows = sqwtsList.getRows();
      let ZZBGRows = reportGridModel.getRows();
      for (let i = 0; i < licRows.length; i++) {
        lincense_Grid.setCellValue(i, "customer_id", customer);
        lincense_Grid.setCellValue(i, "customer_code", customer_bill_no);
        lincense_Grid.setCellValue(i, "customer_name", customer_name);
      }
      for (let i = 0; i < WTSRows.length; i++) {
        sqwtsList.setCellValue(i, "customer_id", customer);
        sqwtsList.setCellValue(i, "customer_code", customer_bill_no);
        sqwtsList.setCellValue(i, "customer_name", customer_name);
      }
      for (let i = 0; i < ZZBGRows.length; i++) {
        reportGridModel.setCellValue(i, "customer_id", customer);
        reportGridModel.setCellValue(i, "customer_code", customer_bill_no);
        reportGridModel.setCellValue(i, "customer_name", customer_name);
      }
    });
  });
  var zzGridModelName = "SY01_khbgsp_xgzzList";
  var zzFieldCellName = "license_licenseName";
  var zzsqlxFieldCellName = "auth_type";
  var zzfw_gridModel = viewModel.getGridModel("SY01_khbgsp_xgzz_fwList");
  //相关证照切换时，删除所有孙表，将列换成对应的参照
  viewModel.getGridModel(zzGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == zzsqlxFieldCellName && data.value != data.oldValue) {
      zzfw_gridModel.deleteAllRows();
      let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, zzsqlxFieldCellName);
      switchDisplayFields(zzfw_gridModel, sqType - 1);
    }
  });
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), zzsqlxFieldCellName);
    switchDisplayFields(zzfw_gridModel, sqType - 1);
  });
  //相关证照切换时，删除孙表
  var authEntrustGridModelName = "SY01_khbgsp_sqwtsList";
  var authEntrustTypeCellName = "sqtype";
  var authEntrustGridModel = viewModel.getGridModel(authEntrustGridModelName);
  var authRangeGridModel = viewModel.getGridModel("SY01_khbgsp_sqwts_lList");
  viewModel.getGridModel(authEntrustGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == authEntrustTypeCellName && data.value != data.oldValue) {
      authRangeGridModel.deleteAllRows();
      let sqType = viewModel.getGridModel(authEntrustGridModelName).getCellValue(data.rowIndex, authEntrustTypeCellName);
      switchDisplayFields(authRangeGridModel, sqType - 1);
    }
  });
  //初始化时参照查询值
  authRangeGridModel.on("beforeSetDataSource", function (data) {
    let sqType = authEntrustGridModel.getCellValue(authEntrustGridModel.getFocusedRowIndex(), authEntrustTypeCellName);
    switchDisplayFields(authRangeGridModel, sqType - 1);
  });
  viewModel.get("customer_name").on("beforeBrowse", function () {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
      op: "eq",
      value1: orgId
    });
    //是否gsp客户
    condition.simpleVOs.push({
      field: "extend_isgsp",
      op: "in",
      value1: [1, "1", "true", true]
    });
    condition.simpleVOs.push({
      field: "extend_syzt",
      op: "eq",
      value1: 1
    });
    this.setFilter(condition);
  });
  //变更人过滤
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
  //业务员过滤
  sqwtsList
    .getEditRowModel()
    .get("khbg_saleman_businesserName")
    .on("beforeBrowse", function (data) {
      let customer = viewModel.get("customer").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "ocustomer",
        op: "eq",
        value1: "" + customer + ""
      });
      this.setFilter(condition);
    });
  //组织切换的情况,带出这个组织下的默认的员工
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    //获取当前用户对应的员工，赋值给复核人员
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
      if (res != undefined && res.staffOfCurrentUser != undefined) {
        viewModel.get("applier").setValue(res.staffOfCurrentUser.id);
        viewModel.get("applier_name").setValue(res.staffOfCurrentUser.name);
      }
    });
  });
  viewModel.on("beforeSave", function (data) {
    //证照主表:lincense_Grid   证照孙表:lincense_fwGrid
    //授权委托书主表:sqwtsList   授权委托书孙表:auth_fwGrid
    let licMasterList = lincense_Grid.getRows();
    let licFwMasterList = sqwtsList.getRows();
    let licMasterScopeType = [];
    let licchildScopeType1 = [];
    let licchildScopeType2 = [];
    let licchildScopeType3 = [];
    for (let l = 0; l < licMasterList.length; l++) {
      if (licMasterList[l]._status == "Delete") {
        continue;
      }
      licMasterScopeType.push(licMasterList[l].auth_type);
      let licChildList = licMasterList[l].SY01_khbgsp_xgzz_fwList;
      if (licMasterList[l].auth_type == 1 || licMasterList[l].auth_type == "1") {
        for (let z = 0; z < licChildList.length; z++) {
          if (licChildList[z]._status == "Delete") {
            continue;
          }
          licchildScopeType1.push(licChildList[z].extend_pro_auth_type);
        }
      } else if (licMasterList[l].auth_type == 2 || licMasterList[l].auth_type == "2") {
        for (let z = 0; z < licChildList.length; z++) {
          if (licChildList[z]._status == "Delete") {
            continue;
          }
          licchildScopeType2.push(licChildList[z].extend_protype_auth_type);
        }
      } else if (licMasterList[l].auth_type == 3 || licMasterList[l].auth_type == "3") {
        for (let z = 0; z < licChildList.length; z++) {
          if (licChildList[z]._status == "Delete") {
            continue;
          }
          licchildScopeType3.push(licChildList[z].extend_dosage_auth_type);
        }
      }
    }
    let errInfo = [];
    for (let s = 0; s < licFwMasterList.length; s++) {
      if (licFwMasterList[s]._status == "Delete") {
        continue;
      }
      let index = licMasterScopeType.indexOf(licFwMasterList[s].sqtype);
      if (index != -1) {
        let licFwChildList = licFwMasterList[s].SY01_khbgsp_sqwts_lList;
        if (licFwMasterList[s].sqtype == 1 || licFwMasterList[s].sqtype == "1") {
          for (let w = 0; w < licFwChildList.length; w++) {
            if (licFwChildList[w]._status == "Delete") {
              continue;
            }
            let index1 = licchildScopeType1.indexOf(licFwChildList[w].extend_pro_auth_type);
            if (index1 == -1) {
              errInfo.push("第" + (s + 1) + "个授权委托书的第" + (w + 1) + "个授权物料不在证照授权物料的范围内,无法进行委托书授权 \n ");
            }
          }
        } else if (licFwMasterList[s].sqtype == 2 || licFwMasterList[s].sqtype == "2") {
          for (let w = 0; w < licFwChildList.length; w++) {
            if (licFwChildList[w]._status == "Delete") {
              continue;
            }
            let index1 = licchildScopeType2.indexOf(licFwChildList[w].extend_protype_auth_type);
            if (index1 == -1) {
              errInfo.push("第" + (s + 1) + "个授权委托书的第" + (w + 1) + "个授权范围类型不在证照授权GSP商品分类的范围内,无法进行委托书授权 \n ");
            }
          }
        } else if (licFwMasterList[s].sqtype == 3 || licFwMasterList[s].sqtype == "3") {
          for (let w = 0; w < licFwChildList.length; w++) {
            if (licFwChildList[w]._status == "Delete") {
              continue;
            }
            let index1 = licchildScopeType3.indexOf(licFwChildList[w].extend_dosage_auth_type);
            if (index1 == -1) {
              errInfo.push("第" + (s + 1) + "个授权委托书的第" + (w + 1) + "个授权剂型不在证照授权剂型的范围内,无法进行委托书授权 \n ");
            }
          }
        }
      } else {
        errInfo.push("第" + (s + 1) + "个授权委托书的授权类型不在证照授权类型的范围内,无法进行委托书授权 \n ");
      }
    }
    if (errInfo.length > 0) {
      cb.utils.alert(errInfo);
      return false;
    }
    //管控项目
    let manageOptions = new Set();
    if (viewModel.get("gxysgz1").getValue() == 1) {
      manageOptions.add("购销员上岗证");
    }
    if (viewModel.get("gxht").getValue() == 1) {
      manageOptions.add("购销合同");
    }
    if (viewModel.get("zlbzxy1").getValue() == 1) {
      manageOptions.add("质量保证协议");
    }
    let rows = viewModel.getGridModel("sy01_customer_change_reportList").getRows();
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
  switchDisplayFields = function (gridModel, number) {
    let fields = ["extend_pro_auth_type_name", "extend_protype_auth_type_catagoryname", "extend_dosage_auth_type_dosagaFormName", "item198sf", "item300pf", "item403oi", "item456ye"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
    }
    switch (number) {
      case 0:
        gridModel.setColumnState("extend_pro_auth_type_name", "visible", true);
        gridModel.setColumnState("item198sf", "visible", true);
        gridModel.setColumnState("item300pf", "visible", true);
        gridModel.setColumnState("item403oi", "visible", true);
        gridModel.setColumnState("item456ye", "visible", true);
        break;
      case 1:
        gridModel.setColumnState("extend_protype_auth_type_catagoryname", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("extend_dosage_auth_type_dosagaFormName", "visible", true);
        break;
    }
  };
  setSubData = function (viewModel, customerInfo) {
    let lincenseGrid = viewModel.getGridModel("SY01_khbgsp_xgzzList");
    let authScope = viewModel.getGridModel("SY01_khbgsp_sqwtsList");
    let reportGridModel = viewModel.getGridModel("sy01_customer_change_reportList");
    lincenseGrid.deleteAllRows();
    authScope.deleteAllRows();
    reportGridModel.deleteAllRows();
    let customerLincenseList = customerInfo.sy01_kh_xgzzList;
    if (typeof customerLincenseList != "undefined") {
      for (let i = 0; i < customerLincenseList.length; i++) {
        let item = {};
        let fwArray = [];
        //状态为Insert
        item._status = "Insert";
        //证照参照id
        item.license = customerLincenseList[i].extend_zzmc;
        //证照参照名称
        item.license_licenseName = customerLincenseList[i].extend_zzmc_licenseName;
        //授权类型
        item.auth_type = customerLincenseList[i].extend_sqlx;
        //证照号码
        item.licenseNo = customerLincenseList[i].extend_zzhm;
        //发证机关
        item.licenseGiver = customerLincenseList[i].extend_fzjg;
        //发证日期
        item.licenseBeginDate = customerLincenseList[i].extend_fzrq;
        //有效期至
        item.licenseEndDate = customerLincenseList[i].extend_yxqz;
        //行备注
        item.entryRemark = customerLincenseList[i].extend_hbz;
        //显示用证照
        item.isLicenseDisplay1 = customerLincenseList[i].extend_xszz;
        //关联id
        item.relate_id = customerLincenseList[i].id;
        let customerLincenseFwList = customerLincenseList[i].sy01_kh_xgzz_fwList;
        if (typeof customerLincenseFwList != "undefined") {
          for (let j = 0; j < customerLincenseFwList.length; j++) {
            fwArray.push({
              _status: "Insert",
              extend_pro_auth_type: customerLincenseFwList[j].extend_pro_auth_type,
              extend_pro_auth_type_name: customerLincenseFwList[j].extend_pro_auth_type_name,
              extend_protype_auth_type: customerLincenseFwList[j].extend_protype_auth_type,
              extend_protype_auth_type_catagoryname: customerLincenseFwList[j].extend_protype_auth_type_catagoryname,
              extend_dosage_auth_type: customerLincenseFwList[j].extend_dosage_auth_type,
              extend_dosage_auth_type_dosagaFormName: customerLincenseFwList[j].extend_dosage_auth_type_dosagaFormName,
              range_relate_id: customerLincenseFwList[j].id
            });
          }
        }
        item.SY01_khbgsp_xgzz_fwList = fwArray;
        lincenseGrid.appendRow(item);
      }
    }
    let customerAuthList = customerInfo.sy01_khsqwtsList;
    if (typeof customerAuthList != "undefined") {
      for (let i = 0; i < customerAuthList.length; i++) {
        let item = {};
        let fwArray = [];
        //状态为Insert
        item._status = "Insert";
        //委托人类型
        item.entrust_type = customerAuthList[i].extend_wtrlx;
        //人员
        item.khbg_saleman = customerAuthList[i].extend_ywy;
        item.khbg_saleman_businesserName = customerAuthList[i].extend_ywy_businesserName;
        //授权开始日期
        item.sqbegindate = customerAuthList[i].extend_sqksrq;
        //授权结束日期
        item.sqenddate = customerAuthList[i].extend_sqjsrq;
        //是否默认
        item.isdefault = customerAuthList[i].extend_sfmr;
        //职务
        item.post = customerAuthList[i].extend_zw;
        //授权类型
        item.sqtype = customerAuthList[i].extend_sqlx;
        //授权地域
        item.sqarea = customerAuthList[i].extend_sqdy;
        //是否禁用
        item.isban = customerAuthList[i].extend_sfjy;
        //关联id
        item.relate_id = customerAuthList[i].id;
        //身份证号
        item.identityno = customerAuthList[i].extend_identityno;
        item.phone = customerAuthList[i].extend_phone;
        let customerAuthFwList = customerAuthList[i].sy01_khsqwts_sqfwList;
        if (typeof customerAuthFwList != "undefined") {
          for (let j = 0; j < customerAuthFwList.length; j++) {
            fwArray.push({
              _status: "Insert",
              extend_pro_auth_type: customerAuthFwList[j].extend_pro_auth_type,
              extend_pro_auth_type_name: customerAuthFwList[j].extend_pro_auth_type_name,
              extend_protype_auth_type: customerAuthFwList[j].extend_protype_auth_type,
              extend_protype_auth_type_catagoryname: customerAuthFwList[j].extend_protype_auth_type_catagoryname,
              extend_dosage_auth_type: customerAuthFwList[j].extend_dosage_auth_type,
              extend_dosage_auth_type_dosagaFormName: customerAuthFwList[j].extend_dosage_auth_type_dosagaFormName,
              range_relate_id: customerAuthFwList[j].id
            });
          }
        }
        item.SY01_khbgsp_sqwts_lList = fwArray;
        authScope.appendRow(item);
      }
    }
    let customerReports = customerInfo.sy01_kh_other_reportList;
    if (customerReports != undefined) {
      let recordList = [];
      for (let i = 0; i < customerReports.length; i++) {
        let item = {};
        item._status = "Insert";
        item.report = customerReports[i].extend_report;
        item.report_name = customerReports[i].extend_report_name;
        item.begin_date = customerReports[i].extend_pzrq;
        item.end_date = customerReports[i].extend_yxqz;
        item.file = customerReports[i].extend_fille;
        item.related_id = customerReports[i].id;
        recordList.push(item);
      }
      reportGridModel.setDataSource(recordList);
    }
  };
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
  getCustomerInfo = function (customerCode, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryMerchantInfor", { code: customerCode, orgId: orgId }, function (err, res) {
        if (typeof res !== "undefined") {
          customerInfo = res.merchantInfo;
          viewModel.get("qualitysystem").setValue(customerInfo.extend_zlbztx); //质量保证体系
          viewModel.get("electron_supervision_code").setValue(customerInfo.extend_dzjgbm); //电子监管编码
          viewModel.get("importantlicense").setValue(customerInfo.extend_zyzz); //重要证照
          viewModel.get("isgsp1").setValue(customerInfo.extend_is_gsp); //GSP认证证书
          viewModel.get("xgyz1").setValue(customerInfo.extend_xgyz); //印章及随货同行票样
          viewModel.get("caigouweituoshu1").setValue(customerInfo.extend_caigouweituoshu); //采购委托书
          viewModel.get("qyswdjz1").setValue(customerInfo.extend_qyswdjz); //企业税务登记证
          viewModel.get("gxysgz1").setValue(customerInfo.extend_gxysgz); //购销员上岗证
          viewModel.get("zlbzxy1").setValue(customerInfo.extend_zlbzxy); //质量保证协议
          viewModel.get("gxysfz1").setValue(customerInfo.extend_gxysfz); //购销员身份证
          viewModel.get("zzjgdz1").setValue(customerInfo.extend_zzjgdz); //组织机构代证
          viewModel.get("yaopinjingyingqiyexukezheng").setValue(customerInfo.extend_ypjyqyxkz); //药品经营许可证
          viewModel.get("isgmp1").setValue(customerInfo.extend_isgmp); //GMP认证证书
          viewModel.get("gxht").setValue(customerInfo.extend_gxht); //购销合同
          viewModel.get("ndbg").setValue(customerInfo.extend_ndbg); //年度报告
          viewModel.get("customertype").setValue(customerInfo.extend_khfl); //gsp客户分类
          viewModel.get("customertype_typename").setValue(customerInfo.extend_khfl_typename); //gsp客户分类名称
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
};