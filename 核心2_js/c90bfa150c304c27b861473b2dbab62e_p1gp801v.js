viewModel.get("button12ci") &&
  viewModel.get("button12ci").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button24fg") && viewModel.get("button24fg").on("click", function (data) {});
// 加载全局配置
let resConfig = cb.rest.invokeFunction("754087d70f0b45b3b6b60ebb0f899ea1", {}, function (err, res) {}, viewModel, { async: false });
viewModel.on("customInit", function (data) {
  // 打印标签预选单--页面初始化
  var tenantId = "";
  var printerIp = "";
  var userId = "";
  console.log(data);
  reqParams.myConfig = resConfig.result; //全局配置参数
  cb.rest.invokeFunction("8585e9baf7d14be4a11343530b11b853", { reqParams: reqParams }, function (err, res) {
    if (err != null && err != "") {
      console.log(err);
      cb.utils.alert("获取打印机地址失败");
      return;
    }
    var resObj = JSON.parse(res.strResponse);
    var configData = resObj.data;
    if (configData == null || configData == undefined) {
      cb.utils.alert("获取打印机地址失败,请检查设备设置");
      return;
    }
    printerIp = configData.localservurl;
    console.log(printerIp);
  });
  cb.rest.invokeFunction("Idx3.BaseConfig.GetUser", {}, function (err, res) {
    if (err != null && err != "") {
      console.log(err);
      cb.utils.alert("获取用户信息失败");
      return;
    }
    var useinfo = JSON.parse(res.rst);
    tenantId = useinfo.tenantId;
    userId = useinfo.id;
  });
  var dataObj = viewModel.getParams().dataObject;
  var parentObj = viewModel.getParams().parentData;
  var warhouseObj = viewModel.getParams().warehouse;
  var isExpiryDateManage = dataObj.isExpiryDateManage;
  var isBatchManage = dataObj.isBatchManage;
  var productSourceCount = dataObj.qty;
  var btnPrint = viewModel.get("button36tg");
  var btnCancel = viewModel.get("button24fg");
  var dataGrip = viewModel.get("isv_printlable_1576096729557106696");
  console.log(dataObj);
  var reqData = {
    dataList: []
  };
  var dataList = [];
  var datadetail = function () {
    this.creator = parentObj.creator;
    this.createTime = parentObj.createTime;
    this.modifier = parentObj.modifier;
    this.modifyTime = parentObj.modifyTime;
    this.puts = parentObj.puts;
    this.tenantId = tenantId;
    this.ytenantId = tenantId;
    this.stockNum = 0;
    this.epc_tid = "";
    this.epccode = "";
    this.orderid = dataObj.sourceid;
    this.ordercode = dataObj.upcode;
    this.orderdetailid = dataObj.sourceautoid;
    this.productId = dataObj.product;
    this.productcode = dataObj.product_cCode;
    this.productname = dataObj.product_cName;
    this.productskuId = dataObj.productsku;
    this.productskucode = dataObj.productsku_cCode;
    this.productskuname = dataObj.productsku_cName;
    this.productclassId = dataObj.productClass;
    this.productclasscode = "";
    this.productclassname = dataObj.productClassName;
    this.warehouseId = warhouseObj.warehouseId;
    this.warehousecode = "";
    this.warehousename = warhouseObj.warehousename;
    this.unitId = dataObj.unit;
    this.unitcode = "";
    this.unitname = dataObj.unit_name;
    this.batchno = "";
    this.productdate = "";
  };
  console.log(datadetail);
  btnPrint.on("click", function (args) {
    // 算数功能
    // 判断效期功能
    var rows = dataGrip.getRows();
    var productCount = 0;
    for (var item in rows) {
      var labnum = rows[item].printlablecount;
      var repreNum = rows[item].perlableRepreNum;
      var productDate = rows[item].productDate;
      var barchno = rows[item].batchno;
      console.log(isExpiryDateManage);
      console.log(isBatchManage);
      if (labnum == 0 || repreNum == 0 || labnum == undefined || repreNum == undefined) {
      } else {
        //判断效期
        if (isExpiryDateManage == true) {
          if (cb.utils.isEmpty(productDate) || productDate == undefined) {
            cb.utils.alert("效期管理商品，必须填写生产日期", "error");
            return;
          }
        }
        //判断批次
        if (isBatchManage == true) {
          if (cb.utils.isEmpty(barchno) || barchno == undefined) {
            cb.utils.alert("批次管理商品，必须填写批次号", "error");
            return;
          }
        }
        console.log(rows[item]);
        for (var i = 0; i < labnum; i++) {
          var code = getLableCode(2);
          var dataObj = new datadetail();
          if (barchno == undefined) {
            dataObj.batchno = "";
          } else {
            dataObj.batchno = barchno;
          }
          dataObj.epccode = code;
          dataObj.productdate = productDate;
          dataObj.stockNum = repreNum;
          dataList.push(dataObj);
        }
        productCount += rows[item].perlableRepreNum * rows[item].printlablecount;
      }
    }
    console.log(rows);
    console.log(productCount);
    if (productCount !== productSourceCount) {
      cb.utils.alert("您输入的标签和物品数量有误，请重新计算并填写️", "error");
      dataList = [];
      return;
    }
    reqData.dataList = dataList;
    var reqParams = {
      tenant_id: tenantId,
      ids: [],
      dataList: dataList,
      ordertype: 3,
      userId: userId
    };
    console.log(reqData);
    cb.utils.confirm(
      "请确认好打印标签的数量，点击确定按钮",
      () => {
        // 参数提交 查看返回参数是否正确，决定是否打印
        cb.utils.loadingControl.start();
        reqParams.myConfig = resConfig.result; //全局配置参数
        var submit = cb.rest.invokeFunction("b1573faef8fa4a139c90266bba83e8ec", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
        console.log(submit);
        const res = JSON.parse(submit.result.strResponse);
        var resstatus = res.status;
        var message = res.message;
        if (resstatus == 1) {
          var content = "rfidplug:";
          for (var i = 0; i < dataList.length; i++) {
            if (i == 0) {
              var contentboday = dataList[i].epccode + "&" + dataList[i].productname + "&" + dataList[i].productcode + "&" + printerIp + "&" + dataList[i].stockNum + "&" + dataList[i].batchno;
            } else {
              var contentboday = "," + dataList[i].epccode + "&" + dataList[i].productname + "&" + dataList[i].productcode + "&" + printerIp + "&" + dataList[i].stockNum + "&" + dataList[i].batchno;
            }
            content += contentboday;
          }
          console.log(content);
          cb.utils.loadingControl.end();
          cb.utils.alert("打印成功");
          window.location.href = content;
        } else {
          cb.utils.alert("打印失败:" + message);
          dataList = [];
          return;
        }
        let data1 = {
          billtype: "VoucherList", // 单据类型
          billno: "pu_arrivalorderlist", // 单据号
          domainKey: "upu",
          params: {
            mode: "browse" // (编辑态、新增态、浏览态)
          }
        };
        cb.loader.runCommandLine("bill", data1, viewModel);
      },
      () => {
        dataList = [];
      }
    );
  });
  btnCancel.on("click", function (args) {
    viewModel.communication({ type: "return", payload: { data: true } });
  });
  function sleep(delay) {
    for (var t = Date.now(); Date.now() - t <= delay; );
  }
  Date.prototype.myFormat = function (format) {
    var o = {
      "M+": this.getMonth() + 1, // month
      "d+": this.getDate(), // day
      "h+": this.getHours(), // hour
      "m+": this.getMinutes(), // minute
      "s+": this.getSeconds(), // second
      "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
      S: this.getMilliseconds(),
      "f+": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    } else if (new RegExp("(f+)").test(format)) {
      var _minSeconds = this.getMilliseconds() + "";
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? ("0" + _minSeconds).substr(("" + _minSeconds).length)
          : RegExp.$1.length == 2
          ? ("00" + _minSeconds).substr(("" + _minSeconds).length)
          : ("000" + _minSeconds).substr(("" + _minSeconds).length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };
  //生成标签
  function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  }
  //数字前补零
  function prefixInteger(num, length) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
  }
  //数字后补零
  function appfixInteger(num, length) {
    if ((num + "").length < length) return appfixInteger(num + "0", length);
    else if ((num + "").length > length) return (num + "").substr(0, length);
    else return num;
  }
  function getLableCode(type) {
    var res = "B01";
    if (type == 2) res = "A01";
    res += new Date().myFormat("yyyyMMdd");
    var time = new Date().myFormat("hhmmssfff");
    res += appfixInteger(time, 9);
    //平台不支持fff
    console.log(new Date().format("yyyyMMddhhmmss"));
    var strRandomNum = randomNum(1000, 9999);
    res += strRandomNum;
    return res;
  }
});