var currViewModel = null;
var invokeName;
var keyword;
cb.defineInner([], function () {
  var MyExternal = {
    // 脚本引入
    loadScript(viewModel, url) {
      var secScript = document.createElement("script");
      window.viewModelInfo = viewModel;
      secScript.setAttribute("type", "text/javascript");
      secScript.setAttribute("src", url);
      document.body.insertBefore(secScript, document.body.lastChild);
    },
    loadXlsxScript(viewModel) {
      currViewModel = viewModel;
      this.loadScript(viewModel, `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsx.core.min.js?domainKey=developplatform`);
      this.loadScript(viewModel, `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsxStyle.utils.js?domainKey=developplatform`);
      this.loadScript(viewModel, `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/xlsxStyle.core.min.js?domainKey=developplatform`);
      this.loadScript(viewModel, `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/FileSaver.js?domainKey=developplatform`);
    },
    // 导出模板
    exportExcelModel(param) {
      //创建一个工作簿
      var workbook = XLSX.utils.book_new();
      var paramData = param.data;
      for (var index = 0; index < paramData.length; index++) {
        var sheetName = paramData[index].sheetName;
        //数组转换为工作表
        var dateSheet = XLSX.utils.aoa_to_sheet(paramData[index].data);
        //工作表插入工作簿
        XLSX.utils.book_append_sheet(workbook, dateSheet, sheetName);
        if (paramData[index].isCenter) {
          //设置表格居中
          XSU.setAlignmentHorizontalAll(workbook, sheetName, "center"); //垂直居中
          XSU.setAlignmentVerticalAll(workbook, sheetName, "center"); //水平居中
          XSU.setAlignmentWrapTextAll(workbook, sheetName, true); //自动换行
        }
      }
      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary"
      };
      var myDate = new Date();
      let workBookName = param.sysName + "模板" + ".xlsx";
      //转换成二进制 使用xlsx-style（XS）进行转换才能得到带样式Excel
      var wbout = xlsxStyle.write(workbook, wopts);
      //保存，使用FileSaver.js
      saveAs(new Blob([XSU.s2ab(wbout)], { type: "" }), workBookName);
    },
    // 触发文件点击事件
    selectFile(invokeName, keyword) {
      console.log(invokeName, keyword);
      invokeName = invokeName;
      keyword = keyword;
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
          this.readWorkbook(workbook, invokeName, keyword);
        });
      };
    }
  };
  return MyExternal;
});
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
//读取excel里面数据，进行缓存
function readWorkbook(workbook, iname, kname) {
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
  execlponse(iname, kname);
  console.log("readWorkbook执行完成");
}
//处理导入的数据
function execlponse(iname, kname) {
  console.log(iname, kname);
  //获取excel数据
  var execl = currViewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  var model = currViewModel.getGridModel();
  //导入;
  //主表新增条数
  var TotalNumber = 0;
  //主表成功条数
  var TotalNumbers = 0;
  var sbNumber = 0;
  //主表修改条数
  var Modify = 0;
  //主表失败详情原因汇总
  var collectArray = new Array();
  //主表存储失败的表单编码
  var numbertArray = new Array(10);
  for (let a = 0; a < 10; a++) {
    numbertArray[a] = new Array();
  }
  if (!sheetone) {
    cb.utils.alert("没有需要导入的数据，本次导入结束", "warning");
    return false;
  }
  var warehouseCode = [];
  for (var index = 0; index < sheetone.length; index++) {
    if (sheetone[index].库存地代码) {
      warehouseCode.push(sheetone[index].库存地代码);
    }
  }
  var warehouseData = { result: { res: [] } };
  if (warehouseCode.length > 0) {
    var warehouseSql =
      "select id, warehouse_code,warehouse_address,contacts,contact_phone,district from AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse where warehouse_code in (" +
      warehouseCode.join(",") +
      ") and enable = 1";
    var warehouseRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: warehouseSql }, function (err, res) {}, currViewModel, { async: false });
    if (warehouseRes.result) {
      warehouseData = warehouseRes;
    }
  }
  for (var i = 0; i < sheetone.length; i++) {
    var enterprise = sheetone[i];
    console.log(enterprise);
    var BOMresponse = cb.rest.invokeFunction(
      "AT161E5DFA09D00001.import." + iname,
      { enterprise: enterprise, rowIndex: i, warehouseData: warehouseData.result.res },
      function (err, res) {},
      currViewModel,
      { async: false }
    );
    console.log(BOMresponse);
    if (BOMresponse.result.err) {
      sbNumber = sbNumber + 1;
      if (collectArray.indexOf(BOMresponse.result.err) == -1) {
        collectArray.push(BOMresponse.result.err);
      }
    } else {
      TotalNumbers = TotalNumbers + 1;
    }
    if (BOMresponse.result.type == "add") {
      TotalNumber = TotalNumber + 1;
    } else {
      if (BOMresponse.result.type == "change") {
        Modify = Modify + 1;
      }
    }
  }
  document.getElementById("filee_input_info").value = "";
  var returnMsg = "总条数：" + sheetone.length + "，成功条数：" + TotalNumbers + "\n新增条数：" + TotalNumber + "，修改条数：" + Modify;
  var msgType = "success";
  if (sbNumber > 0) {
    msgType = "error";
    returnMsg += "\n失败条数：" + sbNumber;
    returnMsg += "\n失败详情原因：";
    for (var errIndex = 0; errIndex < collectArray.length; errIndex++) {
      returnMsg += "\n" + collectArray[errIndex];
    }
  }
  returnMsg += "";
  cb.utils.confirm(returnMsg);
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "xx-small";
  document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
  currViewModel.clearCache("workbookInfoDatas");
  currViewModel.execute("refresh");
}