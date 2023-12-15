var dateinfo = viewModel.getParams().dateinfo; //获取父元素中传递的crm参数
var datafilter = { minDay: "", maxday: "" };
var userInfo = cb.rest.AppContext.user; //用户信息
viewModel.on("modeChange", function (data) {
  if (data == "edit") {
    let date = new Date();
    datafilter.minDay = formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    datafilter.maxday = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    console.log("用户信息", userInfo);
    let user_id = userInfo.userId;
    let res1 = cb.rest.invokeFunction(
      "AT18FE5D761C880009.backend.getStore",
      {
        user_id
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    let { code, dataInfo } = res1.result;
    if (code == "200") {
      viewModel.get("store_name").setValue(dataInfo.store_name);
      viewModel.get("store").setValue(dataInfo.store_id);
    }
    console.log("请求响应结果", res1);
    viewModel.get("start_date").setValue(dateinfo.firstDay);
    viewModel.get("end_date").setValue(dateinfo.lastDay);
    queryData();
  }
});
viewModel.get("button22uk").on("click", function (data) {
  queryData();
});
viewModel.get("start_date").on("beforeValueChange", function (data) {
  let value = data.value;
  let result = isFilter(value);
  if (!result) {
    cb.utils.alert("只允许查询当月的数据", "error");
  }
  return result;
});
viewModel.get("end_date").on("beforeValueChange", function (data) {
  let value = data.value;
  let result = isFilter(value);
  if (!result) {
    cb.utils.alert("只允许查询当月的数据", "error");
  }
  return result;
});
function isFilter(value) {
  if (value > datafilter.maxday || value < datafilter.minDay) {
    return false;
  }
  return true;
}
function queryData() {
  //查询--单击
  // 获取零售单号
  let retalNum = viewModel.get("retal_num").getValue();
  // 获取日期
  let startDate = viewModel.get("start_date").getValue();
  let endDate = viewModel.get("end_date").getValue();
  //组织
  let organization = viewModel.get("organization").getValue();
  //门店
  let store = viewModel.get("store").getValue();
  if (!startDate) {
    cb.utils.alert("请填写单据开始日期", "error");
    return;
  }
  if (!endDate) {
    cb.utils.alert("请填写单据结束日期", "error");
    return;
  }
  ClearValue();
  let res = cb.rest.invokeFunction(
    "AT18FE5D761C880009.backend.getlsinfo",
    {
      code: retalNum,
      organization,
      store,
      startDate,
      endDate
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let { code, dataInfo } = res.result;
  console.log(dataInfo);
  if (code == 200) {
    let addrows = [];
    dataInfo.forEach((item, index) => {
      addrows.push({
        retal_num: item.code,
        date: item.vouchdate,
        store_num: item.storeCode,
        store_name: item.storeName,
        store_id: item.store,
        organization_id: item.iOrgid,
        organization_name: item.iOrgName,
        amount: item.fMoney,
        dept_name: item.Deptname,
        dept: item.Deptid,
        mark: "未评分"
      });
    });
    viewModel.getGridModel().insertRows(0, addrows);
  } else {
    cb.utils.alert("没有获取到单据信息：" + res.result.msg || "");
    ClearValue();
  }
}
function ClearValue() {
  viewModel.getGridModel().clear();
}
let arr = [];
viewModel.getGridModel().on("beforeSelect", function (rowIndexs) {
  //返回true为允许选中，返回false为终止选中
  if (rowIndexs.length >= 2) {
    cb.utils.alert("只能选中一条数据", "error");
    return false;
  }
  return true;
});
//选中select后事件 rowIndexs为行号，单行(整形)or多行(数组)
viewModel.getGridModel().on("afterSelect", function (rowIndexs) {
  arr = rowIndexs;
});
function formatDate(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return `${y}-${m}-${d}`;
}