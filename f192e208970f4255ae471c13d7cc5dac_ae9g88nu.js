viewModel.on("customInit", function (data) {
  // 其他出库单--页面初始化
  var viewModel = this;
  debugger;
  var batchnoarr = [];
  var producedaterr = [];
  var invaliddatearr = [];
  cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  let SetProductInfo = function (id, saleorgid, rowIndex) {
    var detailsModel = viewModel.getGridModel("othOutRecords");
    debugger;
    //调用后端函数取商品信息
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getProductDetail", { materialId: id, orgId: saleorgid }, function (err, res) {
      if (res.merchantInfo) {
        //主计量
        if (res.merchantInfo.unit_Name) {
          detailsModel.setCellValue(rowIndex, "product_unit", res.merchantInfo.unit);
          detailsModel.setCellValue(rowIndex, "product_unitName", res.merchantInfo.unit_Name);
          detailsModel.setCellValue(rowIndex, "unit", res.merchantInfo.unit);
          detailsModel.setCellValue(rowIndex, "unit_name", res.merchantInfo.unit_Name);
        }
        //规格说明
        if (res.merchantInfo.modelDescription) {
          detailsModel.setCellValue(rowIndex, "modelDescription", res.merchantInfo.modelDescription);
        }
        //库存单位
        if (res.merchantInfo.detail.stockUnit) {
          detailsModel.setCellValue(rowIndex, "stockUnitId", res.merchantInfo.detail.stockUnit);
          detailsModel.setCellValue(rowIndex, "stockUnit_name", res.merchantInfo.detail.stockUnit_Name);
        }
        //保质期
        if (res.merchantInfo.detail.expireDateNo) {
          detailsModel.setCellValue(rowIndex, "expireDateNo", res.merchantInfo.detail.expireDateNo);
          detailsModel.setCellValue(rowIndex, "expireDateUnit", res.merchantInfo.detail.expireDateUnit);
        }
      }
      returnPromise.resolve();
    });
    return returnPromise;
  };
  function triggerReferBrowse(productsku) {
    cb.utils.triggerReferBrowse(viewModel.get("othOutRecords").getEditRowModel().get("productsku_cName"), [{ field: "id", op: "eq", value1: productsku }]);
  }
  //库存状态
  var gridModels = viewModel.getGridModel("othOutRecords");
  function setStockStatename(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.name) {
          gridModels.setCellValue(rowIndex, "stockStatusDoc_name", res.info.name);
          gridModels.setCellValue(rowIndex, "stockStatusDoc", res.info.id);
        }
      });
    });
  }
  var returnPromise1 = new cb.promise();
  const promises = [];
  var promise = new cb.promise();
  viewModel.on("afterLoadData", function (data) {
    //是否开启udi管理
    udiIsOpen();
    var gridModelDetails = viewModel.getGridModel("othOutRecords").get("dataSource");
    var gridModel = viewModel.getGridModel("othOutRecords");
    var detail = data.othOutRecords;
    const promises = [];
    var promise = new cb.promise();
    var orgId = data.org;
    debugger;
    for (var i = 0; i <= gridModelDetails.length; i++) {
      let productsku = gridModelDetails[i].product;
      let batchno = gridModelDetails[i].batchno;
      if (undefined != batchno) {
        batchnoarr.push(batchno);
      }
      let producedate = gridModelDetails[i].producedate; //
      if (undefined != producedate) {
        producedaterr.push(producedate);
      }
      let invaliddate = gridModelDetails[i].invaliddate;
      if (undefined != invaliddate) {
        invaliddatearr.push(invaliddate);
      }
      setStockStatename(null, "合格", 2, i);
      gridModel.setCellValue(i, "contactsQuantity", gridModelDetails[i].qty);
      gridModel.setCellValue(i, "invExchRate", 1);
      gridModel.setCellValue(i, "subQty", gridModelDetails[i].qty);
      SetProductInfo(productsku, orgId, i);
    }
  });
  viewModel.on("beforePush", function (args) {
    debugger;
    var verifystate = viewModel.getAllData().verifystate; //
    var ids = viewModel.getAllData().id;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
    var gridModelDetailstr = viewModel.getGridModel("othOutRecords").get("dataSource");
    for (var i = 0; i < gridModelDetailstr.length; i++) {
      var sourceidstr = gridModelDetailstr[i].source;
      if ("c2d5f5ea" != sourceidstr) {
        cb.utils.alert("非报损流程单据不允许下推药品销毁单!");
        return false;
      }
    }
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction1(
      "GT22176AT10.publicFunction.checkChildAudit",
      { uri: "GT22176AT10.GT22176AT10.SY01_durg_destoryv2", id: ids },
      function (err, res) {
        if (res.Info && res.Info.length > 0) {
          cb.utils.alert(res.Info);
          return false;
        }
        if (res.return_info1 && res.return_info1.length > 0) {
          cb.utils.alert(res.return_info1);
          return false;
        }
        returnPromise.resolve();
      },
      undefined,
      { domainKey: "sy01" }
    );
    return returnPromise;
  });
  viewModel.on("afterCellCheck", function (data) {
    debugger;
    let key = data.params && data.params.key;
    var gridModel2 = viewModel.getGridModel("othOutRecords");
    let location = data.params.location;
    if (key == "productsku_cName") {
      if (batchnoarr.length > 0) {
        for (var i = 0; i < batchnoarr.length; i++) {
          gridModel2.setCellValue(i, "batchno", batchnoarr[i]);
          gridModel2.setCellValue(i, "producedate", producedaterr[i]);
          gridModel2.setCellValue(i, "invaliddate", invaliddatearr[i]);
        }
      }
    }
  });
  viewModel.on("afterCheckDetail", function (args) {
    debugger;
    for (var i = 0; i < gridModelDetails.length; i++) {
      gridModel.setCellValue(i, "batchno", gridModelDetails[i].batchno);
    }
  });
  function getLocalTime(longTypeDate) {
    if (isNaN(longTypeDate) && !isNaN(Date.parse(longTypeDate))) {
      return longTypeDate;
    }
    var dateType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateType = date.getFullYear() + "-" + getMonth(date) + "-" + getDay(date); //yyyy-MM-dd格式日期
    return dateType;
  }
  function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
      month = "0" + month;
    }
    return month;
  }
  function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return day;
  }
  viewModel.on("afterSave", function () {
    //事件发生之后， 进行保存成功以后的保存
    saveUdidata();
  });
  let djType = "其他出库单";
  let btnUdiClike = "button75wi"; //udi管理按钮
  let btnUdiText = "item603va"; //udi上下文
  let invokeFunctionUdi = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  viewModel.get(btnUdiClike) &&
    viewModel.get(btnUdiClike).on("click", function (data) {
      const djCode = viewModel.get("code").getValue();
      let datars = {
        billtype: "VoucherList", // 单据类型
        billno: "a0a62540", // 单据号
        domainKey: "sy01",
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态browse)
          //传参
          danjuType: djType,
          danjuNum: djCode
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", datars, viewModel);
    });
  //判断udi管理是否开启 按钮默认不显示，开启则显示
  let udiIsOpen = function () {
    //查询UDI追溯配置表
    invokeFunctionUdi(
      "GT22176AT10.publicFunction.getUDITrace",
      {},
      function (err, res) {
        if (err != null && typeof err != "undefined" && err !== "") {
          viewModel.get(btnUdiClike).setVisible(false);
          return false;
        }
        viewModel.get(btnUdiClike).setVisible(false); //默认关闭
        let cofingRs = res.configurationRs;
        for (i = 0; i < cofingRs.length; i++) {
          if (djType === cofingRs[i].billNameText) {
            viewModel.get(btnUdiClike).setVisible(true);
            break;
          }
        }
        if (viewModel.getParams().mode !== "add") {
          viewModel.get(btnUdiClike).setVisible(false);
        }
      },
      {
        domainKey: "sy01"
      }
    );
  };
  //保存udi到数据中心
  function saveUdidata() {
    // 保存udi--保存后触发
    let udiInfoValueRs = viewModel.get(btnUdiText).getValue(); //获取保存的上下文
    console.log(udiInfoValueRs);
    if (typeof udiInfoValueRs == "undefined" || udiInfoValueRs == null || udiInfoValueRs === "") {
      return;
    }
    let udiInfoValue = udiInfoValueRs.tableData;
    if (udiInfoValue.length <= 0) {
      return;
    }
    //保存后 记录 udi信息
    let newdate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    for (i = 0; i < udiInfoValue.length; i++) {
      for (jxmxi = 0; jxmxi < udiInfoValue[i].udi_admin_djxx_jxmxList.length; jxmxi++) {
        //解析明细
        let adminJxmxList = udiInfoValue[i].udi_admin_djxx_jxmxList[jxmxi];
        let djbh = viewModel.get("code").getValue();
        let saveInfo = {
          id: guid(),
          trackingDirection: "去向", //跟踪方向
          billName: djType, //单据名称
          billNo: djbh, //单据编号
          rowIndex: "", //行号
          material: adminJxmxList.item298sh, //物料
          unit: adminJxmxList.item375ze, //计量单位
          qty: adminJxmxList.jiexishuliang, //数量
          optDate: newdate, //操作时间
          UDIFile_id: "" //UDI主档
        };
        invokeFunctionUdi(
          "GT22176AT10.publicFunction.saveUdiDataTrack",
          {
            UDI: adminJxmxList.item96wg,
            udiDataObject: saveInfo
          },
          function (err, res) {
            if (err != null) {
              console.log("---------采购入库-udi--保存data失败");
              return false;
            } else {
              console.log("---------采购入库-udi--保存data成功！");
            }
          },
          {
            domainKey: "sy01"
          }
        );
      }
    }
  }
  function dateFormat(date, format) {
    date = new Date(date);
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "H+": date.getHours() + 8, //hour+8小时
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  //生成uuid
  function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
});