viewModel.get("btnAdd").setVisible(false); //新增按钮
viewModel.get("btnBatchSubmitDrop").setVisible(false); //提交按钮组
viewModel.get("btnBatchSubmit").setVisible(false); //提交按钮
viewModel.get("btnBatchUnSubmit").setVisible(false); //撤回按钮
viewModel.get("btnBizFlowBatchPush").setVisible(false); //
viewModel.get("btnImportDrop").setVisible(false); //
viewModel.get("btnImport").setVisible(false); //
viewModel.get("btnTempexport").setVisible(false); //
viewModel.get("btnExportDrop").setVisible(false); //
viewModel.get("btnExport").setVisible(false); //
viewModel.get("btnExportDetail").setVisible(false); //
viewModel.get("btnBatchDelete").setVisible(false); //
viewModel.get("btnPrintDrop").setVisible(false); //
viewModel.get("btnBatchPrintnow").setVisible(false); //
viewModel.get("btnDownloadDrop").setVisible(false); //
viewModel.get("btnDownloadAttachment").setVisible(false); //
viewModel.get("button20xf") &&
  viewModel.get("button20xf").on("click", function (data) {
    // 导入--单击
    selectFile();
  });
function getTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  month = month > 9 ? month : "0" + month;
  day = day < 10 ? "0" + day : day;
  var today = year + "-" + month + "-" + day;
  return today;
}
function execlponse() {
  //获取excel数据
  debugger;
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var model = viewModel.getGridModel();
  var errMessage = "";
  var TotalNumber = 0;
  var sbNumber = 0;
  //判断是否已经生成凭证，如果生成了，不能执行
  var dataTime = getTime();
  //获取业务日期
  var business = cb.rest.AppContext.globalization;
  var businessDate = business.businessDate;
  if (businessDate != null) {
    dataTime = new Date(businessDate).format("yyyy-MM-dd");
  }
  var isScpz = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryIsCount", { importData: dataTime }, function (err, res) {}, viewModel, { async: false });
  if (isScpz.error) {
    cb.utils.alert("该期间执行完生成报告，不能启动检测");
    document.getElementById("filee_input_info").value = "";
    viewModel.clearCache("workbookInfoDatas");
    return false;
  }
  for (var i = 0; i < sheetone.length; i++) {
    let BOM = sheetone[i];
    console.log(BOM);
    var BOMresponse = cb.rest.invokeFunction("AT15F164F008080007.startUp.StartDetection", { BOM: BOM }, function (err, res) {}, viewModel, { async: false });
    if (BOMresponse.error) {
      sbNumber = sbNumber + 1;
      errMessage += "在execl中的第【" + (i + 1) + "】行；" + BOMresponse.error.message + "\n";
    } else {
      TotalNumber = TotalNumber + 1;
    }
  }
  document.getElementById("filee_input_info").value = "";
  cb.utils.confirm("总条数：" + sheetone.length + ",\n成功条数：" + TotalNumber + ",\n失败条数：" + sbNumber + ";\n失败详情原因：\n" + errMessage);
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
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
viewModel.on("afterMount", () => {
  loadJsXlsx(viewModel);
});
function loadJsXlsx(viewModel) {
  console.log("loadJsXlsx执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT15F164F008080007/xlsx.core.min.js?domainKey=developplatform`);
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
viewModel.get("button43td") &&
  viewModel.get("button43td").on("click", function (data) {
    // 模板下载--单击
    document.getElementById("filee_adc_export").click();
  });
//点击id 是 filee_a_export 的文件上传按钮
console.log("导出按钮单击");
var myHref = document.createElement("a");
myHref.id = "youridHere";
myHref.style = "float:right";
document.body.insertBefore(myHref, document.body.lastChild);
document.getElementById("filee_adc_export").onclick = function () {
  console.log("监听单击");
  debugger;
  exportExcel();
};
function exportExcel() {
  console.log("开始执行数据");
  var exportDataSource = [
    {
      ynCode: ""
    }
  ]; //导出json数据源
  var excelItems = [];
  for (let i = 0; i < exportDataSource.length; i++) {
    if (exportDataSource[i].name != "") {
      excelItems.push({
        "样本编号*": exportDataSource[i].ynCode
      }); //属性
    }
  }
  var sheet = XLSX.utils.json_to_sheet(excelItems);
  openDownloadDialog(sheet2blob(sheet), "启动检测导入模板.xlsx");
}
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || "样本编号";
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  var wopts = {
    bookType: "xlsx", // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: "binary"
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  return blob;
}
function openDownloadDialog(url, saveName) {
  if (typeof url == "object" && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement("a");
  aLink.href = url;
  aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent("click");
  else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}
viewModel.on("customInit", function (data) {
  // 启动检测--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs;
  //送检形式为自检
  commonVOs.push({
    itemName: "inspectionStyle",
    op: "eq",
    value1: "01"
  });
});
viewModel.get("button64xi") &&
  viewModel.get("button64xi").on("click", function (data) {
    // 启动检测--单击
    debugger;
    // 获取选中行数据
    var gridmodel = viewModel.getGridModel();
    var selectDatas = gridmodel.getSelectedRows();
    if (selectDatas.length == 0) {
      cb.utils.alert("请选择自检类型需要启动检测的收样单！");
      return;
    }
    //判断是否已经生成凭证，如果生成了，不能执行
    var btndataTime = getTime();
    //获取业务日期
    var business = cb.rest.AppContext.globalization;
    var businessDate = business.businessDate;
    if (businessDate != null) {
      btndataTime = new Date(businessDate).format("yyyy-MM-dd");
    }
    var isScpzbtn = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryIsCount", { importData: btndataTime }, function (err, res) {}, viewModel, { async: false });
    if (isScpzbtn.error) {
      cb.utils.alert("该期间执行完生成报告，不能启动检测");
      return false;
    }
    var mage = "";
    var cnum = 0;
    var snum = 0;
    for (var i = 0; i < selectDatas.length; i++) {
      var rowsdata = selectDatas[i];
      var id = rowsdata.id;
      var code = rowsdata.yangbenbianhao;
      var type = rowsdata.inspectionStyle; //01 是自检；02 是委外
      if (type == "02") {
        mage += "【" + code + "】送检样式不是【自检】\n";
        snum += 1;
        continue;
      }
      var status = rowsdata.checkStatus;
      if (status == "05") {
        mage += "【" + code + "】已经【启动检测】不需要重复启动\n";
        snum += 1;
        continue;
      }
      if (status != "00") {
        mage += "【" + code + "】检测状态不是【待检测】\n";
        snum += 1;
        continue;
      }
      var updateType = cb.rest.invokeFunction("AT15F164F008080007.startUp.updatastart", { id: id }, function (err, res) {}, viewModel, { async: false });
      if (updateType.error) {
        mage += updateType.error.message + "\n";
        snum += 1;
        continue;
      } else {
        //成功条数
        cnum += 1;
      }
    }
    if (snum == 0) {
      cb.utils.alert("成功条数：" + cnum + "\n失败条数：" + snum + "\n启动检测失败：" + mage, "success");
    } else if (cnum == 0) {
      cb.utils.alert("成功条数：" + cnum + "\n失败条数：" + snum + "\n启动检测失败：" + mage, "error");
    } else {
      cb.utils.alert("成功条数：" + cnum + "\n失败条数：" + snum + "\n启动检测失败：" + mage);
    }
    viewModel.execute("refresh");
  });