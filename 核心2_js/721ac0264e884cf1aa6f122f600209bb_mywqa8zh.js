var gridInfo = viewModel.get("showDataPushInfoList");
viewModel.on("customInit", function (data) {
  // 智保云推送--页面初始化
  //设置样式
  loadStyle(".group-title {padding:3px 0px !important;font-size:14px!important;margin:24px !important }");
  loadStyle(".grid-container {margin-top: 30px !important}");
  loadStyle(".gridLayout {width:70% !important;margin-left:15% !important;grid-auto-rows:minmax(50px, auto) !important}");
  function loadStyle(params) {
    var headobj = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    headobj.appendChild(style);
    style.sheet.insertRule(params, 0);
  }
  viewModel.get("zuzhi_name")._set_data("textField", "name");
  viewModel.get("huijiqijian_code")._set_data("textField", "code");
  // 清空表
  autorefresh(viewModel);
});
viewModel.get("button4ld") &&
  viewModel.get("button4ld").on("click", function (data) {
    // 数据同步--单击
    var zhangbu = viewModel.get("zuzhi_name")._get_data("text"); //组织编码
    var kuaiji = viewModel.get("huijiqijian_code")._get_data("text"); //会计期间编码
    var lirun = viewModel.get("lirunbiao").getValue();
    var zichanfuzhai = viewModel.get("zichanfuzhaibiao").getValue();
    var myDate = new Date();
    var mytime = myDate.getTime(); // 当前时间
    var y = myDate.getFullYear(); //获取完整的年份(4位)
    var m = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var d = myDate.getDate(); //获取当前日(1-31)
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var min = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds(); //获取当前秒数(0-59)
    var time = y + "年" + m + "月" + d + "日" + h + "时" + min + "分" + s + "秒";
    var ispush = true; //是否推送数据
    let pushparmater = {
      orgCode: zhangbu,
      kjqj: kuaiji,
      lrb: "",
      zcb: "",
      myDate: myDate,
      mytime: mytime,
      time: time
    }; //推送条件
    if (zhangbu != undefined && kuaiji != undefined) {
      // 判断用户选择的报表
      if (lirun && zichanfuzhai) {
        pushparmater.lrb = "lirunbiao";
        pushparmater.zcb = "zichanfuzhaibiao";
      } else if (lirun) {
        pushparmater.lrb = "lirunbiao";
      } else if (zichanfuzhai) {
        pushparmater.zcb = "zichanfuzhaibiao";
      } else {
        ispush = false;
        cb.utils.alert("请至少选择一个报表进行数据同步", "error");
      }
      if (ispush) {
        cb.rest.invokeFunction("AT175542E21C400007.backDefaultGroup.datasync", pushparmater, function (err, res) {
          if (err != null) {
            console.log(err);
            cb.utils.alert(err.message, "error");
          } else {
            let sign = res.result.includes("失败") ? "error" : "success";
            cb.utils.alert(res.result, sign);
            autorefresh(viewModel);
          }
        });
      }
    } else {
      cb.utils.alert("组织与会计期间为必填项", "error");
    }
  });
viewModel.get("button1dh") &&
  viewModel.get("button1dh").on("click", function (data) {
    // 更新日志--单击
    autorefresh(viewModel);
  });
gridInfo.on("pageInfoChange", (pageInfoChange) => {
  var currentPage = gridInfo.getPageIndex();
  console.log("打印当前页：");
  console.log(currentPage);
  cb.rest.invokeFunction("AT175542E21C400007.backDefaultGroup.selectLogForPush", {}, function (err, res) {
    var logInfo = res.log_info;
    var collectionLog = []; // 定义存放log的容器
    var logInfoLen = logInfo.length;
    gridInfo.setState("dataSourceMode", "local");
    var flag = logInfoLen - 12 * currentPage;
    if (flag >= 0) {
      for (let i = 0; i < 12; i++) {
        var numb = logInfoLen - i - 1 - 12 * (currentPage - 1);
        collectionLog[i] = logInfo[numb];
      }
      gridInfo.setDataSource(collectionLog);
      gridInfo.setPageInfo({
        pageIndex: currentPage,
        pageSize: 12,
        recordCount: logInfoLen
      });
    } else {
      var tLen = 12 * currentPage - logInfoLen;
      var trueLen = 12 - tLen; // 实际的条数
      for (let i = 0; i < trueLen; i++) {
        var numb = logInfoLen - i - 1 - 12 * (currentPage - 1);
        collectionLog[i] = logInfo[numb];
      }
      gridInfo.setDataSource(collectionLog);
      gridInfo.setPageInfo({
        pageIndex: currentPage,
        pageSize: 12,
        recordCount: logInfoLen
      });
    }
  });
});
function autorefresh(viewModel) {
  viewModel.getParams().autoAddRow = false;
  gridInfo.setPagination(true);
  cb.rest.invokeFunction("AT175542E21C400007.backDefaultGroup.selectLogForPush", {}, function (err, res) {
    if (err != undefined) {
      console.log(err);
    } else {
      var logInfo = res.log_info;
      console.log("打印查询回来的logInfo");
      console.log(logInfo);
      var collectionLog = []; // 定义存放log的容器
      var logInfoLen = logInfo.length;
      gridInfo.setState("dataSourceMode", "local");
      for (let i = 0; i < 12; i++) {
        var numb = logInfoLen - i - 1;
        if (numb >= 0) {
          collectionLog[i] = logInfo[numb];
        }
      }
      gridInfo.setDataSource(collectionLog);
      gridInfo.setPageInfo({
        pageIndex: 1,
        pageSize: 12,
        recordCount: logInfoLen
      });
    }
  });
}