//加载js-xlsx
loadJsXlsx(viewModel);
//推送S
viewModel.get("button74yi") &&
  viewModel.get("button74yi").on("click", function (data) {
    let allData = viewModel.getAllData();
    cb.rest.invokeFunction("GT37595AT2.backOpenApiFunction.ReplyShipToS", { replyData: allData }, function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
      } else {
        cb.utils.alert("推送成功", "success");
      }
    });
  });
//推送S-要货计划SN明细
viewModel.get("button151db") &&
  viewModel.get("button151db").on("click", function (data) {
    let allData = viewModel.getAllData();
    debugger;
    if (allData && allData.shippingscheduleSNList) {
      if (allData.shippingscheduleSNList.length == 50) {
        cb.utils.alert("数据加载中,请稍后尝试", "success");
        return;
      }
    }
    cb.rest.invokeFunction("GT37595AT2.backOpenApiFunction.ReplyShipSnToS", { replyData: allData }, function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
      } else {
        cb.utils.alert("推送要货计划SN明细成功", "success");
      }
    });
  });
viewModel.get("button114qh") &&
  viewModel.get("button114qh").on("click", function (data) {
    // 模板下载--单击
    //保存传入的viewModel对象
    debugger;
    window.viewModelInfo = viewModel;
    let metaItems = viewModel.getCache("viewMeta")["1a3e18c6f5a743d092d5f5191c1dfd0c"].containers[0].controls;
    let titleData = [];
    let items = [];
    for (let item of metaItems) {
      items.push(item.cShowCaption);
    }
    titleData.push(items);
    exportExcelFileByStyle(titleData, "SN导入模板");
  });
viewModel.get("button104ad") &&
  viewModel.get("button104ad").on("click", function (data) {
    // 导入SN--单击
    const billId = viewModel.get("id").getValue();
    //触发文件点击事件
    selectFile(function () {
      let excelData = viewModel.getCache("workbookInfoDatas");
      if (excelData && excelData[0] && excelData[0].length > 0) {
        let metaItems = viewModel.getCache("viewMeta")["1a3e18c6f5a743d092d5f5191c1dfd0c"].containers[0].controls;
        let nameToCode = {};
        for (let item of metaItems) {
          nameToCode[item.cShowCaption] = item.cFieldName;
        }
        let inportDatas = [];
        for (let excelRow of excelData[0]) {
          let tempData = {};
          for (let [key, value] of Object.entries(excelRow)) {
            if (nameToCode[key]) {
              tempData[nameToCode[key]] = value;
            }
          }
          if (tempData && Object.keys(tempData).length > 0) {
            tempData["_status"] = "Insert";
            tempData["shippingschedule_id"] = billId;
            inportDatas.push(tempData);
          }
        }
        if (inportDatas && inportDatas.length > 0) {
          cb.rest.invokeFunction("GT37595AT2.backOpenApiFunction.snImport", { inportDatas, billId }, function (err, res) {
            if (res) {
              viewModel.execute("refresh");
              cb.utils.alert("上传成功！", "success");
            }
          });
        }
      }
    });
  });
viewModel.get("button123wj") &&
  viewModel.get("button123wj").on("click", function (data) {
    debugger;
    // 导出SN--单击
    let code = viewModel.getAllData().code;
    let vendorIdName = viewModel.getAllData().vendorId_name;
    let orgIdName = viewModel.getAllData().org_id_name;
    let param = { code: code, vendorIdName: vendorIdName, orgIdName: orgIdName };
    cb.rest.invokeFunction("GT37595AT2.excelBackFunciton.getShipSnDetail", param, function (err, res) {
      if (res && res.res[0]) {
        let rowsData = [];
        let shipSNList = res.res[0].shippingscheduleSNList;
        if (shipSNList && shipSNList.length > 0) {
          for (var i = 0; i < shipSNList.length; i++) {
            let shipSN = shipSNList[i];
            let tempItem = {};
            tempItem["供应商名称"] = vendorIdName;
            tempItem["组织"] = orgIdName;
            tempItem["SN"] = shipSN.sncode;
            tempItem["固定资产编码"] = shipSN.fixedassetCode;
            tempItem["PO"] = shipSN.poCode;
            tempItem["物料描述"] = shipSN.materialdescription;
            tempItem["最终父项SN"] = shipSN.parentSn;
            tempItem["发货批次"] = shipSN.deliveryBatchNumber;
            tempItem["最终父项PN描述"] = shipSN.finalParentPNDesc;
            tempItem["甲方父项固资号"] = shipSN.aParentFixedCapitalNumber;
            tempItem["部件类别"] = shipSN.sampleType;
            tempItem["箱单号"] = shipSN.plNo;
            tempItem["甲方父项编码"] = shipSN.supplierParentCode;
            tempItem["甲方最终父项编码"] = shipSN.afinalParentCode;
            tempItem["子项部件描述"] = shipSN.subSampleDesc;
            tempItem["层级"] = shipSN.level;
            tempItem["供应商最终父项编码"] = shipSN.vendorFinalParentCode;
            tempItem["甲方最终父项PN"] = shipSN.afinalParentPN;
            tempItem["设备厂商"] = shipSN.deviceVendor;
            tempItem["子项部件原厂SN"] = shipSN.subSamplePn;
            tempItem["子项备件编码"] = shipSN.aSubPartsMaterialCode;
            tempItem["子项部件SN"] = shipSN.subpartSN;
            tempItem["供应商父项SN"] = shipSN.supplierParentSN;
            tempItem["供应商子项部件编码"] = shipSN.supplierSubSampleCode;
            tempItem["供应商父项编码"] = shipSN.aParentCode;
            tempItem["甲方子项部件编码"] = shipSN.aSubSampleCode;
            tempItem["甲方子项部件原厂SN"] = shipSN.subSampleVendorSn;
            tempItem["U位"] = shipSN.upos;
            tempItem["要货计划主"] = shipSN.shippingschedule_id;
            rowsData.push(tempItem);
          }
          exportExcelFile(rowsData, "SN明细导出-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
          cb.utils.alert("导出成功！", "success");
        } else {
          cb.utils.alert("对应要货计划无sn明细导出！");
          return;
        }
      } else {
        cb.utils.alert("获取SN明细失败,请联系管理员." + JSON.stringify(err));
      }
    });
  });