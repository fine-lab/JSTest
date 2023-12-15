let djInfoTable = viewModel.get("UDIShowDjInfo2List"); //单据列表
let waiBjInfoList = viewModel.get("UDIShowWaiBjInfo3List"); //外包装信息表
let zhongBjInfoList = viewModel.get("UDIShowZhongBjInfo2List"); //中包装信息表
let ziBjInfoList = viewModel.get("UDIShowZiBjInfo2List"); //zi包装信息表
waiBjInfoList.setState("fixedHeight", 180);
zhongBjInfoList.setState("fixedHeight", 250);
ziBjInfoList.setState("fixedHeight", 300);
waiBjInfoList.setReadOnly(true);
zhongBjInfoList.setReadOnly(false);
ziBjInfoList.setReadOnly(false);
let wbzNum = 0;
let zbzNum = 0;
let searchTemp = "no"; //是否搜索
viewModel.getParams().autoLoad = false;
function invokeFunction1(id, data, callback, viewModel, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  if (options.async === false) {
    return proxy.doProxy(data, callback);
  } else {
    proxy.doProxy(data, callback);
  }
}
getDjInfo();
function getParentUdiId(parentUdiId, bzType) {
  let resDataFileSql = "select * from I0P_UDI.I0P_UDI.UDIFilev3 where parentUdiId = '" + parentUdiId + "'";
  invokeFunction1(
    "I0P_UDI.publicFunction.shareApi",
    {
      sqlType: "check",
      sqlTableInfo: resDataFileSql,
      sqlCg: "isv-ud1"
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常，" + err.message);
        return false;
      }
      if (bzType === "wbz") {
        zhongBjInfoList.clear();
        zbzSetData(res.resDataRs);
      }
      if (bzType === "zxbz") {
        ziBjInfoList.clear();
        zxbzSetDate(res.resDataRs);
      }
    },
    undefined,
    { domainKey: "yourKeyHere" }
  );
}
function zxbzSetDate(zxBzData) {
  if (zxBzData != null && typeof zxBzData != "undefined") {
    for (let zxbi1 = 0; zxbi1 < zxBzData.length; zxbi1++) {
      let zxBzrs = {
        identificationQty: zxBzData[zxbi1].identificationQty, //包装内含小一级产品标识数量
        sterilizationBatchNo: zxBzData[zxbi1].sterilizationBatchNo, //sterilizationBatchNo
        materialCode: zxBzData[zxbi1].materialCode, //商品编码
        materialName: zxBzData[zxbi1].materialName, //商品名称
        produceDate: zxBzData[zxbi1].produceDate, //生产日期
        PI: zxBzData[zxbi1].PI, //PI
        batchNo: zxBzData[zxbi1].batchNo, //批号
        spec: zxBzData[zxbi1].spec, //规格型号
        UDI: zxBzData[zxbi1].UDI, //UDI
        DI: zxBzData[zxbi1].DI, //DI
        validateDate: zxBzData[zxbi1].validateDate, //有效期至
        productIdentification: zxBzData[zxbi1].productIdentification, //产品标识
        scanUDI: zxBzData[zxbi1].scanUDI, //扫码UDI
        packageIdentification: zxBzData[zxbi1].packageIdentification, //包装标识
        packagingPhase: zxBzData[zxbi1].packagingPhase, //包装阶段
        serialNumber: zxBzData[zxbi1].serialNumber, //序列号
        id: zxBzData[zxbi1].id, //序列号
        parentUdiId: zxBzData[zxbi1].parentUdiId //id
      };
      ziBjInfoList.appendRow(zxBzrs);
    }
  }
}
//中包装 填充数据
function zbzSetData(zbzBzData) {
  if (zbzBzData != null && typeof zbzBzData != "undefined") {
    for (let zxbi = 0; zxbi < zbzBzData.length; zxbi++) {
      let zbzBzrs = {
        identificationQty: zbzBzData[zxbi].identificationQty, //包装内含小一级产品标识数量
        sterilizationBatchNo: zbzBzData[zxbi].sterilizationBatchNo, //sterilizationBatchNo
        materialCode: zbzBzData[zxbi].materialCode, //商品编码
        materialName: zbzBzData[zxbi].materialName, //商品名称
        produceDate: zbzBzData[zxbi].produceDate, //生产日期
        PI: zbzBzData[zxbi].PI, //PI
        batchNo: zbzBzData[zxbi].batchNo, //批号
        spec: zbzBzData[zxbi].spec, //规格型号
        UDI: zbzBzData[zxbi].UDI, //UDI
        DI: zbzBzData[zxbi].DI, //DI
        validateDate: zbzBzData[zxbi].validateDate, //有效期至
        productIdentification: zbzBzData[zxbi].productIdentification, //产品标识
        scanUDI: zbzBzData[zxbi].scanUDI, //扫码UDI
        packageIdentification: zbzBzData[zxbi].packageIdentification, //包装标识
        packagingPhase: zbzBzData[zxbi].packagingPhase, //包装阶段
        serialNumber: zbzBzData[zxbi].serialNumber, //序列号
        id: zbzBzData[zxbi].id, //序列号
        parentUdiId: zbzBzData[zxbi].parentUdiId //id
      };
      zhongBjInfoList.appendRow(zbzBzrs);
    }
    zbzNum = zbzBzData.length;
  }
}
//查询 关联的udi
function getUdiInfo(djId) {
  invokeFunction1(
    "I0P_UDI.publicFunction.getUdiSourceOrg",
    {
      djId: djId
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常，" + err.message);
        return false;
      }
      let zxBzData = res.zxbzData;
      let zbzBzData = res.zbzData;
      let wbzBzData = res.wbzData;
      if (wbzBzData != null && typeof wbzBzData != "undefined") {
        wbzNum = wbzBzData.length;
        let wbzList = [];
        for (let zxbi = 0; zxbi < wbzBzData.length; zxbi++) {
          let wbzBzRs = {
            identificationQty: wbzBzData[zxbi].identificationQty, //包装内含小一级产品标识数量
            sterilizationBatchNo: wbzBzData[zxbi].sterilizationBatchNo, //sterilizationBatchNo
            materialCode: wbzBzData[zxbi].materialCode, //商品编码
            materialName: wbzBzData[zxbi].materialName, //商品名称
            produceDate: wbzBzData[zxbi].produceDate, //生产日期
            PI: wbzBzData[zxbi].PI, //PI
            batchNo: wbzBzData[zxbi].batchNo, //批号
            spec: wbzBzData[zxbi].spec, //规格型号
            UDI: wbzBzData[zxbi].UDI, //UDI
            DI: wbzBzData[zxbi].DI, //DI
            validateDate: wbzBzData[zxbi].validateDate, //有效期至
            productIdentification: wbzBzData[zxbi].productIdentification, //产品标识
            scanUDI: wbzBzData[zxbi].scanUDI, //扫码UDI
            packageIdentification: wbzBzData[zxbi].packageIdentification, //包装标识
            packagingPhase: wbzBzData[zxbi].packagingPhase, //包装阶段
            serialNumber: wbzBzData[zxbi].serialNumber, //序列号
            id: wbzBzData[zxbi].id, //序列号
            parentUdiId: wbzBzData[zxbi].parentUdiId //id
          };
          wbzList.push(wbzBzRs);
        }
        waiBjInfoList.insertRows(1, wbzList);
      }
      if (zbzBzData != null && typeof zbzBzData != "undefined") {
        zbzNum = zbzBzData.length;
        let zbzList = [];
        for (let zxbi = 0; zxbi < zbzBzData.length; zxbi++) {
          let zbzBzrs = {
            identificationQty: zbzBzData[zxbi].identificationQty, //包装内含小一级产品标识数量
            sterilizationBatchNo: zbzBzData[zxbi].sterilizationBatchNo, //sterilizationBatchNo
            materialCode: zbzBzData[zxbi].materialCode, //商品编码
            materialName: zbzBzData[zxbi].materialName, //商品名称
            produceDate: zbzBzData[zxbi].produceDate, //生产日期
            PI: zbzBzData[zxbi].PI, //PI
            batchNo: zbzBzData[zxbi].batchNo, //批号
            spec: zbzBzData[zxbi].spec, //规格型号
            UDI: zbzBzData[zxbi].UDI, //UDI
            DI: zbzBzData[zxbi].DI, //DI
            validateDate: zbzBzData[zxbi].validateDate, //有效期至
            productIdentification: zbzBzData[zxbi].productIdentification, //产品标识
            scanUDI: zbzBzData[zxbi].scanUDI, //扫码UDI
            packageIdentification: zbzBzData[zxbi].packageIdentification, //包装标识
            packagingPhase: zbzBzData[zxbi].packagingPhase, //包装阶段
            serialNumber: zbzBzData[zxbi].serialNumber, //序列号
            id: zbzBzData[zxbi].id, //序列号
            parentUdiId: zbzBzData[zxbi].parentUdiId //id
          };
          zbzList.push(zbzBzrs);
        }
        zhongBjInfoList.insertRows(1, zbzList);
      }
      if (zxBzData != null && typeof zxBzData != "undefined") {
        let zxbzList = [];
        for (let zxbi1 = 0; zxbi1 < zxBzData.length; zxbi1++) {
          let zxBzrs = {
            identificationQty: zxBzData[zxbi1].identificationQty, //包装内含小一级产品标识数量
            sterilizationBatchNo: zxBzData[zxbi1].sterilizationBatchNo, //sterilizationBatchNo
            materialCode: zxBzData[zxbi1].materialCode, //商品编码
            materialName: zxBzData[zxbi1].materialName, //商品名称
            produceDate: zxBzData[zxbi1].produceDate, //生产日期
            PI: zxBzData[zxbi1].PI, //PI
            batchNo: zxBzData[zxbi1].batchNo, //批号
            spec: zxBzData[zxbi1].spec, //规格型号
            UDI: zxBzData[zxbi1].UDI, //UDI
            DI: zxBzData[zxbi1].DI, //DI
            validateDate: zxBzData[zxbi1].validateDate, //有效期至
            productIdentification: zxBzData[zxbi1].productIdentification, //产品标识
            scanUDI: zxBzData[zxbi1].scanUDI, //扫码UDI
            packageIdentification: zxBzData[zxbi1].packageIdentification, //包装标识
            packagingPhase: zxBzData[zxbi1].packagingPhase, //包装阶段
            serialNumber: zxBzData[zxbi1].serialNumber, //序列号
            id: zxBzData[zxbi1].id, //序列号
            parentUdiId: zxBzData[zxbi1].parentUdiId //id
          };
          zxbzList.push(zxBzrs);
        }
        ziBjInfoList.insertRows(1, zxbzList);
      }
    },
    undefined,
    { domainKey: "yourKeyHere" }
  );
}
//加载数据 查询数据中心的追溯 单据
function getDjInfo() {
  cb.utils.loadingControl.start(); //开启一次loading
  invokeFunction1(
    "I0P_UDI.publicFunction.getUdiSourceOrg",
    {
      djId: ""
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常，" + err.message);
        return false;
      }
      // 返回具体数据
      let resultData = res.resDataRs;
      let tbList = [];
      for (let i = 0; i < resultData.length; i++) {
        if (typeof resultData[i].billNo == "undefined" || resultData[i].billNo === "" || resultData[i].billNo == null) {
          continue;
        }
        let tbDjrs = {
          ID: resultData[i].UDIFile_id,
          wuliao: resultData[i].material, //物料id
          djType: resultData[i].billName, //单据类型
          djNum: resultData[i].billNo, //单据编号
          wuliaomingchen: resultData[i].materialName //物料id
        };
        tbList.push(tbDjrs);
      }
      djInfoTable.insertRows(1, tbList);
      cb.utils.loadingControl.end(); //关闭一次loading
    },
    undefined,
    { domainKey: "yourKeyHere" }
  );
}
viewModel.get("UDIShowDjInfo2List") &&
  viewModel.get("UDIShowDjInfo2List").on("afterSelect", function (rowIndexs) {
    // 表格1--选择后
    let djId = djInfoTable.getCellValue(rowIndexs, "djNum"); //获取对应列的值
    //清空数据
    waiBjInfoList.clear();
    zhongBjInfoList.clear();
    ziBjInfoList.clear();
    if (searchTemp === "no") {
      getUdiInfo(djId);
    }
  });
viewModel.get("UDIShowWaiBjInfo3List") &&
  viewModel.get("UDIShowWaiBjInfo3List").on("afterSelect", function (rowIndexs) {
    // 表格1--外包装选择后
    let parentUdiId = waiBjInfoList.getCellValue(rowIndexs, "id"); //获取对应列的值
    console.log("-----------1-" + wbzNum + "--" + waiBjInfoList.getRows().length);
    if (wbzNum === waiBjInfoList.getRows().length) {
      //清空数据
      zhongBjInfoList.clear();
      ziBjInfoList.clear();
      console.log("-----------2-" + wbzNum + "--" + waiBjInfoList.getRows().length);
      getParentUdiId(parentUdiId, "wbz");
    }
  });
viewModel.get("UDIShowZhongBjInfo2List") &&
  viewModel.get("UDIShowZhongBjInfo2List").on("afterSelect", function (rowIndexs) {
    // 表格1--中包装选择后
    let parentUdiId = zhongBjInfoList.getCellValue(rowIndexs, "id"); //获取对应列的值
    //清空数据
    console.log("---------3---" + zbzNum + "--" + zhongBjInfoList.getRows().length);
    if (zbzNum === zhongBjInfoList.getRows().length) {
      ziBjInfoList.clear();
      console.log("--------4----" + zbzNum + "--" + zhongBjInfoList.getRows().length);
      getParentUdiId(parentUdiId, "zxbz");
    }
  });
let wzbTemp = "no";
let zbzTemp = "no";
let zxbzTemp = "no";
viewModel.get("button42bb") &&
  viewModel.get("button42bb").on("click", function (data) {
    if (wzbTemp === "yes") {
      waiBjInfoList.setShowCheckbox(false);
      wzbTemp = "no";
      return;
    }
    wzbTemp = "yes";
    zbzTemp = "no";
    zxbzTemp = "no";
    waiBjInfoList.setShowCheckbox(true);
    ziBjInfoList.setShowCheckbox(false);
    zhongBjInfoList.setShowCheckbox(false);
  });
viewModel.get("button77ih") &&
  viewModel.get("button77ih").on("click", function (data) {
    if (zbzTemp === "yes") {
      zhongBjInfoList.setShowCheckbox(false);
      zbzTemp = "no";
      return;
    }
    zbzTemp = "yes";
    wzbTemp = "no";
    zxbzTemp = "no";
    waiBjInfoList.setShowCheckbox(false);
    ziBjInfoList.setShowCheckbox(false);
    zhongBjInfoList.setShowCheckbox(true);
  });
viewModel.get("button92pe") &&
  viewModel.get("button92pe").on("click", function (data) {
    if (zxbzTemp === "yes") {
      ziBjInfoList.setShowCheckbox(false);
      zxbzTemp = "no";
      return;
    }
    zxbzTemp = "yes";
    wzbTemp = "no";
    zbzTemp = "no";
    waiBjInfoList.setShowCheckbox(false);
    zhongBjInfoList.setShowCheckbox(false);
    ziBjInfoList.setShowCheckbox(true);
  });
viewModel.get("button76og") &&
  viewModel.get("button76og").on("click", function (data) {
    //没有开启勾选，打印全部
    const index = djInfoTable.getFocusedRowIndex();
    addPrintUdi(index, "wbz");
  });
viewModel.get("button81jf") &&
  viewModel.get("button81jf").on("click", function (data) {
    const index = djInfoTable.getFocusedRowIndex();
    addPrintUdi(index, "zbz");
  });
viewModel.get("button102ib") &&
  viewModel.get("button102ib").on("click", function (data) {
    const index = djInfoTable.getFocusedRowIndex();
    addPrintUdi(index, "zxbz");
  });
function addPrintUdi(index, printType) {
  let UDI_print_wbzList = []; //外包装
  let UDI_print_zbzList = []; //z包装
  let UDI_print_zxbzList = []; //zxbz包装
  let printContent = "";
  let num = 0;
  let ph = "";
  let xlh = "";
  let scrq = "";
  let yxqz = "";
  let org = "";
  let udi_print_scheme = viewModel.get("udi_print_scheme").getValue();
  if (udi_print_scheme == undefined || udi_print_scheme == null) {
    cb.utils.alert("请选择打印方案", "info");
    return;
  }
  let errorMsg = "";
  let promises = [];
  let handerMessage = (n) => (errorMsg += n);
  if (printType === "wbz") {
    //开启了勾选打印
    let printData = waiBjInfoList.getRows();
    if (wzbTemp === "yes") {
      printData = waiBjInfoList.getSelectedRows();
    }
    num = printData.length;
    if (num === 0) {
      cb.utils.alert("请选择打印数据", "info");
      return;
    }
    printContent = "外包装打印；打印数量：" + num;
    for (let iwbz = 0; iwbz < printData.length; iwbz++) {
      let rsdata = printData[iwbz];
      ph = rsdata.batchNo;
      xlh = rsdata.serialNumber;
      scrq = rsdata.produceDate;
      yxqz = rsdata.validateDate;
      let bzinfo = {
        udi: rsdata.UDI,
        di: rsdata.DI,
        pi: rsdata.PI,
        material: rsdata.materialName,
        batchNumber: rsdata.batchNo,
        productionDate: rsdata.produceDate,
        validityDate: rsdata.validateDate,
        serialNumber: rsdata.serialNumber,
        packagingStage: rsdata.packagingPhase,
        parentUdiICode: rsdata.parentUdiId
      };
      UDI_print_wbzList.push(bzinfo);
    }
    promises.push(
      queryUdiPrintNum(udi_print_scheme, UDI_print_wbzList, 1).then((res) => {
        if (res != "") {
          errorMsg += "UDI：" + res + "打印次数已超过打印方案次数，请选择其他UDI进行打印或者修改打印方案次数！";
        }
      })
    );
  }
  if (printType === "zbz") {
    //开启了勾选打印
    let printData = zhongBjInfoList.getRows();
    if (zbzTemp === "yes") {
      printData = zhongBjInfoList.getSelectedRows();
    }
    num = printData.length;
    if (num === 0) {
      cb.utils.alert("请选择打印数据", "info");
      return;
    }
    const bzindex = waiBjInfoList.getFocusedRowIndex();
    let bzUdi = waiBjInfoList.getCellValue(bzindex, "UDI");
    if (typeof bzUdi === undefined || bzUdi === "" || bzUdi === undefined) {
      bzUdi = "";
    }
    printContent = "中包装打印；外包裝UDI码：" + bzUdi + ";打印数量：" + num;
    for (let iwbz = 0; iwbz < printData.length; iwbz++) {
      let rsdata = printData[iwbz];
      ph = rsdata.batchNo;
      xlh = rsdata.serialNumber;
      scrq = rsdata.produceDate;
      yxqz = rsdata.validateDate;
      let bzinfo = {
        udi: rsdata.UDI,
        di: rsdata.DI,
        pi: rsdata.PI,
        material: rsdata.materialName,
        batchNumber: rsdata.batchNo,
        productionDate: rsdata.produceDate,
        validityDate: rsdata.validateDate,
        serialNumber: rsdata.serialNumber,
        packagingStage: rsdata.packagingPhase,
        parentUdiICode: rsdata.parentUdiId
      };
      UDI_print_zbzList.push(bzinfo);
    }
    promises.push(
      queryUdiPrintNum(udi_print_scheme, UDI_print_zbzList, 2).then((res) => {
        if (res != "") {
          errorMsg += "UDI：" + res + "打印次数已超过打印方案次数，请选择其他UDI进行打印或者修改打印方案次数！";
        }
      })
    );
  }
  if (printType === "zxbz") {
    //开启了勾选打印
    let printData = ziBjInfoList.getRows();
    if (zxbzTemp === "yes") {
      printData = ziBjInfoList.getSelectedRows();
    }
    num = printData.length;
    if (num === 0) {
      cb.utils.alert("请选择打印数据", "info");
      return;
    }
    const bzindex = waiBjInfoList.getFocusedRowIndex();
    let bzUdi = waiBjInfoList.getCellValue(bzindex, "UDI");
    const zbzindex = zhongBjInfoList.getFocusedRowIndex();
    let zbzUdi = zhongBjInfoList.getCellValue(zbzindex, "UDI");
    if (typeof bzUdi === undefined || bzUdi === "" || bzUdi === undefined) {
      bzUdi = "";
    }
    if (typeof zbzUdi === undefined || zbzUdi === "" || zbzUdi === undefined) {
      zbzUdi = "";
    }
    printContent = "最小包装打印；外包裝UDI码：" + bzUdi + ";中包裝UDI码：" + zbzUdi + ";打印数量：" + num;
    for (let iwbz = 0; iwbz < printData.length; iwbz++) {
      let rsdata = printData[iwbz];
      ph = rsdata.batchNo;
      xlh = rsdata.serialNumber;
      scrq = rsdata.produceDate;
      yxqz = rsdata.validateDate;
      let bzinfo = {
        udi: rsdata.UDI,
        di: rsdata.DI,
        pi: rsdata.PI,
        material: rsdata.materialName,
        batchNumber: rsdata.batchNo,
        productionDate: rsdata.produceDate,
        validityDate: rsdata.validateDate,
        serialNumber: rsdata.serialNumber,
        packagingStage: rsdata.packagingPhase,
        parentUdiICode: rsdata.parentUdiId
      };
      UDI_print_zxbzList.push(bzinfo);
    }
    promises.push(
      queryUdiPrintNum(udi_print_scheme, UDI_print_zxbzList, 3).then((res) => {
        if (res != "") {
          errorMsg += "UDI：" + res + "打印次数已超过打印方案次数，请选择其他UDI进行打印或者修改打印方案次数！";
        }
      })
    );
  }
  let udiPrintList = {
    billCode: djInfoTable.getCellValue(index, "djNum"),
    billType: djInfoTable.getCellValue(index, "djType"),
    materialName: djInfoTable.getCellValue(index, "wuliaomingchen"),
    printContent: printContent,
    materialNumber: num,
    batchNumber: ph,
    serialNumber: xlh,
    productionDate: scrq,
    validityDate: yxqz,
    org: org,
    UDI_print_wbzList: UDI_print_wbzList,
    UDI_print_zbzList: UDI_print_zbzList,
    UDI_print_zxbzList: UDI_print_zxbzList
  };
  let returnPromise = new cb.promise();
  Promise.all(promises).then(() => {
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg);
      returnPromise.reject();
    } else {
      returnPromise.resolve();
      invokeFunction1(
        "I0P_UDI.publicFunction.savePrintUdi",
        {
          udiDataObject: udiPrintList
        },
        function (err, res2) {
          if (err != null) {
            cb.utils.alert("查询数据异常，" + err.message);
            return false;
          }
          console.log("------跳转页面-----");
          //跳转页面
          let datax = {
            billtype: "Voucher", // 单据类型
            billno: "ca9be671", // 单据号
            domainKey: "yourKeyHere",
            params: {
              mode: "edit", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
              readOnly: true, //TODO: 是否只读
              id: res2.proRes.id //填写详情id
            }
          };
          //打开一个单据，并在当前页面显示
          cb.loader.runCommandLine("bill", datax, viewModel);
        },
        undefined,
        { domainKey: "yourKeyHere" }
      );
    }
  });
}
viewModel.get("button106gf") &&
  viewModel.get("button106gf").on("click", function (data) {
    // 搜索--单击
    djInfoTable.clear();
    zhongBjInfoList.clear();
    ziBjInfoList.clear();
    waiBjInfoList.clear();
    let danjuleixing = viewModel.get("danjuleixing").getValue();
    let danjubianhao = viewModel.get("danjubianhao").getValue();
    let wuliaomingchen = viewModel.get("wuliaomingchen").getValue();
    searchTemp = "yes";
    invokeFunction1(
      "I0P_UDI.publicFunction.getSearchInfo",
      {
        danjuleixing: danjuleixing,
        danjubianhao: danjubianhao,
        wuliaomingchen: wuliaomingchen
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常，" + err.message);
          return false;
        }
        let resultData = res.resDataRs;
        let tbList = [];
        for (let i = 0; i < resultData.length; i++) {
          if (typeof resultData[i].billNo == "undefined" || resultData[i].billNo === "" || resultData[i].billNo == null) {
            continue;
          }
          let tbDjrs = {
            ID: resultData[i].UDIFile_id,
            wuliao: resultData[i].material, //物料id
            djType: resultData[i].billName, //单据类型
            djNum: resultData[i].billNo, //单据编号
            wuliaomingchen: resultData[i].materialName //物料id
          };
          tbList.push(tbDjrs);
        }
        djInfoTable.insertRows(1, tbList);
        searchTemp = "no";
      },
      undefined,
      { domainKey: "yourKeyHere" }
    );
  });
function savePrintUdi(udiPrintList) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.savePrintUdi", { udiDataObject: udiPrintList }, function (err, res) {
      if (err != null) {
        reject(err.message);
      } else {
        resolve("");
      }
    });
  });
}
function queryUdiPrintNum(udi_print_scheme, udiList, type) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.queryUdiPrintNum", { udi_print_scheme: udi_print_scheme, udiList: udiList, type: type }, function (err, res) {
      let message = "";
      if (err != null) {
        reject(err.message);
      } else {
        if (res.result == "") {
          resolve("");
        } else {
          resolve(res.result);
        }
      }
    });
  });
}