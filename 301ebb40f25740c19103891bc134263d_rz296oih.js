cb.defineInner([], function () {
  var MyExternal = {
    resolveSnImport(params, viewModel) {
      debugger;
      let excelData = params.excelData;
      let type = params.type; // 0-全局导入，1-行上导入
      if (!excelData || excelData.length <= 0) {
        cb.utils.alert("excel模板错误，请检查！", "error");
        return false;
      }
      let excelDataMap = new Map(); // excel sn信息
      let productCountMap = new Map(); // 页面物料信息同一物料条数统计map
      let excelProCountMap = new Map(); // excel统一物料条数统计map
      let snCode = ""; // 查询sn是否存在数据库
      let gridCount = viewModel.getGridModel("arrivalOrders").getRowsCount();
      let indexProductMap = new Map(); // 存放物料信息行号信息
      let indexCountMap = new Map(); // 存放物料信息行号及到货数量信息
      let resultMap = new Map(); // 存放物料信息每行对应的SN信息
      let productNameMap = new Map(); // SN信息物料名称非必填，需自动填入
      let snProductCodeMap = new Map(); //SN信息已导入物料及数量信息
      let snSnMap = new Map(); //SN信息已导入物料及数量信息
      if (gridCount <= 0) {
        cb.utils.alert("物料信息为空，请检查！", "error");
        return false;
      }
      let detailLists = viewModel.getGridModel("arrivalOrders").getData();
      for (let i in detailLists) {
        let item = detailLists[i];
        if (item.snMessageList) {
          snProductCodeMap.set(item.productCode, item.snMessageList.length);
          for (let j in item.snMessageList) {
            if (!snSnMap.has(item.snMessageList[j].extendSn)) {
              snSnMap.set(item.snMessageList[j].extendSn, 1);
            }
          }
        } else {
          snProductCodeMap.set(item.productCode, 0);
        }
      }
      debugger;
      if (type == "1") {
        let focusedRowIndex = viewModel.getGridModel("arrivalOrders").get("focusedRowIndex");
        let productCode = viewModel.getGridModel("arrivalOrders").getCellValue(focusedRowIndex, "product_cCode");
        productCountMap.set(productCode, viewModel.getGridModel("arrivalOrders").getCellValue(focusedRowIndex, "qty"));
        indexProductMap.set(productCode, focusedRowIndex + "");
        productNameMap.set(productCode, viewModel.getGridModel("arrivalOrders").getCellValue(focusedRowIndex, "product_cName"));
      } else {
        for (let j = 0; j < gridCount; j++) {
          let gridData = viewModel.getGridModel("arrivalOrders");
          let productCode = gridData.getCellValue(j, "product_cCode");
          if (!productCountMap.has(productCode)) {
            productCountMap.set(productCode, gridData.getCellValue(j, "qty"));
          } else {
            productCountMap.set(productCode, productCountMap.get(productCode) + gridData.getCellValue(j, "qty"));
          }
          if (!indexProductMap.has(productCode)) {
            indexProductMap.set(productCode, j + "");
          } else {
            indexProductMap.set(productCode, indexProductMap.get(productCode) + "_" + j);
          }
          indexCountMap.set(j, gridData.getCellValue(j, "qty"));
          productNameMap.set(productCode, gridData.getCellValue(j, "product_cName"));
        }
      }
      var reg = new RegExp("^[0-9]+$");
      for (let i = 0; i < excelData[0].length; i++) {
        let data = excelData[0][i];
        if (!data["物料编码*"] || data["物料编码*"] == "") {
          cb.utils.alert("第 " + (i + 1) + " 行物料编码为空，请检查！", "error");
          return false;
        }
        if (!data["SN*"] || data["SN*"] == "") {
          cb.utils.alert("第 " + (i + 1) + " 行SN为空，请检查！", "error");
          return false;
        }
        if (!data["箱号*"] || data["箱号*"] == "") {
          cb.utils.alert("第 " + (i + 1) + " 行箱号为空，请检查！", "error");
          return false;
        }
        if (!data["箱数*"] || data["箱数*"] == "") {
          cb.utils.alert("第 " + (i + 1) + " 行箱数为空，请检查！", "error");
          return false;
        }
        // 数字类型校验，箱数必须为数字
        if (!reg.test(data["箱数*"])) {
          cb.utils.alert("第 " + (i + 1) + " 行箱数填写错误，请检查！", "error");
          return false;
        }
        data["SN*"] = String(data["SN*"]);
        data["物料编码*"] = String(data["物料编码*"]);
        if (excelDataMap.has(data["SN*"])) {
          cb.utils.alert("第 " + (i + 1) + " 行SN:" + data["SN*"] + "重复，请检查！", "error");
          return false;
        } else {
          excelDataMap.set(data["SN*"], 1);
        }
        if (snSnMap.has(data["SN*"])) {
          cb.utils.alert("第 " + (i + 1) + " 行SN:" + data["SN*"] + "重复，请检查！", "error");
          return false;
        }
        if (!productCountMap.has(data["物料编码*"])) {
          cb.utils.alert("第 " + (i + 1) + " 行物料编码" + data["物料编码*"] + "在物料信息中未找到，请检查！", "error");
          return false;
        }
        if (!excelProCountMap.has(data["物料编码*"])) {
          excelProCountMap.set(data["物料编码*"], 1);
        } else {
          excelProCountMap.set(data["物料编码*"], excelProCountMap.get(data["物料编码*"]) + 1);
        }
        // 物料名称
        data["物料名称"] = productNameMap.get(data["物料编码*"]);
        snCode += "'" + data["SN*"] + "',";
        let excelSn = {};
        let index = -1;
        if (indexProductMap.get(data["物料编码*"]).indexOf("_") == -1) {
          // 物料信息重该物料只有一行
          index = Number(indexProductMap.get(data["物料编码*"]));
        } else {
          // 物料信息重该物料有多行
          index = Number(indexProductMap.get(data["物料编码*"]).split("_")[0]);
        }
        if (reg.test(data["保质期"])) {
          // 日期传过来是数字，需转换
          let datePar = new Date((parseInt(data["保质期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          data["保质期"] = getDate(datePar);
        }
        if (reg.test(data["生产日期"])) {
          // 日期传过来是数字，需转换
          let datePar = new Date((parseInt(data["生产日期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          data["生产日期"] = getDate(datePar);
        }
        if (reg.test(data["DC日期"])) {
          // 日期传过来是数字，需转换
          let datePar = new Date((parseInt(data["DC日期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          data["DC日期"] = getDate(datePar);
        }
        if (reg.test(data["出厂日期"])) {
          // 日期传过来是数字，需转换
          let datePar = new Date((parseInt(data["出厂日期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          data["出厂日期"] = getDate(datePar);
        }
        if (reg.test(data["到期日期"])) {
          // 日期传过来是数字，需转换
          let datePar = new Date((parseInt(data["到期日期"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          data["到期日期"] = getDate(datePar);
        }
        excelSn = {
          DeliveryDetail_id: viewModel.getGridModel("arrivalOrders").getCellValue(index, "id"),
          extendProductName: data["物料名称"],
          extendSn: data["SN*"],
          extendBoxNumber: data["箱号*"],
          extendBoxCount: data["箱数*"],
          extendProduct: viewModel.getGridModel("arrivalOrders").getCellValue(index, "product"),
          extendProduct_code: data["物料编码*"],
          extendShelfLife: data["保质期"],
          extendProductDate: data["生产日期"],
          dc_data: data["DC日期"],
          maturity_Date: data["到期日期"],
          date_Of_Production: data["出厂日期"],
          volume: data["体积"],
          rough_Weight: data["毛重"],
          _status: "Insert"
        };
        if (resultMap.has(index)) {
          let getArr = resultMap.get(index);
          getArr.push(excelSn);
          resultMap.set(index, getArr);
        } else {
          let gridArr = []; // 组装的对象数据
          gridArr.push(excelSn);
          resultMap.set(index, gridArr);
        }
        if (indexCountMap.get(index) == resultMap.get(index).length) {
          // 第一行物料到货数量=已经push的该物料的条数，将第一个下标去掉，下一次则从下一个相同物料行开始push
          indexProductMap.set(data["物料编码*"], indexProductMap.get(data["物料编码*"]).replace(index + "_", ""));
        }
      }
      for (var [key, value] of productCountMap) {
        if (Math.abs(value) < excelProCountMap.get(key) + snProductCodeMap.get(key)) {
          cb.utils.alert("物料编码" + key + "总条数大于物料信息中到货数量的总和，请检查！", "error");
          return false;
        }
      }
      snCode = snCode.substring(0, snCode.length - 1);
      let querySn = cb.rest.invokeFunction("PU.backApiFunc.checkSnCount", { snCode: snCode, busType: viewModel.get("busType").getValue() }, function (err, res) {}, viewModel, { async: false });
      if (querySn.result.querySn && querySn.result.querySn != "") {
        cb.utils.alert("SN:" + querySn.result.querySn + "已存在，请检查！", "error");
        return false;
      }
      let resultData = [];
      resultMap.forEach((value, key) => {
        resultData.push({ index: key, data: value });
      });
      return resultData;
      function getDate(date, type) {
        var timeStr = date.getFullYear() + "-";
        if (date.getMonth() < 9) {
          // 月份从0开始的
          timeStr += "0";
        }
        timeStr += date.getMonth() + 1 + "-";
        timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        if (type == "time") {
          timeStr += " ";
          timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          timeStr += ":";
          timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          timeStr += ":";
          timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        }
        return timeStr;
      }
    }
  };
  return MyExternal;
});