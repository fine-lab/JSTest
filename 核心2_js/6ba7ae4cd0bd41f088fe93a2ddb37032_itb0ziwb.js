function loadJsXlsx(viewModel) {
  var secScript = document.createElement("script");
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/${viewModel.getParams().subId}/xlsx.core.min.js?domainKey=${viewModel.getDomainKey()}`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
var fileInput = document.createElement("input");
fileInput.id = "youridHere";
fileInput.type = "file";
fileInput.style = "display:none";
document.body.insertBefore(fileInput, document.body.lastChild);
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
function readWorkbook(workbook, callBack) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  const workbookDatas = [];
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    workbookDatas[i] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
  }
  if (callBack) callBack(workbookDatas);
}
//触发文件点击事件
function selectFile(callBack) {
  //给文件input注册改变事件
  document.getElementById("file_input_info").addEventListener("change", function (e) {
    var files = e.target.files;
    if (files.length == 0) return;
    var filesData = files[0];
    readWorkbookFromLocalFile(filesData, function (workbook) {
      readWorkbook(workbook, function (workbookDatas) {
        if (callBack) callBack(workbookDatas);
      });
    });
  });
  document.getElementById("file_input_info").click();
}