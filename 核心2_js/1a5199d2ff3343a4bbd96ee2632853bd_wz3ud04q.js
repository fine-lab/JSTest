let djInfoTable = viewModel.get("UDIShowDjInfo2List"); //单据列表
let waiBjInfoList = viewModel.get("UDIShowWaiBjInfo2List"); //外包装信息表
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
let bzii = 0;
function getParentUdiId(parentUdiId, bzType) {
  bzii++;
  console.log("----------------" + bzType + "---" + bzii);
  let resDataFileSql = "select * from ISVUDI.ISVUDI.UDIFilev2 where parentUdiId = '" + parentUdiId + "'";
  invokeFunction1(
    "ISVUDI.publicFunction.shareApi",
    {
      sqlType: "check",
      sqlTableInfo: resDataFileSql,
      sqlCg: "sy01"
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
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
    { domainKey: "sy01" }
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
    "ISVUDI.publicFunction.getUdiSourceOrg",
    {
      djId: djId
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
      // 返回具体数据
      if (djId === null || djId === "" || typeof djId == "undefined") {
        let resultData = res.resDataRs;
        for (let i = 0; i < resultData.length; i++) {
          let tbDjrs = {
            ID: resultData[i].UDIFile_id,
            wuliao: resultData[i].material, //物料id
            djType: resultData[i].billName, //单据类型
            djNum: resultData[i].billNo, //单据编号
            wuliaomingchen: resultData[i].materialName //物料id
          };
          if (i === 0) {
            viewModel.get("danjuleixing").setValue(resultData[i].billName);
            viewModel.get("danjubianhao").setValue(resultData[i].billNo);
            viewModel.get("wuliaoid").setValue(resultData[i].material);
          }
          djInfoTable.appendRow(tbDjrs);
        }
      }
      let zxBzData = res.zxbzData;
      let zbzBzData = res.zbzData;
      let wbzBzData = res.wbzData;
      if (wbzBzData != null && typeof wbzBzData != "undefined") {
        wbzNum = wbzBzData.length;
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
          waiBjInfoList.appendRow(wbzBzRs);
        }
      }
      if (zbzBzData != null && typeof zbzBzData != "undefined") {
        zbzNum = zbzBzData.length;
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
      }
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
    },
    undefined,
    { domainKey: "sy01" }
  );
}
//加载数据 查询数据中心的追溯 单据
function getDjInfo() {
  invokeFunction1(
    "ISVUDI.publicFunction.getUdiSourceOrg",
    {
      djId: ""
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
      // 返回具体数据
      let resultData = res.resDataRs;
      for (let i = 0; i < resultData.length; i++) {
        let tbDjrs = {
          ID: resultData[i].UDIFile_id,
          wuliao: resultData[i].material, //物料id
          djType: resultData[i].billName, //单据类型
          djNum: resultData[i].billNo, //单据编号
          wuliaomingchen: resultData[i].materialName //物料id
        };
        if (i === 0) {
          viewModel.get("danjuleixing").setValue(resultData[i].billName);
          viewModel.get("danjubianhao").setValue(resultData[i].billNo);
          viewModel.get("wuliaoid").setValue(resultData[i].material);
        }
        djInfoTable.appendRow(tbDjrs);
      }
      djInfoTable.select([0]); //默认选则第一个 展示
      getUdiInfo(resultData[0].UDIFile_id);
    },
    undefined,
    { domainKey: "sy01" }
  );
}
viewModel.get("UDIShowDjInfo2List") &&
  viewModel.get("UDIShowDjInfo2List").on("afterSelect", function (rowIndexs) {
    // 表格1--选择后
    let djId = djInfoTable.getCellValue(rowIndexs, "ID"); //获取对应列的值
    viewModel.get("danjuleixing").setValue(djInfoTable.getCellValue(rowIndexs, "djType"));
    viewModel.get("danjubianhao").setValue(djInfoTable.getCellValue(rowIndexs, "djNum"));
    viewModel.get("wuliaomingchen").setValue(djInfoTable.getCellValue(rowIndexs, "wuliaomingchen"));
    viewModel.get("wuliaoid").setValue(djInfoTable.getCellValue(rowIndexs, "wuliao"));
    //清空数据
    waiBjInfoList.clear();
    zhongBjInfoList.clear();
    ziBjInfoList.clear();
    getUdiInfo(djId);
  });
viewModel.get("UDIShowWaiBjInfo2List") &&
  viewModel.get("UDIShowWaiBjInfo2List").on("afterSelect", function (rowIndexs) {
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