viewModel.on("afterMount", () => {
  //加载js-xlsx
  loadJsXlsx(viewModel);
  //加载js-xlsx-style
  loadJsXlsxs(viewModel);
  //加载js-xlsx-style
  loadJsXlsxss(viewModel);
  //加载fileSaver
  fileSaver(viewModel);
});
function loadJsXlsxs(viewModel) {
  console.log("loadJsXlsxs执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsxStyle.utils.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function loadJsXlsxss(viewModel) {
  console.log("loadJsXlsxss执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsxStyle.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function fileSaver(viewModel) {
  console.log("fileSaver执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/FileSaver.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
viewModel.get("button30qf") &&
  viewModel.get("button30qf").on("click", function (data) {
    var count = 0;
    // 确认--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取数据下标
    const indexArr = girdModel.getSelectedRowIndexes();
    if (indexArr.length > 0) {
      var errArr = [];
      indexArr.forEach((item) => {
        var formData = viewModel.getGridModel().getRowsByIndexes(item)[0];
        if (formData.enable == 1) {
          errArr.push({ product_coding: formData.product_coding, enable: "启用" });
        }
      });
      if (errArr.length > 0) {
        var errMsg = "";
        for (var index = 0; index < errArr.length; index++) {
          errMsg += "产品编码: " + errArr[index].product_coding + "，单据已经属于" + errArr[index].enable + "状态\n";
        }
        cb.utils.confirm(errMsg);
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
        return false;
      }
      for (var j = 0; j < indexArr.length; j++) {
        // 获取行号
        var row = indexArr[j];
        var newRow = row + 1;
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        var code = SunData[0].product_coding;
        var registration_certificate_effective_date = SunData[0].registration_certificate_effective_date;
        var timestamp = Date.parse(new Date());
        var registration_Date = Date.parse(registration_certificate_effective_date);
        //创建人
        var creator_userName = SunData[0].creator_userName;
        //修改人
        var modifier_userName = SunData[0].modifier_userName;
        // 该条单据的id
        var ID = SunData[0].id;
        var cancelAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.currentuser", { id: ID }, function (err, res) {}, viewModel, { async: false });
        // 确认人
        var cancelNames = cancelAPI.result.currentUser.name;
        if (SunData[0].enable == "0") {
          var state = 0;
          var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.productenable", { id: ID, state: state, cancelNames: cancelNames }, function (err, res) {}, viewModel, { async: false });
          if (res.error != undefined) {
            alert("产品编码为： " + code + " 单据错误信息：" + res.error.message);
          } else {
            girdModel.setCellValue(row, "enable", "1");
            count = count + 1;
          }
        }
      }
      if (count > 0) {
        alert(" 单据启用成功！");
      }
    } else {
      alert("未选中子表！！！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button38ij") &&
  viewModel.get("button38ij").on("click", function (data) {
    var count = 0;
    // 取消确认--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取数据下标
    const indexArr = girdModel.getSelectedRowIndexes();
    if (indexArr.length > 0) {
      for (var j = 0; j < indexArr.length; j++) {
        // 获取行号
        var row = indexArr[j];
        var newRow = row + 1;
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        var code = SunData[0].product_coding;
        // 该条单据的id
        var ID = SunData[0].id;
        var state = 1;
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.productenable", { id: ID, state: state }, function (err, res) {}, viewModel, { async: false });
        if (res.error != undefined) {
          alert("产品编码为： " + code + " 单据错误信息：" + res.error.message);
        } else {
          girdModel.setCellValue(row, "enable", "0");
          count = count + 1;
        }
      }
      if (count > 0) {
        alert(" 单据停用成功！");
      }
    } else {
      alert("未选中子表！！！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button43md") &&
  viewModel.get("button43md").on("click", function (data) {
    // 导入按钮--单击
    //加载js-xlsx
    loadJsXlsx(viewModel);
    //触发文件点击事件
    selectFile();
  });
function loadJsXlsx(viewModel) {
  console.log("loadJsXlsx执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function readWorkbookFromLocalFile(file, callback) {
  console.log("readWorkbookFromLocalFile执行完成");
  var reader = new FileReader();
  reader.onload = function (e) {
    var localData = e.target.result;
    var workbook = XLSX.read(localData, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
//读取excel里面数据，进行缓存    5
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  const workbookDatas = [];
  //获取每个sheet页的数据
  for (let i = 0; i < sheetNames.length; i++) {
    console.log("循环sheet页");
    let sheetNamesItem = sheetNames[i];
    var sheetNameList = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
    if (sheetNameList.length > 0) {
      workbookDatas[i] = sheetNameList;
    }
  }
  //对获取的数据进行缓存
  window.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
  execlponse();
  console.log("readWorkbook执行完成");
}
function selectFile() {
  var fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  //点击id 是 filee_input_info 的文件上传按钮
  document.getElementById("filee_input_info").click();
  console.log("文件按钮单击次数");
  var dou = document.getElementById("filee_input_info");
  dou.onchange = function (e) {
    console.log("获取文件触发");
    var files = e.target.files;
    if (files.length == 0) return;
    var filesData = files[0];
    readWorkbookFromLocalFile(filesData, function (workbook) {
      readWorkbook(workbook);
    });
  };
}
function execlponse() {
  //获取excel数据
  debugger;
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var sheetTwo = execl[1];
  var model = viewModel.getGridModel();
  //导入主表;
  var errMessage = ",失败详情原因：\r\n";
  var errMessages = "";
  //主表新增条数
  var TotalNumber = 0;
  //主表成功条数
  var TotalNumbers = 0;
  var sbNumber = 0;
  //主表修改条数
  var Modify = 0;
  //子表新增条数
  var subTotalNumber = 0;
  //子表修改条数
  var subModify = 0;
  //校验数
  var checkSum = 0;
  var cNum = 0;
  var sNum = 0;
  var sMages = ",失败详情原因：";
  var productArray = new Array();
  var productListArray = new Array();
  var productListArrays = new Array();
  //主表失败详情原因汇总
  var collectArray = new Array();
  //主表存储失败的表单编码
  var numbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    numbertArray[a] = new Array();
  }
  //子表失败详情原因汇总
  var subCollectArray = new Array();
  //子表存储失败的表单编码
  var subNumbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    subNumbertArray[a] = new Array();
  }
  //校验子表
  for (var m = 0; m < sheetTwo.length; m++) {
    var importSubtable = sheetTwo[m];
    var importSubtableRes = cb.rest.invokeFunction("AT161E5DFA09D00001.ImportCheck.checkProduct", { importSubtable: importSubtable }, function (err, res) {}, viewModel, { async: false });
    if (importSubtableRes.result.boolean != "true") {
      //将数据存入数组
      productListArrays.push([importSubtable.产品编码, importSubtable.委托方企业编码]);
      if (importSubtableRes.result.err) {
        if (subCollectArray.indexOf(importSubtableRes.result.err) == -1) {
          subCollectArray.push(importSubtableRes.result.err);
        }
        for (var k = 0; k < subCollectArray.length; k++) {
          if (subCollectArray[k] == importSubtableRes.result.err) {
            subNumbertArray[k].push(importSubtable.产品编码);
          }
        }
        for (var k = 0; k < productArray.length; k++) {
          if (productArray[k][0] == importSubtable.产品编码 && productArray[k][1] == importSubtable.委托方企业编码) {
            //将数据存入数组
            productListArray.push([importSubtable.产品编码, importSubtable.委托方企业编码]);
          }
        }
      }
    }
  }
  // 所需值域代码数据
  var rangeResult = {};
  var rangeCodeSql = "select id, dict_code, dict_type from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where dict_type in ('A.2','A.3','A.4','A.7','A.8','A.10') and enable = 1";
  var rangeCodeRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
  if (rangeCodeRes.result) {
    console.log(rangeCodeRes.result);
    var resData = rangeCodeRes.result.res;
    if (resData.length > 0) {
      resData.forEach(function (item) {
        if (!rangeResult[item.dict_type + ""]) {
          rangeResult[item.dict_type + ""] = {};
        }
        var dict_code = item.dict_code + "";
        rangeResult[item.dict_type + ""][dict_code] = { id: item.id };
      });
    }
  }
  console.log("所需值域代码数据", rangeResult);
  // 所需委托方数据
  var clientResult = {};
  var clientSql = "select id, clientCode, clientName from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where enable = 1";
  var clientRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: clientSql }, function (err, res) {}, viewModel, { async: false });
  if (clientRes.result) {
    var resData = clientRes.result.res;
    if (resData.length > 0) {
      resData.forEach(function (item) {
        var clientCode = item.clientCode + "";
        clientResult[clientCode] = { id: item.id, clientName: item.clientName };
      });
    }
  }
  console.log("所需委托方数据数据", clientResult);
  // 所需生产企业信息数据
  var informationResult = {};
  var informationSql = "select id, production_numbers, production_name from AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production where enable = 1";
  var informationRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: informationSql }, function (err, res) {}, viewModel, { async: false });
  if (informationRes.result) {
    var resData = informationRes.result.res;
    if (resData.length > 0) {
      resData.forEach(function (item) {
        var production_numbers = item.production_numbers;
        informationResult[production_numbers + ""] = { id: item.id, production_name: item.production_name };
      });
    }
  }
  console.log("所需委托方数据数据", informationResult);
  //导入主表;
  for (var i = 0; i < sheetone.length; i++) {
    var information = sheetone[i];
    for (var j = 0; j < sheetTwo.length; j++) {
      var importSubtable = sheetTwo[j];
      if (importSubtable.产品编码 == information.产品编码) {
        break;
      }
    }
    var sum = 0;
    for (var m = 0; m < sheetTwo.length; m++) {
      if (importSubtable.产品编码 == sheetTwo[m].产品编码) {
        sum = sum + 1;
      }
    }
    checkSum = 0;
    for (var n = 0; n < productListArrays.length; n++) {
      if (information.产品编码 == productListArrays[n][0] && information.委托方企业编码 == productListArrays[n][1]) {
        checkSum = checkSum + 1;
      }
    }
    if (checkSum == 0) {
      var BOMresponse = cb.rest.invokeFunction(
        "AT161E5DFA09D00001.import.ProductImport",
        { information: information, importSubtable: importSubtable, sum: sum, rangeResult: rangeResult, clientResult: clientResult, informationResult: informationResult },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      if (BOMresponse.result) {
        if (BOMresponse.result.err) {
          errMessages = errMessages + information.产品编码 + information.委托方企业编码;
          sbNumber = sbNumber + 1;
          if (collectArray.indexOf(BOMresponse.result.err) == -1) {
            collectArray.push(BOMresponse.result.err);
          }
          for (var k = 0; k < collectArray.length; k++) {
            if (collectArray[k] == BOMresponse.result.err) {
              numbertArray[k].push(information.产品编码);
            }
          }
        } else {
          TotalNumbers = TotalNumbers + 1;
        }
        if (BOMresponse.result.type == "add") {
          TotalNumber = TotalNumber + 1;
          productArray.push([information.产品编码, information.委托方企业编码]);
        } else {
          if (BOMresponse.result.type == "change") {
            Modify = Modify + 1;
          }
        }
      } else {
        if (BOMresponse.error) {
          errMessages = errMessages + information.产品编码 + information.委托方企业编码;
          sbNumber = sbNumber + 1;
          if (collectArray.indexOf(BOMresponse.error.message) == -1) {
            collectArray.push(BOMresponse.error.message);
          }
          for (var k = 0; k < collectArray.length; k++) {
            if (collectArray[k] == BOMresponse.error.message) {
              numbertArray[k].push(information.产品编码);
            }
          }
        } else {
          TotalNumbers = TotalNumbers + 1;
        }
      }
    } else {
      if (collectArray.indexOf("子表未导入，整单删除;") == -1) {
        collectArray.push("子表未导入，整单删除;");
      }
      for (var k = 0; k < collectArray.length; k++) {
        if (collectArray[k] == "子表未导入，整单删除;") {
          numbertArray[k].push(information.产品编码);
        }
      }
    }
  }
  for (var b = 0; b < collectArray.length; b++) {
    for (var d = 0; d < numbertArray[b].length; d++) {
      errMessage = errMessage + numbertArray[b][d] + "、";
    }
    errMessage = errMessage + collectArray[b];
  }
  //导入子表
  for (var z = 0; z < sheetTwo.length; z++) {
    var importSubtable = sheetTwo[z];
    var AdvanceArrivalNoticeNo = importSubtable.产品编码 + importSubtable.委托方企业编码;
    if (errMessages.includes(AdvanceArrivalNoticeNo)) {
      sNum += 1;
      if (subCollectArray.indexOf("未成功导入，请先导产品信息单") == -1) {
        subCollectArray.push("未成功导入，请先导产品信息单");
      }
      for (var k = 0; k < subCollectArray.length; k++) {
        if (subCollectArray[k] == "未成功导入，请先导产品信息单") {
          subNumbertArray[k].push(importSubtable.产品编码);
        }
      }
    } else {
      checkSum = 0;
      for (var n = 0; n < productListArrays.length; n++) {
        if (importSubtable.产品编码 == productListArrays[n][0] && importSubtable.委托方企业编码 == productListArrays[n][1]) {
          checkSum = checkSum + 1;
        }
      }
      if (checkSum == 0) {
        var importSubtableRes = cb.rest.invokeFunction("AT161E5DFA09D00001.import.sunProductImport", { importSubtable: importSubtable }, function (err, res) {}, viewModel, { async: false });
        if (BOMresponse.result) {
          if (importSubtableRes.result.err) {
            if (subCollectArray.indexOf(importSubtableRes.result.err) == -1) {
              subCollectArray.push(importSubtableRes.result.err);
            }
            for (var k = 0; k < subCollectArray.length; k++) {
              if (subCollectArray[k] == importSubtableRes.result.err) {
                subNumbertArray[k].push(importSubtable.产品编码);
              }
            }
            cNum = cNum - 1;
            sNum = sNum + 1;
          } else {
            if (importSubtableRes.result.type == "add") {
              subTotalNumber = subTotalNumber + 1;
            } else {
              if (importSubtableRes.result.type == "change") {
                subModify = subModify + 1;
              }
            }
          }
        } else {
          if (importSubtableRes.error) {
            if (subCollectArray.indexOf(importSubtableRes.error) == -1) {
              subCollectArray.push(importSubtableRes.error);
            }
            for (var k = 0; k < subCollectArray.length; k++) {
              if (subCollectArray[k] == importSubtableRes.error) {
                subNumbertArray[k].push(importSubtable.产品编码);
              }
            }
            cNum = cNum - 1;
            sNum = sNum + 1;
          } else {
            if (importSubtableRes.result.type == "add") {
              subTotalNumber = subTotalNumber + 1;
            } else {
              if (importSubtableRes.result.type == "change") {
                subModify = subModify + 1;
              }
            }
          }
        }
        cNum += 1;
      } else {
        sNum += 1;
      }
    }
  }
  if (productListArray.length > 0) {
    //调用api函数删除产品信息表
    var delProduct = cb.rest.invokeFunction("AT161E5DFA09D00001.del.delProduct", { productListArray: productListArray }, function (err, res) {}, viewModel, { async: false });
    TotalNumber = TotalNumber - productListArray.length;
    TotalNumbers = TotalNumbers - productListArray.length;
  }
  document.getElementById("filee_input_info").value = "";
  sbNumber = sheetone.length - TotalNumbers;
  sNum = sheetTwo.length - cNum;
  if (sbNumber == 0) {
    errMessage = "";
  }
  for (var c = 0; c < subCollectArray.length; c++) {
    for (var e = 0; e < subNumbertArray[c].length; e++) {
      sMages = sMages + subNumbertArray[c][e] + "、";
    }
    sMages = sMages + subCollectArray[c];
  }
  if (sNum == 0) {
    sMages = "";
  }
  cb.utils.confirm(
    "主表总条数：" +
      sheetone.length +
      "," +
      "主表成功条数：" +
      TotalNumbers +
      ",主表新增条数：" +
      TotalNumber +
      ",主表修改条数：" +
      Modify +
      "," +
      "主表失败条数：" +
      sbNumber +
      "," +
      errMessage +
      ";\r\n子表总条数" +
      sheetTwo.length +
      ",子表成功条数" +
      cNum +
      ",子表新增条数" +
      subTotalNumber +
      ",子表修改条数" +
      subModify +
      ",\r\n子表失败条数" +
      sNum +
      ",\r\n" +
      sMages +
      ""
  );
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "xx-small";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}
viewModel.get("button59ub") &&
  viewModel.get("button59ub").on("click", function (data) {
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/otherFileDown?domainKey=developplatform"], function (a) {
      a.downloadTemplate("product_import_file");
    });
  });
viewModel.get("productinformation_1593950032564846598") &&
  viewModel.get("productinformation_1593950032564846598").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    let gridModel = viewModel.getGridModel();
    gridModel.on("afterSetDataSource", () => {
      debugger;
      //获取列表所有数据
      const rows = gridModel.getRows();
      //从缓存区获取按钮
      const actions = gridModel.getCache("actions");
      if (!actions);
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
          debugger;
          //设置按钮可用不可用
          actionState[action.cItemName] = { visible: true };
          if (action.cItemName == "btnEdit") {
            if (data.enable == "1") {
              actionState[action.cItemName] = { visible: false };
            } else {
              actionState[action.cItemName] = { visible: true };
            }
          }
        });
        actionsStates.push(actionState);
      });
      gridModel.setActionsState(actionsStates);
    });
  });
var argsData;
viewModel.on("beforeBatchdelete", function (args) {
  var data = JSON.parse(args.data.data);
  var sItem = viewModel
    .getGridModel()
    .getSelectedRows()
    .find(function (obj) {
      return obj.id === item.id;
    });
  data.forEach((item) => {
    var sItem = viewModel
      .getGridModel()
      .getSelectedRows()
      .find(function (obj) {
        return obj.id === item.id;
      });
    item.to_the_enterprise_uscc = sItem.warehouse_warehouse_code;
  });
  argsData = data;
});