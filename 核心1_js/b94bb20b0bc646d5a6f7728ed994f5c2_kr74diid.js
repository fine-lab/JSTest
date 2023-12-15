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
  var staffCodeListStr = filterVm.get("staff_code").getFromModel().getValue();
  if (staffCodeListStr) {
    const staffCodeArray = staffCodeListStr.split(" ");
    if (staffCodeArray && staffCodeArray.length > 0) {
      commonVOs.push({
        itemName: "staff_code",
        op: "in",
        value1: staffCodeArray
      });
    }
  }
  var printNum = newPseudoGuid();
  viewModel.setCache("1edd0436List.PrintNum", printNum);
  var body = {
    printNum: printNum,
    beginDate: null,
    endDate: null,
    ids: null,
    deptId: null,
    name: null
  };
  commonVOs.forEach((data) => {
    //培训区间
    if (data.itemName === "birthDate") {
      body.beginDate = data.value1;
      body.endDate = data.value2;
    }
    //员工编码
    if (data.itemName === "staff_code") {
      body.ids = data.value1.toString();
    }
    //部门
    if (data.itemName === "adminOrgVO") {
      if (data.value1) {
        body.deptId = data.value1.toString();
      }
    }
    //员工姓名
    if (data.itemName === "name") {
      body.name = data.value1.toString();
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
  cb.rest.invokeFunction("GT15AT1.api.getTraineeList", body, function (err, res) {
    debugger;
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