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
debugger;
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
viewModel.get("button24dh") &&
  viewModel.get("button24dh").on("click", function (data) {
    // 导入测试--单击
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
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var sheetTwo = execl[1];
  var model = viewModel.getGridModel();
  var errMessage = "\n失败详情原因：\n";
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
  var sMages = "\n失败详情原因：\n";
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
  var warehouseCode = [];
  for (var index = 0; index < sheetone.length; index++) {
    if (sheetone[index].库存地代码) {
      warehouseCode.push("'" + sheetone[index].库存地代码 + "'");
    }
  }
  //校验子表
  for (var m = 0; m < sheetTwo.length; m++) {
    var importSubtable = sheetTwo[m];
    console.log(importSubtable);
    for (var j = 0; j < sheetTwo.length; j++) {
      var information = sheetone[j];
      if (importSubtable.委托方编码 == information.委托方企业编码) {
        break;
      }
    }
    var importSubtableRes = cb.rest.invokeFunction("AT161E5DFA09D00001.ImportCheck.checkSubtable", { information: information, importSubtable: importSubtable }, function (err, res) {}, viewModel, {
      async: false
    });
    if (importSubtableRes.result.boolean != "true") {
      //将数据存入数组
      productListArrays.push(information.委托方企业编码);
      if (importSubtableRes.result.err) {
        if (subCollectArray.indexOf(importSubtableRes.result.err) == -1) {
          subCollectArray.push(importSubtableRes.result.err);
        }
        for (var k = 0; k < subCollectArray.length; k++) {
          if (subCollectArray[k] == importSubtableRes.result.err) {
            subNumbertArray[k].push(information.委托方企业编码);
          }
        }
      }
    } else {
      cNum += 1;
    }
  }
  var rangeCodeSql = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where dict_type = 'A.9' and enable = 1";
  var rangeData = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql }, function (err, res) {}, viewModel, { async: false });
  if (!rangeData.result) {
    rangeData = { result: { res: [] } };
  }
  var rangeCodeSql2 = "select id, dict_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code where dict_type = 'A.1' and enable = 1";
  var rangeData2 = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: rangeCodeSql2 }, function (err, res) {}, viewModel, { async: false });
  if (!rangeData2.result) {
    rangeData2 = { result: { res: [] } };
  }
  var warehouseData = { result: { res: [] } };
  if (warehouseCode.length > 0) {
    var warehouseSql = "select id, warehouse_code from AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse where warehouse_code in (" + warehouseCode.join(",") + ") and enable = 1";
    var warehouseRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: warehouseSql }, function (err, res) {}, viewModel, { async: false });
    if (warehouseRes.result) {
      warehouseData = warehouseRes;
    }
  }
  //导入主表;
  for (var i = 0; i < sheetone.length; i++) {
    var information = sheetone[i];
    console.log(information);
    for (var j = 0; j < sheetTwo.length; j++) {
      var importSubtable = sheetTwo[j];
      if (importSubtable.委托方编码 == information.委托方企业编码) {
        break;
      }
    }
    checkSum = 0;
    for (var n = 0; n < productListArrays.length; n++) {
      if (importSubtable.委托方编码 == productListArrays[n]) {
        checkSum = checkSum + 1;
      }
    }
    if (checkSum == 0) {
      var BOMresponse = cb.rest.invokeFunction(
        "AT161E5DFA09D00001.import.importMainTable",
        { information: information, importSubtable: importSubtable, range_code: rangeData.result.res, range_code2: rangeData2.result.res, warehouse: warehouseData.result.res },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      if (BOMresponse.result.err) {
        sbNumber = sbNumber + 1;
        if (collectArray.indexOf(BOMresponse.result.err) == -1) {
          collectArray.push(BOMresponse.result.err);
        }
        for (var k = 0; k < collectArray.length; k++) {
          if (collectArray[k] == BOMresponse.result.err) {
            numbertArray[k].push(information.委托方企业编码);
          }
        }
      } else {
        TotalNumbers = TotalNumbers + 1;
      }
      if (BOMresponse.result.type == "add") {
        TotalNumber = TotalNumber + 1;
        productArray.push(information.委托方企业编码);
      } else {
        if (BOMresponse.result.type == "change") {
          Modify = Modify + 1;
        }
      }
    } else {
      if (collectArray.indexOf("子表未导入，整单删除;") == -1) {
        collectArray.push("子表未导入，整单删除;");
      }
      for (var k = 0; k < collectArray.length; k++) {
        if (collectArray[k] == "子表未导入，整单删除;") {
          numbertArray[k].push(information.委托方企业编码);
        }
      }
    }
  }
  for (var b = 0; b < collectArray.length; b++) {
    for (var d = 0; d < numbertArray[b].length; d++) {
      errMessage = errMessage + (b == 0 ? "" : "\n") + numbertArray[b][d] + "、";
    }
    errMessage = errMessage + collectArray[b];
  }
  //导入子表
  for (var z = 0; z < sheetTwo.length; z++) {
    var importSubtable = sheetTwo[z];
    console.log(importSubtable);
    var AdvanceArrivalNoticeNo = importSubtable.委托方企业编码;
    if (errMessage.includes(AdvanceArrivalNoticeNo)) {
      sNum += 1;
      if (subCollectArray.indexOf("未成功导入，请先导入委托方信息") == -1) {
        subCollectArray.push("未成功导入，请先导入委托方信息");
      }
      for (var k = 0; k < subCollectArray.length; k++) {
        if (subCollectArray[k] == "未成功导入，请先导入委托方信息") {
          subNumbertArray[k].push(importSubtable.委托方企业编码);
        }
      }
    } else {
      for (var j = 0; j < sheetTwo.length; j++) {
        var information = sheetone[j];
        if (importSubtable.委托方编码 == information.委托方企业编码) {
          break;
        }
      }
      checkSum = 0;
      for (var n = 0; n < productListArrays.length; n++) {
        if (information.委托方企业编码 == productListArrays[n]) {
          checkSum = checkSum + 1;
        }
      }
      if (checkSum == 0) {
        var importSubtableRes = cb.rest.invokeFunction("AT161E5DFA09D00001.import.importSubtable", { information: information, importSubtable: importSubtable }, function (err, res) {}, viewModel, {
          async: false
        });
        if (importSubtableRes.result.err) {
          if (subCollectArray.indexOf(importSubtableRes.result.err) == -1) {
            subCollectArray.push(importSubtableRes.result.err);
          }
          for (var k = 0; k < subCollectArray.length; k++) {
            if (subCollectArray[k] == importSubtableRes.result.err) {
              subNumbertArray[k].push(information.委托方企业编码);
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
        sNum += 1;
      }
    }
  }
  //调用api函数删除委托方信息
  var delProduct = cb.rest.invokeFunction("AT161E5DFA09D00001.del.delClient", { productListArray: productListArray }, function (err, res) {}, viewModel, { async: false });
  if (productListArray.length > 0) {
    TotalNumber = TotalNumber - productListArray.length;
    TotalNumbers = TotalNumbers - productListArray.length;
  }
  sbNumber = sheetone.length - TotalNumbers;
  sNum = sheetTwo.length - cNum;
  document.getElementById("filee_input_info").value = "";
  if (sbNumber == 0) {
    errMessage = "";
  }
  for (var c = 0; c < subCollectArray.length; c++) {
    for (var e = 0; e < subNumbertArray[c].length; e++) {
      sMages = sMages + (c == 0 ? "" : "\n") + subNumbertArray[c][e] + "、";
    }
    sMages = sMages + subCollectArray[c] + "";
  }
  if (sNum == 0) {
    sMages = "";
  }
  cb.utils.confirm(
    "主表总条数：" +
      sheetone.length +
      "，" +
      "主表成功条数：" +
      TotalNumbers +
      "\n主表新增条数：" +
      TotalNumber +
      "，主表修改条数：" +
      Modify +
      "，" +
      "主表失败条数：" +
      sbNumber +
      errMessage +
      ";\n子表总条数" +
      sheetTwo.length +
      "，子表成功条数" +
      cNum +
      "\n子表新增条数" +
      subTotalNumber +
      "，子表修改条数" +
      subModify +
      "\n子表失败条数" +
      sNum +
      sMages +
      ""
  );
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "xx-small";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}
viewModel.get("button53ih") &&
  viewModel.get("button53ih").on("click", function (data) {
    var nullFileArr = [];
    viewModel
      .getGridModel()
      .getSelectedRows()
      .forEach((item) => {
        if (!item.protocol_attachment) {
          nullFileArr.push(item.clientCode);
        }
      });
    // 委托协议附件未上传
    if (nullFileArr.length > 0) {
      cb.utils.confirm(nullFileArr.join("/") + "委托协议附件未上传");
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "xx-small";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
      return false;
    }
    var count = 0;
    // 确认--单击
    var gridModel = viewModel.getGridModel();
    // 获取选中行下标
    var indexs = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexs.length; idx++) {
      var index = indexs[idx];
      var selectedData = gridModel.getRowsByIndexes(index);
      var enadleStatus = selectedData[0].enable;
      // 创建人
      var creator_userName = selectedData[0].creator_userName;
      // 修改人
      var modifier_userName = selectedData[0].modifier_userName;
      // 获取委托方编码
      var clientCode = selectedData[0].clientCode;
      var ID = selectedData[0].id;
      // 获取许可证/备案凭证效期
      var expiryDate = selectedData[0].expiryDate;
      var timestamp = Date.parse(new Date());
      var registration_Date = Date.parse(expiryDate);
      if (enadleStatus == 1) {
        count = count + 1;
      } else {
        var cancelAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.currentuser", { id: ID }, function (err, res) {}, viewModel, { async: false });
        // 确认人
        var cancelNames = cancelAPI.result.currentUser.name;
        var selectedId = selectedData[0].id;
        // 当前日前与许可证备案凭证有效期比对
        params = {
          id: selectedId,
          cancelNames: cancelNames
        };
        // 调用api函数更新实体
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.confrimUpClient", { params }, function (err, res) {}, viewModel, { async: false });
        if (!res.error) {
          count = count + 1;
        }
        if (res.error) {
          alert("委托方编码：" + clientCode + "启用失败:" + res.error.message);
        }
      }
    }
    if (count > 0) {
      alert(" 单据启用成功！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button37nd") &&
  viewModel.get("button37nd").on("click", function (data) {
    var count = 0;
    var number = 0;
    // 取消确认--单击
    var gridModel = viewModel.getGridModel();
    // 获取选中行下标
    var indexs = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexs.length; idx++) {
      var index = indexs[idx];
      var selectedData = gridModel.getRowsByIndexes(index);
      var enadleStatus = selectedData[0].enable;
      // 获取委托方编码
      var clientCode = selectedData[0].clientCode;
      if (enadleStatus == 0) {
        alert("委托方编码：" + clientCode + "，单据已经属于停用状态");
        continue;
      } else {
        var selectedId = selectedData[0].id;
        params = {
          id: selectedId
        };
        // 调用api函数更新实体
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.cancelUpClient", { params }, function (err, res) {}, viewModel, { async: false });
        if (!res.error) {
          count = count + 1;
        }
        if (res.error) {
          alert("委托方企业编码:'" + clientCode + "',取消确认失败：" + res.error.message);
        }
      }
    }
    if (count > 0) {
      alert(" 单据停用成功！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button42kd") &&
  viewModel.get("button42kd").on("click", function (data) {
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/otherFileDown?domainKey=developplatform"], function (a) {
      a.downloadTemplate("client_import_file");
    });
  });
viewModel.get("clientinformation_1593933127571472393") &&
  viewModel.get("clientinformation_1593933127571472393").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    let gridModel = viewModel.getGridModel();
    gridModel.on("afterSetDataSource", () => {
      //获取列表所有数据
      const rows = gridModel.getRows();
      //从缓存区获取按钮
      const actions = gridModel.getCache("actions");
      if (!actions);
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
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
  argsData = data;
});