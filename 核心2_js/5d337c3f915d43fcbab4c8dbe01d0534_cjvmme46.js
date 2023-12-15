[];
viewModel.on("customInit", function (data) {
  //加载js-xlsx
  loadJsXlsx(viewModel);
  loadJsXlsxs(viewModel);
  loadJsXlsxss(viewModel);
  fileSaver(viewModel);
});
viewModel.get("button22ee") &&
  viewModel.get("button22ee").on("click", function (data) {
    //导入--单击
    //加载js-xlsx
    loadJsXlsx(viewModel);
    loadJsXlsxs(viewModel);
    loadJsXlsxss(viewModel);
    fileSaver(viewModel);
    //触发文件点击事件
    selectFile();
  });
function loadJsXlsx(viewModel) {
  console.log("loadJsXlsx执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT164D981209380003/xlsx.core.min.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT164D981209380003/xlsxStyle.utils.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT164D981209380003/xlsxStyle.core.min.js?domainKey=developplatform`);
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
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT164D981209380003/FileSaver.js?domainKey=developplatform`);
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
  document.getElementById("filee_input_info").value = "";
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
  debugger;
  // 错误总数居
  let ErrorDateSum = new Array();
  // 解析出Excel中的数据-->JSONArray
  let execl = viewModel.getCache("workbookInfoDatas");
  // 处理excel中的数据
  let sheetDate = sheetDateList(execl);
  // 调用封装主子的数据 tableDate:子表数据  mainMapList：主表Map
  let packageMethodDate = packageMethod(sheetDate.tableDate, sheetDate.mainMapList, sheetDate.ErrorMapDate);
  // 保存数据
  let SaveDateList = SaveDate(packageMethodDate.mainMapList);
  // 调用返回错误的方法
  ErrorDateSum.push(
    sheetDate.ErrorDate1,
    sheetDate.ErrorDate2,
    sheetDate.ErrorDate3,
    sheetDate.ErrorDate4,
    sheetDate.ErrorDate5,
    sheetDate.ErrorDate6,
    packageMethodDate.ErrorDate,
    SaveDateList.ErrorDate1,
    SaveDateList.ErrorDate2,
    SaveDateList.ErrorDate3,
    SaveDateList.ErrorDate4,
    SaveDateList.ErrorDate5,
    SaveDateList.ErrorDate6
  );
  let ErrDateList = ErrorDateList(ErrorDateSum);
  // 执行完成弹窗
  successDate(sheetDate.sumNum, SaveDateList.successNum, ErrDateList.ErrorNum, ErrDateList.ErrorStr);
}
let SalesReturnMap = new Map();
// 处理页签中的数据
function sheetDateList(execl) {
  // 错误数据
  let ErrorDate1 = new Array();
  let ErrorDate2 = new Array();
  let ErrorDate3 = new Array();
  let ErrorDate4 = new Array();
  let ErrorDate5 = new Array();
  let ErrorDate6 = new Array();
  // 获取第一个页签的数据
  let sheetOneDate = execl[0];
  let mainMapList = new Map();
  let bigmap = new Map();
  let ErrorMapDate = new Map();
  // 储存封装好的数据
  let tableDate = new Array();
  for (let i = 0; i < sheetOneDate.length; i++) {
    let sheetLineDate = sheetOneDate[i];
    // 获取字段名
    let returngoodsCode = sheetLineDate["销售退货单号"];
    let returngoodsType = sheetLineDate["退货类型"];
    let material_model = sheetLineDate["型号"];
    let material_code = sheetLineDate["助记码"];
    let material = sheetLineDate["商品名称"];
    let qty = sheetLineDate["退货数量"];
    let returngoodssource = sheetLineDate["退货来源"];
    let receivedquantity = sheetLineDate["工厂收货数量"];
    let qualityproblemqty = sheetLineDate["质量问题数量"];
    let componentqty = sheetLineDate["零部件厂责任数量"];
    let overwarrantyquantity = sheetLineDate["过质保数量"];
    let Factorybatch = sheetLineDate["工厂鉴定批次"];
    let Outbound = sheetLineDate["出库单号"];
    let responsibilityQty = sheetLineDate["客户责任数量"];
    let scrappedQty = sheetLineDate["需报废数量"];
    let responsibilitiesQty = sheetLineDate["组装厂责任数量"];
    // 判断是否为空的数据
    if (sheetLineDate["销售退货单号"] != undefined && sheetLineDate["退货类型"] == "2C") {
      console.log(i + 1 + "列数据是2C类型的，退货单号必须为空");
      ErrorDate6.push("第" + (i + 1));
      continue;
    } else if (
      sheetLineDate["工厂鉴定批次"] == undefined ||
      sheetLineDate["退货类型"] == undefined ||
      sheetLineDate["型号"] == undefined ||
      sheetLineDate["助记码"] == undefined ||
      sheetLineDate["退货数量"] == undefined ||
      sheetLineDate["退货来源"] == undefined ||
      sheetLineDate["工厂收货数量"] == undefined
    ) {
      console.log("列中必填项未填写，请填写后重新导入");
      ErrorDate1.push("第" + (i + 1));
      continue;
    }
    if (sheetLineDate["退货类型"] != "2C") {
      // 判断退货单号是否存在系统中 TODO
      let isExistSales = cb.rest.invokeFunction("AT164D981209380003.api.SalesReturn", { code: returngoodsCode }, function (err, res) {}, viewModel, { async: false });
      if (isExistSales.result.SalesIsEx === 0) {
        console.log(Outbound + "该单号不存在系统中或改单号没有审核");
        ErrorDate4.push(returngoodsCode);
        continue;
      }
      SalesReturnMap.set(returngoodsCode, isExistSales.result.SaleRes);
    }
    // 判断数据库中是否存在改退货单号
    let isExist = cb.rest.invokeFunction("AT164D981209380003.api.isExist", { code: Outbound }, function (err, res) {}, viewModel, { async: false });
    if (isExist.result.isExistNum == 1) {
      console.log(Outbound + "退货单号已存在不能重复导入");
      // 错误数据
      ErrorDate2.push(Outbound);
      continue;
    }
    // 判断物料是否存在
    let isExistPro = cb.rest.invokeFunction("AT164D981209380003.api.isExistProduct", { material_code: material_code }, function (err, res) {}, viewModel, { async: false });
    if (isExistPro.result.noProduct == 0) {
      console.log(returngoodsCode + "该物料不存在系统中");
      // 错误数据
      ErrorDate3.push(returngoodsCode);
      continue;
    }
    // 组装数据
    // 校验数据
    let key = Outbound + "" + returngoodsCode + "" + returngoodsType;
    if (undefined == bigmap.get(Outbound)) {
      let smallmap = new Map();
      smallmap.set(key, Outbound);
      bigmap.set(Outbound, smallmap);
    } else {
      let smallmap = bigmap.get(Outbound);
      if (undefined == smallmap.get(key)) {
        ErrorMapDate.set(Outbound, "1");
        ErrorDate5.push(Outbound);
        console.log(Outbound + "该退货单号存在不一样的数据，请检查");
        continue;
      }
    }
    // 子表对象
    let Subtable = {
      returngoodsCode: returngoodsCode,
      Outbound: Outbound,
      Factorybatch: Factorybatch,
      returngoodsType: returngoodsType,
      material: isExistPro.result.productId,
      responsibilitiesQty: responsibilitiesQty,
      qty: qty,
      returngoodssource: returngoodssource,
      responsibilityQty: responsibilityQty,
      receivedquantity: receivedquantity,
      componentqty: componentqty,
      scrappedQty: scrappedQty,
      overwarrantyquantity: overwarrantyquantity,
      isMateSaleReturn: 1
    };
    //将主表信息保存到MAP集合中
    let mainTable = { returngoodsCode: returngoodsCode, returngoodsType: returngoodsType, Factorybatch: Factorybatch, Outbound: Outbound, verifystate: 2, signBackSubtableList: [] };
    mainMapList.set(Outbound, mainTable);
    tableDate.push(Subtable);
  }
  // 返回数据
  return {
    tableDate: tableDate,
    mainMapList: mainMapList,
    ErrorDate1: ErrorDate1,
    ErrorDate2: ErrorDate2,
    ErrorDate3: ErrorDate3,
    ErrorDate4: ErrorDate4,
    ErrorDate5: ErrorDate5,
    ErrorDate6: ErrorDate6,
    ErrorMapDate: ErrorMapDate,
    sumNum: sheetOneDate.length
  };
}
// 封装主子数据
function packageMethod(tableDate, mainMapList, ErrorMapDate) {
  // 错误数据
  let ErrorDate = new Array();
  // 循环子表数据 根据identifyCode找Map数据进行封装
  let mainList = {};
  for (let i = 0; i < tableDate.length; i++) {
    let returngoodsCode = tableDate[i].returngoodsCode;
    let returngoodsType = tableDate[i].returngoodsType;
    let Factorybatch = tableDate[i].Factorybatch;
    let Outbound = tableDate[i].Outbound;
    if (ErrorMapDate.get(Outbound) != undefined) {
      continue;
    }
    mainList = mainMapList.get(Outbound);
    if (mainList == undefined || mainList.returngoodsCode != returngoodsCode || mainList.returngoodsType != returngoodsType || mainList.Factorybatch != Factorybatch) {
      console.log(returngoodsCode + "该退货号存在异常请检查后导入");
      ErrorDate.push(returngoodsCode);
      continue;
    }
    // 删除子表中主表的元素
    delete tableDate.returngoodsCode;
    delete tableDate.Outbound;
    delete tableDate.Factorybatch;
    delete tableDate.returngoodsCode;
    mainList.signBackSubtableList.push(tableDate[i]);
  }
  return { mainMapList: mainMapList, ErrorDate: ErrorDate };
}
// 保存数据
function SaveDate(mainMapList) {
  // 错误数据
  let ErrorDate1 = new Array();
  let ErrorDate2 = new Array();
  let ErrorDate3 = new Array();
  let ErrorDate4 = new Array();
  let ErrorDate5 = new Array();
  let ErrorDate6 = new Array();
  // 计算成功条数
  let successNum = 0;
  let resAdd = "";
  // 判断是否是2C数据
  mainMapList.forEach((value, key) => {
    let feedbackForm = value;
    if (value.returngoodsType != "2C" && value.returngoodsType != "2B") {
      console.log(value.returngoodsCode + "退货类型有误，请检查");
      ErrorDate1.push(value.returngoodsCode);
    } else {
      if (value.returngoodsType === "2C") {
        let resAddDate = cb.rest.invokeFunction("AT164D981209380003.api.AddDate", { DateObject: value }, function (err, res) {}, viewModel, { async: false });
        // 判断是否成功
        if (!resAddDate.result.hasOwnProperty("res")) {
          console.log(value.returngoodsCode + "保存失败，请联系管理员查看");
          ErrorDate2.push(value.returngoodsCode);
        }
        successNum += successNum + value.signBackSubtableList.length;
        resAdd = resAddDate.result.res.id;
      }
      if (value.returngoodsType === "2B") {
        let resAddDate = cb.rest.invokeFunction("AT164D981209380003.api.AddDate", { DateObject: value }, function (err, res) {}, viewModel, { async: false });
        // 判断是否成功
        if (!resAddDate.result.hasOwnProperty("res")) {
          console.log(value.returngoodsCode + "保存失败，请联系管理员查看");
          ErrorDate2.push(value.returngoodsCode);
        }
        resAdd = resAddDate.result.res.id;
        // 回写销售退货
        let SaleOneTableDate = SalesReturnMap.get(value.returngoodsCode);
        let resUpdDate = cb.rest.invokeFunction("AT164D981209380003.api.updateSaleReturn", { res: resAddDate.result.res, saleRetur: SaleOneTableDate, id: resAdd }, function (err, res) {}, viewModel, {
          async: false
        });
        if (resUpdDate.result.successCode === 1) {
          console.log(value.returngoodsCode + "回写销售退货单失败，请联系管理员");
          successNum += successNum + value.signBackSubtableList.length - 1;
          ErrorDate3.push(value.returngoodsCode);
        } else if (resUpdDate.result.ErrorNumber > 0) {
          successNum += successNum + value.signBackSubtableList.length - 1;
          console.log(value.returngoodsCode + "该回签单有关联异常的情况，无法生成新的销售退货");
          ErrorDate6.push(value.returngoodsCode);
        } else {
          // 生成新的销售出库单 TODO
          let resAddDate = cb.rest.invokeFunction(
            "AT164D981209380003.api.AddSaleReturn",
            { SaleReturnTable: SaleOneTableDate, SaleReturnCode: value.returngoodsCode, id: resAdd },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          if (resAddDate.result.successCode === 1) {
            console.log(value.returngoodsCode + "添加销售退货单失败，请联系管理员");
            ErrorDate4.push(value.returngoodsCode);
            successNum += successNum + value.signBackSubtableList.length - 1;
          } else if (resAddDate.result.successCode === 2) {
            console.log(value.returngoodsCode + "审核非质量问题单失败，请删除生成的退货单，重新导入");
            successNum += successNum + value.signBackSubtableList.length - 1;
            ErrorDate5.push(value.returngoodsCode);
          } else {
            successNum += successNum + value.signBackSubtableList.length;
          }
        }
      }
    }
  });
  return { ErrorDate1: ErrorDate1, ErrorDate2: ErrorDate2, ErrorDate3: ErrorDate3, ErrorDate4: ErrorDate4, ErrorDate5: ErrorDate5, ErrorDate6: ErrorDate6, successNum: successNum };
}
// 封装导入失败的原因
function ErrorDateList(ErrorDate) {
  // 错误类型
  let ErrorType = new Array();
  // 错误类型
  ErrorType.push("列中必填项未填写，请检查模板在重新导入");
  ErrorType.push("该回签单已存在不能重复导入");
  ErrorType.push("该回签单中有物料不存在系统中，请检查后在重新导入");
  ErrorType.push("该单号不存在系统中或该单号没有审核");
  ErrorType.push("该退货单号存在不一样的数据，请检查");
  ErrorType.push("列2C类型的数据销售退货单号必须为空");
  ErrorType.push("该回签单存在异常请联系管理员");
  ErrorType.push("退货类型有误，请检查");
  ErrorType.push("回签单号保存失败，请联系管理员查看");
  ErrorType.push("回写销售退货单失败，请联系管理员");
  ErrorType.push("生成销售退货单失败，请联系管理员看");
  ErrorType.push("审核非质量问题单失败，请删除生成的退货单，重新导入");
  ErrorType.push("导入成功，关联异常，无法生成子销售退货单");
  let ErrorStr = "";
  let ErrorNum = 0;
  ErrType: for (let i = 0; i < ErrorType.length; i++) {
    if (ErrorDate[i].length <= 0) {
      continue ErrType;
    }
    ErrDate: for (let j = 0; j < ErrorDate[i].length; j++) {
      ErrorNum += 1;
      if (j + 1 === ErrorDate[i].length) {
        ErrorStr = ErrorStr + ErrorDate[i][j];
      } else {
        ErrorStr = ErrorStr + ErrorDate[i][j] + "、";
      }
    }
    ErrorStr = ErrorStr + ErrorType[i] + ";";
  }
  return { ErrorNum: ErrorNum, ErrorStr: ErrorStr };
}
// 弹框函数
function successDate(sumNum, successNum, ErrorNum, ErrorStr) {
  let text = "导入完成，共" + sumNum + "条，成功条数为：" + successNum + "条，失败条数为：" + ErrorNum + "条，原因为：" + ErrorStr;
  cb.utils.confirm(text);
}
viewModel.on("beforeBatchunaudit", (data) => {
  // 保存可以弃审的回签单到规则链中
  let successArrayData = new Array();
  //错误信息
  let ErrorDataArray = new Array();
  // 获取弃审前的数据
  let UnauditData = JSON.parse(data.data.data);
  for (let i = 0; i < UnauditData.length; i++) {
    let signBackid = UnauditData[i].code;
    // 调用Api函数
    let UnauditDataRes = cb.rest.invokeFunction("AT164D981209380003.api.BactUnuditDate", { id: signBackid }, function (err, res) {}, viewModel, { async: false });
    if (UnauditDataRes.result.ErrorCode == 1) {
      let ErrorStr = UnauditData[i].code + "该单号生成的销售退货单再寻在系统中，请删除后弃审";
      ErrorDataArray.push(ErrorStr);
      continue;
    }
    successArrayData.push(UnauditData[i]);
  }
  if (ErrorDataArray.length > 0) {
    // 弹出错误信息
    cb.utils.alert(JSON.stringify(ErrorDataArray));
    data.data.data = JSON.stringify(successArrayData);
  }
});