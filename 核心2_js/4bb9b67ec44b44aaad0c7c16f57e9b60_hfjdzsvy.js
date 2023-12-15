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
  let endDate = viewModel.get("endDate").getValue();
  let startDate = viewModel.get("startDate").getValue();
  if ((data.value.value != undefined && data.oldValue == undefined) || data.value.value != data.oldValue.value) {
    getBillList(data.value.value, startDate, endDate);
  }
});
viewModel.get("endDate").on("afterValueChange", function (data) {
  let billurl = viewModel.get("billType").getValue();
  let startDate = viewModel.get("startDate").getValue();
  if (billurl != undefined && ((data.value != undefined && data.oldValue == undefined) || data.value != data.oldValue)) {
    getBillList(billurl, startDate, data.value);
  }
});
viewModel.get("startDate").on("afterValueChange", function (data) {
  let billurl = viewModel.get("billType").getValue();
  let endDate = viewModel.get("endDate").getValue();
  if (billurl != undefined && ((data.value != undefined && data.oldValue == undefined) || data.value != data.oldValue)) {
    getBillList(billurl, data.value, endDate);
  }
});
function getBillList(url, startDate, endDate) {
  invokeFunction1(
    "I0P_UDI.publicFunction.getinoutstock",
    {
      url: url,
      startDate: startDate,
      endDate: endDate
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
      } else {
        let gridModel = viewModel.get("udiSourceBillConfigEntityList");
        let edate = viewModel.get("endDate").getValue();
        let apiResponse = JSON.parse(res.apiResponse);
        if (apiResponse.code == "200") {
          let dataList = apiResponse.data.recordList;
          gridModel.clear();
          let list = [];
          for (let i = 0; i < dataList.length; i++) {
            let object = {
              id: dataList[i].id,
              billCode: dataList[i].code,
              orgName: dataList[i].org_name == null || dataList[i].org_name == undefined ? dataList[i].orgName : dataList[i].org_name,
              vouchDate: dataList[i].vouchdate
            };
            list.push(object);
          }
          gridModel.setDataSource(list);
        } else {
          cb.utils.alert(apiResponse.message, "error");
        }
      }
    },
    {
      domainKey: "yourKeyHere"
    }
  );
}
function dateFormat(date, format) {
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
    let page = {
      billtype: "voucherList", // 单据类型
      billno: "cd45c909", // 单据号
      params: {
        mode: "add", // (编辑态、新增态、浏览态)
        billCode: row.billCode,
        billId: row.id,
        billType: viewModel.get("billType").getValue()
      }
    };
    cb.loader.runCommandLine("bill", page, viewModel);
  });