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
viewModel.on("customInit", function (data) {
});
viewModel.on("afterLoadData", function (event) {
  //卡片页面中获取参照模型   cItemName:参照的字段别名
  let now = new Date();
  // 当前月的日期
  let nowDate = now.getDate();
  let lastMonth = new Date(now.getTime());
  // 设置上一个月（这里不需要减1）
  lastMonth.setMonth(lastMonth.getMonth());
  // 设置为0，默认为当前月的最后一天
  lastMonth.setDate(0);
  // 上一个月的天数
  let daysOflastMonth = lastMonth.getDate();
  // 设置上一个月的日期，如果当前月的日期大于上个月的总天数，则为最后一天
  lastMonth.setDate(nowDate > daysOflastMonth ? daysOflastMonth : nowDate);
  viewModel.get("startDate").setValue(dateFormat(lastMonth, "yyyy-MM-dd"));
});
viewModel.get("billType").on("afterValueChange", function (data) {
});
viewModel.get("endDate").on("afterValueChange", function (data) {
});
viewModel.get("startDate").on("afterValueChange", function (data) {
});
viewModel.get("button33dd") &&
  viewModel.get("button33dd").on("click", function (datas) {
    // 搜索--单击
    let billurl = viewModel.get("billType").getValue();
    let startDate = viewModel.get("startDate").getValue();
    let endDate = viewModel.get("endDate").getValue();
    let baseOrg = viewModel.get("baseOrg").getValue();
    getBillList(billurl, baseOrg, startDate, endDate);
  });
function getBillList(url, baseOrg, startDate, endDate) {
  if (url == undefined || url == null || url === "") {
    cb.utils.alert("请选择单据类型", "info");
    return;
  }
  if (startDate == undefined || startDate == null || startDate === "") {
    cb.utils.alert("请选择开始时间", "info");
    return;
  }
  if (endDate == undefined || endDate == null || endDate === "") {
    cb.utils.alert("请选择结束时间", "info");
    return;
  }
  invokeFunction1(
    "I0P_UDI.publicFunction.getinoutstock",
    {
      url: url,
      baseOrg: baseOrg,
      startDate: startDate,
      endDate: endDate
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
      } else {
        let gridModel = viewModel.get("udiSourceBillConfigEntityList");
        let edate = viewModel.get("endDate").getValue();
        let dataList = res.apiResponse;
        gridModel.clear();
        gridModel.setDataSource(dataList);
      }
    },
    {
      domainKey: "yourKeyHere"
    }
  );
}
function dateFormat(date, format) {
  if (date == undefined || date == "") {
    return "";
  }
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
viewModel.get("button15wa") &&
  viewModel.get("button15wa").on("click", function (data) {
    // 生成UDI--单击
    let row = viewModel.get("udiSourceBillConfigEntityList").getRow(data.index);
    row.producedate = dateFormat(row.producedate, "yyyy-MM-dd");
    row.invaliddate = dateFormat(row.invaliddate, "yyyy-MM-dd");
    let page = {
      billtype: "voucherList", // 单据类型
      billno: "cd45c909", // 单据号
      params: {
        mode: "add", // (编辑态、新增态、浏览态)
        billData: row,
        billType: viewModel.get("billType").getValue()
      }
    };
    cb.loader.runCommandLine("bill", page, viewModel);
  });