cb.defineInner([], function () {
  var MyExternal = {
    exportExcelFile(params) {
      let param = { billId: params.id };
      cb.rest.invokeFunction("GT37522AT1.excelBackFunciton.getAggTransVO", param, function (err, res) {
        if (res && res.aggvo) {
          let aggvo = res.aggvo;
          let rowsData = [];
          let details = aggvo.espoplandetailsList;
          if (details) {
            details.forEach((item) => {
              let tempItem = {};
              tempItem["物料编码"] = item.pk_material_code || "";
              tempItem["物料名称"] = item.pk_material_name;
              tempItem["物料型号"] = "";
              tempItem["物料规格"] = "";
              tempItem["采购数量"] = item.num;
              tempItem["单位"] = item.pk_material_detail_purchaseUnit_name;
              tempItem["品牌"] = "";
              tempItem["需求时间"] = item.demanddate;
              tempItem["建议供应商名称"] = "整机供应商";
              tempItem["需求组织名称"] = "贵州中融信通科技有限公司"; // 线上环境需改为中融组织
              tempItem["需求组织编码"] = "ZR001"; // 线上环境需改为中融组织的编码
              tempItem["需求部门名称"] = "";
              tempItem["需求部门编码"] = "";
              tempItem["需求联系人"] = "";
              tempItem["需求联系人编码"] = "";
              tempItem["计划部门名称"] = "";
              tempItem["计划部门编码"] = "";
              tempItem["计划员名称"] = "";
              tempItem["计划员编码"] = "";
              tempItem["联系电话"] = "";
              tempItem["收货地址"] = "";
              tempItem["收货组织"] = "贵州中融信通科技有限公司"; // 线上环境需改为中融组织
              tempItem["收货组织编码"] = "ZR001"; // 线上环境需改为中融组织的编码
              tempItem["收货人"] = "";
              tempItem["收货人编码"] = "";
              tempItem["收货人电话"] = "";
              tempItem["采购组织"] = "贵州中融信通科技有限公司"; // 线上环境需改为中融组织
              tempItem["采购组织编码"] = "ZR001"; // 线上环境需改为中融组织的编码
              tempItem["采购员"] = item.pk_material_detail_productBuyer_name;
              tempItem["采购员编码"] = item.pk_material_detail_productBuyer_code;
              tempItem["备注"] = "";
              tempItem["ERP请购单单据号"] = "";
              tempItem["ERP请购单行号"] = "";
              tempItem["项目名称"] = "";
              tempItem["sku名称"] = "";
              tempItem["sku编码"] = "";
              tempItem["sku规格"] = "";
              tempItem["sku型号"] = "";
              tempItem["sku规格说明"] = "";
              tempItem["自定义项1"] = "";
              tempItem["自定义项2"] = "";
              tempItem["自定义项3"] = "";
              tempItem["自定义项4"] = "";
              tempItem["自定义项5"] = "";
              tempItem["自定义项6"] = "";
              tempItem["自定义项7"] = "";
              tempItem["自定义项8"] = "";
              tempItem["自定义项9"] = "";
              tempItem["自定义项10"] = "";
              tempItem["自定义项11"] = "";
              tempItem["自定义项12"] = "";
              tempItem["自定义项13"] = "";
              tempItem["自定义项14"] = "";
              tempItem["自定义项15"] = "";
              tempItem["自定义项16"] = "";
              tempItem["自定义项17"] = "";
              tempItem["自定义项18"] = "";
              tempItem["自定义项19"] = "";
              tempItem["自定义项20"] = "";
              rowsData.push(tempItem);
            });
            exportExcelFile(rowsData, "采购任务模板导出-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
            cb.utils.alert("导出成功！", "success");
            aggvo.feedbacknum = aggvo.feedbacknum ? Number(aggvo.feedbacknum) + 1 : 1;
            aggvo._status = "Update";
            cb.rest.invokeFunction("GT37522AT1.excelBackFunciton.updateEsPlan", { aggvodata: aggvo }, function (err, res) {
              debugger;
              if (res) {
                window.viewModelInfo.execute("refresh");
              } else {
                cb.utils.alert("更新转换次数失败！原因" + err.message, "error");
              }
            });
          }
        }
      });
    },
    resolveExcelData(params) {
      let importData = params.excelData;
      // 解析导入模板对象
      if (!importData || importData.length <= 0) {
        cb.utils.alert("请正确输入数据!", "error");
        return;
      }
      let importMap = new Map();
      let requestDateMap = new Map();
      let requestDateRows = [];
      let orderDate = [];
      var reg = new RegExp("^[0-9]+$");
      let sup = "";
      let unitPrice = 0;
      let quantity = 0;
      let vender = 0;
      let allProductCode = [];
      for (var i = 0; i < importData.length; i++) {
        let item = importData[i];
        if (i <= 2) {
          if (i == 0) {
            sup = item["__EMPTY_8"];
          }
          continue;
        }
        let requestDateItem = {};
        if (!item["__EMPTY"]) {
          break;
        }
        if (reg.test(item["__EMPTY_5"])) {
          let datePar = new Date((parseInt(item["__EMPTY_5"]) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
          item["__EMPTY_5"] = datePar.getFullYear() + "-" + (datePar.getMonth() + 1) + "-" + datePar.getDate();
        }
        orderDate.push(item["__EMPTY_5"]);
        requestDateItem["需求时间"] = item["__EMPTY_5"];
        if (item["__EMPTY_14"] == "") {
          item["__EMPTY_14"] = "0";
        }
        requestDateItem["备货周期"] = item["__EMPTY_14"];
        if (!requestDateMap.has(item["__EMPTY"])) {
          requestDateRows = [];
        }
        requestDateRows.push(requestDateItem);
        requestDateMap.set(item["__EMPTY"], requestDateRows);
        // 按编码生成数据，去重后的关键字段
        if (!importMap.has(item["__EMPTY"])) {
          unitPrice = 0;
          quantity = 0;
          vender = 0;
        }
        if (item["__EMPTY_7"] == "") {
          item["__EMPTY_7"] = "0";
        }
        if (item["__EMPTY_8"] == "") {
          item["__EMPTY_8"] = "0";
        }
        if (item["__EMPTY_11"] == "") {
          item["__EMPTY_11"] = "0";
        }
        quantity += parseInt(item["__EMPTY_7"]);
        unitPrice = parseInt(item["__EMPTY_8"]);
        vender = parseInt(item["__EMPTY_11"]);
        let importItem = {};
        importItem["华为算力编码"] = item["__EMPTY"];
        importItem["在途订单数量"] = quantity;
        importItem["供应商库存"] = unitPrice;
        importItem["待检库存"] = vender;
        allProductCode.push(item["__EMPTY"]);
        importMap.set(item["__EMPTY"], importItem);
      }
      if (importMap.size <= 0) {
        cb.utils.alert("请正确输入数据!", "error");
        return;
      }
      // 排序日期
      orderDate.sort((a, b) => {
        let aDate = new Date(a);
        let bDate = new Date(b);
        return aDate.getTime() - bDate.getTime();
      });
      cb.rest.invokeFunction("GT37522AT1.pubFunction.protCodeToModel", { allProductCode }, function (err, res) {
        if (res && res.productMap) {
          let productMap = res.productMap || {};
          let data = getValueData(productMap);
          exportMultiSheetExcelFile(data, "供应商供应能力反馈-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
          cb.utils.alert("导出成功！", "success");
        } else {
          cb.utils.alert("导出失败：未找到物料对应的虚编码！", "success");
        }
      });
      getValueData = (productMap) => {
        // 组装导出模板对象
        let exportRows = [];
        let exportSheetTwoRows = [];
        let currDate = new Date();
        for (let [key, value] of importMap.entries()) {
          let exportItem = {};
          let exportSheetTwoItem = {};
          let productCode = value["华为算力编码"];
          let productModel = productMap[productCode] || productCode;
          exportItem["部门"] = "";
          exportItem["供方物料编码"] = "";
          exportItem["华为算力编码"] = productModel;
          exportItem["库存组织"] = "";
          exportItem["版本号"] = "";
          exportItem["采购模式"] = "";
          exportItem["器件分类"] = "";
          exportItem["整机供应商"] = sup;
          exportItem["采购员"] = "";
          exportItem["发布日期"] = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-" + currDate.getDate();
          exportItem["在途订单数量"] = value["在途订单数量"];
          exportItem["VMI实时库存"] = "";
          exportItem["VMI库存"] = "";
          exportItem["供应商库存"] = value["供应商库存"];
          exportItem["备注"] = "";
          exportItem["数据类型"] = "供应";
          exportSheetTwoItem["工厂代码"] = "";
          exportSheetTwoItem["工厂名称"] = "";
          exportSheetTwoItem["供应商物料编码"] = productModel;
          exportSheetTwoItem["物料编码版本"] = "";
          exportSheetTwoItem["物料小类"] = "";
          exportSheetTwoItem["库存类型"] = "";
          exportSheetTwoItem["客户代码"] = "";
          exportSheetTwoItem["供应商子库"] = "";
          exportSheetTwoItem["供应商货位"] = "";
          exportSheetTwoItem["入库时间"] = "";
          exportSheetTwoItem["库存(PCS)"] = value["供应商库存"];
          exportSheetTwoItem["待检库存"] = value["待检库存"];
          exportSheetTwoItem["隔离品数量"] = "";
          exportSheetTwoItem["是否协议备货"] = "";
          exportSheetTwoItem["最后更新人"] = "";
          exportSheetTwoItem["最后更新时间"] = "";
          exportSheetTwoRows.push(exportSheetTwoItem);
          let requestDate = requestDateMap.get(key);
          let total = 0;
          let isNotSameDate = true;
          let dinstinctArr = [];
          orderDate.forEach((rd) => {
            if (dinstinctArr.indexOf(rd) == -1) {
              dinstinctArr.push(rd);
              if (!requestDate) {
                exportItem[rd] = 0;
              } else {
                isNotSameDate = true;
                requestDate.forEach((rdf) => {
                  if (rdf["需求时间"] == rd) {
                    if (!isNotSameDate) {
                      // 存在相同日期，相加
                      exportItem[rd] += parseInt(rdf["备货周期"]);
                    } else {
                      isNotSameDate = false;
                      exportItem[rd] = parseInt(rdf["备货周期"]);
                    }
                    total += parseInt(rdf["备货周期"]);
                  }
                });
                if (isNotSameDate) {
                  exportItem[rd] = 0;
                }
              }
            }
          });
          exportItem["合计"] = total;
          exportRows.push(exportItem);
        }
        let dataArr = [
          { sheetName: "云1.0-eSupplier预测传递及回复页面", sheetData: exportRows },
          { sheetName: "云2.0-eSupplier供应商库存上载", sheetData: exportSheetTwoRows }
        ];
        return dataArr;
      };
    }
  };
  return MyExternal;
});