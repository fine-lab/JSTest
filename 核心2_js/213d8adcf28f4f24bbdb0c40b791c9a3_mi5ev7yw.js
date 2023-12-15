viewModel.on("customInit", function (data) {
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  secScript1.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript1, document.body.lastChild);
  var gridModel = viewModel.getGridModel();
  let objs = [];
  gridModel.on("afterSetDataSource", function (data) {
    gridModel.deleteAllRows();
    let filterViewModel = viewModel.getCache("FilterViewModel");
    let org = viewModel.getCache("FilterViewModel").get("org_id").getFromModel().getValue();
    let statusName = viewModel.getCache("FilterViewModel").get("statusName").getFromModel().getValue();
    let warehouse = viewModel.getCache("FilterViewModel").get("warehouse").getFromModel().getValue();
    if (objs.length > 0) {
      let statusNameIsNull = true;
      for (let i = 0; i < objs.length; i++) {
        if (org == objs[i].org_id && org != undefined && org != "") {
          if (statusName == objs[i].statusName && statusName != undefined && statusName != "") {
            gridModel.appendRow({
              org_id: objs[i].org_id,
              org_id_name: objs[i].org_id_name,
              product_code: objs[i].product_code,
              product_name: objs[i].product_name,
              warehouse: objs[i].warehouse,
              warehouse_name: objs[i].warehouse_name,
              produce_date: objs[i].produce_date,
              valid_until: objs[i].valid_until,
              warehouse_qty: objs[i].warehouse_qty,
              availableQuantity: objs[i].availableQuantity,
              batchno: objs[i].batchno,
              standard_code: objs[i].standard_code,
              package_specification: objs[i].package_specification,
              featureGroup: objs[i].featureGroup,
              specification: objs[i].specification,
              productType: objs[i].productType,
              productType_name: objs[i].productType_name,
              product_id: objs[i].product,
              product: objs[i].product,
              unit: objs[i].unit,
              unit_name: objs[i].unit_name,
              unity: objs[i].unity,
              unity_name: objs[i].unity_name,
              listingLicensor: objs[i].listingLicensor,
              listingLicensor_ip_name: objs[i].listingLicensor_ip_name,
              manufacturer: objs[i].manufacturer,
              statusName: objs[i].statusName, //库存状态ID
              statusName_statusName: objs[i].statusName_statusName //库存状态
            });
            statusNameIsNull = false;
          } else {
            gridModel.appendRow({
              org_id: objs[i].org_id,
              org_id_name: objs[i].org_id_name,
              product_code: objs[i].product_code,
              product_name: objs[i].product_name,
              warehouse: objs[i].warehouse,
              warehouse_name: objs[i].warehouse_name,
              produce_date: objs[i].produce_date,
              valid_until: objs[i].valid_until,
              warehouse_qty: objs[i].warehouse_qty,
              availableQuantity: objs[i].availableQuantity,
              batchno: objs[i].batchno,
              standard_code: objs[i].standard_code,
              package_specification: objs[i].package_specification,
              featureGroup: objs[i].featureGroup,
              specification: objs[i].specification,
              productType: objs[i].productType,
              productType_name: objs[i].productType_name,
              product_id: objs[i].product,
              product: objs[i].product,
              unit: objs[i].unit,
              unit_name: objs[i].unit_name,
              unity: objs[i].unity,
              unity_name: objs[i].unity_name,
              listingLicensor: objs[i].listingLicensor,
              listingLicensor_ip_name: objs[i].listingLicensor_ip_name,
              manufacturer: objs[i].manufacturer,
              statusName: objs[i].statusName, //库存状态ID
              statusName_statusName: objs[i].statusName_statusName //库存状态
            });
            statusNameIsNull = false;
          }
        } else {
          cb.utils.alert("查询条件以改变，请刷新页面重新查询", "error");
        }
      }
    } else {
      if (org != undefined && org != "") {
        getProducts(org, statusName, warehouse).then((materialInfo) => {
          for (let i = 0; i < materialInfo.length; i++) {
            objs.push({
              org_id: materialInfo[i].org,
              org_id_name: materialInfo[i].org_name,
              product_code: materialInfo[i].product_code,
              product_name: materialInfo[i].product_name,
              warehouse: materialInfo[i].warehouse,
              warehouse_name: materialInfo[i].warehouse_name,
              produce_date: materialInfo[i].producedate,
              valid_until: materialInfo[i].invaliddate,
              warehouse_qty: materialInfo[i].qty,
              availableQuantity: materialInfo[i].availableqty,
              batchno: materialInfo[i].batchno,
              standard_code: materialInfo[i].bwm,
              package_specification: materialInfo[i].package_specification,
              featureGroup: materialInfo[i].currentStockCharacteristic,
              specification: materialInfo[i].specification,
              productType: materialInfo[i].productType,
              productType_name: materialInfo[i].productType_name,
              product_id: materialInfo[i].product,
              product: materialInfo[i].product,
              unit: materialInfo[i].unit,
              unit_name: materialInfo[i].unit_name,
              unity: materialInfo[i].unity,
              unity_name: materialInfo[i].unity_name,
              listingLicensor: materialInfo[i].listingLicensor,
              listingLicensor_ip_name: materialInfo[i].listingLicensor_ip_name,
              manufacturer: materialInfo[i].manufacturer,
              statusName: materialInfo[i].statusId, //库存状态ID
              statusName_statusName: materialInfo[i].statusName //库存状态
            });
          }
          if (objs.length > 0) {
            let rows = [];
            for (let p = 0; p < objs.length; p++) {
              rows.push({
                org_id: objs[p].org_id,
                org_id_name: objs[p].org_id_name,
                product_code: objs[p].product_code,
                product_name: objs[p].product_name,
                warehouse: objs[p].warehouse,
                warehouse_name: objs[p].warehouse_name,
                produce_date: objs[p].produce_date,
                valid_until: objs[p].valid_until,
                warehouse_qty: objs[p].warehouse_qty,
                availableQuantity: objs[p].availableQuantity,
                batchno: objs[p].batchno,
                standard_code: objs[p].standard_code,
                package_specification: objs[p].package_specification,
                featureGroup: objs[p].featureGroup,
                specification: objs[p].specification,
                productType: objs[p].productType,
                productType_name: objs[p].productType_name,
                product_id: objs[p].product,
                product: objs[p].product,
                unit: objs[p].unit,
                unit_name: objs[p].unit_name,
                unity: objs[p].unity,
                unity_name: objs[p].unity_name,
                listingLicensor: objs[p].listingLicensor,
                listingLicensor_ip_name: objs[p].listingLicensor_ip_name,
                manufacturer: objs[p].manufacturer,
                statusName: objs[p].statusName, //库存状态ID
                statusName_statusName: objs[p].statusName_statusName //库存状态
              });
            }
            gridModel.insertRows(0, rows);
          }
        });
      }
    }
  });
  getProducts = function (org, statusName, warehouse) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.exportDrugAdministrationData.getWourehousePdDate",
        {
          type: "ALL",
          org: org,
          statusName: statusName,
          warehouse: warehouse
        },
        function (err, res) {
          console.log(res);
          if (typeof res !== "undefined") {
            let currentInfo = res.currentInfo;
            if (currentInfo.length > 0) {
              resolve(currentInfo);
            }
          } else if (err !== null) {
            cb.utils.alert(err.message);
            return false;
          }
          resolve();
        }
      );
    });
  };
  getProductExecls = function (org, proIds, batchNos, warehouses) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.exportDrugAdministrationData.getWourehousePdDate",
        {
          type: "GSP",
          org: org,
          proIds: proIds,
          batchNos: batchNos,
          warehouses: warehouses
        },
        function (err, res) {
          console.log(res);
          if (typeof res !== "undefined") {
            let currentInfo = res.currentInfo;
            if (currentInfo.length > 0) {
              resolve(currentInfo);
            } else {
              alert("没有库存盘点单");
            }
          } else if (err !== null) {
            cb.utils.alert(err.message);
            return false;
          }
          resolve();
        }
      );
    });
  };
  //导出药监局数据
  viewModel.get("button3rj").on("click", function () {
    let org = viewModel.getCache("FilterViewModel").get("org_id").getFromModel().getValue();
    let rows = gridModel.getSelectedRows();
    let nowDate = new Date();
    let date = nowDate.toLocaleDateString();
    const sheetData1 = [
      {
        库存盘点截止时间: ymdDate(date)
      }
    ];
    let proIds = [];
    let batchNos = [];
    let warehouses = [];
    for (let i = 0; i < rows.length; i++) {
      proIds.push(rows[i].product);
      batchNos.push(rows[i].batchno);
      warehouses.push(rows[i].warehouse);
    }
    getProductExecls(org, proIds, batchNos, warehouses).then((materialInfo) => {
      let workbookBlob;
      let sheetData2 = [];
      for (let i = 0; i < materialInfo.length; i++) {
        let item1 = materialInfo[i];
        if (Array.isArray(item1.org)) {
          item1Org = item1.org[0];
        } else {
          item1Org = item1.org;
        }
        if (org == undefined || org == "") {
          sheetData2.push({
            生产批号: item1.batchno,
            生产日期: ymdDate(item1.producedate),
            有效期至: ymdDate(item1.invaliddate),
            采购数量: item1.qty,
            本位码: item1.bwm,
            包装规格: item1.package_specification
          });
        } else if (org == item1Org) {
          sheetData2.push({
            生产批号: item1.batchno,
            生产日期: ymdDate(item1.producedate),
            有效期至: ymdDate(item1.invaliddate),
            采购数量: item1.qty,
            本位码: item1.bwm,
            包装规格: item1.package_specification
          });
        }
      }
      // 支持多 sheet
      const wb = XLSX.utils.book_new();
      // 支持多 sheet
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      // 支持多 sheet
      const sheet2 = XLSX.utils.json_to_sheet(sheetData2);
      XLSX.utils.book_append_sheet(wb, sheet2, "sheet2");
      workbookBlob = workbook2blob(wb);
      // 导出最后的总表
      openDownloadDialog(workbookBlob, "现存量数据" + ymdDate(new Date()) + ".xlsx");
    });
  });
  //导出Excel数据
  viewModel.get("button4jc").on("click", function () {
    let org = viewModel.getCache("FilterViewModel").get("org_id").getFromModel().getValue();
    let nowDate = new Date();
    getProductExecls(org, proIds, batchNos, warehouses).then((materialInfo) => {
      let workbookBlob;
      let sheetData1 = [];
      for (let i = 0; i < materialInfo.length; i++) {
        let item1 = materialInfo[i];
        if (Array.isArray(item1.org)) {
          item1Org = item1.org[0];
        } else {
          item1Org = item1.org;
        }
        if (org == undefined || org == "") {
          sheetData1.push({
            组织名称: item1.org_name,
            物料编码: item1.product_code,
            物料名称: item1.product_name,
            规格型号: item1.specification,
            物料分类: item1.productType_name,
            主计量: item1.unit_name,
            上市许可持有人: item1.listingLicensor_ip_name,
            生产批号: item1.batchno,
            生产日期: ymdDate(item1.producedate),
            有效期至: ymdDate(item1.invaliddate),
            采购数量: item1.qty,
            本位码: item1.bwm,
            包装规格: item1.package_specification,
            生产厂家: item1.manufacturer,
            仓库: item1.warehouse_name,
            可用量: item1.availableqty,
            现存量: item1.qty,
            库存状态: item1.statusName
          });
        } else if (org == item1Org) {
          sheetData1.push({
            组织名称: item1.org_name,
            物料编码: item1.product_code,
            物料名称: item1.product_name,
            规格型号: item1.specification,
            物料分类: item1.productType_name,
            主计量: item1.unit_name,
            上市许可持有人: item1.listingLicensor_ip_name,
            生产批号: item1.batchno,
            生产日期: ymdDate(item1.producedate),
            有效期至: ymdDate(item1.invaliddate),
            采购数量: item1.qty,
            本位码: item1.bwm,
            包装规格: item1.package_specification,
            生产厂家: item1.manufacturer,
            仓库: item1.warehouse_name,
            可用量: item1.availableqty,
            现存量: item1.qty,
            库存状态: item1.statusName
          });
        }
      }
      // 支持多 sheet
      const wb = XLSX.utils.book_new();
      // 支持多 sheet
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      workbookBlob = workbook2blob(wb);
      // 导出最后的总表
      openDownloadDialog(workbookBlob, "现存量数据" + ymdDate(new Date()) + ".xlsx");
    });
  });
  function ymdDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
});