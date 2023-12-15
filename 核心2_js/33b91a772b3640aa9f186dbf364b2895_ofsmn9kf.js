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
viewModel.get("billType").on("afterValueChange", function (data) {
  if ((data.value.value != undefined && data.oldValue == undefined) || data.value.value != data.oldValue.value) {
    getBillList(data.value.value);
  }
});
viewModel.get("endDate").on("afterValueChange", function (data) {
  let billurl = viewModel.get("billType").getValue();
  if (billurl != undefined || (data.value.value != undefined && data.oldValue == undefined) || data.value.value != data.oldValue.value) {
    getBillList(billurl);
  }
});
function getBillList(url) {
  invokeFunction1(
    "GT22176AT10.publicFunction.getinoutstock",
    {
      url: url
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
          for (let i = 0; i < dataList.length; i++) {
            let vouchdate = dateFormat(dataList[i].vouchdate, "yyyy-MM-dd");
            if (edate == undefined || vouchdate >= edate) {
              let object = {
                billCode: dataList[i].code,
                orgName: dataList[i].org_name,
                vouchDate: dataList[i].vouchdate
              };
              gridModel.appendRow(object);
            }
          }
        } else {
          cb.utils.alert(apiResponse.message, "error");
        }
      }
    },
    {
      domainKey: "sy01"
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