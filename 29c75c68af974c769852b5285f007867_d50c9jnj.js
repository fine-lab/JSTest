let secScript = document.createElement("script");
secScript.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT37595AT2/xlsx.common.extend.js?domainKey=developplatform`);
document.body.insertBefore(secScript, document.body.lastChild);
var secScript1 = document.createElement("script");
secScript1.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript1.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT37595AT2/xlsx.core.min.js?domainKey=developplatform`);
document.body.insertBefore(secScript1, document.body.lastChild);
//查询条件设置默认值
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterInit事件，必须放在页面模型的afterMount事件中才生效
  filterViewModelInfo.on("afterInit", function (data) {
    debugger;
    // 删除之前不断跳转的节点
    let bodyParent = document.getElementsByClassName("wui-tabs-tabpane wui-tabs-tabpane-inactive mdf-bill-tabpane");
    if (bodyParent.length > 0) {
      let body = bodyParent[0].parentElement;
      let indexs = [];
      for (var i = 0; i < body.childNodes.length; i++) {
        if (body.childNodes[i].attributes["aria-hidden"].value == "true") {
          indexs.push(body.childNodes[i]);
        }
      }
      for (var j = 0; j < indexs.length; j++) {
        body.removeChild(indexs[j]);
      }
    }
    let datePick = document.getElementsByClassName("Test-time-two")[0];
    datePick.children[1].hidden = true; // 隐藏-字符
    datePick.children[2].hidden = true; // 隐藏第二个选择框
    datePick.children[0].style.width = "100%"; // 设置第一个选择框的长度
    let filterModelInfo = filterViewModelInfo.get("opDate");
    let realModelInfo = filterModelInfo.getFromModel();
    if (viewModel.getParams().monthNum) {
      realModelInfo.setValue(viewModel.getParams().opDate); //默认值赋值
    } else if (!realModelInfo.getValue()) {
      const res = cb.utils.getNowFormatDate();
      realModelInfo.setValue(res.substring(0, 7)); //默认值赋值
    }
  });
  // 设置数据源
  viewModel.getGridModel().setState("dataSourceMode", "local");
});
viewModel.on("beforeSearch", function (args) {
  // 调用API函数查询采购入库单数据并替换data
  let opDateCache = viewModel.getCache("FilterViewModel").get("opDate");
  let opDate = null;
  if (opDateCache != null) {
    opDate = opDateCache.getFromModel().getValue();
  }
  let phymaterialCodeCache = viewModel.getCache("FilterViewModel").get("phymaterialCode");
  let phymaterialCode = null;
  if (phymaterialCodeCache != null) {
    phymaterialCode = phymaterialCodeCache.getFromModel().getValue();
  }
  let productCodeCache = viewModel.getCache("FilterViewModel").get("productCode");
  let productCode = null;
  if (productCodeCache != null) {
    productCode = productCodeCache.getFromModel().getValue();
  }
  let gapSettlementSignCache = viewModel.getCache("FilterViewModel").get("gapSettlementSign");
  let gapSettlementSign = null;
  if (gapSettlementSignCache != null) {
    gapSettlementSign = gapSettlementSignCache.getFromModel().getValue();
  }
  let monthNum = null;
  let firstDate = null;
  let firstNextDate = null;
  if (opDate != null) {
    let year = opDate.substring(0, 4);
    monthNum = Number(opDate.substring(5, 7));
    firstDate = new Date(year, monthNum - 1, 1).format("yyyy-MM-dd");
    firstNextDate = new Date(year, monthNum, 1).format("yyyy-MM-dd");
  }
  let result = cb.rest.invokeFunction("AT160194EA17D00009.apiFun.priceSettleQuery", { opDate: opDate, firstDate: firstDate, firstNextDate: firstNextDate }, function (err, res) {}, viewModel, {
    async: false
  });
  if (result.error != undefined) {
    cb.utils.alert("系统错误！请联系管理员！");
    return;
  }
  let purdata = result.result.purInRecordData;
  for (let k = 0; k < purdata.length; k++) {
    let arrivalDate = purdata[k].arrivalDate;
    purdata[k].arrivalTime = arrivalDate;
    purdata[k].gapSettlementSign = purdata[k].gapSettleMark === "1" ? 1 : 0;
  }
  let mark = false;
  if (phymaterialCode != null) {
    phymaterialCode = phymaterialCodeCache.getFromModel().getValue();
    purdata = purdata.filter(function (item) {
      return item.phymaterialCode + "" == phymaterialCode + "";
    });
  }
  if (productCode != null) {
    purdata = purdata.filter(function (item) {
      return item.productCode + "" == productCode + "";
    });
  }
  if (gapSettlementSign != null) {
    purdata = purdata.filter(function (item) {
      return item.gapSettlementSign + "" == gapSettlementSign + "";
    });
  }
  viewModel.getGridModel().setDataSource(purdata);
  return false;
});
// 替换默认的查询数据
// 替换默认的查询数据
//结算
viewModel.get("button31ab").on("click", function (data) {
  debugger;
  // 获取选中的数据
  let listData = viewModel.getGridModel().getSelectedRows();
  let updateStatusObj = [];
  let gapSettlementSign = 1;
  for (let i = 0; i < listData.length; i++) {
    updateStatusObj.push({ id: listData[i].id, arrivalNum: listData[i].arrivalNum, gapSettlementMark: gapSettlementSign, _status: "Update" });
  }
  cb.rest.invokeFunction("AT160194EA17D00009.apiFun.updateGapSettle", { updateStatusObj: updateStatusObj }, function (err, res) {
    cb.utils.alert("结算成功", "success");
    queryData();
  });
});
//取消结算
viewModel.get("button22ic").on("click", function (data) {
  // 获取选中的数据
  let listData = viewModel.getGridModel().getSelectedRows();
  let updateStatusObj = [];
  let gapSettlementSign = 0;
  for (let i = 0; i < listData.length; i++) {
    updateStatusObj.push({ id: listData[i].id, gapSettlementMark: gapSettlementSign, _status: "Update" });
  }
  cb.rest.invokeFunction("AT160194EA17D00009.apiFun.updateGapSettle", { updateStatusObj: updateStatusObj, listData: listData }, function (err, res) {
    cb.utils.alert("取消结算成功", "success");
    queryData();
  });
});
//默认选中所有行
viewModel.getGridModel().on("afterSetDataSource", function (data) {
});
function queryData() {
  // 调用API函数查询采购入库单数据并替换data
  let opDateCache = viewModel.getCache("FilterViewModel").get("opDate");
  let opDate = null;
  if (opDateCache != null) {
    opDate = opDateCache.getFromModel().getValue();
  }
  let phymaterialCodeCache = viewModel.getCache("FilterViewModel").get("phymaterialCode");
  let phymaterialCode = null;
  if (phymaterialCodeCache != null) {
    phymaterialCode = phymaterialCodeCache.getFromModel().getValue();
  }
  let productCodeCache = viewModel.getCache("FilterViewModel").get("productCode");
  let productCode = null;
  if (productCodeCache != null) {
    productCode = productCodeCache.getFromModel().getValue();
  }
  let gapSettlementSignCache = viewModel.getCache("FilterViewModel").get("gapSettlementSign");
  let gapSettlementSign = null;
  if (gapSettlementSignCache != null) {
    gapSettlementSign = gapSettlementSignCache.getFromModel().getValue();
  }
  let monthNum = null;
  let firstDate = null;
  let firstNextDate = null;
  if (opDate != null) {
    let year = opDate.substring(0, 4);
    monthNum = Number(opDate.substring(5, 7));
    firstDate = new Date(year, monthNum - 1, 1).format("yyyy-MM-dd");
    firstNextDate = new Date(year, monthNum, 1).format("yyyy-MM-dd");
  }
  let result = cb.rest.invokeFunction("AT160194EA17D00009.apiFun.priceSettleQuery", { opDate: opDate, firstDate: firstDate, firstNextDate: firstNextDate }, function (err, res) {}, viewModel, {
    async: false
  });
  if (result.error != undefined) {
    cb.utils.alert("系统错误！请联系管理员！");
    return;
  }
  let purdata = result.result.purInRecordData;
  for (let k = 0; k < purdata.length; k++) {
    let arrivalDate = purdata[k].arrivalDate;
    purdata[k].arrivalTime = arrivalDate;
    purdata[k].gapSettlementSign = purdata[k].gapSettleMark === "1" ? 1 : 0;
  }
  let mark = false;
  if (phymaterialCode != null) {
    phymaterialCode = phymaterialCodeCache.getFromModel().getValue();
    purdata = purdata.filter(function (item) {
      return item.phymaterialCode + "" == phymaterialCode + "";
    });
  }
  if (productCode != null) {
    purdata = purdata.filter(function (item) {
      return item.productCode + "" == productCode + "";
    });
  }
  if (gapSettlementSign != null) {
    purdata = purdata.filter(function (item) {
      return item.gapSettlementSign + "" == gapSettlementSign + "";
    });
  }
  viewModel.getGridModel().setDataSource(purdata);
}
viewModel.getGridModel().on("beforeDblClick", function (data) {
  return false;
});
viewModel.get("button39yc") &&
  viewModel.get("button39yc").on("click", function (data) {
    // 导出--单击
    let gridModel = viewModel.getGridModel();
    let columnMetaArr = gridModel.get("meta") && gridModel.get("meta").controls;
    let codeToName = {};
    let titleData = [];
    let items = [];
    for (let item of columnMetaArr) {
      items.push(item.cShowCaption);
      codeToName[item.cItemName] = item.cShowCaption;
    }
    titleData.push(items);
    debugger;
    //加载js-xlsx
    loadJsXlsx(viewModel);
    //保存传入的viewModel对象
    let selectRows = gridModel.getSelectedRows();
    if (!selectRows || selectRows.length == 0) {
      selectRows = gridModel.getAllData();
    }
    if (!selectRows || selectRows.length == 0) {
      exportExcelFileByStyle(titleData, "差价结算表导出");
    } else {
      let excelData = [];
      for (let rowData of selectRows) {
        let tempExcelData = {};
        for (let [key, value] of Object.entries(codeToName)) {
          if (rowData[key] || rowData[key] == 0) {
            tempExcelData[value] = rowData[key];
          } else {
            tempExcelData[value] = "";
          }
        }
        tempExcelData[codeToName["gapSettlementSign"]] = tempExcelData[codeToName["gapSettlementSign"]] ? "是" : "否";
        excelData.push(tempExcelData);
      }
      exportExcelFile(excelData, "差价结算表导出-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
    }
    window.viewModelInfo = viewModel;
  });
viewModel.on("customInit", function (data) {
  // 价差结算表--页面初始化
});