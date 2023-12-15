viewModel.on("afterMount", () => {
  //加载js-xlsx
  loadJsXlsx(viewModel);
  loadJsXlsxs(viewModel);
  loadJsXlsxss(viewModel);
  fileSaver(viewModel);
});
function loadJsXlsx(viewModel) {
  console.log("loadJsXlsx执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function loadJsXlsxs(viewModel) {
  console.log("loadJsXlsxs执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.utils.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.core.min.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/FileSaver.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
viewModel.get("button44ng") &&
  viewModel.get("button44ng").on("click", function (data) {
    //导入更新模板下载--单击
    var workbook = XLSX.utils.book_new();
    //添加主表表头
    var data = [];
    data.push([
      "下达单位",
      "日立下达日期",
      "录入日期",
      "类型",
      "任务单号",
      "分包合同号",
      "合同号",
      "分包合同日期",
      "生产工号",
      "用户单位",
      "地址",
      "型号",
      "层/站",
      "台数",
      "施工内容",
      "材料合同编号",
      "材料合同日期",
      "发票日期",
      "支付材料费日期",
      "材料费金额",
      "人工费金额",
      "材料费占费用合计比例",
      "委托价格",
      "费用合计",
      "组员",
      "组长",
      "人数",
      "施工工时",
      "计划施工日期",
      "计划完工日期",
      "施工时间",
      "完工时间",
      "完工交单日期",
      "完工回单日期",
      "交办结算日期",
      "开票日期",
      "收款日期",
      "备注",
      "启用"
    ]);
    data.push([
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "枚举,{'1':'保修等效','2':'保养有效','3':'维改有效','4':'项目委托'},长度36",
      "字符,长度200",
      "档案,长度36",
      "字符,长度200",
      "日期,长度23",
      "字符",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "整数,长度11",
      "字符,长度200",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "浮点型",
      "浮点型",
      "浮点型",
      "浮点型",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "整数,长度11",
      "浮点型",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "枚举,{'0':'停用','1':'启用'},长度4,默认值0"
    ]);
    //数组转换为工作表
    var dateSheet = XLSX.utils.aoa_to_sheet(data);
    //工作表插入工作簿
    XLSX.utils.book_append_sheet(workbook, dateSheet, "安装维改合同");
    XSU.setAlignmentHorizontalAll(workbook, "安装维改合同", "center"); //垂直居中
    XSU.setAlignmentVerticalAll(workbook, "安装维改合同", "center"); //水平居中
    XSU.setAlignmentWrapTextAll(workbook, "安装维改合同", true); //自动换行
    XSU.setBorderDefaultAll(workbook, "安装维改合同"); //设置所有单元格默认边框
    var BorderList = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AF",
      "AG",
      "AH",
      "AI",
      "AJ",
      "AK",
      "AL",
      "AM"
    ];
    var BorderStr = "";
    //设置字体大小
    XSU.setFontSizeAll(workbook, "安装维改合同", 10);
    for (var n = 0; n < BorderList.length; n++) {
      BorderStr = BorderList[n] + 2;
      XSU.setFontSize(workbook, "安装维改合同", BorderStr, 7);
    }
    for (var n = 0; n < BorderList.length; n++) {
      BorderStr = BorderList[n] + 1;
      XSU.setFillFgColorRGB(workbook, "安装维改合同", BorderStr, "ADADAD");
    }
    var wopts = {
      bookType: "xlsx", // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: "binary"
    };
    var myDate = new Date();
    let workBookName = "安装维改合同更新导入模板" + ".xlsx";
    var wbout = xlsxStyle.write(workbook, wopts);
    //保存，使用FileSaver.js
    saveAs(new Blob([XSU.s2ab(wbout)], { type: "" }), workBookName);
  });
viewModel.get("button51od") &&
  viewModel.get("button51od").on("click", function (data) {
    //导入更新--单击
    //加载js-xlsx
    loadJsXlsx(viewModel);
    loadJsXlsxs(viewModel);
    loadJsXlsxss(viewModel);
    fileSaver(viewModel);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function loadJsXlsxs(viewModel) {
  console.log("loadJsXlsxs执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.utils.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.core.min.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/FileSaver.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
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
    //获取上传excel文件
    var files = e.target.files;
    if (files.length == 0) {
      return;
    }
    var filesData = files[0];
    //对文件进行处理
    readWorkbookFromLocalFile(filesData, function (workbook) {
      readWorkbook(workbook);
    });
  };
  document.getElementById("filee_input_info").value = "";
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
function execlponse() {
  //获取excel数据
  debugger;
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  viewModel.clearCache("workbookInfoDatas");
  var productArray = new Array();
  var err = "未导入原因:第";
  for (var i = 1; i < sheetone.length; i++) {
    if (sheetone[i]["任务单号"] != undefined) {
      productArray.push(sheetone[i]);
    } else {
      err = err + i + "、";
    }
  }
  if (sheetone.length - productArray.length - 1 == 0) {
    err = "";
  } else {
    err = err + "行任务单号为空";
  }
  var BOMresponse = cb.rest.invokeFunction("GT102917AT3.import.WGImport", { productArray: productArray }, function (err, res) {}, viewModel, { async: false });
  cb.utils.confirm("总条数：" + (sheetone.length - 1) + ",导入条数：" + productArray.length + "未导入条数：" + (sheetone.length - productArray.length - 1) + "," + err + ";");
  //自动刷新页面
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}