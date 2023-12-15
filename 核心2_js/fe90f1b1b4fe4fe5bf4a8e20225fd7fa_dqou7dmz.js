cb.defineInner([], function () {
  var MyExternal = {};
  function loadJsXlsx(viewModel) {
    //动态引入js-xlsx库
    var secScript = document.createElement("script");
    //保存传入的viewModel对象
    window.viewModelInfo = viewModel;
    secScript.setAttribute("type", "text/javascript");
    //传入文件地址 subId:应用ID
    secScript.setAttribute("src", `/opencomponentsystem/public/${viewModel.getParams().subId}/xlsx.core.min.js?domainKey=${viewModel.getDomainKey()}`);
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
  return MyExternal;
});