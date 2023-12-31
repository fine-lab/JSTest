function loadJsXlsx(viewModel) {
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT37595AT2/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
var fileInput = document.createElement("input");
fileInput.id = "youridHere";
fileInput.type = "file";
fileInput.style = "display:none";
document.body.insertBefore(fileInput, document.body.lastChild);
var inputChangeCallback;
//读取本地excel文件
function readWorkbookFromLocalFile(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var localData = e.target.result;
    var workbook = XLSX.read(localData, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
//读取excel里面数据，进行缓存
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  const workbookDatas = [];
  //获取每个sheet页的数据
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    workbookDatas[i] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
  }
  //对获取的数据进行缓存
  window.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
  if (inputChangeCallback) {
    inputChangeCallback.call();
    fileInput.value = "";
  }
}
//给文件input注册改变事件
document.getElementById("file_input_info").addEventListener("change", function (e) {
  var files = e.target.files;
  if (files.length == 0) return;
  var filesData = files[0];
  readWorkbookFromLocalFile(filesData, function (workbook) {
    readWorkbook(workbook);
  });
});
//触发文件点击事件
function selectFile(callback) {
  document.getElementById("file_input_info").click();
  inputChangeCallback = callback;
}
//触发文件点击事件
function exportExcelFile(excelData, excelName) {
  //创建工作薄
  let wb = XLSX.utils.book_new();
  //创建sheet对象
  let sheet = XLSX.utils.json_to_sheet(excelData);
  //将sheet对象添加到工作薄web
  XLSX.utils.book_append_sheet(wb, sheet, "sheet");
  //将工作薄对象转化为文件进行下载
  XLSX.writeFile(wb, excelName + ".xlsx");
}
function exportExcelFileByStyle(excelData, excelName) {
  //创建工作薄
  let wb = XLSX.utils.book_new();
  //创建sheet对象
  let sheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });
  //将sheet对象添加到工作薄web
  XLSX.utils.book_append_sheet(wb, sheet, "sheet");
  //将工作薄对象转化为文件进行下载
  XLSX.writeFile(wb, excelName + ".xlsx");
}