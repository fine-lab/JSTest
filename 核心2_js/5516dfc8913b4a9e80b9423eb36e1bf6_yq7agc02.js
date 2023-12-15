var mainGirdModel = viewModel.getGridModel();
var perData = viewModel.getParams().perData;
viewModel.on("customInit", function (data) {
  // 条码打印主表新--页面初始化
  const referModel = mainGirdModel.getEditRowModel().get("item360ai_currentqty");
  //设置多选
  referModel.setMultiple(true);
  viewModel.getParams().autoAddRow = false;
  if (!cb.utils.isEmpty(perData)) {
    viewModel.biz.do("add", viewModel);
  }
});
var isFirst = true;
viewModel.on("afterLoadData", function () {
  if (isFirst || cb.utils.isEmpty(perData) || cb.utils.isEmpty(perData.billno)) {
    isFirst = false;
    return;
  }
  let bt = perData.bt;
  viewModel.get("org_id").setValue(perData.orgid);
  viewModel.get("name").setValue(perData.bt + perData.billno + "条码打印");
  let alldata = perData.alldata;
  let perlist = [];
  for (var i = 0; i < alldata.length; i++) {
    let rowdata = alldata[i];
    let barcodedata = {};
    barcodedata._id = rowdata._id;
    console.log(
      "【afterLoadData " +
        i +
        "】productId=" +
        rowdata.productId +
        ",product=" +
        rowdata.product +
        ",isSerialNoManage=" +
        rowdata.isSerialNoManage +
        ",productClass=" +
        rowdata.productClass +
        ",materialClassId=" +
        rowdata.materialClassId +
        ",productId_manageClass=" +
        rowdata.productId_manageClass
    );
    if (!!rowdata.productId) {
      barcodedata.pk_material = rowdata.productId;
      barcodedata.def6 = rowdata.productCode;
      barcodedata.pk_material_name = rowdata.productName;
      barcodedata.item86nf = rowdata.materialModelDescription; //规格
      barcodedata.item415vd = rowdata.materialModel; //型号
    } else {
      barcodedata.pk_material = rowdata.product;
      barcodedata.def6 = rowdata.product_cCode;
      barcodedata.pk_material_name = rowdata.product_cName;
      barcodedata.item86nf = rowdata.product_modelDescription; //规格
      barcodedata.item415vd = rowdata.product_model; //型号
    }
    if (!!rowdata.productsku) {
      barcodedata.material_sku = rowdata.productsku;
      barcodedata.material_sku_name = rowdata.productsku_cName;
    } else if (!!rowdata.productId_defaultSKUId) {
      barcodedata.material_sku = rowdata.productId_defaultSKUId;
      barcodedata.material_sku_name = rowdata.productId_defaultSKUId_name;
    }
    if (!!rowdata.productClass) {
      barcodedata.def20 = rowdata.productClass;
      barcodedata.item118vh = rowdata.productClass_Name;
    } else if (!!rowdata.materialClassId) {
      barcodedata.def20 = rowdata.materialClassId;
      barcodedata.item118vh = rowdata.materialClassName;
    } else if (!!rowdata.productId_manageClass) {
      //生产订单
      barcodedata.def20 = rowdata.productId_manageClass;
      barcodedata.item118vh = rowdata.productId_manageClass_name;
    }
    if (!!rowdata.unit_name) {
      barcodedata.pk_material_unit_name = rowdata.unit_name;
      barcodedata.pk_material_unit_code = rowdata.unit_code;
    } else {
      barcodedata.pk_material_unit_name = rowdata.mainUnitName;
      barcodedata.pk_material_unit_code = rowdata.mainUnitCode;
    }
    if (!!rowdata.producedate) {
      barcodedata.productdate = rowdata.producedate;
    } else {
      barcodedata.productdate = rowdata.produceDate;
    }
    if (!!rowdata.invaliddate) {
      barcodedata.invaliddate = rowdata.invaliddate;
    } else {
      barcodedata.invaliddate = rowdata.expirationDate;
    }
    if (!!rowdata.batchNo) {
      barcodedata.pici = rowdata.batchNo;
    } else {
      barcodedata.pici = rowdata.batchno;
    }
    if (!!rowdata.quantity) {
      barcodedata.ordernum = rowdata.quantity;
    } else {
      barcodedata.ordernum = rowdata.qty;
    }
    if (cb.rest.AppContext.tenant.tenantId == "nntvlgdq") {
      //百如森
      barcodedata.nnum = rowdata.qty;
    }
    barcodedata.cvendorid = perData.vendor;
    barcodedata.cvendorid_name = perData.vendor_name;
    barcodedata.def8 = perData.billno;
    barcodedata.def9 = rowdata.memo;
    let proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/barprint/findconf",
        method: "POST"
      }
    });
    let param = [];
    param.push({
      pk_material: barcodedata.pk_material,
      orgid: perData.orgid,
      pk_marbasclass: barcodedata.def20,
      id: i
    });
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      if (err.data !== undefined) {
        if (err.data[0].msg != null) {
          cb.utils.alert(err.data[0].msg, "error");
          return;
        }
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
          if (bt == "采购入库") {
            pursns = rowdata.purInRecordsSNs;
          } else if (bt == "其他入库") {
            pursns = rowdata.othInRecordsSNs;
          } else if (bt == "产品入库") {
            pursns = rowdata.StoreProRecordsSNs;
          }
          if (cb.utils.isEmpty(pursns) || pursns.length == 0) {
          } else {
            let count = perlist.length;
            for (var s = 0; s < pursns.length; s++) {
              let barcodedatanew = { ...barcodedata };
              let pursn = pursns[s];
              barcodedatanew.def7 = pursn.sn;
              barcodedatanew.nnum = 1;
              barcodedatanew.item58vb = 1;
              let index = count + s;
              perlist[index] = barcodedatanew;
            }
          }
        } else {
          perlist.push(barcodedata);
        }
        mainGirdModel.setDataSource(perlist);
      }
    });
  }
});
viewModel.on("modeChange", function (data) {
  let gridData = mainGirdModel.getData();
  if (data == "browse") {
    viewModel.get("button12ik").setVisible(false);
    for (let i = 0; i < gridData.length; i++) {
      mainGirdModel.setCellValue(i, "def7", gridData[i].def7);
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
      mainGirdModel.setCellValue(i, "def7", gridData[i].def7);
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
viewModel.get("button12ik") &&
  viewModel.get("button12ik").on("click", function (data) {
    // 生成条码--单击
    var rows = mainGirdModel.getAllData();
    let orgid = viewModel.get("org_id").getValue();
    let isgo = false;
    let indexes = [];
    rows.forEach((item, index) => {
      if (item.pk_material == "" || item.pk_material == null) {
        cb.utils.alert(index + 1 + "行请选择物料");
        isgo = true;
        return;
      }
      if (item.def3 == "Y" && (item.pici == "" || item.pici == null)) {
        cb.utils.alert(index + 1 + "行请输入批次号");
        isgo = true;
        return;
      }
      if (item.def4 == "Y" && (item.nnum == "" || item.nnum == null)) {
        cb.utils.alert(index + 1 + "行请输入主数量");
        isgo = true;
        return;
      }
      item.isbatchman = item.def3;
      item.islsh = item.def4;
      item.pk_config = item.def2;
      item.isDate = item.def1;
      item.printnum = item.item58vb;
      item.skuid = item.material_sku;
      item.vbatchcode = item.pici;
      item.dproducedate = item.productdate;
      item.cinvcode = item.def8;
      item.cinvname = item.pk_material_name;
      item.xlh = item.def7;
      item.orgid = orgid;
      indexes.push(index);
    });
    if (isgo) {
      return;
    }
    var proxy = viewModel.setProxy({
      settle: {
        url: "/scmbc/barprint/genbarcode",
        method: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json"
      }
    });
    //传参
    var param = rows;
    cb.utils.loadingControl.start({ serviceCode: "18802b06-6f16-4674-bfe1-80b6bb4b0716" });
    proxy.settle(param, function (err, result) {
      try {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        if (err.data != undefined) {
          mainGirdModel.deleteRows(indexes);
          let rows2 = err.data;
          mainGirdModel.insertRows(0, rows2);
          rows2.forEach((row, rowno) => {
            mainGirdModel.setCellValue(rowno, "barcode", row.barcode);
            mainGirdModel.setCellValue(rowno, "def5", row.def5);
            mainGirdModel.setCellValue(rowno, "def7", row.xlh);
            if (row.isbatchman == "Y") {
              mainGirdModel.setCellState(rowno, "pici", "disabled", false);
            } else {
              mainGirdModel.setCellState(rowno, "pici", "disabled", true);
            }
            if (row.islsh == "Y") {
              mainGirdModel.setCellState(rowno, "nnum", "disabled", false);
            } else {
              mainGirdModel.setCellState(rowno, "nnum", "disabled", true);
            }
          });
        }
      } finally {
        cb.utils.loadingControl.end({ serviceCode: "18802b06-6f16-4674-bfe1-80b6bb4b0716" });
      }
    });
  });
mainGirdModel.on("afterSetDataSource", () => {
  //获取列表所有数据
  const rows = mainGirdModel.getRows();
  rows.forEach((data, idn) => {
    if (data.def3 == "Y") {
      mainGirdModel.setCellState(idn, "pici", "disabled", false);
    } else {
      mainGirdModel.setCellState(idn, "pici", "disabled", true);
    }
    if (data.def4 == "Y") {
      mainGirdModel.setCellState(idn, "nnum", "disabled", false);
    } else {
      mainGirdModel.setCellState(idn, "nnum", "disabled", true);
    }
    mainGirdModel.setCellState(idn, "material_sku_name", "disabled", false);
    mainGirdModel.setCellState(idn, "item360ai_currentqty", "disabled", true);
    mainGirdModel.setCellState(idn, "ordernum", "disabled", true);
  });
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
  //仓库参照 - 点击按钮弹出参照前事件
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
  } else if (cellName == "def7") {
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
          rowData.def7 = xlhs[i];
          mainGirdModel.updateRow(index + i, rowData);
        } else {
          rowData.def7 = xlhs[i];
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
        mainGirdModel.setCellState(index + i, "material_sku_name", "disabled", false);
      }
    }
  }
});
mainGirdModel
  .getEditRowModel()
  .get("item360ai_currentqty")
  .on("beforeBrowse", function () {
    //现存量参照 - 点击按钮弹出参照前事件
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
    //现存量参照 - 参照打开vm初始化后
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
        mainGirdModel.setCellValue(xh, "def20", itemData.manageClass);
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
      let fIndex = mainGirdModel.getFocusedRowIndex();
      if (okData.length > 1) fIndex--;
      for (let i = 0; i < okData.length; i++) {
        mainGirdModel.setCellValue(fIndex + i, "def20", okData[i].manageClassId);
        mainGirdModel.setCellValue(fIndex + i, "def6", okData[i].code);
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
viewModel.get("button18yd") &&
  viewModel.get("button18yd").on("click", function (data) {
    // 导出明暗码--单击
    let rows = viewModel.get("item515ld").getValue();
    if (cb.utils.isEmpty(rows)) {
      cb.utils.alert("请输入需要导出的明暗码数量！");
      return;
    }
    if (cb.utils.isEmpty(viewModel.get("name").getValue())) {
      viewModel.get("name").setValue("导出明暗码" + rows + "个");
    }
    cb.utils.alert("一次导出明暗码条数越多，耗时越长。\n\n请等待导出文件的生成...", "info");
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/barprint/findMinganSet",
        method: "POST"
      }
    });
    let param = [];
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      const queryUrl = cb.utils.getServiceUrl() + "/files/scmbc/barprint/exportPassword?domainKey=qilibcscm";
      const sendData = { rows: rows, tenantId: cb.rest.AppContext.tenant.tenantId, filename: viewModel.get("name").getValue() };
      const { common } = viewModel.biz.action();
      const endDown = common.createDownloadForm(queryUrl, sendData);
    });
  });