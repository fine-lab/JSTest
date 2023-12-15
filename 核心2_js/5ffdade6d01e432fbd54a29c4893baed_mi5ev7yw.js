run = function (event) {
  //首营供应商表单----页面初始化
  var viewModel = this;
  //相关证照
  const licenseGridModelInfo = viewModel.get("SY01_syqysp_xgzzv4List");
  //相关证照-范围
  const scopeGridModelInfo = viewModel.getGridModel("SY01_syqysp_xgzz_v4List");
  //授权委托书
  const licenseFwGridModelInfo = viewModel.get("SY01_poavv4List");
  //授权委托书-范围
  const scopeFwGridModelInfo = viewModel.getGridModel("SY01_poalv5List");
  let reportGridModel = viewModel.getGridModel("sy01_vendor_other_reportList");
  scopeGridModelInfo.setShowCheckbox(false);
  licenseGridModelInfo.setShowCheckbox(false);
  scopeFwGridModelInfo.setShowCheckbox(false);
  licenseFwGridModelInfo.setShowCheckbox(false);
  viewModel.on("modeChange", function (data) {
    if (data === "browse") {
      //设置增行，删行不可见
      viewModel.get("button37mi").setVisible(false);
      viewModel.get("button42ec").setVisible(false);
    } else if (data == "edit") {
      viewModel.get("button37mi").setVisible(true);
      viewModel.get("button42ec").setVisible(true);
    }
  });
  //证照-范围-物料过滤
  scopeFwGridModelInfo
    .getEditRowModel()
    .get("extend_pro_auth_type_name")
    .on("beforeBrowse", function (data) {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "isDeleted",
          op: "in",
          value1: ["false", false, 0, "0"]
        },
        {
          field: "extend_syzt",
          op: "eq",
          value1: 1
        }
      );
      this.setFilter(condition);
    });
  //授权委托-范围-物料过滤
  scopeGridModelInfo
    .getEditRowModel()
    .get("extend_pro_auth_type_name")
    .on("beforeBrowse", function (data) {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "isDeleted",
          op: "in",
          value1: ["false", false, 0, "0"]
        },
        {
          field: "extend_syzt",
          op: "eq",
          value1: 1
        }
      );
      this.setFilter(condition);
    });
  //供应商过滤
  viewModel.get("supplier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "vendorApplyRange.org",
        op: "eq",
        value1: orgId
      },
      {
        field: "extend_is_gsp",
        op: "in",
        value1: [1, true, "1", "true"]
      },
      {
        field: "extend_first_status",
        op: "neq",
        value1: 2
      }
    );
    this.setFilter(condition);
  });
  //业务员过滤
  licenseFwGridModelInfo
    .getEditRowModel()
    .get("saleman_businesserName")
    .on("beforeBrowse", function (data) {
      let orgId = viewModel.get("org_id").getValue();
      let supplier = viewModel.get("supplier").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "osupplier",
        op: "in",
        value1: supplier
      });
      this.setFilter(condition);
    });
  viewModel.get("btnAddRowSY01_syqysp_xgzzv4").on("click", function (data) {
    const indexCell = licenseGridModelInfo.getFocusedRowIndex();
    let supplier = viewModel.get("supplier").getValue();
    let supplier_name = viewModel.get("supplier_name").getValue(); //供应商名称
    let supplier_code = viewModel.get("supplier_code").getValue(); //供应商编码
    licenseGridModelInfo.setCellValue(indexCell, "supplier_id", supplier);
    licenseGridModelInfo.setCellValue(indexCell, "supplier_code", supplier_code);
    licenseGridModelInfo.setCellValue(indexCell, "supplier_name", supplier_name);
  });
  viewModel.get("btnAddRowSY01_poavv4").on("click", function (data) {
    const indexCellSQ = licenseFwGridModelInfo.getFocusedRowIndex();
    let supplier = viewModel.get("supplier").getValue();
    let supplier_name = viewModel.get("supplier_name").getValue(); //供应商名称
    let supplier_code = viewModel.get("supplier_code").getValue(); //供应商编码
    licenseFwGridModelInfo.setCellValue(indexCellSQ, "supplier_id", supplier);
    licenseFwGridModelInfo.setCellValue(indexCellSQ, "supplier_code", supplier_code);
    licenseFwGridModelInfo.setCellValue(indexCellSQ, "supplier_name", supplier_name);
  });
  viewModel.get("button37mi").on("click", function (data) {
    const indexCell = reportGridModel.getFocusedRowIndex();
    let supplier = viewModel.get("supplier").getValue();
    let supplier_name = viewModel.get("supplier_name").getValue(); //供应商名称
    let supplier_code = viewModel.get("supplier_code").getValue(); //供应商编码
    reportGridModel.setCellValue(indexCell, "supplier_id", supplier);
    reportGridModel.setCellValue(indexCell, "supplier_code", supplier_code);
    reportGridModel.setCellValue(indexCell, "supplier_name", supplier_name);
  });
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    let currentState = viewModel.getParams().mode;
    if (currentState == "browse") {
      return;
    }
    const licenseRows = licenseGridModelInfo.getRows();
    let lRows = [];
    for (let l = 0; l < licenseRows.length; l++) {
      lRows[l] = l;
    }
    const licenseFwRows = licenseFwGridModelInfo.getRows();
    let lFwRows = [];
    for (let ls = 0; ls < licenseFwRows.length; ls++) {
      lFwRows[ls] = ls;
    }
    const scopeRows = scopeGridModelInfo.getRows();
    let sRows = [];
    for (let s = 0; s < scopeRows.length; s++) {
      sRows[s] = s;
    }
    const scopeFwRows = scopeFwGridModelInfo.getRows();
    let sFwRows = [];
    for (let ss = 0; ss < scopeFwRows.length; ss++) {
      sFwRows[ss] = ss;
    }
    licenseGridModelInfo.deleteRows(lRows);
    licenseFwGridModelInfo.deleteRows(lFwRows);
    scopeGridModelInfo.deleteRows(sRows);
    scopeFwGridModelInfo.deleteRows(sFwRows);
    let supplier = viewModel.get("supplier").getValue();
    let supplier_code = viewModel.get("supplier_code").getValue(); //供应商编码
    let supplier_name = viewModel.get("supplier_name").getValue(); //供应商名称
    cb.rest.invokeFunction(
      "GT22176AT10.backDefaultGroup.getSupplierChildInfo",
      {
        supplier: supplier,
        supplier_code: supplier_code
      },
      function (err, res) {
        let supplierEmpower = JSON.parse(res.supplierEmpower);
        console.log(supplierEmpower);
        viewModel.get("extend_dzjgbm").setValue(supplierEmpower.extend_ele_supervision_code); //dian子监管编码
        viewModel.get("qualitysystem").setValue(supplierEmpower.extend_qc_assurance_system); //质量保证体系
        viewModel.get("importantlicense").setValue(supplierEmpower.extend_import_license); //重要证照
        viewModel.get("gsp_vendor_type").setValue(supplierEmpower.extend_gsp_supplier_catgrory); //GSP供应商分类
        viewModel.get("gmplicense").setValue(supplierEmpower.extend_gmp_license); //GMP认证证书
        viewModel.get("gsplicense").setValue(supplierEmpower.extend_gsplicense); //GSP认证证书
        viewModel.get("sealandticket").setValue(supplierEmpower.extend_sealandticket); //印章及随货同行票样
        viewModel.get("purandsaleondutycer").setValue(supplierEmpower.extend_purandsaleondutycer); //购销人员上岗证
        viewModel.get("qualityguaagreement").setValue(supplierEmpower.extend_qualityguaagreement); //质量保证协议
        viewModel.get("purandsalecertificates").setValue(supplierEmpower.extend_purandsalecertificates); //购销人员证件
        viewModel.get("orgcertificate").setValue(supplierEmpower.extend_orgcertificate); //组织机构代码证
        viewModel.get("license").setValue(supplierEmpower.extend_license); //营业执照
        viewModel.get("phaproducerlicense").setValue(supplierEmpower.extend_durg_create_licence); //药品生产企业许可证
        viewModel.get("phamanagelicense").setValue(supplierEmpower.extend_durg_jy_license); //药品经营企业许可证
        viewModel.get("legalpersonpaper").setValue(supplierEmpower.extend_legalpersonpaper); //法人委托书
        viewModel.get("gsp_vendor_type").setValue(supplierEmpower.extend_gsp_supplier_catgrory); //GSP供应商分类
        viewModel.get("gsp_vendor_type_catagoryName").setValue(supplierEmpower.extend_gsp_supplier_catgrory_catagoryName); //GSP供应商分类名称
        viewModel.get("extend_purchase_status").setValue(supplierEmpower.extend_purchase_status); //供应商采购状态
        viewModel.get("gxht").setValue(supplierEmpower.extend_gxht); //供应商购销合同
        viewModel.get("ndbg").setValue(supplierEmpower.extend_year); //供应商年度报告
        //授权委托书
        let gyssqwtsList = supplierEmpower.attorney_authList; //授权委托书子表
        if (typeof gyssqwtsList !== "undefined") {
          if (gyssqwtsList.length > 0) {
            //表格删行功能 入参：rowIndexes:行号集合 [0,1]
            gyssqwtsList.forEach(function (wtslist) {
              let wtsfwList = wtslist.scope_authorityList; //授权委托书范围孙表
              let rowDatas = {
                sqtype: wtslist.extend_auth_scope, //授权范围
                client_type: wtslist.extend_attormey_type, //委托人类型
                saleman: wtslist.extend_salesman, //业务员ID
                saleman_businesserName: wtslist.extend_salesman_businesserName, //业务员名称
                post: wtslist.extend_duties, //职务
                sqbegindate: wtslist.extend_start_date, //授权开始日期
                sqenddate: wtslist.extend_end_date, //授权结束日期
                sqarea: wtslist.extend_area, //授权地域
                isban: wtslist.extend_disable, //是否禁用
                isdefault: wtslist.extend_is_default, //是否默认
                identityno: wtslist.extend_id_code, //身份证号
                relate_id: wtslist.id
              };
              let fwDatas = [];
              if (typeof wtsfwList != "undefined" && wtsfwList.length > 0) {
                wtsfwList.forEach(function (fwlist) {
                  fwDatas.push({
                    poarange: fwlist.extend_attorrmey_scope,
                    extend_pro_auth_type: fwlist.extend_pro_auth_type,
                    extend_pro_auth_type_name: fwlist.extend_pro_auth_type_name,
                    extend_protype_auth_type: fwlist.extend_protype_auth_type,
                    extend_protype_auth_type_catagoryname: fwlist.extend_protype_auth_type_catagoryname,
                    extend_dosage_auth_type: fwlist.extend_dosage_auth_type,
                    extend_dosage_auth_type_dosagaFormName: fwlist.extend_dosage_auth_type_dosagaFormName,
                    range_relate_id: fwlist.id
                  });
                });
              }
              rowDatas.SY01_gysbg_sqwt_lList = fwDatas;
              licenseFwGridModelInfo.appendRow(rowDatas);
            });
          }
        }
        //相关证照
        let xgzzList = supplierEmpower.extend_lincenseList;
        let zzfwList = {};
        if (typeof xgzzList != "undefined") {
          //表格删行功能 入参：rowIndexes:行号集合 [0,1]
          xgzzList.forEach(function (zzlist) {
            zzfwList = zzlist.extend_licenseScopeList;
            var rowDatas = {
              license: zzlist.extend_license_name, //相关证照
              license_name: zzlist.extend_license_name, //证照名称
              licenseNo: zzlist.extend_license_code, //证照编码
              license_auth_type: zzlist.extend_auth_type_v2, //证照授权类型
              licenseGiver: zzlist.extend_organ, //发证机关
              licenseBeginDate: zzlist.extend_get_date, //发证日期
              isLicenseDisplay: zzlist.extend_is_display, //是否显示证照
              licenseEndDate: zzlist.extend_end_validity_date, //有效期至
              entryRemark: zzlist.extend_line_comment, //行备注
              relate_id: zzlist.id
            };
            const Param = {};
            //设置参照编码、参照类型（grid\Tree\TreeList）
            Param.refCode = "sy01.RefTable_9df28d7491";
            Param.dataType = "grid";
            //设置行数据
            //通过参照接口，获取最新name值
            const proxy = viewModel.setProxy({
              getRefData: {
                url: "bill/ref/getRefData",
                method: "POST"
              }
            });
            const condition = {
              isExtend: true,
              simpleVOs: []
            };
            condition.simpleVOs.push({
              field: "id",
              op: "eq",
              value1: zzlist.extend_license_name
            });
            Object.assign(Param, { condition: condition });
            const indexCell = licenseGridModelInfo.getFocusedRowIndex();
            proxy.getRefData(Param, function (error, result) {
              if (result.recordList.length > 0) {
                licenseGridModelInfo.setCellValue(indexCell + 1, "license_licenseName", result.recordList[0].licenseName);
              }
            });
            let fwDatas = [];
            if (zzfwList != undefined && zzfwList.length > 0) {
              zzfwList.forEach(function (zzfwSunlist) {
                fwDatas.push({
                  range: zzfwSunlist.extend_scope,
                  extend_pro_auth_type: zzfwSunlist.extend_pro_auth_type,
                  extend_pro_auth_type_name: zzfwSunlist.extend_pro_auth_type_name,
                  extend_protype_auth_type: zzfwSunlist.extend_protype_auth_type,
                  extend_protype_auth_type_catagoryname: zzfwSunlist.extend_protype_auth_type_catagoryname,
                  extend_dosage_auth_type: zzfwSunlist.extend_dosage_auth_type,
                  extend_dosage_auth_type_dosagaFormName: zzfwSunlist.extend_dosage_auth_type_dosagaFormName,
                  range_relate_id: zzfwSunlist.id
                });
                //表格增行操作
              });
            }
            rowDatas.SY01_gysbgsp_xgzz_lList = fwDatas;
            licenseGridModelInfo.appendRow(rowDatas);
          });
        }
        let licRows = licenseGridModelInfo.getRows();
        let WTSRows = licenseFwGridModelInfo.getRows();
        let ZZBGRows = reportGridModel.getRows();
        for (let i = 0; i < licRows.length; i++) {
          licenseGridModelInfo.setCellValue(i, "supplier_id", supplier);
          licenseGridModelInfo.setCellValue(i, "supplier_code", supplier_code);
          licenseGridModelInfo.setCellValue(i, "supplier_name", supplier_name);
        }
        for (let i = 0; i < WTSRows.length; i++) {
          licenseFwGridModelInfo.setCellValue(i, "supplier_id", supplier);
          licenseFwGridModelInfo.setCellValue(i, "supplier_code", supplier_code);
          licenseFwGridModelInfo.setCellValue(i, "supplier_name", supplier_name);
        }
        for (let i = 0; i < ZZBGRows.length; i++) {
          reportGridModel.setCellValue(i, "supplier_id", supplier);
          reportGridModel.setCellValue(i, "supplier_code", supplier_code);
          reportGridModel.setCellValue(i, "supplier_name", supplier_name);
        }
      }
    );
  });
  //相关证照授权范围切换时，删除孙表,将列换成对应的参照
  licenseGridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "license_auth_type" && data.value != data.oldValue) {
      scopeGridModelInfo.deleteAllRows();
      switchDisplayFields(scopeGridModelInfo, data.value - 1);
    }
  });
  //初始化时参照查询值
  scopeGridModelInfo.on("beforeSetDataSource", function (data) {
    let sqType = licenseGridModelInfo.getCellValue(licenseGridModelInfo.getFocusedRowIndex(), "license_auth_type");
    switchDisplayFields(scopeGridModelInfo, sqType - 1);
  });
  //授权委托书
  licenseFwGridModelInfo.on("afterCellValueChange", function (data) {
    if (data.cellName == "sqtype" && data.oldValue != data.value) {
      //清空范围
      scopeFwGridModelInfo.deleteAllRows();
      switchDisplayFields(scopeFwGridModelInfo, data.value - 1);
    }
  });
  //初始化时参照查询值
  scopeFwGridModelInfo.on("beforeSetDataSource", function (data) {
    let sqType = licenseFwGridModelInfo.getCellValue(licenseFwGridModelInfo.getFocusedRowIndex(), "sqtype");
    switchDisplayFields(scopeFwGridModelInfo, sqType - 1);
  });
  //控制其他资质与报告中,生效日期必须小于生效日期
  reportGridModel.on("beforeCellValueChange", function (data) {
    let begin_date = reportGridModel.getCellValue(data.rowIndex, "begin_date");
    let end_date = reportGridModel.getCellValue(data.rowIndex, "end_date");
    if (data.cellName == "begin_date") {
      if (data.value > syqysp_parseDate(new Date())) {
        cb.utils.alert("生效日期不能大于当前日期", "error");
        return false;
      }
      if (data.value != undefined && end_date != undefined && data.value > end_date) {
        cb.utils.alert("生效日期不能大于失效日期", "error");
        return false;
      }
    }
    if (data.cellName == "end_date") {
      if (data.value != undefined && begin_date != undefined && data.value < begin_date) {
        cb.utils.alert("失效日期不能小于生效日期", "error");
        return false;
      }
    }
    return true;
  });
  switchDisplayFields = function (gridModel, number) {
    let fields = ["extend_pro_auth_type_name", "extend_protype_auth_type_catagoryname", "extend_dosage_auth_type_dosagaFormName", "item180ze", "item266dj", "item353jf", "item394gg"];
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
    }
    switch (number) {
      case 0:
        gridModel.setColumnState("extend_pro_auth_type_name", "visible", true);
        gridModel.setColumnState("item180ze", "visible", true);
        gridModel.setColumnState("item266dj", "visible", true);
        gridModel.setColumnState("item353jf", "visible", true);
        gridModel.setColumnState("item394gg", "visible", true);
        break;
      case 1:
        gridModel.setColumnState("extend_protype_auth_type_catagoryname", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("extend_dosage_auth_type_dosagaFormName", "visible", true);
        break;
    }
  };
  viewModel.on("beforeSave", function (data) {
    //证照主表:licenseGridModelInfo   证照孙表:scopeGridModelInfo
    //授权委托书主表:licenseFwGridModelInfo   授权委托书孙表:scopeFwGridModelInfo
    let licMasterList = licenseGridModelInfo.getRows();
    let licFwMasterList = licenseFwGridModelInfo.getRows();
    let licMasterScopeType = [];
    let licchildScopeType1 = [];
    let licchildScopeType2 = [];
    let licchildScopeType3 = [];
    for (let l = 0; l < licMasterList.length; l++) {
      if (licMasterList[l]._status == "Delete") {
        continue;
      }
      licMasterScopeType.push(licMasterList[l].license_auth_type);
      let licChildList = licMasterList[l].SY01_syqysp_xgzz_v4List;
      if (licMasterList[l].license_auth_type == 1 || licMasterList[l].license_auth_type == "1") {
        for (let z = 0; z < licChildList.length; z++) {
          if (licChildList[z]._status == "Delete") {
            continue;
          }
          licchildScopeType1.push(licChildList[z].extend_pro_auth_type);
        }
      } else if (licMasterList[l].license_auth_type == 2 || licMasterList[l].license_auth_type == "2") {
        for (let z = 0; z < licChildList.length; z++) {
          if (licChildList[z]._status == "Delete") {
            continue;
          }
          licchildScopeType2.push(licChildList[z].extend_protype_auth_type);
        }
      } else if (licMasterList[l].license_auth_type == 3 || licMasterList[l].license_auth_type == "3") {
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
        let licFwChildList = licFwMasterList[s].SY01_poalv5List;
        if (licFwMasterList[s].sqtype == 1 || licFwMasterList[s].sqtype == "1") {
          for (let w = 0; w < licFwChildList.length; w++) {
            if (licFwChildList[w]._status == "Delete") {
              continue;
            }
            let index1 = licchildScopeType1.indexOf(licFwChildList[w].extend_pro_auth_type);
            if (index1 == -1) {
              errInfo.push("第" + (s + 1) + "个授权委托书的第" + (w + 1) + "个授权范围类型不在证照授权物料的范围内,无法进行委托书授权 \n ");
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
          for (let w = 0; w < licFwChildList3.length; w++) {
            if (licFwChildList[w]._status == "Delete") {
              continue;
            }
            let index1 = licchildScopeType.indexOf(licFwChildList[w].extend_dosage_auth_type);
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
    if (viewModel.get("purandsaleondutycer").getValue() == 1) {
      manageOptions.add("购销员上岗证");
    }
    if (viewModel.get("gxht").getValue() == 1) {
      manageOptions.add("购销合同");
    }
    if (viewModel.get("qualityguaagreement").getValue() == 1) {
      manageOptions.add("质量保证协议");
    }
    if (viewModel.get("ndbg").getValue() == 1) {
      manageOptions.add("年度报告");
    }
    let rows = viewModel.getGridModel("sy01_vendor_other_reportList").getRows();
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
  viewModel.on("beforeUnaudit", function (args) {
    cb.utils.alert("首营单据不允许弃审,如有改动请做变更", "error");
    return false;
  });
  function syqysp_parseDate(date) {
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
};