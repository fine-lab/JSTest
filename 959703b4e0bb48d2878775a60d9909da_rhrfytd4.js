var leftList = viewModel.get("sy01_company_identifier_lcccv3List"); //表格 left 列表
var cpbsv3List = viewModel.get("sy01_company_identifier_cpbsv3List"); //表格 包装产品标识"
var ccv3List = viewModel.get("sy01_company_identifier_ccv3List"); //表格存储
var numtemp = 0;
viewModel.get("button15zj") &&
  viewModel.get("button15zj").on("click", function (data) {
    //搜索--单击
    let startTime = viewModel.get("item563lj").getValue();
    let endTime = viewModel.get("item646hg").getValue();
    if (startTime === undefined || startTime === "" || startTime === null) {
      cb.utils.alert("开始时间是必填项!请填写开始时间!", "error");
      return;
    }
    if (endTime === undefined || endTime === "" || endTime === null) {
      cb.utils.alert("结束时间是必填项!请填写结束时间!", "error");
      return;
    }
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
        //执行查询
        getCpbsInfo(res.rt);
      } else {
        cb.utils.alert(res.rt.returnMsg, "error");
      }
    });
  });
//获取产品标识
function getCpbsInfo(rt) {
  let startTime = viewModel.get("item563lj").getValue();
  let endTime = viewModel.get("item646hg").getValue();
  let cpbs = viewModel.get("item817cb").getValue();
  let cpmc = viewModel.get("item730ch").getValue();
  let ggxh = viewModel.get("item481vg").getValue();
  let fysNum = viewModel.get("item907tb").getValue();
  let body = {
    data: {
      accessToken: rt.accessToken,
      startTime: startTime,
      endTime: endTime,
      ZXXSDYCPBS: cpbs,
      CPMCTYMC: cpmc,
      GGXH: ggxh,
      currentPageNumber: fysNum
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
      rtDataInfo(res.rt);
    } else {
      cb.utils.alert(res.rt.returnMsg + ";错误详情信息:" + res.rt.errorDetailList[0].errorMsg, "error");
    }
  });
}
//回写到表格
function rtDataInfo(rt) {
  //先清空
  leftList.clear();
  if (rt.dataSet.deviceInfo && rt.dataSet.deviceInfo.length) {
    for (let devi = 0; devi < rt.dataSet.deviceInfo.length; devi++) {
      let tbrs = {
        item90xd: rt.dataSet.deviceInfo[devi].ZXXSDYCPBS,
        item181ia: rt.dataSet.deviceInfo[devi].CPMCTYMC,
        item366bc: rt.dataSet.deviceInfo[devi].SPMC,
        item273hg: rt.dataSet.deviceInfo[devi].deviceRecordKey,
        id: rt.dataSet.deviceInfo[devi]
      };
      // 下表添加行数据
      leftList.appendRow(tbrs);
    }
    leftList.select([0]); //默认选则第一个 展示
    numtemp = rt.dataSet.deviceInfo.length;
    cpbsInfo(rt.dataSet.deviceInfo[0]);
  } else {
    cb.utils.alert("没有找到对应数据!");
  }
}
viewModel.get("sy01_company_identifier_lcccv3List") &&
  viewModel.get("sy01_company_identifier_lcccv3List").on("afterSelect", function (rowIndexs) {
    // 表格1--中包装选择后
    if (numtemp === leftList.getRows().length) {
      let parentUdiId = leftList.getCellValue(rowIndexs, "id"); //获取对应列的值
      cpbsInfo(parentUdiId);
    }
  });
//赋值右边详情
function cpbsInfo(rt) {
  viewModel.get("deviceRecordKey").setValue(rt.deviceRecordKey);
  viewModel.get("ZXXSDYCPBS").setValue(rt.ZXXSDYCPBS);
  viewModel.get("ZXXSDYZSYDYDSL").setValue(rt.ZXXSDYZSYDYDSL);
  viewModel.get("SYDYCPBS").setValue(rt.SYDYCPBS);
  viewModel.get("CPBSBMTXMC").setValue(rt.CPBSBMTXMC);
  viewModel.get("SFYBTZJBS").setValue(rt.SFYBTZJBS);
  viewModel.get("BTCPBSYZXXSDYCPBSSFYZ").setValue(rt.BTCPBSYZXXSDYCPBSSFYZ);
  viewModel.get("BTCPBS").setValue(rt.BTCPBS);
  viewModel.get("BSZT").setValue(rt.BSZT);
  viewModel.get("SFYZCBAYZ").setValue(rt.SFYZCBAYZ);
  viewModel.get("ZCBACPBS").setValue(rt.ZCBACPBS);
  viewModel.get("CPBSFBRQ").setValue(rt.CPBSFBRQ);
  viewModel.get("CPMCTYMC").setValue(rt.CPMCTYMC);
  viewModel.get("SPMC").setValue(rt.SPMC);
  viewModel.get("GGXH").setValue(rt.GGXH);
  viewModel.get("SFWBLZTLCP").setValue(rt.SFWBLZTLCP);
  viewModel.get("CPMS").setValue(rt.CPMS);
  viewModel.get("CPHHHBH").setValue(rt.CPHHHBH);
  viewModel.get("CPLX").setValue(rt.CPLX);
  viewModel.get("FLBM").setValue(rt.FLBM);
  viewModel.get("YFLBM").setValue(rt.YFLBM);
  viewModel.get("YLQXZCRBARMC").setValue(rt.YLQXZCRBARMC);
  viewModel.get("YLQXZCRBARYWMC").setValue(rt.YLQXZCRBARYWMC);
  viewModel.get("TYSHXYDM").setValue(rt.TYSHXYDM);
  viewModel.get("ZCZBHHZBAPZBH").setValue(rt.ZCZBHHZBAPZBH);
  viewModel.get("HCHZSB").setValue(rt.HCHZSB);
  viewModel.get("SFBJWYCXSY").setValue(rt.SFBJWYCXSY);
  viewModel.get("ZDCFSYCS").setValue(rt.ZDCFSYCS);
  viewModel.get("SFWWJBZ").setValue(rt.SFWWJBZ);
  viewModel.get("SYQSFXYJXMJ").setValue(rt.SYQSFXYJXMJ);
  viewModel.get("MJFS").setValue(rt.MJFS);
  viewModel.get("YBBM").setValue(rt.YBBM);
  viewModel.get("CGZMRAQXGXX").setValue(rt.CGZMRAQXGXX);
  viewModel.get("TSCCHCZTJ").setValue(rt.TSCCHCZTJ);
  viewModel.get("TSCCSM").setValue(rt.TSCCSM);
  viewModel.get("SCBSSFBHPH").setValue(rt.SCBSSFBHPH);
  viewModel.get("SCBSSFBHXLH").setValue(rt.SCBSSFBHXLH);
  viewModel.get("SCBSSFBHSCRQ").setValue(rt.SCBSSFBHSCRQ);
  viewModel.get("SCBSSFBHSXRQ").setValue(rt.SCBSSFBHSXRQ);
  viewModel.get("QTXXDWZLJ").setValue(rt.QTXXDWZLJ);
  viewModel.get("TSRQ").setValue(rt.TSRQ);
  viewModel.get("BGSM").setValue(rt.BGSM);
  viewModel.get("isUpdate").setValue(rt.isUpdate);
  viewModel.get("yjlb").setValue(rt.yjlb);
  viewModel.get("ejlb").setValue(rt.ejlb);
  viewModel.get("sjlb").setValue(rt.sjlb);
}