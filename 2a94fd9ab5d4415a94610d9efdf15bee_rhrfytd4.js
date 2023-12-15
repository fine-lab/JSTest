viewModel.get("button34xi").setVisible(false);
viewModel.get("button56ne").setVisible(false);
//按钮只有在浏览情况显示 当未填报的key为空时,显示 填报按钮,key不为空时 提交 按钮显示
if (viewModel.getParams().mode !== "add" && viewModel.getParams().mode !== "edit") {
  const deviceRecordKey = viewModel.get("deviceRecordKey").getValue();
  if (deviceRecordKey === "" || deviceRecordKey === undefined || deviceRecordKey === null) {
    viewModel.get("button34xi").setVisible(true);
  } else {
    viewModel.get("button56ne").setVisible(true);
  }
}
viewModel.get("button34xi") &&
  viewModel.get("button34xi").on("click", function (data) {
    // 上传国家医疗器械标识库--单击
    //获取接口调用凭据
    getApiTokenAndPushUdi("tb");
  });
viewModel.get("button56ne") &&
  viewModel.get("button56ne").on("click", function (data) {
    // 提交--单击
    //获取接口调用凭据
    getApiTokenAndPushUdi("tj");
  });
//连通性测试
function getConnectionTest() {}
//获取接口调用凭据
function getApiTokenAndPushUdi(type) {
  let body = {
    data: {
      appId: "应用码",
      appSecret: "应用授权码",
      TYSHXYDM: "统一社会信用代码"
    },
    url: "https://www.example.com/"
  };
  cb.utils.loadingControl.start(); //开启一次loading
  cb.rest.invokeFunction("I0P_UDI.publicFunction.apiManInfo", { body }, function (err, res) {
    cb.utils.loadingControl.end(); //关闭一次loading
    if (err != null) {
      cb.utils.alert("查询token失败!请重试!" + err.message, "error");
      return false;
    }
    //如果返回不是200 提示错误信息 否则 执行上传
    if ("1" === res.rt.returnCode) {
      //执行上传
      //产品标识数据填报
      if ("tb" === type) {
        identifierSave(res.rt);
      } else if ("tj" === type) {
        identifierSubmit(res.rt);
      }
    } else {
      cb.utils.alert(res.rt.returnMsg, "error");
    }
  });
}
//填报
function identifierSave(rt) {
  //循环添加子表 包装产品标识
  var cpbsv3List = viewModel.get("sy01_company_identifier_cpbsv3List"); //表格-UDI包装标识信息
  let devicePackage = [];
  for (let cpbsi = 0; cpbsi < cpbsv3List.getRows().length; cpbsi++) {
    devicePackage.push({
      BZCPBS: cpbsv3List.getRows()[cpbsi].BZCPBS,
      BZNHXYJBZCPBS: cpbsv3List.getRows()[cpbsi].BZNHXYJBZCPBS,
      CPBZJB: cpbsv3List.getRows()[cpbsi].CPBZJB,
      BZNHXYJCPBSSL: cpbsv3List.getRows()[cpbsi].BZNHXYJCPBSSL
    });
  }
  //循环添加子表 存储或操作信息数据
  var ccv3List = viewModel.get("sy01_company_identifier_ccv3List"); //表格-UDI包装标识信息
  let deviceStorage = [];
  for (let ccvi = 0; ccvi < ccv3List.getRows().length; ccvi++) {
    deviceStorage.push({
      CCHCZTJ: ccv3List.getRows()[ccvi].CCHCZTJ,
      ZDZ: ccv3List.getRows()[ccvi].ZDZ,
      ZGZ: ccv3List.getRows()[ccvi].ZGZ,
      JLDW: ccv3List.getRows()[ccvi].JLDW
    });
  }
  //循环添加子表 临床尺寸信息数据
  var lcccv3List = viewModel.get("sy01_company_identifier_lcccv3List"); //表格-UDI包装标识信息
  let deviceClinical = [];
  for (let lcccvi = 0; lcccvi < lcccv3List.getRows().length; lcccvi++) {
    deviceClinical.push({
      LCSYCCLX: lcccv3List.getRows()[lcccvi].LCSYCCLX,
      CCZ: lcccv3List.getRows()[lcccvi].CCZ,
      CCDW: lcccv3List.getRows()[lcccvi].CCDW
    });
  }
  //将页面上的数据回填
  let dataSet = [
    {
      uploadType: viewModel.get("uploadType").getValue(),
      deviceRecordKey: viewModel.get("deviceRecordKey").getValue(),
      ZXXSDYCPBS: viewModel.get("ZXXSDYCPBS").getValue(),
      ZXXSDYZSYDYDSL: viewModel.get("ZXXSDYZSYDYDSL").getValue(),
      SYDYCPBS: viewModel.get("SYDYCPBS").getValue(),
      CPBSBMTXMC: viewModel.get("CPBSBMTXMC").getValue(),
      SFYBTZJBS: viewModel.get("SFYBTZJBS").getValue(),
      BTCPBSYZXXSDYCPBSSFYZ: viewModel.get("BTCPBSYZXXSDYCPBSSFYZ").getValue(),
      BTCPBS: viewModel.get("BTCPBS").getValue(),
      BSZT: viewModel.get("BSZT").getValue(),
      SFYZCBAYZ: viewModel.get("SFYZCBAYZ").getValue(),
      ZCBACPBS: viewModel.get("ZCBACPBS").getValue(),
      CPBSFBRQ: viewModel.get("CPBSFBRQ").getValue(),
      CPMCTYMC: viewModel.get("CPMCTYMC").getValue(),
      SPMC: viewModel.get("SPMC").getValue(),
      GGXH: viewModel.get("GGXH").getValue(),
      SFWBLZTLCP: viewModel.get("SFWBLZTLCP").getValue(),
      CPMS: viewModel.get("CPMS").getValue(),
      CPHHHBH: viewModel.get("CPHHHBH").getValue(),
      CPLX: viewModel.get("CPLX").getValue(),
      FLBM: viewModel.get("FLBM").getValue(),
      YFLBM: viewModel.get("YFLBM").getValue(),
      YLQXZCRBARMC: viewModel.get("YLQXZCRBARMC").getValue(),
      YLQXZCRBARYWMC: viewModel.get("YLQXZCRBARYWMC").getValue(),
      TYSHXYDM: viewModel.get("TYSHXYDM").getValue(),
      ZCZBHHZBAPZBH: viewModel.get("ZCZBHHZBAPZBH").getValue(),
      HCHZSB: viewModel.get("HCHZSB").getValue(),
      SFBJWYCXSY: viewModel.get("SFBJWYCXSY").getValue(),
      ZDCFSYCS: viewModel.get("ZDCFSYCS").getValue(),
      SFWWJBZ: viewModel.get("SFWWJBZ").getValue(),
      SYQSFXYJXMJ: viewModel.get("SYQSFXYJXMJ").getValue(),
      MJFS: viewModel.get("MJFS").getValue(),
      YBBM: viewModel.get("YBBM").getValue(),
      CGZMRAQXGXX: viewModel.get("CGZMRAQXGXX").getValue(),
      TSCCHCZTJ: viewModel.get("TSCCHCZTJ").getValue(),
      TSCCSM: viewModel.get("TSCCSM").getValue(),
      SCBSSFBHPH: viewModel.get("SCBSSFBHPH").getValue(),
      SCBSSFBHXLH: viewModel.get("SCBSSFBHXLH").getValue(),
      SCBSSFBHSCRQ: viewModel.get("SCBSSFBHSCRQ").getValue(),
      SCBSSFBHSXRQ: viewModel.get("SCBSSFBHSXRQ").getValue(),
      QTXXDWZLJ: viewModel.get("QTXXDWZLJ").getValue(),
      TSRQ: viewModel.get("TSRQ").getValue(),
      BGSM: viewModel.get("BGSM").getValue(),
      devicePackage: devicePackage,
      deviceStorage: deviceStorage,
      deviceClinical: deviceClinical
    }
  ];
  let body = {
    data: {
      accessToken: rt.accessToken,
      dataSet: dataSet
    },
    url: "https://www.example.com/"
  };
  cb.utils.loadingControl.start(); //开启一次loading
  cb.rest.invokeFunction("I0P_UDI.publicFunction.apiManInfo", { body }, function (err, res) {
    cb.utils.loadingControl.end(); //关闭一次loading
    if (err != null) {
      cb.utils.alert("产品标识数据填报失败!请重试!" + err.message);
      return false;
    }
    //如果返回不是1 提示错误信息 否则 执行上传
    if ("1" === res.rt.returnCode) {
      //填报成功,回填 deviceRecordKey String 标识数据库记录编号
      const id = viewModel.get("id").getValue();
      var object = { id: id, deviceRecordKey: res.rt.successList[0].deviceRecordKey, isUpdate: "已填报" };
      htKey(object, res.rt.todayRemainVisitCount);
      cb.utils.alert(res.rt.returnMsg);
    } else {
      cb.utils.alert(res.rt.returnMsg + ";错误详情信息:" + res.rt.errorDetailList[0].errorMsg, "error");
    }
  });
}
//提交
function identifierSubmit(rt) {
  let body = {
    data: {
      accessToken: rt.accessToken,
      dataSet: [{ deviceRecordKey: viewModel.get("deviceRecordKey").getValue(), ZXXSDYCPBS: viewModel.get("ZXXSDYCPBS").getValue() }]
    },
    url: "https://www.example.com/"
  };
  cb.utils.loadingControl.start(); //开启一次loading
  cb.rest.invokeFunction("I0P_UDI.publicFunction.apiManInfo", { body }, function (err, res) {
    cb.utils.loadingControl.end(); //关闭一次loading
    if (err != null) {
      cb.utils.alert("提交产品标识数据失败!请重试!" + err.message);
      return false;
    }
    //如果返回不是1 提示错误信息 否则 执行上传
    if ("1" === res.rt.returnCode) {
      const id = viewModel.get("id").getValue();
      var object = { id: id, isUpdate: "已提交" };
      htKey(object, res.rt.todayRemainVisitCount);
      cb.utils.alert(res.rt.returnMsg);
    } else {
      cb.utils.alert(res.rt.returnMsg + ";错误详情信息:" + res.rt.errorDetailList[0].errorMsg, "error");
    }
  });
}
//回填key
function htKey(object, num) {
  cb.utils.loadingControl.start(); //开启一次loading
  cb.rest.invokeFunction("I0P_UDI.publicFunction.updateUpUdiInfo", { object }, function (err, res) {
    cb.utils.loadingControl.end(); //关闭一次loading
    if (err != null) {
      cb.utils.alert("标识数据库记录编号回填失败!请重试!标识数据库记录编号:" + deviceRecordKey + ";" + err.message);
      return false;
    }
    if (res.length !== 0 && typeof res != "undefined") {
      viewModel.get("deviceRecordKey").setValue(deviceRecordKey);
      cb.utils.alert("产品标识数据填报成功![当天剩余访问次数:" + num + "]");
    } else {
      cb.utils.alert("标识数据库记录编号回填失败!请重试!标识数据库记录编号:" + deviceRecordKey + ";");
    }
  });
}
viewModel.get("yjlb_rangeName") &&
  viewModel.get("yjlb_rangeName").on("afterValueChange", function (data) {
    // 一级类别--值改变后
    viewModel.get("item511ae").setValue("");
    viewModel.get("item412mi").setValue("");
    viewModel.get("ejlb_rangeName").setValue("");
    viewModel.get("item612yf").setValue("");
    viewModel.get("sjlb_rangeName").setValue("");
  });
viewModel.get("ejlb_rangeName") &&
  viewModel.get("ejlb_rangeName").on("afterValueChange", function (data) {
    // 二级类别--值改变后
    viewModel.get("item612yf").setValue("");
    viewModel.get("sjlb_rangeName").setValue("");
    let yij = viewModel.get("item313sc").getValue();
    let erj = viewModel.get("item412mi").getValue();
    let yflbm = yij + "-" + erj;
    viewModel.get("FLBM").setValue(yflbm);
  });
viewModel.get("sjlb_rangeName") &&
  viewModel.get("sjlb_rangeName").on("afterValueChange", function (data) {
    // 三级类别--值改变后
    let yij = viewModel.get("item313sc").getValue();
    let erj = viewModel.get("item412mi").getValue();
    let sanj = viewModel.get("item612yf").getValue();
    let sanjt = "-" + sanj;
    if (sanj === null || sanj === undefined || sanj === "") {
      sanjt = "";
    }
    let yflbm = yij + "-" + erj + sanjt;
    viewModel.get("FLBM").setValue(yflbm);
  });