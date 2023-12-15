function loadJsXlsx(viewModel) {
  var secScript = document.createElement("script");
  this.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", `/opencomponentsystem/public/${this.viewModelInfo.getParams().subId}/xlsx.core.min.js?domainKey=${this.viewModelInfo.getDomainKey()}`);
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
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  const workbookDatas = [];
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    workbookDatas[i] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
  }
  this.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
}
//给文件input注册改变事件
document.getElementById("file_input_info").addEventListener("click", function (e) {
  var files = e.target.files;
  if (files.length == 0) return;
  var filesData = files[0];
  readWorkbookFromLocalFile(filesData, function (workbook) {
    readWorkbook(workbook);
  });
});
//触发文件点击事件
function selectFile() {
  document.getElementById("file_input_info").click();
}