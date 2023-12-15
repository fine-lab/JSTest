function ChangeOfQualificationFile(event) {
  var viewModel = this;
  //原客户经营范围(子表)
  var oldNOBModel = viewModel.get("XPH_OldCQFCOrderList");
  //新客户经营范围(子表)
  var newNOBModel = viewModel.get("XPH_NewCQFCOrderList");
  //企业编码 路径->viewModel.__data.enterpriseCode_code
  let enterpriseCodeModel = viewModel.get("enterpriseCode_code");
  //类型名称 路径->viewModel.__data.qualificationCode_code
  let qualificationCodeModel = viewModel.get("qualificationCode_code");
  //通过企业编码和类型名称调用后端api查询供应商资质档案
  //设置企业编码默认值为null
  let enterpriseCode = null;
  //设置类型编码默认值为null
  let qualificationCode = null;
  //企业编码事件
  enterpriseCodeModel.on("beforeValueChange", function (event) {
    //清空表体数据
    oldNOBModel.deleteAllRows();
    newNOBModel.deleteAllRows();
    //企业编码model
    const enterpriseCodeModel = this;
    enterpriseCode === null;
    //对value进行判断,如果value有值,则将值赋给'enterpriseCode'
    if (typeof event.value == "undefined" || event.value === null) {
      return;
    } else {
      enterpriseCode = event.value.code;
    }
    // 调用后端API函数
    if (qualificationCode && enterpriseCode && qualificationCodeModel.get("value")) {
      addNOBDatas();
    } else {
      clearHeadDatas();
    }
  });
  //类型编码事件
  qualificationCodeModel.on("beforeValueChange", function (event) {
    //清空表体数据
    oldNOBModel.deleteAllRows();
    newNOBModel.deleteAllRows();
    const qualificationCodeModel = this;
    qualificationCode === null;
    //对value进行判断,如果value有值,则将值赋给'qualificationCode'
    if (typeof event.value == "undefined" || event.value === null) {
      return;
    } else {
      qualificationCode = event.value.code;
    }
    // 调用后端API函数
    if (qualificationCode && enterpriseCode && enterpriseCodeModel.get("value")) {
      addNOBDatas();
    } else {
      clearHeadDatas();
    }
  });
  //表体单元格值改变后时事件:四选一,有一则其他不可编辑
  newNOBModel.on("afterCellValueChange", function (event) {
    const newNOBModel = this;
    selectOne(newNOBModel);
  });
  //根据企业编码和类型编码对应供应商资质档案添加档案的表数据
  function addNOBDatas() {
    var respResult = cb.rest.invokeFunction("739ce0b8eaef49e99e037e5e59e03ea6", { enterpriseCode: enterpriseCode, typeCode: qualificationCode }, null, viewModel, { async: false });
    if (typeof respResult.error != "undefined") {
      clearHeadDatas();
      cb.utils.alert('根据"企业编码"和"类型编码"查无此客户档案,请重新选择!');
      return false;
    }
    var resultData = respResult.result.XPH_QFileData.tableBody;
    var resultHeadData = respResult.result.XPH_QFileData.tableHead;
    //添加表头数据
    if (typeof resultHeadData.code != "undefined") {
      viewModel.get("oldQualificationCode").setValue(resultHeadData.code); //原资质编码
      viewModel.get("newQualificationCode").setValue(resultHeadData.code); //新资质编码
    }
    if (typeof resultHeadData.name != "undefined") {
      viewModel.get("oldQualificationName").setValue(resultHeadData.name); //原资质名称
      viewModel.get("newQualificationName").setValue(resultHeadData.name); //新资质名称
    }
    if (typeof resultHeadData.effectiveControl != "undefined") {
      viewModel.get("oldValidityControl").setValue(resultHeadData.effectiveControl); //原效期控制
      viewModel.get("newValidityControl").setValue(resultHeadData.effectiveControl); //新效期控制
    }
    if (typeof resultHeadData.effectiveDate != "undefined") {
      viewModel.get("oldEffectiveDate").setValue(resultHeadData.effectiveDate); //原生效日期
      viewModel.get("newEffectiveDate").setValue(resultHeadData.effectiveDate); //新生效日期
    }
    if (typeof resultHeadData.issueAuthority != "undefined") {
      viewModel.get("oldIssuingAuthority").setValue(resultHeadData.issueAuthority); //原颁发机构
      viewModel.get("newIssuingAuthority").setValue(resultHeadData.issueAuthority); //新颁发机构
    }
    if (typeof resultHeadData.issueDate != "undefined") {
      viewModel.get("oldDateOfIssue").setValue(resultHeadData.issueDate); //原颁发日期
      viewModel.get("newDateOfIssue").setValue(resultHeadData.issueDate); //新颁发日期
    }
    if (typeof resultHeadData.manageMode != "undefined") {
      viewModel.get("oldModeOfOperation").setValue(resultHeadData.manageMode); //原经营方式
      viewModel.get("newModeOfOperation").setValue(resultHeadData.manageMode); //新经营方式
    }
    if (typeof resultHeadData.manageScope != "undefined") {
      viewModel.get("oldNatureOfBusiness").setValue(resultHeadData.manageScope); //原经营范围
      viewModel.get("newNatureOfBusiness").setValue(resultHeadData.manageScope); //新经营范围
    }
    if (typeof resultHeadData.share != "undefined") {
      viewModel.get("oldShare").setValue(resultHeadData.share); //原是否共享
      viewModel.get("newShare").setValue(resultHeadData.share); //新是否共享
    }
    if (typeof resultHeadData.validUntil != "undefined") {
      viewModel.get("oldDueDate").setValue(resultHeadData.validUntil); //原有效期至
      viewModel.get("newDueDate").setValue(resultHeadData.validUntil); //新有效期至
    }
    if (typeof resultHeadData.warningDays != "undefined") {
      viewModel.get("oldApproachingWarningDays").setValue(resultHeadData.warningDays); //原预警天数
      viewModel.get("newApproachingWarningDays").setValue(resultHeadData.warningDays); //新预警天数
    }
    //添加表体数据
    let datas = [];
    for (var j = 0; j < resultData.length; j++) {
      let row = {};
      if (typeof resultData[j].productionManageCategoryName != "undefined") {
        row["productionAndOperationCategory"] = resultData[j].productionManageCategoryId;
        row["productionAndOperationCategory_name"] = resultData[j].productionManageCategoryName;
      } else if (typeof resultData[j].dosageName != "undefined") {
        row["dosageForm"] = resultData[j].dosageId;
        row["dosageForm_name"] = resultData[j].dosageName;
      } else if (typeof resultData[j].materielSortName != "undefined") {
        row["basicMaterialClassification"] = resultData[j].materielSortId;
        row["basicMaterialClassification_name"] = resultData[j].materielSortName;
      } else if (typeof resultData[j].materielCodeName != "undefined") {
        row["materialCode"] = resultData[j].materielCodeId;
        row["materialCode_code"] = resultData[j].materielCodeName;
      }
      if (typeof resultData[j].SKUCodeName != "undefined") {
        row["SKUCode"] = resultData[j].SKUCodeId;
        row["SKUCode_code"] = resultData[j].SKUCodeName;
      }
      datas.push(row);
    }
    oldNOBModel.insertRows(0, datas);
    newNOBModel.insertRows(0, datas);
    selectOne(newNOBModel);
  }
  //四选一方法
  function selectOne(newNOBModel) {
    const gridModel = newNOBModel;
    //获取列表所有数据
    let rows = gridModel.getRows();
    if (!rows || rows.length <= 0) {
      return;
    }
    var readOnlyFields = [];
    let len = rows.length;
    const cellStates = [];
    for (let i = 0; i < len; i++) {
      var pmcName = rows[i].productionAndOperationCategory_name;
      var msName = rows[i].basicMaterialClassification_name;
      var mcCode = rows[i].materialCode_code;
      var dNname = rows[i].dosageForm_name;
      if (
        (typeof pmcName == "undefined" || pmcName === null) &&
        (typeof msName == "undefined" || msName === null) &&
        (typeof mcCode == "undefined" || mcCode === null || mcCode === "") &&
        (typeof dNname == "undefined" || dNname === null)
      ) {
        gridModel.setCellState(i, "productionAndOperationCategory_name", "readOnly", false);
        gridModel.setCellState(i, "basicMaterialClassification_name", "readOnly", false);
        gridModel.setCellState(i, "materialCode_code", "readOnly", false);
        gridModel.setCellState(i, "dosageForm_name", "readOnly", false);
      } else {
        if ((typeof msName == "undefined" || msName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "") && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["basicMaterialClassification_name", "materialCode_code", "dosageForm_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "") && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["productionAndOperationCategory_name", "materialCode_code", "dosageForm_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof msName == "undefined" || msName === null) && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["productionAndOperationCategory_name", "basicMaterialClassification_name", "dosageForm_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof msName == "undefined" || msName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "")) {
          readOnlyFields = ["productionAndOperationCategory_name", "basicMaterialClassification_name", "materialCode_code"];
        }
        for (let field of readOnlyFields) {
          cellStates.push({ rowIndex: i, cellName: field, propertyName: "readOnly", value: true });
        }
        gridModel.setCellStates(cellStates);
      }
    }
    let b = 1;
  }
  //清空表头数据
  function clearHeadDatas() {
    //资质编码
    viewModel.get("oldQualificationCode").setValue();
    viewModel.get("newQualificationCode").setValue();
    //资质名称
    viewModel.get("oldQualificationName").setValue();
    viewModel.get("newQualificationName").setValue();
    //效期控制
    viewModel.get("oldValidityControl").setValue();
    viewModel.get("newValidityControl").setValue();
    //生效日期
    viewModel.get("oldEffectiveDate").setValue();
    viewModel.get("newEffectiveDate").setValue();
    //颁发机构
    viewModel.get("oldIssuingAuthority").setValue();
    viewModel.get("newIssuingAuthority").setValue();
    //颁发日期
    viewModel.get("oldDateOfIssue").setValue();
    viewModel.get("newDateOfIssue").setValue();
    //经营方式
    viewModel.get("oldModeOfOperation").setValue();
    viewModel.get("newModeOfOperation").setValue();
    //经营范围
    viewModel.get("oldNatureOfBusiness").setValue();
    viewModel.get("newNatureOfBusiness").setValue();
    //是否共享
    viewModel.get("oldShare").setValue();
    viewModel.get("newShare").setValue();
    //有效期至
    viewModel.get("oldDueDate").setValue();
    viewModel.get("newDueDate").setValue();
    //预警天数
    viewModel.get("oldApproachingWarningDays").setValue();
    viewModel.get("newApproachingWarningDays").setValue();
  }
}