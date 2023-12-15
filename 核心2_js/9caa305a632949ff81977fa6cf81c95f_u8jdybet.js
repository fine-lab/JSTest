//详情列表条件过滤  gridModel.prototype.setDataSource
window.isAdmin = 0;
window.KPextend = {
  invokeFunc: function (
    funcName,
    swhere = {},
    ayc = false //异步时回调函数才有用
  ) {
    var d = cb.rest.invokeFunction(
      funcName,
      swhere,
      function (err, res) {
        alert(funcName + "调用错误:" + res);
      },
      viewModel,
      { async: ayc }
    );
    if (d.hasOwnProperty("error")) {
      alert(funcName + "函数调用错误!");
      console.log("invokeFunc=-------------------------");
      console.log(d);
    }
    return d.result.result;
  }
};
var isIni = 0;
let result = window.KPextend.invokeFunc("AT16F632B808C80005.API.getOrg", {});
let kecodes = "";
let len = result.length;
result.forEach((v, i) => {
  kecodes += "'" + v.code + "'" + (i == len - 1 ? "" : ",");
});
window.condition = {
  defaultCondition: { orderby: "order by createTime desc", shoudawhere: "dr=0 and type=0 ", songdaWhere: " " },
  defineCondition: { orderby: "order by createTime desc", shoudawhere: "dr=0 and type=0 ", songdaWhere: " " }
}; //and type=0
function isearch() {
  var s = document.getElementById("seachinput").value;
  if (s) window.condition.defineCondition.shoudawhere = window.condition.defaultCondition.shoudawhere + " and name like '" + s + "'";
  else window.condition.defineCondition.shoudawhere = window.condition.defaultCondition.shoudawhere;
  viewModel.refreshGrid();
}
viewModel.on("afterBatchimport", function (args) {
  console.log("afterBatchimport----------------------");
  viewModel.refreshGrid();
});
viewModel.on("beforeBatchoutput", function (data) {
  console.log("beforeBatchoutput----------------------");
  console.log(data);
});
viewModel.on("beforeSearch", function (args) {
  console.log("beforeSearch---------------");
  console.log(args);
});
viewModel.on("customInit", function (data) {
  console.log("customInit----------------------");
  viewModel.getGridModel().setState("dataSourceMode", "local");
});
viewModel.on("afterLoadData", function (data) {
  //列表页无这个事件
  console.log("afterLoadData ----------------------");
  console.log(data);
});
viewModel.on("afterBatchdelete", function (data) {
  this.refreshGrid();
});
viewModel.on("afterMount", function (data) {
  console.log("列表afterMount----------------------");
  console.log(data);
  this.refreshGrid = function (d) {
    var gmData;
    if (window.isAdmin == "Kewpie(1993)") {
      var gmData = window.KPextend.invokeFunc("AT16F632B808C80005.API.getData", window.condition.defineCondition);
    } else {
      var defineConditionShouda = JSON.parse(JSON.stringify(window.condition.defineCondition));
      var defineConditionSongda = JSON.parse(JSON.stringify(window.condition.defineCondition));
      defineConditionShouda.shoudawhere += "and disableTime is null and keCode in (" + kecodes + ") "; //合同签订课
      var gmDataShouda = window.KPextend.invokeFunc("AT16F632B808C80005.API.getData", defineConditionShouda); //and keCode in ("+kecodes+")
      defineConditionSongda.shoudawhere += "and disableTime is null and keCode not in (" + kecodes + ") " + "and Address.keCode in (" + kecodes + ") "; //业绩归属课
      var gmDataSongda = window.KPextend.invokeFunc("AT16F632B808C80005.API.getData", defineConditionSongda);
      gmData = [...gmDataShouda, ...gmDataSongda];
    }
    if (isIni) {
      this.getGridModel().setDataSource(gmData);
    } else {
      gmData.forEach((it, i) => {
        d[i] = it;
      });
      isIni = 1;
    }
    this.get("item106xc").setValue(gmData.length);
  };
  var searchHtml =
    '<div class="" style="padding-top:8px;"><div title="客户全称" style="display: inline-block;width: 110px;text-align: right;padding-right: 12px"><label>客户全称</label></div><div style="display: inline-block; width: 500px;"><input id="youridHere" class="wui-input default" style=""></div><div style="display: inline-block;padding-left: 15px;"><button id="youridHere" type="button" class="wui-button basic-control" locale="zh_CN"><span class="wui-button-text-wrap">查询</span></button></div>' +
    '<div style="display: inline-block;padding-left: 15px;"><span style="color: red;">*新增新规草稿功能，不支持变更草稿，见右边草稿按钮——></span></div></div>';
  var dom = document.createElement("div");
  dom.style.float = "left";
  dom.innerHTML = searchHtml;
  document.querySelector(".ybff7b95d3List .list-header-right-toolbar").parentElement.appendChild(dom);
  document.getElementById("seachbutton").addEventListener("click", isearch);
  document.getElementById("seachinput").onkeydown = function (event) {
    //搜索框enter键
    if (event.which === 13) {
      isearch();
    }
  };
});
viewModel.on("customInit", function (data) {
  // 客户档案管理--页面初始化
});
viewModel.get("merchant3_1654605725399252999") &&
  viewModel.get("merchant3_1654605725399252999").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log("beforeSetDataSource-----------");
    console.log(data);
    if (!isIni) viewModel.refreshGrid(data);
  });
viewModel.get("merchant3_1654605725399252999") &&
  viewModel.get("merchant3_1654605725399252999").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    console.log("afterSetDataSource-----------");
  });
viewModel.get("button69sh") &&
  viewModel.get("button69sh").on("click", function (data) {
    // 关闭申请--单击
    window.location.href = "/yonbip-ec-iform/ucf-wh/iform/static/rt.html?_=1682577148267#/fillin?fromType=formMgr&pk_bo=8410e450d85943ea87ef936460e6f98f&processdefId=multiProcess";
  });
viewModel.get("button89vd") &&
  viewModel.get("button89vd").on("click", function (data) {
    //草稿--单击
    window.open("https://" + window.location.host + "/mdf-node/meta/Voucher/yb4c05f61f?domainKey=developplatform");
  });