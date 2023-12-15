viewModel.on("afterMount", () => {
  //加载js-xlsx
  loadJsXlsx(viewModel);
  //加载js-xlsx-style
  loadJsXlsxs(viewModel);
  //加载js-xlsx-style
  loadJsXlsxss(viewModel);
  //加载fileSaver
  fileSaver(viewModel);
});
viewModel.get("button28zg") &&
  viewModel.get("button28zg").on("click", function (data) {
    // 导入按钮--单击
    //加载js-xlsx
    loadJsXlsx(viewModel);
    debugger;
    //触发文件点击事件
    selectFile();
  });
const compare = (attr, rev) => {
  rev = rev || typeof rev === "undefined" ? 1 : -1;
  return (a, b) => {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
};
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
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var sheetTwo = execl[1];
  var cNum = 0;
  var sNum = 0;
  var sMages = "失败详情原因：";
  var model = viewModel.getGridModel();
  var checkSum = 0;
  var errMessage = "失败详情原因：";
  var TotalNumber = 0;
  var sbNumber = 0;
  var productListArrays = ["1"];
  //主表失败详情原因汇总
  var collectArray = new Array();
  //主表存储失败的表单编码
  var numbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    numbertArray[a] = new Array();
  }
  //子表失败详情原因汇总
  var subCollectArray = new Array();
  //子表存储失败的表单编码
  var subNumbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    subNumbertArray[a] = new Array();
  }
  //导入主表;
  for (var i = 0; i < sheetone.length; i++) {
    //获取主表信息
    var information = sheetone[i];
    var subArray = new Array();
    //循环子表
    for (var j = 0; j < sheetTwo.length; j++) {
      var subInformation = sheetTwo[j];
      if (information.出库单号 == subInformation.出库单号) {
        subArray.push(subInformation);
      }
    }
  }
  debugger;
}