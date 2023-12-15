function loadJsXlsx(viewModel) {
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
}
function csv2sheet(csv) {
  var sheet = {}; // 将要生成的sheet
  csv = csv.split("\n");
  csv.forEach(function (row, i) {
    row = row.split(",");
    if (i == 0) sheet["!ref"] = "A1:" + String.fromCharCode(65 + row.length - 1) + (csv.length - 1);
    row.forEach(function (col, j) {
      sheet[String.fromCharCode(65 + j) + (i + 1)] = { v: col };
    });
  });
  return sheet;
}
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheets) {
  var workbook = {};
  for (let i = 0; i < sheets.length; i++) {
    sheetName = "sheet" + (i + 1);
    workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheets[i];
  }
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
function extTest() {
  var sheets = [];
  var aoa = [
    ["姓名", "性别", "年龄", "注册时间"],
    ["张三", "男", 18, new Date()],
    ["李四", "女", 22, new Date()]
  ];
  sheets[0] = XLSX.utils.aoa_to_sheet(aoa);
  var aoa1 = [
    ["姓名", "性别", "年龄", "注册时间"],
    ["张三1", "男", 122, new Date()],
    ["李四2", "女", 224, new Date()]
  ];
  sheets[1] = XLSX.utils.aoa_to_sheet(aoa1);
  openDownloadDialog(sheet2blob(sheets), "导出.xlsx");
}