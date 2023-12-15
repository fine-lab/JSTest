cb.defineInner([], function () {
  var MyExternal = {
    resolveExcelData(params) {
      let excelData = params.excelData || [];
      let serviceUrl = params.serviceUrl;
      if (excelData && excelData.length > 2) {
        let allBillCode = new Set();
        let allBillSN = new Set();
        let allRepeatSN = [];
        let codeToSN = {};
        debugger;
        for (var i = excelData.length - 2; i >= 1; i--) {
          let item = excelData[i];
          let code = item["code"];
          let SN = item["fixedDefines!define1"];
          if (code) {
            allBillCode.add(code);
          }
          if (SN) {
            if (!allBillSN.has(SN)) {
              allBillSN.add(SN);
            } else {
              allRepeatSN.push(SN);
            }
            codeToSN[code] = SN;
          }
        }
        if (allRepeatSN.length > 0) {
          cb.utils.alert("更新SN失败！原因：文件中存在重复的SN:" + JSON.stringify(allRepeatSN), "error");
        } else {
          cb.rest.invokeFunction("GT37522AT1.fixedAssetsFunc.batchCheckSn", { snValues: [...allBillSN], billCodes: [...allBillCode] }, function (err, res) {
            //解析
            if (res && res.isPass) {
              cb.rest.invokeFunction("GT37522AT1.fixedAssetsFunc.batchUpdateSN", { envUrl: serviceUrl, billCodes: [...allBillCode], codeToSN: codeToSN }, function (err, res) {
                cb.utils.alert("更新成功！", "success");
              });
            } else {
              let repeatInfo = res.repeatInfo;
              const repeatInfoStr = JSON.stringify(repeatInfo);
              cb.utils.alert("更新SN失败！原因：存在SN重复！\n" + repeatInfoStr, "error");
            }
          });
        }
      }
    }
  };
  return MyExternal;
});