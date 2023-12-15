viewModel.on("afterMount", () => {
  debugger;
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
viewModel.get("button24nf") &&
  viewModel.get("button24nf").on("click", function (data) {
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
  debugger;
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var model = viewModel.getGridModel();
  //导入;
  var errMessage = "失败详情原因：";
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
  //主表失败详情原因汇总
  var collectArray = new Array();
  //主表存储失败的表单编码
  var numbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    numbertArray[a] = new Array();
  }
  for (var i = 0; i < sheetone.length; i++) {
    var enterprise = sheetone[i];
    console.log(enterprise);
    var BOMresponse = cb.rest.invokeFunction("AT161E5DFA09D00001.import.enterpriseImport", { enterprise: enterprise }, function (err, res) {}, viewModel, { async: false });
    if (BOMresponse.result.err) {
      sbNumber = sbNumber + 1;
      if (collectArray.indexOf(BOMresponse.result.err) == -1) {
        collectArray.push(BOMresponse.result.err);
      }
      for (var k = 0; k < collectArray.length; k++) {
        if (collectArray[k] == BOMresponse.result.err) {
          numbertArray[k].push(enterprise.生产企业编号);
        }
      }
    } else {
      TotalNumbers = TotalNumbers + 1;
    }
    if (BOMresponse.result.type == "add") {
      TotalNumber = TotalNumber + 1;
    } else {
      if (BOMresponse.result.type == "change") {
        Modify = Modify + 1;
      }
    }
  }
  document.getElementById("filee_input_info").value = "";
  for (var b = 0; b < collectArray.length; b++) {
    for (var d = 0; d < numbertArray[b].length; d++) {
      errMessage = errMessage + numbertArray[b][d] + "、";
    }
    errMessage = errMessage + collectArray[b];
  }
  sbNumber = sheetone.length - TotalNumbers;
  if (sbNumber == 0) {
    errMessage = "";
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
      ",\r\n" +
      errMessage +
      ";"
  );
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}
viewModel.get("button29ve") &&
  viewModel.get("button29ve").on("click", function (data) {
    // 确认--单击
    var count = 0;
    debugger;
    var gridModel = viewModel.getGridModel();
    // 获取选中行下标
    var indexs = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexs.length; idx++) {
      var index = indexs[idx];
      var selectedData = gridModel.getRowsByIndexes(index);
      var enadleStatus = selectedData[0].enable;
      // 获取生产企业编码
      var production_numbers = selectedData[0].production_numbers;
      // 创建人
      var creator_userName = selectedData[0].creator_userName;
      //修改人
      var modifier_userName = selectedData[0].modifier_userName;
      var ID = selectedData[0].id;
      if (enadleStatus == 1) {
        count = count + 1;
      } else {
        var cancelAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.currentuser", { id: ID }, function (err, res) {}, viewModel, { async: false });
        // 确认人
        var cancelNames = cancelAPI.result.currentUser.name;
        var selectedId = selectedData[0].id;
        params = {
          id: selectedId,
          cancelNames: cancelNames
        };
        // 调用api函数更新实体
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.comUpenterprise", { params }, function (err, res) {}, viewModel, { async: false });
        if (!res.error) {
          count = count + 1;
        }
        if (res.error) {
          alert("生产企业编码：" + production_numbers + "确认失败：" + res.error.message);
        }
      }
    }
    if (count > 0) {
      alert(" 单据启用成功！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button35qj") &&
  viewModel.get("button35qj").on("click", function (data) {
    // 取消确认--单击
    var count = 0;
    debugger;
    var gridModel = viewModel.getGridModel();
    // 获取选中行下标
    var indexs = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexs.length; idx++) {
      var index = indexs[idx];
      var selectedData = gridModel.getRowsByIndexes(index);
      var enableStatus = selectedData[0].enable;
      // 获取生产企业编码
      var production_numbers = selectedData[0].production_numbers;
      if (enableStatus == 0) {
        alert("生产企业编码：" + production_numbers + "，单据已经属于停用状态");
        continue;
      } else {
        var selectedId = selectedData[0].id;
        params = { id: selectedId };
        // 调用api函数更新实体
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.canUpenterprise", { params }, function (err, res) {}, viewModel, { async: false });
        if (!res.error) {
          count = count + 1;
        }
        if (res.error) {
          alert("生产企业编码：" + production_numbers + ",取消确认失败：" + res.error.message);
        }
      }
    }
    if (count > 0) {
      alert(" 单据停用成功！");
    }
    viewModel.execute("refresh");
  });
viewModel.get("button40oh") &&
  viewModel.get("button40oh").on("click", function (data) {
    // 模板下载--单击
    debugger;
    //创建一个工作簿
    var workbook = XLSX.utils.book_new();
    //添加主表表头
    var data = [];
    data.push(["生产企业编号", "生产企业名称", "生产许可证号/备案凭证号", "生产范围", "许可证/备案凭证效期至", "企业类型"]);
    //数组转换为工作表
    var dateSheet = XLSX.utils.aoa_to_sheet(data);
    //工作表插入工作簿
    XLSX.utils.book_append_sheet(workbook, dateSheet, "生产企业信息");
    var datass = [];
    datass.push(["1、", "企业类型，‘1’代表‘国外’，‘0’代表‘国内’，不能输入文字"]);
    datass.push(["2、", "生产企业信息必须按照‘生产企业编号’进行去重复项"]);
    datass.push(["3、", "模板字段值不可为空，如不需要添加值请以“/”代替"]);
    datass.push(["4、", "日期格式为：2023/12/20 "]);
    //数组转换为工作表
    var dateSheetss = XLSX.utils.aoa_to_sheet(datass);
    //工作表插入工作簿
    XLSX.utils.book_append_sheet(workbook, dateSheetss, "说明");
    XSU.mergeCells(workbook, "说明", "B1", "G1"); //合并title单元格
    XSU.mergeCells(workbook, "说明", "B2", "G2"); //合并title单元格
    XSU.mergeCells(workbook, "说明", "B3", "G3"); //合并title单元格
    XSU.mergeCells(workbook, "说明", "B4", "G4"); //合并title单元格
    var wopts = {
      bookType: "xlsx", // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: "binary"
    };
    var myDate = new Date();
    let workBookName = "生产企业模板" + ".xlsx";
    //转换成二进制 使用xlsx-style（XS）进行转换才能得到带样式Excel
    var wbout = xlsxStyle.write(workbook, wopts);
    //保存，使用FileSaver.js
    saveAs(new Blob([XSU.s2ab(wbout)], { type: "" }), workBookName);
  });
viewModel.get("information_production_1593949474237972488") &&
  viewModel.get("information_production_1593949474237972488").on("beforeSetDataSource", function (data) {
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