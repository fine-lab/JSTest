cb.defineInner([], function () {
  var MyExternal = {
    exportDataToExcel(params) {
      let param = { billId: params.id };
      cb.rest.invokeFunction("GT37522AT1.excelBackFunciton.getAggEsPoPlanVO", param, function (err, res) {
        if (res && res.aggvo) {
          let aggvo = res.aggvo;
          let rowsData = [];
          let details = aggvo.espoplandetailsList;
          let startDate = new Date(aggvo.startdate);
          let endDate = new Date(aggvo.enddate);
          if (details) {
            let orderDateSet = new Set();
            let prductMap = {};
            details.map((item) => {
              let producId = item.pk_material;
              if (prductMap[producId]) {
                prductMap[producId].dateMap[item.demanddate] = item.num;
              } else {
                item["dateMap"] = { [item.demanddate]: item.num };
                prductMap[producId] = item;
              }
              orderDateSet.add(item.demanddate);
            });
            let orderDate = Array.from(orderDateSet);
            orderDate.sort((a, b) => {
              let aDate = new Date(a);
              let bDate = new Date(b);
              return aDate.getTime() - bDate.getTime();
            });
            Object.keys(prductMap).forEach((key) => {
              let value = prductMap[key];
              let tempItem = {};
              tempItem["S算力编码"] = value.pk_material_model || "";
              tempItem["供应方物料编码"] = value.pk_material_code || "";
              tempItem["采购模式"] = value.pomode;
              tempItem["部门编号"] = value.deptcode;
              tempItem["发布日期"] = aggvo.maketime;
              tempItem["在途订单数量"] = 0;
              tempItem["备注"] = aggvo.pk_material_name || "";
              tempItem["数据类型"] = aggvo.bustype_name;
              debugger;
              let totalQty = 0;
              orderDate.forEach((currDate) => {
                let currDateStr = currDate.format("yyyy-MM-dd");
                if (value.dateMap[currDateStr]) {
                  tempItem[currDateStr] = value.dateMap[currDateStr];
                } else {
                  tempItem[currDateStr] = 0;
                }
                totalQty += tempItem[currDateStr];
              });
              tempItem["合计"] = totalQty;
              tempItem["在途订单数量"] = totalQty;
              rowsData.push(tempItem);
            });
          }
          exportExcelFile(rowsData, "算力计划导出-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
          cb.utils.alert("导出成功！", "success");
        }
      });
    },
    resolveExcelData(params) {
      let productColumnName = "S算力编码";
      let verdorColumnName = "整机供应商";
      let excelData = params.excelData;
      //根据excel数据获取所有相关的物料id信息，封装成map映射
      if (excelData && excelData[0]) {
        let allErpOuterCode = [];
        let allVendorName = [];
        let allBusTypeNames = [];
        let codeToIdMap = {};
        let typeToExcelDatas = {};
        excelData[0].map((item) => {
          if (item[productColumnName]) {
            allErpOuterCode.push(item[productColumnName]);
          }
          if (item[verdorColumnName]) {
            allVendorName.push(item[verdorColumnName]);
          }
          let typeName = item["数据类型"] || "";
          if (typeName) {
            allBusTypeNames.push(typeName);
            if (!typeToExcelDatas[typeName]) {
              typeToExcelDatas[typeName] = [];
            }
            typeToExcelDatas[typeName].push(item);
          }
        });
        if (allErpOuterCode && allErpOuterCode.length > 0) {
          cb.rest.invokeFunction(
            "GT37522AT1.excelBackFunciton.productCodeToId",
            { allErpOuterCode: allErpOuterCode, allVendorName: allVendorName, allBusTypeNames: allBusTypeNames },
            function (err, res) {
              //解析
              if (res) {
                let aggVoData = solveExcelData(typeToExcelDatas, res);
                saveExcelData(aggVoData);
              } else {
                cb.utils.loadingControl.end();
                cb.utils.alert("上传失败！原因: " + err.message, "error");
              }
            }
          );
        } else {
          cb.utils.alert("excel中未包含列【S算力编码】或所有编码为空！", "error");
        }
      }
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      function formatDate(numb, format) {
        if (/\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/.test(numb)) {
          return numb;
        } else {
          const time = new Date((numb - 1) * 24 * 3600000 + 1);
          time.setYear(time.getFullYear() - 70);
          const year = time.getFullYear() + "";
          const month = time.getMonth() + 1 + "";
          const date = time.getDate() + "";
          if (format && format.length === 1) {
            return year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date) + " 00:00:00";
          }
          return year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date) + " 00:00:00";
        }
      }
      //执行保存操作
      function saveExcelData(aggData) {
        //请求成功
        cb.rest.invokeFunction("GT37522AT1.excelBackFunciton.saveExcelVO", { aggvodata: aggData }, function (err, res) {
          cb.utils.loadingControl.end();
          if (res) {
            window.viewModelInfo.execute("refresh");
            cb.utils.alert("上传成功！", "success");
          } else {
            cb.utils.alert("上传失败！原因：" + err.message, "error");
          }
        });
      }
      //解析excel数据生成aggVO数据
      function solveExcelData(typeToExcelDatas, dataMap) {
        let aggVoData = [];
        let codeToIdMap = dataMap.productMap;
        let vendorToIdMap = dataMap.vendorMap || {};
        let typeNameToId = dataMap.typeNameToId;
        let currUser = dataMap.userData || {};
        if (typeToExcelDatas) {
          for (var typeName in typeToExcelDatas) {
            let excelDatas = typeToExcelDatas[typeName];
            let headData = {};
            let startDate = undefined;
            let endDate = undefined;
            let bodyDatas = [];
            let totalnum = 0;
            let headItem = excelDatas[0];
            let date = new Date();
            headData["maketime"] = formatDate(headItem["发布日期"], "-");
            headData["remark"] = headItem["备注"];
            headData["bustype_name"] = typeName;
            headData["bustype"] = typeNameToId[typeName];
            headData["billname"] = "esupplier算力计划[" + date.format("yyyy-MM-dd") + "]" + S4();
            let excelRes = excelDatas.map((item) => {
              let erpOuterCode = item[productColumnName];
              let vendorName = item[verdorColumnName];
              if (erpOuterCode) {
                let materialID = codeToIdMap[erpOuterCode];
                let vendorID = vendorToIdMap[vendorName] || "";
                //默认写死组织
                headData["org_id"] = currUser.orgId || "2751169017008384";
                headData["erpOuterCode"] = erpOuterCode;
                headData["vendorName"] = vendorName;
                Object.keys(item).forEach((key) => {
                  if (/\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/.test(key)) {
                    if (!startDate || new Date(startDate) > new Date(key)) {
                      startDate = key;
                    }
                    if (!endDate || new Date(endDate) < new Date(key)) {
                      endDate = key;
                    }
                    if (item[key] != 0) {
                      let bodyData = {};
                      bodyData["pomode"] = item["采购模式"];
                      bodyData["deptcode"] = item["部门编号"];
                      bodyData["pk_material"] = materialID;
                      bodyData["vendor"] = vendorID;
                      bodyData["num"] = item[key];
                      bodyData["demanddate"] = key;
                      bodyDatas.push(bodyData);
                    }
                  }
                });
                totalnum += Number(item["合计"]);
              }
            });
            headData["totalnum"] = totalnum;
            headData["startdate"] = startDate;
            headData["enddate"] = endDate;
            headData["espoplandetailsList"] = bodyDatas;
            aggVoData.push(headData);
          }
        }
        return aggVoData;
      }
    }
  };
  return MyExternal;
});