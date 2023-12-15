function qilibcPrintInitUI(event) {
  var viewModel = this;
  viewModel.getParams().autoAddRow = false;
  var mainGirdModel = viewModel.getGridModel();
  const perData = viewModel.getParams().perData;
  if (cb.utils.isEmpty(perData)) {
  } else {
    viewModel.biz.do("add", viewModel);
  }
  viewModel.on("afterLoadData", function () {
    if (cb.utils.isEmpty(perData) || cb.utils.isEmpty(perData.billno)) {
    } else {
      viewModel.get("org_id").setValue(perData.orgid);
      viewModel.get("name").setValue(perData.bt + perData.billno + "条码打印");
      let alldata = perData.alldata;
      for (var i = 0; i < alldata.length; i++) {
        let rowdata = alldata[i];
        let barcodedata = {};
        barcodedata._id = rowdata._id;
        barcodedata.pk_material = rowdata.product;
        barcodedata.def6 = rowdata.product_cCode;
        barcodedata.item86nf = rowdata.product_model;
        barcodedata.pk_material_name = rowdata.product_cName;
        barcodedata.material_sku = rowdata.productsku;
        barcodedata.material_sku_name = rowdata.productsku_cName;
        barcodedata.item118vh = rowdata.productClassName;
        barcodedata.productdate = rowdata.producedate;
        barcodedata.invaliddate = rowdata.invaliddate;
        barcodedata.pici = rowdata.batchno;
        barcodedata.ordernum = rowdata.qty;
        barcodedata.cvendorid = perData.vendor;
        barcodedata.cvendorid_name = perData.vendor_name;
        let proxy = viewModel.setProxy({
          queryData: {
            url: "/scmbc/barprint/findconf",
            method: "POST"
          }
        });
        let param = [];
        param.push({
          pk_material: rowdata.product,
          orgid: perData.orgid,
          pk_marbasclass: rowdata.productClass,
          id: i
        });
        proxy.queryData(param, function (err, result) {
          if (!err.success) {
            cb.utils.alert(err.msg, "error");
            return;
          }
          if (err.data !== undefined) {
            barcodedata.configname = err.data[0].config.configname;
            barcodedata.configcode = err.data[0].config.configcode;
            barcodedata.def1 = err.data[0].isDate;
            barcodedata.def2 = err.data[0].config.pk_config;
            barcodedata.def3 = err.data[0].isbatchman;
            barcodedata.def4 = err.data[0].islsh;
            let id = err.data[0].id;
            //序列号物料
            if (rowdata.isSerialNoManage) {
              let pursns = rowdata.purInRecordsSNs;
              if (cb.utils.isEmpty(pursns) || pursns.length == 0) {
              } else {
                for (var s = 0; s < pursns.length; s++) {
                  let pursn = pursns[s];
                  barcodedata.item392mf = pursn.sn;
                  barcodedata.nnum = 1;
                  let idnew = id + alldata.length + s + 10;
                  mainGirdModel.insertRow(idnew, barcodedata);
                  if (err.data[0].isbatchman == "Y") {
                    mainGirdModel.setCellState(idnew, "pici", "disabled", false);
                  } else {
                    mainGirdModel.setCellState(idnew, "pici", "disabled", true);
                  }
                  if (err.data[0].islsh == "Y") {
                    mainGirdModel.setCellState(idnew, "nnum", "disabled", false);
                  } else {
                    mainGirdModel.setCellState(idnew, "nnum", "disabled", true);
                  }
                  if (err.data[0].isDate == "Y") {
                    mainGirdModel.setCellState(idnew, "productdate", "disabled", false);
                  } else {
                    mainGirdModel.setCellState(idnew, "productdate", "disabled", true);
                  }
                  mainGirdModel.setCellState(idnew, "material_sku_name", "disabled", false);
                  mainGirdModel.setCellState(idnew, "item360ai_currentqty", "disabled", true);
                  mainGirdModel.setCellState(idnew, "ordernum", "disabled", true);
                }
              }
            } else {
              mainGirdModel.insertRow(id, barcodedata);
              if (err.data[0].isbatchman == "Y") {
                mainGirdModel.setCellState(id, "pici", "disabled", false);
              } else {
                mainGirdModel.setCellState(id, "pici", "disabled", true);
              }
              if (err.data[0].islsh == "Y") {
                mainGirdModel.setCellState(id, "nnum", "disabled", false);
              } else {
                mainGirdModel.setCellState(id, "nnum", "disabled", true);
              }
              if (err.data[0].isDate == "Y") {
                mainGirdModel.setCellState(id, "productdate", "disabled", false);
              } else {
                mainGirdModel.setCellState(id, "productdate", "disabled", true);
              }
              mainGirdModel.setCellState(id, "material_sku_name", "disabled", false);
              mainGirdModel.setCellState(id, "item360ai_currentqty", "disabled", true);
              mainGirdModel.setCellState(id, "ordernum", "disabled", true);
            }
          }
        });
      }
    }
  });
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    viewModel.setDisabled(false);
  });
  mainGirdModel.on("afterInsertRow", function (data) {
    mainGirdModel.setCellState(data.index, "nnum", "disabled", true);
    mainGirdModel.setCellState(data.index, "pici", "disabled", true);
    mainGirdModel.setCellState(data.index, "productdate", "disabled", true);
    mainGirdModel.setCellState(data.index, "material_sku_name", "disabled", true);
  });
  viewModel.on("beforeSave", function (args) {
    var rows = mainGirdModel.getAllData();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].barcode === "" || rows[i].barcode === null) {
        cb.utils.alert("第" + (i + 1) + "条数据请先生成条码");
        return false;
      }
    }
  });
  viewModel.get("item171mc_name").on("beforeBrowse", function () {
    let orgid = viewModel.get("org_id").getValue();
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org",
      op: "eq",
      value1: orgid
    });
    this.setFilter(condition);
  });
  viewModel.on("modeChange", function (data) {
    let gridData = mainGirdModel.getData();
    if (data == "browse") {
      viewModel.get("button12ik").setVisible(false);
      for (let i = 0; i < gridData.length; i++) {
        mainGirdModel.setCellValue(i, "item392mf", gridData[i].def7);
      }
    } else {
      tongbu();
      if (data == "add") {
        viewModel.getParams().autoAddRow = false;
      }
      for (let i = 0; i < gridData.length; i++) {
        if (gridData[i].def3 == "Y") {
          mainGirdModel.setCellState(i, "pici", "disabled", false);
        } else {
          mainGirdModel.setCellState(i, "pici", "disabled", true);
        }
        if (gridData[i].def1 == "Y") {
          mainGirdModel.setCellState(i, "productdate", "disabled", false);
        } else {
          mainGirdModel.setCellState(i, "productdate", "disabled", true);
        }
        if (gridData[i].def4 == "Y") {
          mainGirdModel.setCellState(i, "nnum", "disabled", false);
        } else {
          mainGirdModel.setCellState(i, "nnum", "disabled", true);
        }
        if (gridData[i].pk_material != "" && gridData[i].pk_material != null) {
          mainGirdModel.setCellState(i, "material_sku_name", "disabled", false);
        } else {
          mainGirdModel.setCellState(i, "pici", "disabled", true);
        }
        mainGirdModel.setCellValue(i, "item392mf", gridData[i].def7);
      }
      viewModel.get("button12ik").setVisible(true);
    }
  });
  function tongbu() {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/barprint/syn",
        method: "get"
      }
    });
    proxy.queryData({}, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
    });
  }
  mainGirdModel.on("afterCellValueChange", function (data) {
    var orgid = viewModel.get("org_id").getValue();
    var cellName = data.cellName;
    if (cellName == "item360ai_currentqty") {
      //现存量参照
      var proxy = viewModel.setProxy({
        queryData: {
          url: "/scmbc/barprint/findconf",
          method: "POST"
        }
      });
      let param = {};
      if (cellName == "pk_material_name") {
        //物料参照
        param = {
          pk_material: data.value.id,
          orgid: orgid,
          pk_marbasclass: data.value.manageClassId
        };
      } else {
        param = {
          pk_material: data.value.product,
          orgid: orgid,
          pk_marbasclass: ""
        };
      }
      proxy.queryData(param, function (err, result) {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        if (err.data != undefined) {
          console.log("++++++++++++++++++++++");
          if (cellName == "item360ai_currentqty") {
            //现存量参照
            mainGirdModel.setCellValue(data.rowIndex, "pk_material", data.value.product);
            mainGirdModel.setCellValue(data.rowIndex, "pk_material_name", data.value.product_name);
            mainGirdModel.setCellValue(data.rowIndex, "def6", data.value.product_code);
            mainGirdModel.setCellValue(data.rowIndex, "sku", data.value.productsku);
            mainGirdModel.setCellValue(data.rowIndex, "material_sku_name", data.value.productsku_name);
          }
          mainGirdModel.setCellValue(data.rowIndex, "configname", err.data.config.configname);
          mainGirdModel.setCellValue(data.rowIndex, "configcode", err.data.config.configcode);
          mainGirdModel.setCellValue(data.rowIndex, "def1", err.data.isDate);
          mainGirdModel.setCellValue(data.rowIndex, "def2", err.data.config.pk_config);
          mainGirdModel.setCellValue(data.rowIndex, "def3", err.data.isbatchman);
          mainGirdModel.setCellValue(data.rowIndex, "def4", err.data.islsh);
          //对结果进行处理
          if (err.data.isbatchman == "Y") {
            mainGirdModel.setCellState(data.rowIndex, "pici", "disabled", false);
          } else {
            mainGirdModel.setCellState(data.rowIndex, "pici", "disabled", true);
          }
          if (err.data.islsh == "Y") {
            mainGirdModel.setCellState(data.rowIndex, "nnum", "disabled", false);
          } else {
            mainGirdModel.setCellState(data.rowIndex, "nnum", "disabled", true);
          }
          if (err.data.isDate == "Y") {
            mainGirdModel.setCellState(data.rowIndex, "productdate", "disabled", false);
          } else {
            mainGirdModel.setCellState(data.rowIndex, "productdate", "disabled", true);
          }
          mainGirdModel.setCellState(data.rowIndex, "material_sku_name", "disabled", false);
        }
      });
    } else if (cellName == "productdate") {
      //生产日期
      var proxy = viewModel.setProxy({
        queryData: {
          url: "/scmbc/barprint/expory_date",
          method: "get"
        }
      });
      var row = mainGirdModel.getRow(data.rowIndex);
      //传参
      var param = {
        productdate: row.productdate,
        pk_material: row.pk_material,
        orgid: orgid
      };
      proxy.queryData(param, function (err, result) {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        if (err.data != undefined) {
          mainGirdModel.setCellValue(data.rowIndex, "invaliddate", err.data);
        }
      });
    } else if (cellName == "item392mf") {
      //序列号
      let xlhlist = data.value;
      if (cb.utils.isEmpty(xlhlist)) {
        return;
      } else {
        let xlhs = xlhlist.split(" ");
        let index = mainGirdModel.getFocusedRowIndex();
        var rows = mainGirdModel.getAllData();
        let rowData = rows[index];
        for (let i = 0; i < xlhs.length; i++) {
          if (i == 0) {
            rowData.item392mf = xlhs[i];
            mainGirdModel.updateRow(index + i, rowData);
          } else {
            rowData.item392mf = xlhs[i];
            mainGirdModel.insertRow(index + i, rowData);
          }
          if (rowData.def3 == "Y") {
            mainGirdModel.setCellState(index + i, "pici", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i, "pici", "disabled", true);
          }
          if (rowData.def4 == "Y") {
            mainGirdModel.setCellState(index + i, "nnum", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i, "nnum", "disabled", true);
          }
          if (rowData.def1 == "Y") {
            mainGirdModel.setCellState(index + i, "productdate", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i, "productdate", "disabled", true);
          }
          mainGirdModel.setCellState(index + i, "material_sku_name", "disabled", false);
        }
      }
    }
  });
  const referModel = mainGirdModel.getEditRowModel().get("item360ai_currentqty");
  //设置多选
  referModel.setMultiple(true);
  mainGirdModel
    .getEditRowModel()
    .get("item360ai_currentqty")
    .on("beforeBrowse", function () {
      let orgid = viewModel.get("org_id").getValue();
      let pk_stordoc = viewModel.get("item171mc").getValue();
      if (pk_stordoc == null || cb.utils.isEmpty(pk_stordoc)) {
        cb.utils.alert("参照现存量仓库不能为空！");
        return false;
      }
    });
  mainGirdModel
    .getEditRowModel()
    .get("item360ai_currentqty")
    .on("afterInitVm", (arg) => {
      let gridModel = arg.vm.get("table");
      let orgid = viewModel.get("org_id").getValue();
      let pk_stordoc = viewModel.get("item171mc").getValue();
      gridModel.on("beforeSetDataSource", function (argument) {
        var proxy = viewModel.setProxy({
          queryData: {
            url: "/scmbc/barprint/onHandStock",
            method: "GET"
          }
        });
        //传参
        var param = {
          orgId: orgid,
          warehouseId: pk_stordoc
        };
        const result = proxy.queryDataSync(param);
        for (let i = 0; i < result.error.data.data.length; i++) {
          if (result.error.data.data[i].currentqty > 0 && result.error.data.data[i].availableqty > 0) {
            result.error.data.data[i].id = i;
            argument.push(result.error.data.data[i]);
          }
        }
      });
      let referViewModelInfo = arg.vm;
      referViewModelInfo.on("afterOkClick", function (okData) {
        let index = mainGirdModel.getFocusedRowIndex();
        let xh = 0;
        for (let i = 0; i < okData.length; i++) {
          let itemData = okData[i];
          if (index == 0) {
            xh = index + i;
          } else {
            xh = index + i - 1;
          }
          mainGirdModel.setCellValue(xh, "pk_material", itemData.product);
          mainGirdModel.setCellValue(xh, "pk_material_name", itemData.product_name);
          mainGirdModel.setCellValue(xh, "def6", itemData.product_code);
          mainGirdModel.setCellValue(xh, "material_sku", itemData.productsku);
          mainGirdModel.setCellValue(xh, "material_sku_name", itemData.productsku_name);
          mainGirdModel.setCellValue(xh, "id", itemData.product);
          mainGirdModel.setCellValue(xh, "item118vh", itemData.manageClass_name);
          mainGirdModel.setCellValue(xh, "pici", itemData.batchno);
          mainGirdModel.setCellValue(xh, "productdate", itemData.producedate);
          mainGirdModel.setCellValue(xh, "invaliddate", itemData.invaliddate);
          mainGirdModel.setCellValue(xh, "nnum", itemData.currentqty);
          let proxy = viewModel.setProxy({
            queryData: {
              url: "/scmbc/barprint/findconf",
              method: "POST"
            }
          });
          let param = [];
          param.push({
            pk_material: itemData.product,
            orgid: orgid,
            pk_marbasclass: itemData.manageClass,
            id: xh
          });
          proxy.queryData(param, function (err, result) {
            if (!err.success) {
              cb.utils.alert(err.msg, "error");
              return;
            }
            if (err.data !== undefined) {
              mainGirdModel.setCellValue(err.data[0].id, "configname", err.data[0].config.configname);
              mainGirdModel.setCellValue(err.data[0].id, "configcode", err.data[0].config.configcode);
              mainGirdModel.setCellValue(err.data[0].id, "def1", err.data[0].isDate);
              mainGirdModel.setCellValue(err.data[0].id, "def2", err.data[0].config.pk_config);
              mainGirdModel.setCellValue(err.data[0].id, "def3", err.data[0].isbatchman);
              mainGirdModel.setCellValue(err.data[0].id, "def4", err.data[0].islsh);
              if (err.data[0].isbatchman == "Y") {
                mainGirdModel.setCellState(err.data[0].id, "pici", "disabled", false);
              } else {
                mainGirdModel.setCellState(err.data[0].id, "pici", "disabled", true);
              }
              if (err.data[0].islsh == "Y") {
                mainGirdModel.setCellState(err.data[0].id, "nnum", "disabled", false);
              } else {
                mainGirdModel.setCellState(err.data[0].id, "nnum", "disabled", true);
              }
              if (err.data[0].isDate == "Y") {
                mainGirdModel.setCellState(err.data[0].id, "productdate", "disabled", false);
              } else {
                mainGirdModel.setCellState(err.data[0].id, "productdate", "disabled", true);
              }
              mainGirdModel.setCellState(err.data[0].id, "material_sku_name", "disabled", false);
              mainGirdModel.setCellState(err.data[0].id, "item360ai_currentqty", "disabled", true);
              mainGirdModel.setCellState(err.data[0].id, "ordernum", "disabled", true);
            }
          });
        }
      });
    });
  mainGirdModel
    .getEditRowModel()
    .get("pk_material_name")
    .on("afterInitVm", function (args) {
      let referViewModelInfo = args.vm;
      referViewModelInfo.on("afterOkClick", function (okData) {
        let orgid = viewModel.get("org_id").getValue();
        var proxy = viewModel.setProxy({
          queryData: {
            url: "/scmbc/barprint/findconf",
            method: "POST"
          }
        });
        let param = [];
        for (let i = 0; i < okData.length; i++) {
          param.push({
            pk_material: okData[i].id,
            name: okData[i].name,
            orgid: orgid,
            pk_marbasclass: okData[i].manageClassId
          });
        }
        proxy.queryData(param, function (err, result) {
          if (!err.success) {
            cb.utils.alert(err.msg, "error");
            return;
          }
          if (err.data.length > 0) {
            let focuseIndex = mainGirdModel.getFocusedRowIndex();
            let message = "";
            for (let i = 0; i < err.data.length; i++) {
              let item = err.data[i];
              let rowIndex = focuseIndex + i;
              if (item.msg) {
                message = message + item.name + ",";
                mainGirdModel.setCellState(rowIndex, "pici", "disabled", true);
                mainGirdModel.setCellState(rowIndex, "nnum", "disabled", true);
                mainGirdModel.setCellState(rowIndex, "productdate", "disabled", true);
                continue;
              }
              mainGirdModel.setCellValue(rowIndex, "configname", item.config.configname);
              mainGirdModel.setCellValue(rowIndex, "configcode", item.config.configcode);
              mainGirdModel.setCellValue(rowIndex, "def2", item.config.pk_config);
              mainGirdModel.setCellValue(rowIndex, "def1", item.isDate);
              mainGirdModel.setCellValue(rowIndex, "def3", item.isbatchman);
              mainGirdModel.setCellValue(rowIndex, "def4", item.islsh);
            }
            // 会导致前面行设置的批次等字段是否可编辑失效 2022-3-30 xhs upd
            const rows = mainGirdModel.getRows();
            for (let i = focuseIndex; i < rows.length; i++) {
              let item = rows[i];
              if (item.def3 == "Y") {
                //是否批次管理
                mainGirdModel.setCellState(i, "pici", "disabled", false);
              } else {
                mainGirdModel.setCellState(i, "pici", "disabled", true);
              }
              if (item.def4 == "Y") {
                //流水号条码
                mainGirdModel.setCellState(i, "nnum", "disabled", false);
              } else {
                mainGirdModel.setCellState(i, "nnum", "disabled", true);
              }
              if (item.def1 == "Y") {
                //保质期管理
                mainGirdModel.setCellState(i, "productdate", "disabled", false);
              } else {
                mainGirdModel.setCellState(i, "productdate", "disabled", true);
              }
              mainGirdModel.setCellState(i, "material_sku_name", "disabled", false);
              mainGirdModel.setCellState(i, "item360ai_currentqty", "disabled", true);
              mainGirdModel.setCellState(i, "ordernum", "disabled", true);
            }
            if (!cb.utils.isEmpty(message)) {
              cb.utils.alert(message + "没有分配条码规则", "error");
            }
          }
        });
      });
    });
  mainGirdModel
    .getEditRowModel()
    .get("material_sku_name")
    .on("afterInitVm", function (args) {
      let referViewModelInfo = args.vm;
      referViewModelInfo.on("afterOkClick", function (okData) {
        let index = mainGirdModel.getFocusedRowIndex();
        var rows = mainGirdModel.getAllData();
        let rowData = rows[index - 1];
        for (let i = 0; i < okData.length; i++) {
          if (i == 0) {
            continue;
          }
          rowData._id = rows[index + i - 1]._id;
          rowData.material_sku = rows[index + i - 1].material_sku;
          rowData.material_sku_name = rows[index + i - 1].material_sku_name;
          mainGirdModel.updateRow(index + i - 1, rowData);
          if (rowData.def3 == "Y") {
            mainGirdModel.setCellState(index + i - 1, "pici", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i - 1, "pici", "disabled", true);
          }
          if (rowData.def4 == "Y") {
            mainGirdModel.setCellState(index + i - 1, "nnum", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i - 1, "nnum", "disabled", true);
          }
          if (rowData.def1 == "Y") {
            mainGirdModel.setCellState(index + i - 1, "productdate", "disabled", false);
          } else {
            mainGirdModel.setCellState(index + i - 1, "productdate", "disabled", true);
          }
        }
      });
    });
  mainGirdModel
    .getEditRowModel()
    .get("pk_material_name")
    .on("beforeBrowse", function () {
      // 获取当前编辑行的物料段值
      let orgid = viewModel.get("org_id").getValue();
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "orgId",
        op: "in",
        value1: [orgid, "666666"]
      });
      this.setFilter(condition);
    });
}