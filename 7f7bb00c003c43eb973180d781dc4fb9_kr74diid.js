//加载函数
function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}
viewModel.on("afterInit", function () {
  //页面初始化是否加载数据
  viewModel.getParams().autoLoad = false;
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  cb.utils.loadingControl.start(); //开启一次loading
  commonVOs = args.params.condition.commonVOs;
  const filterVm = viewModel.getCache("FilterViewModel");
  debugger;
  //获取查询区查询条件
  var define16ListStr = filterVm.get("define16").getFromModel().getValue();
  if (define16ListStr) {
    const define16Array = define16ListStr.split(" ");
    if (define16Array && define16Array.length > 0) {
      commonVOs.push({
        itemName: "define16",
        op: "in",
        value1: define16Array
      });
    }
  }
  var printNum = newPseudoGuid();
  viewModel.setCache("c4bef7abList.PrintNum", printNum);
  var body = {
    printNum: printNum,
    beginDate: null,
    endDate: null,
    trainCode: null,
    trainHierarchy: null,
    trainOrgType: null,
    trainNature: null,
    trainMethod: null,
    trainPlanType: null,
    examinationMode: null,
    deptId: null
  };
  commonVOs.forEach((data) => {
    //培训区间
    if (data.itemName === "beginDate") {
      body.beginDate = data.value1;
      body.endDate = data.value2;
    }
    //培训编码
    if (data.itemName === "define16") {
      body.trainCode = data.value1.toString();
    }
    //培训计划类型
    if (data.itemName === "define11") {
      body.trainPlanType = data.value1;
    }
    //培训方式
    if (data.itemName === "define8") {
      body.trainMethod = data.value1;
    }
    //培训层级
    if (data.itemName === "define9") {
      body.trainHierarchy = data.value1;
    }
    //培训组织形式
    if (data.itemName === "define13") {
      body.trainOrgType = data.value1;
    }
    //培训性质
    if (data.itemName === "define10") {
      body.trainNature = data.value1;
    }
    //考核方式
    if (data.itemName === "define12") {
      body.examinationMode = data.value1;
    }
  });
  args.params.condition.commonVOs = [];
  args.params.condition.commonVOs.push({
    itemName: "printNum",
    op: "eq",
    value1: printNum
  });
  cb.utils.alert("正在拉取数据...请稍后", "info");
  ReactDOM.render(React.createElement(Loading), document.createElement("div"));
  cb.rest.invokeFunction("GT15AT1.api.getPersonTrains", body, function (err, res) {
    debugger;
    var data = res;
    viewModel.execute("refresh");
    cb.utils.alert("数据拉取完成", "info");
    stop(); //关闭loading
    cb.utils.loadingControl.end(); //关闭一次loading
  });
});
function newPseudoGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
  }
  return guid;
}