var dateFormat = function (date, format) {
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours() + 8, //hour+8小时
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
};
viewModel.on("afterLoadData", function (args) {
  debugger;
  try {
    let pd = viewModel.originalParams.parentParams.billData;
    let need_write = true;
    if (pd != undefined && viewModel.originalParams.mode == "add") {
      let apl = viewModel.get("apply_license").getValue();
      if (apl == pd.id) {
        need_write = false;
      }
    }
    if (pd != undefined && viewModel.originalParams.mode == "add" && need_write) {
      console.log("有数据");
      viewModel.get("apply_license").setValue(pd.id);
      viewModel.get("apply_license_code").setValue(pd.code);
      viewModel.get("org_id_name").setValue(pd.org_id_name);
      viewModel.get("org_id").setValue(pd.org_id);
      viewModel.get("org_id_name").setValue(pd.org_id_name);
      viewModel.get("apply_user").setValue(pd.applyer);
      viewModel.get("apply_user_name").setValue(pd.applyer_name);
      viewModel.get("apply_department").setValue(pd.depart_id);
      viewModel.get("apply_department_name").setValue(pd.depart_name);
      viewModel.get("apply_license_customerCode_code").setValue(pd.customerCode_code);
      viewModel.get("apply_license_customerCode_name").setValue(pd.customerName);
      viewModel.get("is_all_org").setValue(pd.is_all_org);
      let l_remark = "";
      if (pd.remarks != undefined) {
        l_remark = pd.remarks;
      }
      viewModel.get("remark").setValue(l_remark);
      var now = new Date();
      var audit_time = dateFormat(now, "yyyy-MM-dd");
      viewModel.get("bill_date").setValue(audit_time);
      let license_list = pd.SY01_customer_license_detailList;
      for (let i = 0; i < license_list.length; i++) {
        let remark = "";
        if (license_list[i].remark != undefined) {
          remark = license_list[i].remark;
        }
        viewModel
          .getGridModel()
          .insertRow(i + 1, {
            license_code: license_list[i].license_code,
            license_type_typeName: license_list[i].license_type_typeName,
            license_type: license_list[i].license_type,
            validity_start_date: license_list[i].validity_start_date,
            validity_end_date: license_list[i].validity_end_date,
            yuan_validity_end_date: license_list[i].validity_end_date,
            remark: remark
          });
      }
    } else {
      console.log("无数据");
    }
  } catch (err) {
    console.log("无数据");
  }
});