viewModel.on("customInit", function (data) {
  // 供应商注册申请卡片--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    debugger;
    if (currentState == "add") {
      //新增状态
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "供应商社会责任承诺书",
        qualifyDocRemark: "供应商社会责任承诺书"
      });
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "采购云平台注册人授权委托书",
        qualifyDocRemark: "采购云平台注册人授权委托书"
      });
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "阳光合作承诺书",
        qualifyDocRemark: "阳光合作承诺书"
      });
    }
  });
  var dzj = ["营业执照", "银行开户许可证"];
  var qy = ["营业执照", "银行开户许可证", "供应商社会责任承诺书", "采购云平台注册人授权委托书", "阳光合作承诺书"];
  viewModel.get("defines!define6") &&
    viewModel.get("defines!define6").on("afterValueChange", function (data) {
      debugger;
      var qualifydocNames = [];
      var rows = viewModel.get("qualifys").getAllData();
      for (var num = 0; num < rows.length; num++) {
        qualifydocNames.push(rows[num].qualifyName);
      }
      var zzhinfo = [];
      //企业
      if (data.value.name == "企业") {
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
        viewModel.get("qualifys").deleteRows(delIndexs);
      }
    });
  function addRow(qualifydoc_name) {
    if (qualifydoc_name == "供应商社会责任承诺书") {
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "供应商社会责任承诺书",
        qualifyDocRemark: "供应商社会责任承诺书"
      });
    }
    if (qualifydoc_name == "采购云平台注册人授权委托书") {
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "采购云平台注册人授权委托书",
        qualifyDocRemark: "采购云平台注册人授权委托书"
      });
    }
    if (qualifydoc_name == "阳光合作承诺书") {
      viewModel.get("qualifys").appendRow({
        hasDefaultInit: true,
        paperType: 2,
        cellConfig: [
          { cControlType: "input", cItemName: "qualifyName", uitype: "input" },
          { cControlType: "input", cItemName: "qualifyGradeName", uitype: "input" }
        ],
        _tableDisplayOutlineAll: false,
        necessary: "1",
        qualifyName: "阳光合作承诺书",
        qualifyDocRemark: "阳光合作承诺书"
      });
    }
  }
  function getRowIndex(qualifydoc_name) {
    var allRows = viewModel.get("qualifys").getAllData();
    var index = 0;
    for (var num4 = 0; num4 < allRows.length; num4++) {
      if (qualifydoc_name == allRows[num4].qualifyName) {
        index = num4;
        break;
      }
    }
    return index;
  }
  viewModel.on("beforeSave", function (data) {
  });
});