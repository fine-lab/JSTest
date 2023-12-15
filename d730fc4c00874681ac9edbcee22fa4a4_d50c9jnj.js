viewModel.on("customInit", function (data) {
  // 到货单列表--页面初始化
});
viewModel.on("afterBatchaudit", function (result) {
  debugger;
  cb.rest.invokeFunction("PU.backApiFunc.syncPurToHw", { params: result.res.infos }, function (err, res) {
    debugger;
    if (err) {
      cb.utils.alert(err.message, "同步华为error");
    } else {
      cb.utils.alert("成功！", "同步华为success");
    }
  });
  cb.rest.invokeFunction("PU.backApiFunc.syncZyyApi", { params: result.res.infos }, function (err, res) {
    debugger;
    if (err) {
      cb.utils.alert(err.message, "整机同步中外运error");
    } else {
      cb.utils.alert("成功！", "整机同步中外运success");
    }
  });
});
viewModel.on("afterSearch", function (args) {
  // 调用API函数查询采购到货数据并替换data
});
// 替换默认的查询数据
viewModel.getGridModel().on("beforeSetDataSource", function (data) {
  debugger;
  // 调用API函数查询资产数据并替换data
  let codeList = [];
  data.forEach((item) => {
    codeList.push(item.code);
  });
  let result = cb.rest.invokeFunction("PU.backApiFunc.arrivalAndLogics", { code: codeList }, function (err, res) {}, viewModel, { async: false });
  if (result.error != undefined) {
    cb.utils.alert("系统错误！请联系管理员！");
    return;
  }
  let logiclist = result.result.logicRes;
  if (data.length > 0 && logiclist.length > 0) {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < logiclist.length; j++) {
        if (data[i].code == logiclist[j].code) {
          data[i].extendLogisticsStatus = logiclist[j].status_name;
          break;
        }
      }
    }
  }
});
//第一步: 引入cdn 域名换成自己环境的  我这里是https://yonbip-core1.dbox.diwork.com
loadjs("https://www.example.com/");
function loadjs(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = params;
  headobj.appendChild(script);
}
viewModel.get("button47bf") &&
  viewModel.get("button47bf").on("click", function (data) {
    debugger;
    let listData = viewModel.getGridModel().getSelectedRows();
    let codeList = [];
    listData.forEach((item) => {
      codeList.push(item.code);
    });
    let result = cb.rest.invokeFunction("PU.backApiFunc.getLogisticsData", { code: codeList }, function (err, res) {}, viewModel, { async: false });
    //跳转物流状态的
    let config = cb.rest.invokeFunction("PU.backApiFunc.getServiceCode", {}, function (err, res) {}, viewModel, { async: false });
    let serviceCode = config.result.serviceCode;
    var data = {
      billtype: "voucherList",
      billno: "yba8d3690fList"
    };
    let params = {
      data: result
    };
    jDiwork.openService(serviceCode, data, params);
  });
viewModel.get("button62ne").on("click", function (result) {
  let selectData = viewModel.getGridModel("pu_arrivalorderlist").getSelectedRows();
  if (selectData.length == 0) {
    cb.utils.alert("请选择一条数据", "warn");
    return;
  }
  let ids = [];
  for (let i = 0; i < selectData.length; i++) {
    ids.push({ id: selectData[i].id });
  }
  cb.rest.invokeFunction("PU.backApiFunc.syncPurToHw", { params: ids }, function (err, res) {
    if (err) {
      cb.utils.alert("推送失败，失败原因：" + err.message, "error");
    } else {
      cb.utils.alert("推送成功！", "success");
    }
  });
});