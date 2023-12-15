viewModel.on("customInit", function (data) {
  // 供应商申请--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      var supplyType = viewModel.get("supplyType").getValue();
      if (supplyType !== "1") {
        //供应商类型<>个人
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
      } else {
        viewModel.get("vendorQualifies").appendRow({
          hasDefaultInit: true,
          qualifyDefine: 2,
          cellConfig: [
            { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
            { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
          ],
          _tableDisplayOutlineAll: false,
          qualifydoc_name: "房屋产权证明",
          qualifydocName: "房屋产权证明",
          qualifydoc_description: "房屋产权证明",
          qualifydocDescription: "房屋产权证明"
        });
        viewModel.get("vendorQualifies").appendRow({
          hasDefaultInit: true,
          qualifyDefine: 2,
          cellConfig: [
            { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
            { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
          ],
          _tableDisplayOutlineAll: false,
          qualifydoc_name: "房东身份证",
          qualifydocName: "房东身份证",
          qualifydoc_description: "房东身份证",
          qualifydocDescription: "房东身份证"
        });
      }
      cb.rest.invokeFunction("GZTBDM.interface.queryCurrentUser", {}, function (err, res) {
        viewModel.get("vendorDefine!define1").setValue(res.name);
        viewModel.get("vendorDefine!define2").setValue(res.email);
        viewModel.get("vendorDefine!define3").setValue(res.mobile);
        console.log(res);
      });
    }
    viewModel.get("salesman_Name").setDisabled(true);
  });
  viewModel.get("vendorQualifies").on("beforeDeleteRows", function (args) {
    var index = viewModel.get("vendorQualifies").getFocusedRowIndex();
  });
  var dzj = ["营业执照", "银行开户许可证"];
  var qy = ["营业执照", "银行开户许可证", "供应商社会责任承诺书", "采购云平台注册人授权委托书", "阳光合作承诺书"];
  var grzf = ["房屋产权证明", "房东身份证"];
  viewModel.get("vendorDefine!define2").on("afterValueChange", function (data) {
    changeGyslb();
    changeQualify();
  });
  viewModel.get("supplyType").on("beforeBrowse", function (data) {
  });
  viewModel.get("supplyType").on("afterValueChange", function (data) {
    changeQualify();
  });
  function changeGyslb() {
    let define6 = viewModel.get("vendorDefine!define2").getValue();
    let supplyType = viewModel.get("supplyType").getValue();
    if (define6 && define6.includes("出租")) {
      if (supplyType !== "1") {
        viewModel.get("supplyType").setValue("1");
        viewModel.get("registerFund").setVisible(false);
        viewModel.get("registerCurrency_name").setVisible(false);
        viewModel.get("companytype").setVisible(false);
        viewModel.get("foundDate").setVisible(false);
        viewModel.get("legalBody").setVisible(false);
        viewModel.get("address").setVisible(false);
        let licenseTypeDT = [
          { value: "idCard", text: "居民身份证" },
          { value: "passport", text: "护照" },
          { value: "otherIDCard", text: "其他身份证件" }
        ];
        viewModel.get("licenseType").setDataSource(licenseTypeDT);
        viewModel.get("licenseType").setValue("idCard");
      }
    } else {
      if (supplyType !== "0" && supplyType !== "2") {
        viewModel.get("supplyType").setValue("0");
        viewModel.get("registerFund").setVisible(true);
        viewModel.get("registerCurrency_name").setVisible(true);
        viewModel.get("companytype").setVisible(true);
        viewModel.get("foundDate").setVisible(true);
        viewModel.get("legalBody").setVisible(true);
        viewModel.get("address").setVisible(true);
        viewModel.get("licenseType").setDataSource([{ value: "businessLicense", text: "统一社会信用代码" }]);
        viewModel.get("licenseType").setValue("businessLicense");
      }
    }
  }
  function changeQualify() {
    var qualifydocNames = [];
    var supplyType = viewModel.get("supplyType").getValue();
    var define6 = viewModel.get("vendorDefine!define2").getValue();
    //个人供应商
    if (supplyType == "1" && !define6.includes("出租")) {
      viewModel.get("vendorQualifies").clear();
      return;
    }
    var rows = viewModel.get("vendorQualifies").getAllData();
    for (var num = 0; num < rows.length; num++) {
      qualifydocNames.push(rows[num].qualifydoc_name);
    }
    var zzhinfo = [];
    //企业
    if (define6 == "企业" || define6 == "客户指定厂商/渠道") {
      zzhinfo = qy;
    } else if (define6.includes("出租")) {
      zzhinfo = grzf;
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
  }
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
    if (qualifydoc_name == "房屋产权证明") {
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "房屋产权证明",
        qualifydocName: "房屋产权证明",
        qualifydoc_description: "房屋产权证明",
        qualifydocDescription: "房屋产权证明"
      });
    } //','
    if (qualifydoc_name == "房东身份证") {
      viewModel.get("vendorQualifies").appendRow({
        hasDefaultInit: true,
        qualifyDefine: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifydoc_name", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGrade_name", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        qualifydoc_name: "房东身份证",
        qualifydocName: "房东身份证",
        qualifydoc_description: "房东身份证",
        qualifydocDescription: "房东身份证"
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
  viewModel.get("vendorDefine!define1_name").on("afterValueChange", function (data) {
    if (data && data.value && data.value.name) {
      if (data.value.name.includes("项目租房")) {
        viewModel.get("vendorDefine!define2").setValue("个人房出租");
        changeGyslb();
        changeQualify();
      }
    }
  });
});
viewModel.get("changeVendor_name") &&
  viewModel.get("changeVendor_name").on("afterValueChange", function (data) {
    //变更供应商--值改变后
    let psnname = viewModel.get("vendorDefine!define1").getValue();
    if (true) {
      cb.rest.invokeFunction("GZTBDM.interface.queryCurrentUser", {}, function (err, res) {
        viewModel.get("vendorDefine!define1").setValue(res.name);
        viewModel.get("vendorDefine!define2").setValue(res.email);
        viewModel.get("vendorDefine!define3").setValue(res.mobile);
        console.log(res);
      });
    }
  });