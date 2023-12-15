viewModel.get("button24pe") &&
  viewModel.get("button24pe").on("click", function (data) {
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
  var model = viewModel.getGridModel();
  //导入;
  var errMessage = "";
  var TotalNumber = 0;
  var sbNumber = 0;
  for (var i = 0; i < sheetone.length; i++) {
    var enterprise = sheetone[i];
    console.log(enterprise);
    var BOMresponse = cb.rest.invokeFunction("AT161E5DFA09D00001.import.UserImport", { enterprise: enterprise }, function (err, res) {}, viewModel, { async: false });
    if (BOMresponse.error) {
      sbNumber = sbNumber + 1;
      errMessage = errMessage + "模板中的第" + i + 2 + "行,错误原因：" + BOMresponse.error.message + ";\n";
    } else {
      TotalNumber = TotalNumber + 1;
    }
  }
  document.getElementById("filee_input_info").value = "";
  cb.utils.confirm("主表总条数：【" + sheetone.length + "】,\n主表成功条数：【" + TotalNumber + "】,\n失败条数：【" + sbNumber + "】;\n失败详情原因：\n【" + errMessage + "】");
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}