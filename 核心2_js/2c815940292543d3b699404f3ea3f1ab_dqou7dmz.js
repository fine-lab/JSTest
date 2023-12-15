function loadJsXlsx(viewModel) {
  var secScript = document.createElement("script");
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GZTBDM/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
}
var fileInput = document.createElement("input");
fileInput.id = "youridHere";
fileInput.type = "file";
fileInput.style = "display:none";
document.body.insertBefore(fileInput, document.body.lastChild);
function readWorkbookFromLocalFile(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var localData = e.target.result;
    var workbook = XLSX.read(localData, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // ���������Ƽ���
  const workbookDatas = [];
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    workbookDatas[i] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
  }
  window.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
}
document.getElementById("file_input_info").addEventListener("change", function (e) {
  var files = e.target.files;
  if (files.length == 0) return;
  var filesData = files[0];
  readWorkbookFromLocalFile(filesData, function (workbook) {
    readWorkbook(workbook);
  });
});
function selectFile() {
  document.getElementById("file_input_info").click();
}