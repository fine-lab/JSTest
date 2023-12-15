cb.defineInner([], function () {
  var MyExternal = {
    resolveExcelData(params) {
      let excelData = params.excelData;
      let viewModel = params.viewModel;
      if (excelData && excelData[0].length > 0) {
        let focusedRowIndex = viewModel.get("suppliershippingschedulebList").get("focusedRowIndex");
        let shippingschedulebId = viewModel.get("suppliershippingschedulebList").getData()[focusedRowIndex].id;
        let quantitiy = viewModel.get("suppliershippingschedulebList").getData()[focusedRowIndex].quantitiy;
        let tenantId = viewModel.get("suppliershippingschedulebList").getData()[focusedRowIndex].tenant_id;
        let shippingschedulesnvo = [];
        let searchParam = { shippingschedulebId: shippingschedulebId };
        // 导入行数与数量校验
        cb.rest.invokeFunction("GT39325AT4.backDesignerFunction.getSnCount", searchParam, function (err, res) {
          if (res) {
            if (res.snCount[0].snCount + excelData[0].length != quantitiy) {
              cb.utils.alert("上传失败！原因:要货计划子行的【数量】与SN行数不相等！", "error");
              return;
            }
          }
          let excelDataMap = new Map();
          let key = Object.keys(excelData[0][0])[0];
          for (let i = 0; i < excelData[0].length; i++) {
            let data = excelData[0][i];
            let shippingschedulesnItem = {};
            if (excelDataMap.has(data[key])) {
              // 已重复
              cb.utils.alert("上传失败！原因:SN(" + data[key] + ")已经存在", "error");
              return;
            }
            excelDataMap.set(data[key], data[key]);
            shippingschedulesnItem["suppliershippingscheduleb_id"] = shippingschedulebId;
            shippingschedulesnItem["tenant_id"] = tenantId;
            shippingschedulesnItem["sncode"] = data[key];
            shippingschedulesnvo.push(shippingschedulesnItem);
          }
          // 保存
          cb.rest.invokeFunction("GT39325AT4.backDesignerFunction.batchSaveSn", { shippingschedulesnvo: shippingschedulesnvo }, function (err, res) {
            if (res) {
              window.viewModelInfo.execute("refresh");
              cb.utils.alert("上传成功！", "success");
            } else {
              cb.utils.alert("上传失败！原因:" + err.message, "error");
            }
          });
        });
      } else {
        cb.utils.alert("请正确在excel中填写SN值！", "error");
      }
    }
  };
  return MyExternal;
});