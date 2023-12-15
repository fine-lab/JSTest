viewModel.get("product_registration_certificaList") &&
  viewModel.get("product_registration_certificaList").on("afterCellValueChange", function (data) {
    // 表格-产品注册证--单元格值改变后
  });
viewModel.on("customInit", function (data) {
  // 产品信息详情--页面初始化
  var gridModelGoods = viewModel.getGridModel("product_registration_certificaList");
  gridModelGoods.on("afterCellValueChange", function (params) {
    var newValue = params.value;
    var str1 = newValue.match(/\d+/g);
    var result = str1.join("");
    res = result.substring(4, 5);
    var rowIndex = params.rowIndex;
    var cellName = params.cellName;
    if (cellName == "product_umber") {
      gridModelGoods.setCellValue(rowIndex, "classOfmd", res);
    }
  });
});
viewModel.get("button30xi") &&
  viewModel.get("button30xi").on("click", function (data) {
    // 确认--单击
    debugger;
    var code = viewModel.get("product_coding").getValue();
    var enable = viewModel.get("enable").getValue();
    var ID = viewModel.get("id").getValue();
    //创建人
    var creator_userName = viewModel.get("creator_userName").getValue();
    //修改人
    var modifier_userName = viewModel.get("modifier_userName").getValue();
    var cancelAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.currentuser", { id: ID }, function (err, res) {}, viewModel, { async: false });
    // 确认人
    var cancelNames = cancelAPI.result.currentUser.name;
    if (enable == "1") {
      alert("产品编码为： " + code + " 单据的状态已经是启用状态无需再次启用！");
    } else {
      var registration_certificate_effective_date = viewModel.get("registration_certificate_effective_date").getValue();
      var timestamp = Date.parse(new Date());
      var registration_Date = Date.parse(registration_certificate_effective_date);
      if (timestamp > registration_Date) {
        alert("产品编码为： " + code + " 单据的产品注册证已过期不可启用！");
      } else {
        var state = 0;
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.productenable", { id: ID, state: state, cancelNames: cancelNames }, function (err, res) {}, viewModel, { async: false });
        if (res.error != undefined) {
          alert("产品编码为： " + code + " 单据错误信息：" + res.error.message);
        } else {
          viewModel.get("enable").setValue("1");
          alert("产品编码为： " + code + " 的单据启用成功！");
        }
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button35rb") &&
  viewModel.get("button35rb").on("click", function (data) {
    // 取消确认--单击
    debugger;
    var code = viewModel.get("product_coding").getValue();
    var enable = viewModel.get("enable").getValue();
    var ID = viewModel.get("id").getValue();
    if (enable == "0") {
      alert("产品编码为： " + code + " 单据的状态已经是停用状态无需再次停用！");
    } else {
      var state = 1;
      var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.productenable", { id: ID, state: state }, function (err, res) {}, viewModel, { async: false });
      if (res.error != undefined) {
        alert("产品编码为： " + code + " 单据错误信息：" + res.error.message);
      } else {
        viewModel.get("enable").setValue("0");
        alert("产品编码为： " + code + " 的单据停用成功！");
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button39fg") &&
  viewModel.get("button39fg").on("click", function (data) {
    // 按钮--单击
  });
// 产品大类 代码值等于 101001
function productCategoryLinkageCheck() {
  var product_category_dict_code = viewModel.get("item217vf").getValue();
  if (product_category_dict_code == "101001") {
    viewModel.get("class_of_product_dict_name").setState("bIsNull", false);
    viewModel.get("registration_certificate_approval_date").setState("bIsNull", false);
    viewModel.get("product_registration_number").setState("bIsNull", false);
  } else {
    viewModel.get("class_of_product_dict_name").setState("bIsNull", true);
    viewModel.get("registration_certificate_approval_date").setState("bIsNull", true);
    viewModel.get("product_registration_number").setState("bIsNull", true);
  }
}
viewModel.get("product_category_dict_name").on("afterValueChange", function (data) {
  productCategoryLinkageCheck();
});
// 是否实施唯一标识管理 等于是
function isUniqueIdentificationControlLinkageCheck() {
  var isUniqueIdentificationControl = viewModel.get("is_unique_identification_control").getValue();
  if (isUniqueIdentificationControl == "1") {
    viewModel.get("di").setState("bIsNull", false);
    viewModel.get("barcode_type_dict_name").setState("bIsNull", false);
    viewModel.get("product_control_method_dict_name").setState("bIsNull", false);
  } else {
    viewModel.get("di").setState("bIsNull", true);
    viewModel.get("barcode_type_dict_name").setState("bIsNull", true);
    viewModel.get("product_control_method_dict_name").setState("bIsNull", true);
  }
}
viewModel.get("is_unique_identification_control").on("afterValueChange", function (data) {
  isUniqueIdentificationControlLinkageCheck();
});
// 产品类别 代码值等于 100202 或 产品类别 代码值等于 100203
function classOfProductLinkageCheck() {
  var classOfProductdictCode = viewModel.get("item269dg").getValue();
  if (classOfProductdictCode == "100202" || classOfProductdictCode == "100203") {
    viewModel.get("registration_certificate_effective_date").setState("bIsNull", false);
  } else {
    viewModel.get("registration_certificate_effective_date").setState("bIsNull", true);
  }
}
viewModel.get("class_of_product_dict_name").on("afterValueChange", function (data) {
  classOfProductLinkageCheck();
});
// 产品生产类型 包含 100302
function productionTypeLinkageCheck() {
  var productionType = viewModel.get("productInformation_production_typeList").getValue();
  var dictCodeArr = [];
  for (var index = 0; index < productionType.length; index++) {
    if (productionType[index].allData) {
      dictCodeArr.push(productionType[index].allData.dict_code);
    }
  }
  if (dictCodeArr.length > 0) {
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100301"));
  } else {
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", true);
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", true);
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", true);
  }
}
viewModel.get("productInformation_production_typeList").on("afterValueChange", function (data) {
  productionTypeLinkageCheck();
});
// 页面初始化
viewModel.on("afterLoadData", function (args) {
  debugger;
  var is_unique_identification_controlObj = viewModel.get("is_unique_identification_control");
  var is_unique_identification_controlVal = is_unique_identification_controlObj.getValue();
  if (is_unique_identification_controlVal == "1.0") {
    viewModel.get("is_unique_identification_control").setValue("1");
  }
  productCategoryLinkageCheck();
  isUniqueIdentificationControlLinkageCheck();
  classOfProductLinkageCheck();
  var productionType = viewModel.get("productInformation_production_typeList").getValue();
  var productionTypeArr = [];
  for (var index = 0; index < productionType.length; index++) {
    if (productionType[index].production_type) {
      productionTypeArr.push(productionType[index].production_type);
    }
  }
  if (productionTypeArr.length > 0) {
    var rangeCodeSql = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where id in ( " + productionTypeArr.join(",") + " ) ";
    var rangeData = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
    if (!rangeData.result) {
      return false;
    }
    var dictCodeArr = [];
    for (var aindex = 0; aindex < rangeData.result.res.length; aindex++) {
      dictCodeArr.push(rangeData.result.res[aindex].dict_code + "");
    }
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100301"));
  } else {
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", true);
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", true);
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", true);
  }
});
// 复制后
viewModel.on("afterCopy", function (args) {
  viewModel.get("item217vf").setValue(getDictCode(viewModel.get("product_category").getValue()));
  viewModel.get("item269dg").setValue(getDictCode(viewModel.get("class_of_product").getValue()));
  productCategoryLinkageCheck();
  classOfProductLinkageCheck();
  debugger;
  var productionType = viewModel.get("productInformation_production_typeList").getValue();
  var productionTypeArr = [];
  for (var index = 0; index < productionType.length; index++) {
    if (productionType[index].production_type) {
      productionTypeArr.push(productionType[index].production_type);
    }
  }
  if (productionTypeArr.length > 0) {
    var rangeCodeSql = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where id in ( " + productionTypeArr.join(",") + " ) ";
    var rangeData = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
    if (!rangeData.result) {
      return false;
    }
    var dictCodeArr = [];
    for (var aindex = 0; aindex < rangeData.result.res.length; aindex++) {
      dictCodeArr.push(rangeData.result.res[aindex].dict_code + "");
    }
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100302"));
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", !dictCodeArr.includes("100301"));
  } else {
    viewModel.get("production_enterprise_code_production_numbers").setState("bIsNull", true);
    viewModel.get("manufacturerLicenseNocertificateNo").setState("bIsNull", true);
    viewModel.get("registrantLicenseNocertificateNo").setState("bIsNull", true);
  }
});
function getDictCode(id) {
  var rangeCodeSql = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where id = " + id;
  var rangeData = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
  if (!rangeData.result) {
    return null;
  }
  return rangeData.result.res[0].dict_code;
}