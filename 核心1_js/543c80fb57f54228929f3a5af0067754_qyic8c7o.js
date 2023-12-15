viewModel.on("customInit", function (data) {
  // 供应商申请--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      debugger;
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "营业执照", qualifyDefine: 1, qualifydoc: 1, longEffective: false, qualifydoc_description: "营业执照" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "银行开户许可证", qualifyDefine: 1, qualifydoc: 6, longEffective: false, qualifydoc_description: "银行开户许可证" });
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "供应商社会责任承诺书",
        qualifydocName: "供应商社会责任承诺书",
        qualifydoc_description: "供应商社会责任承诺书",
        qualifydocDescription: "供应商社会责任承诺书"
      });
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "采购云平台注册人授权委托书",
        qualifydocName: "采购云平台注册人授权委托书",
        qualifydoc_description: "采购云平台注册人授权委托书",
        qualifydocDescription: "采购云平台注册人授权委托书"
      });
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "阳光合作承诺书",
        qualifydocName: "阳光合作承诺书",
        qualifydoc_description: "阳光合作承诺书",
        qualifydocDescription: "阳光合作承诺书"
      });
      cb.rest.invokeFunction("GZTBDM.interface.queryCurrentUser", {}, function (err, res) {
        viewModel.get("vendorDefine!define1").setValue(res.name);
        viewModel.get("vendorDefine!define2").setValue(res.email);
        viewModel.get("vendorDefine!define3").setValue(res.mobile);
        console.log(res);
      });
    }
  });
  viewModel.get("vendorQualifies").on("beforeDeleteRows", function (args) {
    var index = viewModel.get("vendorQualifies").getFocusedRowIndex();
  });
  var dzj = ["营业执照", "银行开户许可证"];
  var qy = ["营业执照", "银行开户许可证", "供应商社会责任承诺书", "采购云平台注册人授权委托书", "阳光合作承诺书"];
  viewModel.get("vendorDefine!define6").on("beforeValueChange", function (data) {
    debugger;
    var qualifydocNames = [];
    var rows = viewModel.get("vendorQualifies").getAllData();
    for (var num = 0; num < rows.length; num++) {
      qualifydocNames.push(rows[num].qualifydoc_name);
    }
    var zzhinfo = [];
    //企业
    if (data.value.code == "01" || data.value.code == "06") {
      zzhinfo = qy;
    } else {
      zzhinfo = dzj;
    }
    for (var num2 = 0; num2 < zzhinfo.length; num2++) {
      if (!qualifydocNames.includes(zzhinfo[num2])) {
        addRow(zzhinfo[num2]);
      }
    }
    var delIndexs = [];
    for (var num3 = 0; num3 < qualifydocNames.length; num3++) {
      if (!zzhinfo.includes(qualifydocNames[num3])) {
        delIndexs.push(getRowIndex(qualifydocNames[num3]));
      }
    }
    if (delIndexs.length > 0) {
      viewModel.get("vendorQualifies").deleteRows(delIndexs);
    }
  });
  function addRow(qualifydoc_name) {
    if (qualifydoc_name == "营业执照") {
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "营业执照", qualifyDefine: 1, qualifydoc: 1, longEffective: false, qualifydoc_description: "营业执照" });
    }
    if (qualifydoc_name == "银行开户许可证") {
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "银行开户许可证", qualifyDefine: 1, qualifydoc: 6, longEffective: false, qualifydoc_description: "银行开户许可证" });
    }
    if (qualifydoc_name == "供应商社会责任承诺书") {
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "供应商社会责任承诺书",
        qualifydocName: "供应商社会责任承诺书",
        qualifydoc_description: "供应商社会责任承诺书",
        qualifydocDescription: "供应商社会责任承诺书"
      });
    }
    if (qualifydoc_name == "采购云平台注册人授权委托书") {
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "采购云平台注册人授权委托书",
        qualifydocName: "采购云平台注册人授权委托书",
        qualifydoc_description: "采购云平台注册人授权委托书",
        qualifydocDescription: "采购云平台注册人授权委托书"
      });
    }
    if (qualifydoc_name == "阳光合作承诺书") {
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "阳光合作承诺书",
        qualifydocName: "阳光合作承诺书",
        qualifydoc_description: "阳光合作承诺书",
        qualifydocDescription: "阳光合作承诺书"
      });
    }
  }
  function getRowIndex(qualifydoc_name) {
    var allRows = viewModel.get("vendorQualifies").getAllData();
    var index = 0;
    for (var num4 = 0; num4 < allRows.length; num4++) {
      if (qualifydoc_name == allRows[num4].qualifydoc_name) {
        index = num4;
        break;
      }
    }
    return index;
  }
  viewModel.on("beforeSave", function (data) {
  });
});