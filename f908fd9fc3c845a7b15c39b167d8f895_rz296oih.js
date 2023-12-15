function loadJsXlsx(viewModel) {}
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
  //获取每个sheet页的数据
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    workbookDatas[i] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
  }
  //对获取的数据进行缓存
  window.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
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
function selectFile() {
  document.getElementById("file_input_info").click();
}
//导出
function exportFile(data, sheetName = "sheet1", fileName = "表格") {
  if (data.length) {
    const list = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, list, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}