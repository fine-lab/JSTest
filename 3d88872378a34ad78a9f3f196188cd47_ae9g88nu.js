run = function (event) {
  var viewModel = this;
  let gridModel = viewModel.getGridModel("othInRecords");
  viewModel.on("beforeSave", function () {
    //复制行实现方案   判断
    let promises = [];
    let errorMsg = "";
    let rows = gridModel.getRows();
    //判断
    let validateStock = {
      inInvoiceOrg: viewModel.get("accountOrg").getValue(),
      wareHouseId: viewModel.get("warehouse").getValue(),
      rows: rows
    };
    //执行validateTemperature方法
    promises.push(
      validateStorage(validateStock).then(
        (res) => {
          errorMsg += res;
        },
        (err) => {
          errorMsg += err;
        }
      )
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  gridModel.on("beforeCellValueChange", function (data) {
    if (data.cellName == "product_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
      }
    }
    if (data.cellName == "productsku_cCode") {
      gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
      gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
    }
  });
  gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "product_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null, false);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null, false);
      } else {
        let rows = gridModel.getRows();
        let orgId = viewModel.get("accountOrg").getValue();
        let materialIds = [];
        materialIds.push(data.value.id);
        getStorage(orgId, materialIds).then((materialInfos) => {
          for (let i = 0; i < rows.length; i++) {
            if (materialInfos.hasOwnProperty(rows[i].product)) {
              gridModel.setCellValue(i, "extendStorageCondition", materialInfos[rows[i].product].storage);
              gridModel.setCellValue(i, "extendStorageCondition_storageName", materialInfos[rows[i].product].storageName);
            }
          }
        });
      }
    }
    if (data.cellName == "productsku_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
      } else {
        let product = gridModel.getCellValue(data.rowIndex, "product");
        if (product == undefined || product == null || product == "") {
          return;
        }
        let rows = gridModel.getRows();
        let orgId = viewModel.get("accountOrg").getValue();
        let materialIds = [];
        materialIds.push(gridModel.getCellValue(data.rowIndex, "product"));
        getStorage(orgId, materialIds).then((materialInfos) => {
          for (let i = 0; i < rows.length; i++) {
            if (materialInfos.hasOwnProperty(rows[i].product)) {
              gridModel.setCellValue(i, "extendStorageCondition", materialInfos[rows[i].product].storage);
              gridModel.setCellValue(i, "extendStorageCondition_storageName", materialInfos[rows[i].product].storageName);
            }
          }
        });
      }
    }
  });
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  //判断物料的存储条件是否符合仓库条件
  let validateStorage = function (param) {
    return new Promise(function (resolve, reject) {
      try {
        invokeFunction1(
          "ST.publicFunction.validateStorage",
          param,
          function (err, res) {
            if (typeof res !== "undefined") {
              resolve(res.errorMsg);
            }
            if (err !== null) {
              reject(err.message);
            }
          },
          { domainKey: "sy01" }
        );
      } catch (err) {
        reject(err.message);
      }
    });
  };
  let getStorage = function (orgId, materialIds) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ST.publicFunction.getStorage", { orgId: orgId, materialIds: materialIds }, function (err, res) {
        if (res != undefined) {
          resolve(res.materialInfos);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.on("afterSave", function () {
    //事件发生之后， 进行保存成功以后的保存
    saveUdidata();
  });
  viewModel.on("afterLoadData", function (data) {
    //是否开启udi管理
    udiIsOpen();
  });
  let djType = "其他入库单";
  let btnUdiClike = "button68mj"; //udi管理按钮
  let btnUdiText = "item539zk"; //udi上下文
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
          trackingDirection: "来源", //跟踪方向
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
};