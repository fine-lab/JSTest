viewModel.on("customInit", function (data) {
  // 检测订单--页面初始化
  viewModel.get("btnBizFlowBatchPush").setVisible(false); //下推
});
viewModel.on("afterMount", () => {
  loadJsXlsx(viewModel);
});
function loadJsXlsx(viewModel) {
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT15F164F008080007/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function readWorkbookFromLocalFile(file, callback) {
  var reader = new FileReader();
  var fileName = file.name;
  reader.onload = function (e) {
    var localData = e.target.result;
    var workbook = XLSX.read(localData, { type: "binary" });
    workbook.name = fileName;
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
//读取excel里面数据，进行缓存    5
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  var fileName = workbook.name;
  var clname = fileName.split(".");
  fileName = clname[0];
  const workbookDatas = [];
  //获取每个sheet页的数据
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetNamesItem = sheetNames[i];
    var sheetNameList = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
    if (sheetNameList.length > 0) {
      workbookDatas[i] = sheetNameList;
    }
  }
  if (fileName.includes("检测订单BOM导入模板")) {
    execlponse(workbookDatas);
  } else if (fileName.includes("生成报告导入模板")) {
    execlponsereport(workbookDatas);
  } else {
    cb.utils.alert("导入文件有误，请检查！", "error");
    return false;
  }
}
function selectFile() {
  var fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  //点击id 是 filee_input_info 的文件上传按钮
  document.getElementById("filee_input_info").click();
  var dou = document.getElementById("filee_input_info");
  dou.onchange = function (e) {
    var files = e.target.files;
    if (files.length == 0) return;
    var filesData = files[0];
    readWorkbookFromLocalFile(filesData, function (workbook) {
      readWorkbook(workbook);
    });
  };
}
function execlponse(workbookDatas) {
  //获取excel数据
  var execl = workbookDatas;
  var sheetone = execl[0];
  var model = viewModel.getGridModel();
  var errMessage = "";
  var TotalNumber = 0;
  var sbNumber = 0;
  var dateTimes = getMonthDate();
  var business = cb.rest.AppContext.globalization;
  var businessDate = business.businessDate;
  if (businessDate != null) {
    dateTimes = new Date(businessDate).format("yyyy-MM") + "-01";
  }
  var dateTimesq = getMonthDateq(dateTimes);
  var querylsCountRese = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryIsCount", { importData: dateTimes }, function (err, res) {}, viewModel, { async: false });
  if (querylsCountRese.error) {
    cb.utils.confirm("已存在凭证号！");
    return false;
  }
  for (var i = 0; i < sheetone.length; i++) {
    let BOM = sheetone[i];
    BOM.strdates = dateTimes;
    BOM.strdateSql = dateTimesq;
    var BOMresponse = cb.rest.invokeFunction("AT15F164F008080007.jcdd.importXlxs", { BOM: BOM }, function (err, res) {}, viewModel, { async: false });
    if (BOMresponse.error) {
      sbNumber = sbNumber + 1;
      errMessage += "在execl中的第【" + (i + 2) + "】行;" + BOMresponse.error.message + ";\n";
    } else {
      TotalNumber = TotalNumber + 1;
    }
  }
  document.getElementById("filee_input_info").value = "";
  cb.utils.confirm("总条数：" + sheetone.length + ",\n成功条数：" + TotalNumber + ",\n失败条数：" + sbNumber + ";\n失败详情原因：\n" + errMessage);
  viewModel.execute("refresh");
}
viewModel.get("button45fg") &&
  viewModel.get("button45fg").on("click", function (data) {
    //触发文件点击事件
    selectFile();
  });
viewModel.get("button30bd") &&
  viewModel.get("button30bd").on("click", function (data) {
    // 生成报告--单击
    var model = viewModel.getGridModel();
    var event = model.getSelectedRows();
    if (event.length == 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    var sonApiMageS = "";
    var selfApiMageS = "";
    var ponseApiMages = "";
    var cNum = 0;
    var sNum = 0;
    a: for (var i = 0; i < event.length; i++) {
      var eventId = event[i].id;
      var InspectionFormtype = event[i].InspectionForm;
      //委外不判断子表的数据
      if (InspectionFormtype != "02") {
        //拿到子表数据以及生成了材料出库得数量;
        var sonApi = cb.rest.invokeFunction("AT15F164F008080007.jcdd.bomSon", { DetectOrder_id: eventId }, function (err, res) {}, viewModel, { async: false });
        if (sonApi.error) {
          sNum += 1;
          sonApiMageS += "该编码【" + event[i].sampleCode + "】；错误信息：" + sonApi.error.message;
          continue a;
        }
        var bomlist = sonApi.result.bomRes;
        for (var j = 0; j < bomlist.length; j++) {
          var bomType = bomlist[j].bomType;
          if (bomType == "01") {
            var isMater = bomlist[j].hasOwnProperty("Materialdelivery");
            if (isMater == false) {
              cb.utils.alert("【" + event[i].sampleCode + "】；" + "自检工序还有未【倒冲材料出库】");
              return;
            }
          }
        }
      }
      var ponseApi = cb.rest.invokeFunction("AT15F164F008080007.jcdd.UpdateReport", { id: eventId, data: event[i] }, function (err, res) {}, viewModel, { async: false });
      if (ponseApi.error) {
        sNum += 1;
        ponseApiMages += "该编码【" + event[i].sampleCode + "】；错误信息：" + ponseApi.error.message;
        continue a;
      } else {
        cNum += 1;
      }
    }
    viewModel.execute("refresh");
    cb.utils.alert("成功【" + cNum + "】条;\n" + "失败【" + sNum + "】条;\n原因:" + sonApiMageS + selfApiMageS + ponseApiMages);
  });
viewModel.get("button38bb") &&
  viewModel.get("button38bb").on("click", function (data) {
    // 终止--单击
    var gridmodel = viewModel.getGridModel();
    var event = gridmodel.getSelectedRows();
    if (event.length == 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    var cNumber = 0;
    var sNumber = 0;
    var smage = "";
    for (var i = 0; i < event.length; i++) {
      var id = event[i].id;
      var ponseApi = cb.rest.invokeFunction("AT15F164F008080007.jcdd.Detectiontatus", { id: id, data: event[i] }, function (err, res) {}, viewModel, { async: false });
      if (ponseApi.error) {
        smage += "这条单据【" + event[i].sampleCode + "】终止失败;" + "错误信息：【" + ponseApi.error.message + "】！";
        sNumber += 1;
      } else {
        cNumber += 1;
      }
    }
    cb.utils.alert("共【" + cNumber + "】条成功；" + "共【" + sNumber + "】条失败" + "错误信息：" + smage);
    viewModel.execute("refresh");
  });
viewModel.get("button52sa") &&
  viewModel.get("button52sa").on("click", function (data) {
    // 清除单号--单击
    let dataS = {
      billtype: "Voucher", // 单据类型
      billno: "e74e05f1", // 单据号
      params: {
        mode: "edit" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", dataS, viewModel);
  });
viewModel.get("button175de") &&
  viewModel.get("button175de").on("click", function (data) {
    // 下推采购订单（工序委外）测试--单击
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var event = gridmodel.getRowsByIndexes(gridmodel.getSelectedRowIndexes());
    if (event.length == 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    var sampDataRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.workingService", { data: event }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("进入到后台执行，请等待（查看日志信息）", "success");
  });
viewModel.get("button94hb") &&
  viewModel.get("button94hb").on("click", function (data) {
    // 下推采购订单（工序委外）平台代码；
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var event = gridmodel.getRowsByIndexes(gridmodel.getSelectedRowIndexes());
    if (event.length == 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    var purchaseMap = new Map();
    var mapkey = [];
    for (var z = 0; z < event.length; z++) {
      var eventData = event[z];
      //只有自检的数据才能生成
      var inspectTypez = event[z].InspectionForm;
      if (inspectTypez == "02") {
        cb.utils.alert("检测项目中选择的数据中有委外，请检查！");
        return;
      }
      //子表只有委外的数据才能生成
      var inspectType = event[z].BOMImportList_bomType;
      if (inspectType == "01") {
        cb.utils.alert("工序中选择的数据中有自检，请检查！");
        return;
      }
      //生成报告的不能下推！
      var generateType = eventData.Generate;
      if (generateType == "true") {
        cb.utils.alert("选择的检测项目中有已生成报告的 请检查！");
        return;
      }
      //判断有没有生成采购订单
      var isCaiGou = eventData.hasOwnProperty("BOMImportList_caigoudingdanhao");
      if (isCaiGou == true) {
        cb.utils.alert("选择的数据中有【已下推检测订单（工序委外）】请检查！");
        return;
      }
      //拼接MAP的key
      var strZjg = event[z].organizationId + event[z].id + event[z].BOMImportList_gongyingshang;
      var isStrZjg = purchaseMap.has(strZjg);
      if (isStrZjg == false) {
        var purchaseList = new Array();
        purchaseList.push(eventData);
        mapkey.push(strZjg);
        purchaseMap.set(strZjg, purchaseList);
      } else {
        var valueMap = purchaseMap.get(strZjg);
        valueMap.push(eventData);
        purchaseMap.set(strZjg, valueMap);
      }
    }
    //拿到符分组后的数据。
    var cNum = 0;
    var sNum = 0;
    var Meage = "";
    for (var i = 0; i < mapkey.length; i++) {
      var purchaseMapKey = mapkey[i];
      var sampData = purchaseMap.get(purchaseMapKey);
      var sampDataRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.purchaseOrder", { data: sampData }, function (err, res) {}, viewModel, { async: false });
      if (sampDataRes.error) {
        //失败
        Meage += sampDataRes.error.message + "\n";
        sNum += 1;
      } else {
        //成功
        cNum += 1;
      }
    }
    cb.utils.alert("总共【" + purchaseList.length + "】条\n" + "共【" + cNum + "】条成功；\n" + "共【" + sNum + "】条失败\n" + "错误信息：" + Meage);
    viewModel.execute("refresh");
  });
viewModel.get("detectorder_1590840063925682177") &&
  viewModel.get("detectorder_1590840063925682177").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    const btjmx = viewModel.get("sumSwitch").getValue();
    //表体+明细
    if (btjmx == false) {
      viewModel.get("button175de").setVisible(true); //下推采购订单（工序委外）
      viewModel.get("button163fe").setVisible(false); //下推采购订单(项目委外)
      viewModel.get("button211qj").setVisible(false); //项目委外
      viewModel.get("button175de").setVisible(true); //下推采购订单(项目委外)微服务
      viewModel.get("button203hg").setVisible(false); //倒冲材料出库
      viewModel.get("button38bb").setVisible(false); //终止按钮
      viewModel.get("button30bd").setVisible(false); //生成报告
      viewModel.get("btnExportDetail").setVisible(false); //导出明细
    } else {
      //表头
      viewModel.get("button175de").setVisible(false); //下推采购订单（工序委外）
      viewModel.get("button163fe").setVisible(true); //下推采购订单(项目委外)
      viewModel.get("button211qj").setVisible(true); //项目委外
      viewModel.get("button175de").setVisible(false); //下推采购订单(项目委外)微服务
      viewModel.get("button203hg").setVisible(true); //倒冲材料出库
      viewModel.get("button38bb").setVisible(true); // 终止按钮
      viewModel.get("button30bd").setVisible(true); //生成报告
      viewModel.get("btnExportDetail").setVisible(true); //导出明细
    }
  });
//点击id 是 filee_a_export 的文件上传按钮
var myHref = document.createElement("a");
myHref.id = "youridHere";
myHref.style = "float:right";
document.body.insertBefore(myHref, document.body.lastChild);
document.getElementById("filee_adc_export").onclick = function () {
  exportExcel();
};
viewModel.get("button115kc") &&
  viewModel.get("button115kc").on("click", function (data) {
    // 模板下载--单击
    document.getElementById("filee_adc_export").click();
  });
function exportExcel() {
  var excelItems = [];
  excelItems.push({
    "样本编号*": "",
    "BOM编码*": "",
    "导入小组*": ""
  }); //属性
  var sheet = XLSX.utils.json_to_sheet(excelItems);
  openDownloadDialog(sheet2blob(sheet, "BOM导入"), "检测订单BOM导入模板.xlsx");
}
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || sheetName;
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
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
viewModel.get("button125ob") &&
  viewModel.get("button125ob").on("click", function (data) {
    // 生成项目委外检测单--单击
    let pagedata = {
      billtype: "Voucher", // 单据类型
      billno: "15c15703", // 单据号
      params: {
        mode: "edit" // (编辑态edit、新增态add、浏览态browse)
        //传参
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", pagedata, viewModel);
  });
viewModel.get("button132td") &&
  viewModel.get("button132td").on("click", function (data) {
    // 倒冲材料出库--单击
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var selectDatas = gridmodel.getSelectedRows();
    if (selectDatas.length == 0) {
      cb.utils.alert("请选择自检类型的检测订单！");
      return;
    }
    var nowTime = getMonthDate(); //获取当前会计期间
    var allBOMList = new Array();
    //循环查询出所选订单的对应自检BOM以及BOM对应的物料
    for (var i = 0; i < selectDatas.length; i++) {
      let selectData = selectDatas[i];
      if (selectData.InspectionForm != "01") {
        cb.utils.alert(selectData.sampleCode + "送检形式非自检，不可生成材料出库单");
        return false;
      }
      if (selectData.importData != nowTime) {
        cb.utils.alert(selectData.sampleCode + "会计期间非本月，不可生成材料出库单");
        return false;
      }
      var bodyRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.quryJcddBody", { selectData: selectData }, function (err, res) {}, viewModel, { async: false });
      if (bodyRes.error) {
        cb.utils.alert(bodyRes.error.message);
        return false;
      }
      let bodyDatas = bodyRes.result.returnBody;
      if (bodyDatas.length > 0) {
        allBOMList.push.apply(allBOMList, bodyDatas);
      }
    }
    if (allBOMList.length == 0) {
      cb.utils.alert("所选检测订单无需生成材料出库单！");
      return;
    }
    //循环查询出的所有BOM数据，按照组织+小组+项目分开
    var grounpMap = new Map();
    for (var j = 0; j < allBOMList.length; j++) {
      let bomData = allBOMList[j];
      let key = bomData.orgId + bomData.ImportTeam + bomData.xiangmu; //拼接key值
      if (grounpMap.get(key) != null) {
        let sendObj = grounpMap.get(key);
        sendObj.allid = sendObj.allid + "," + bomData.id; //BOM id拼接
        let allpruData = sendObj.allpru;
        allpruData.push.apply(allpruData, bomData.boms);
        sendObj.allpru = allpruData;
        //从新放入Map
        grounpMap.set(key, sendObj);
      } else {
        var sendObj = {
          orgId: bomData.orgId,
          impoidrtTeam: bomData.ImportTeam,
          allid: bomData.id,
          xmid: bomData.xiangmu,
          allpru: bomData.boms
        };
        grounpMap.set(key, sendObj);
      }
    }
    //循环分组后的数据，将物料合并
    var grounpList = new Array();
    grounpMap.forEach((valueMap) => {
      var pruMap = new Map();
      for (var g = 0; g < valueMap.allpru.length; g++) {
        let pruObj = valueMap.allpru[g];
        if (pruMap.get(pruObj.wuliaobianma) != null) {
          let newpru = pruMap.get(pruObj.wuliaobianma);
          let newQty = newpru.qty + pruObj.wuliao;
          newpru.qty = newQty;
          //从新放入Map
          pruMap.set(pruObj.wuliaobianma, newpru);
        } else {
          let newpru = {
            pruId: pruObj.wuliaobianma,
            qty: pruObj.wuliao
          };
          pruMap.set(pruObj.wuliaobianma, newpru);
        }
      }
      valueMap.allpru = mapToList(pruMap);
      grounpList.push(valueMap);
    });
    var nowDay = getDayDate();
    //循环生成材料出库单
    for (var k = 0; k < grounpList.length; k++) {
      let sendDataObj = grounpList[k];
      //查询仓库id
      var warehouRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.queryWarehouId", { impoidrtTeam: sendDataObj.impoidrtTeam }, function (err, res) {}, viewModel, { async: false });
      if (warehouRes.error) {
        cb.utils.confirm("查询仓库异常：" + warehouRes.error.message);
        return false;
      }
      sendDataObj.warehouId = warehouRes.result.warehouObj.id;
      sendDataObj.warehouName = warehouRes.result.warehouObj.name;
      var makeBodyObjs = new Array();
      //循环物料组装材料出库单子表数据
      let sendBodyObj = sendDataObj.allpru;
      for (var m = 0; m < sendBodyObj.length; m++) {
        var makeBodyRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.makeCLCKBody", { sendBodyMap: sendBodyObj[m], sendDataObj: sendDataObj }, function (err, res) {}, viewModel, {
          async: false
        });
        if (makeBodyRes.error) {
          cb.utils.confirm("生成材料出库明细失败：" + makeBodyRes.error.message);
          return false;
        }
        makeBodyObjs.push.apply(makeBodyObjs, makeBodyRes.result.makeBodyObjs);
      }
      sendDataObj.makeBodyObjs = makeBodyObjs;
      //调用接口生成材料出库单
      var sendRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.sendCLCKData", { sendDataObj: sendDataObj, nowDay: nowDay }, function (err, res) {}, viewModel, { async: false });
      if (sendRes.error) {
        cb.utils.confirm("小组:" + sendDataObj.warehouName + ",生成材料出库单失败：" + sendRes.error.message);
        return false;
      }
      var clckCode = sendRes.result.code;
      //查询
      var idList = sendDataObj.allid.split(",");
      var allIdList = sliceIntoChunks(idList, 100);
      return false;
      for (var n = 0; n < allIdList.length; n++) {
        var updateRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.updateJCDDBody", { idlist: allIdList[n], code: clckCode }, function (err, res) {}, viewModel, { async: false });
        if (updateRes.error) {
          cb.utils.confirm("回更材料出库单号失败：" + updateRes.error.message + ",请还原出库单号：" + clckCode + "对应数据，删除出库单!");
          return false;
        }
      }
    }
    cb.utils.alert("材料出库单成功生成！");
    viewModel.execute("refresh");
  });
function getMonthDate() {
  var date = new Date();
  var year = date.getFullYear(); //  返回的是年份
  var month = date.getMonth() + 1;
  if (month < 10) month = "0" + month;
  return year + "-" + month + "-01";
}
function getMonthDateq(beDate) {
  debugger;
  var date = beDate.split("-"); //前一个月的日期
  var year = Number(date[0]);
  var month = Number(date[1]);
  month = month - 1;
  if (month == 0) {
    year = year - 1;
    month = 12;
  }
  if (month < 10) month = "0" + month;
  return year + "-" + month + "-01";
}
function getDayDate() {
  var date = new Date();
  var year = date.getFullYear(); //  返回的是年份
  var month = date.getMonth() + 1;
  var day = date.getDate(); //获取当前日1-31
  if (month < 10) month = "0" + month; //补位
  if (day < 10) day = "0" + day; //补位
  return year + "-" + month + "-" + day;
}
//拆分数组
function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
function mapToList(pruMap) {
  var pruList = new Array();
  pruMap.forEach((sendBodyMap) => {
    pruList.push(sendBodyMap);
  });
  return pruList;
}
viewModel.get("button139th") &&
  viewModel.get("button139th").on("click", function (data) {
    // 成本计算--单击
    var businessDate = cb.rest.AppContext.globalization.businessDate;
    var monthData = "";
    if (businessDate == null) {
      monthData = getMonthDate();
    } else {
      monthData = new Date(businessDate).format("yyyy-MM") + "-01";
    }
    var ttttt = cb.rest.invokeFunction("AT15F164F008080007.jcdd.implementCBJS", { importData: monthData }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("后台进入执行，请等待", "success");
  });
viewModel.get("button185wc") &&
  viewModel.get("button185wc").on("click", function (data) {
    // 模板下载--单击
    document.getElementById("filee_report_export").click();
  });
//点击id 是 filee_a_export 的文件上传按钮
var myHref = document.createElement("a");
myHref.id = "youridHere";
myHref.style = "float:right";
document.body.insertBefore(myHref, document.body.lastChild);
document.getElementById("filee_report_export").onclick = function () {
  reportExcel();
};
function reportExcel() {
  var excelItems = [];
  excelItems.push({
    "样本编号*": ""
  }); //属性
  var sheet = XLSX.utils.json_to_sheet(excelItems);
  openDownloadDialog(sheet2blob(sheet, "样本编号"), "生成报告导入模板.xlsx");
}
viewModel.get("button156ij") &&
  viewModel.get("button156ij").on("click", function (data) {
    // 生成报告导入(测试)--单击
    selectFile();
  });
function execlponsereport(workbookDatas) {
  //获取excel数据
  var execl = workbookDatas;
  var sheetone = execl[0];
  var voucherResponse = cb.rest.invokeFunction("AT15F164F008080007.jcdd.reportImport", { reportData: sheetone }, function (err, res) {}, viewModel, { async: false });
  document.getElementById("filee_input_info").value = "";
  cb.utils.alert("进入到后台执行，请等待", "success");
}
viewModel.get("button163fe") &&
  viewModel.get("button163fe").on("click", function (data) {
    // 下推采购订单（项目委外）--单击
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var event = gridmodel.getRowsByIndexes(gridmodel.getSelectedRowIndexes());
    if (event.length == 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    var purchaseMap = new Map();
    var Keylist = new Array();
    for (var i = 0; i < event.length; i++) {
      var eventData = event[i];
      var isInspectionForm = eventData.InspectionForm;
      if (isInspectionForm != "02") {
        cb.utils.alert("选择的检测项目中含有自检请检查！");
        return;
      }
      //已经生成的不能再次生成
      var isCaiGou = eventData.hasOwnProperty("caigoudingdanhao");
      if (isCaiGou == true) {
        cb.utils.alert("选择的数据中有【已下推检测订单（工序委外）】请检查！");
        return;
      }
      //生成报告的不能下推！
      var generateType = eventData.Generate;
      if (generateType == "true") {
        cb.utils.alert("选择的检测项目中有已生成报告的 请检查！");
        return;
      }
      //只有是检测中的才能生成！
      var checkStatusType = eventData.checkStatus;
      if (checkStatusType != 10) {
        cb.utils.alert("选择的检测项目中有不是检测中的 请检查！");
        return;
      }
      //组织id+检测项目id+供应商id
      var orgId = eventData.organizationId;
      var testId = eventData.testItemCode;
      var supplierId = eventData.gongyingshang;
      var Key = orgId + testId + supplierId;
      //判断map里面有没有这个KEY
      var isKey = purchaseMap.has(Key);
      if (isKey == false) {
        var purchaseList = new Array();
        Keylist.push(Key);
        purchaseList.push(eventData);
        purchaseMap.set(Key, purchaseList);
      } else {
        var valueMap = purchaseMap.get(Key);
        valueMap.push(eventData);
        purchaseMap.set(Key, valueMap);
      }
    }
    //拿到符合条件的数据。
    var cNum = 0;
    var sNum = 0;
    var Meage = "";
    for (var i = 0; i < Keylist.length; i++) {
      var purchaseMapKey = Keylist[i];
      var sampData = purchaseMap.get(purchaseMapKey);
      var sampDataRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.ProjectInspec", { data: sampData }, function (err, res) {}, viewModel, { async: false });
      if (sampDataRes.error) {
        //失败
        Meage += sampDataRes.error.message + "\n";
        sNum += 1;
      } else {
        //成功
        cNum += 1;
      }
    }
    cb.utils.alert("总共【" + purchaseList.length + "】条\n" + "共【" + cNum + "】条成功；\n" + "共【" + sNum + "】条失败\n" + "错误信息：" + Meage);
    viewModel.execute("refresh");
  });
viewModel.get("button203hg") &&
  viewModel.get("button203hg").on("click", function (data) {
    // 倒冲材料出库--单击
    debugger;
    //获取当前登陆人角色信息
    var userRes = cb.rest.invokeFunction("AT15F164F008080007.jcdd.founder", {}, function (err, res) {}, viewModel, { async: false });
    if (userRes.error) {
      cb.utils.alert("失败");
      return false;
    }
    var creaetName = userRes.result.date.name;
    if (creaetName == null) {
      cb.utils.alert("获取当前登陆人角色信息失败");
      return false;
    }
    var creaetId = userRes.result.date.id;
    if (creaetId == null) {
      cb.utils.alert("获取当前登陆人角色信息失败");
      return false;
    }
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var selectDatas = gridmodel.getSelectedRows();
    if (selectDatas.length == 0) {
      cb.utils.alert("请选择自检类型的检测订单！");
      return;
    }
    var businessDate = cb.rest.AppContext.globalization.businessDate;
    var monthData = "";
    if (businessDate == null) {
      monthData = getMonthDate();
    } else {
      monthData = new Date(businessDate).format("yyyy-MM") + "-01";
    }
    var voucherResponse = cb.rest.invokeFunction(
      "AT15F164F008080007.jcdd.MaterialIssue",
      {
        selectDatas: selectDatas,
        nowTime: monthData,
        creaetName: creaetName,
        creaetId: creaetId
      },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    cb.utils.alert("后台进入执行，请等待", "success");
  });
viewModel.get("button211qj") &&
  viewModel.get("button211qj").on("click", function (data) {
    // 项目委外--单击
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var selectDatas = gridmodel.getSelectedRows();
    if (selectDatas.length == 0) {
      cb.utils.alert("请选择委外类型的检测订单！");
      return;
    }
    var businessDate = cb.rest.AppContext.globalization.businessDate;
    var monthData = "";
    if (businessDate == null) {
      monthData = getMonthDate();
    } else {
      monthData = new Date(businessDate).format("yyyy-MM") + "-01";
    }
    var voucherResponse = cb.rest.invokeFunction("AT15F164F008080007.jcdd.PushDownCGDDWW", { selectDatas: selectDatas, nowTime: monthData }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("后台进入执行，请等待", "success");
  });
viewModel.get("button220hc") &&
  viewModel.get("button220hc").on("click", function (data) {
    // 删除凭证号--单击
    debugger;
    var gridmodel = viewModel.getGridModel();
    // 获取选中行数据
    var selectDatas = gridmodel.getSelectedRows();
    if (selectDatas.length == 0) {
      cb.utils.alert("请选择");
      return;
    }
    var voucherResponse = cb.rest.invokeFunction("AT15F164F008080007.backWorkflowFunction.Deathpzh", { list: selectDatas }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
  });