viewModel.on("afterLoadData", function (args) {
  var operateStatus = viewModel.getParams().operateStatus;
  viewModel.get("item149rf").setValue(operateStatus);
  viewModel.get("acpt_flg").setValue("2");
  viewModel.get("apply_upd_no").setValue(cb.utils.getUser(cb.context.getUserId()).identityId);
  viewModel.get("apply_upd").setValue(cb.context.getUserName());
  viewModel.get("apply_time").setValue(getCurrentDateTimeString());
});
viewModel.on("beforeSave", function (args) {
  debugger;
  viewModel.get("apply_time").setValue(getCurrentDateTimeString());
  var warehousingAcceptanceSheet_AdvanceArrivalNoticeNo = viewModel.get("warehousingAcceptanceSheet_AdvanceArrivalNoticeNo").getValue();
  var gm = viewModel.getGridModel("warehousing_subset_recordList").getData();
  for (var index = 0; index < gm.length; index++) {
    if (gm[index].AdvanceArrivalNoticeNo != warehousingAcceptanceSheet_AdvanceArrivalNoticeNo) {
      cb.utils.alert("入库验收单信息不一致", "error");
      return false;
    }
  }
  var parameter_value = null;
  var sql = "select id, parameter_value from AT161E5DFA09D00001.AT161E5DFA09D00001.config_parameters where parameter_code = 'Role_QAadministration_ID'";
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicQuery", { sql: sql }, function (err, res) {
    if (res.res.length > 0) {
      parameter_value = res.res[0].parameter_value;
      debugger;
      var roleUserRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.findRoleUser", { roleId: parameter_value }, function (err, res) {}, viewModel, { async: false });
      var userList = roleUserRes.result.userList;
      if (userList && userList.length > 0) {
        var mailReceiver = [];
        for (var index = 0; index < userList.length; index++) {
          mailReceiver.push(userList[index].email);
        }
        var advanceArrivalNoticeNo = viewModel.get("warehousingAcceptanceSheet_AdvanceArrivalNoticeNo").getValue();
        var currUserName = cb.context.getUserName();
        var subject = "【提醒】入库验收数据子集修改申请";
        var content = "您好：<br>入库验收数据子集（入库单号：" + advanceArrivalNoticeNo + "）已由" + currUserName + "提交修改申请，请即时审核。";
        var sendRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.sendMailPublic", { mailReceiver, subject, content }, function (err2, res2) {}, viewModel, { async: false });
      }
    } else {
      cb.utils.alert("未找到可用的邮箱地址发送", "error");
      return false;
    }
  });
});
function getCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return dateTimeString;
}
function warehousing_subset_detailList_copy() {
  let warehousing_subset_detailList = viewModel.getGridModel("warehousing_subset_detailList").getData();
  if (warehousing_subset_detailList.length > 0) {
    let rowIndexes = [];
    for (let i = 0; i < warehousing_subset_detailList.length; i++) {
      rowIndexes.push(i);
    }
    viewModel.getGridModel("warehousing_subset_detailList").deleteRows(rowIndexes);
  }
  let warehousing_subset_recordList = viewModel.getGridModel("warehousing_subset_recordList").getData();
  warehousing_subset_recordList.forEach((warehousing_subset_record) => {
    let warehousing_subset_detail = {
      AdvanceArrivalNoticeNo: warehousing_subset_record.AdvanceArrivalNoticeNo,
      product_lis: warehousing_subset_record.product_lis,
      product_lis_product_code_product_coding: warehousing_subset_record.product_lis_product_code_product_coding,
      product_code: warehousing_subset_record.product_code,
      product_name: warehousing_subset_record.product_name,
      model: warehousing_subset_record.model,
      registrant: warehousing_subset_record.registrant,
      Enterprise_name: warehousing_subset_record.Enterprise_name,
      di: warehousing_subset_record.di,
      registration_number: warehousing_subset_record.registration_number,
      batch_number: warehousing_subset_record.batch_number,
      date_manufacture: warehousing_subset_record.date_manufacture,
      term_validity: warehousing_subset_record.term_validity,
      quantity: warehousing_subset_record.quantity,
      Company: warehousing_subset_record.Company,
      storage_conditions: warehousing_subset_record.storage_conditions,
      transportation_conditions: warehousing_subset_record.transportation_conditions,
      warehouse_location: warehousing_subset_record.warehouse_location,
      warehouse_location_location_code: warehousing_subset_record.warehouse_location_location_code,
      warehouse_code: warehousing_subset_record.warehouse_code,
      warehouse_address: warehousing_subset_record.warehouse_address,
      area_name: warehousing_subset_record.area_name,
      storage_env_cond: warehousing_subset_record.storage_env_cond,
      Entrusting_enterprise_name: warehousing_subset_record.Entrusting_enterprise_name,
      quality_status: warehousing_subset_record.quality_status,
      bonded_status: warehousing_subset_record.bonded_status
    };
    viewModel.getGridModel("warehousing_subset_detailList").appendRow(warehousing_subset_detail);
  });
}
function warehousing_subset_detailList_revert() {
  let warehousing_subset_recordList = viewModel.getGridModel("warehousing_subset_recordList").getData();
  if (warehousing_subset_recordList.length > 0) {
    let rowIndexes = [];
    for (let i = 0; i < warehousing_subset_recordList.length; i++) {
      rowIndexes.push(i);
    }
    viewModel.getGridModel("warehousing_subset_recordList").deleteRows(rowIndexes);
  }
  let warehousing_subset_detailList = viewModel.getGridModel("warehousing_subset_detailList").getData();
  warehousing_subset_detailList.forEach((warehousing_subset_detail) => {
    let warehousing_subset_record = {
      AdvanceArrivalNoticeNo: warehousing_subset_detail.AdvanceArrivalNoticeNo,
      product_lis: warehousing_subset_detail.product_lis,
      product_lis_product_code_product_coding: warehousing_subset_detail.product_lis_product_code_product_coding,
      product_code: warehousing_subset_detail.product_code,
      product_name: warehousing_subset_detail.product_name,
      model: warehousing_subset_detail.model,
      registrant: warehousing_subset_detail.registrant,
      Enterprise_name: warehousing_subset_detail.Enterprise_name,
      di: warehousing_subset_detail.di,
      registration_number: warehousing_subset_detail.registration_number,
      batch_number: warehousing_subset_detail.batch_number,
      date_manufacture: warehousing_subset_detail.date_manufacture,
      term_validity: warehousing_subset_detail.term_validity,
      quantity: warehousing_subset_detail.quantity,
      Company: warehousing_subset_detail.Company,
      storage_conditions: warehousing_subset_detail.storage_conditions,
      transportation_conditions: warehousing_subset_detail.transportation_conditions,
      warehouse_location: warehousing_subset_detail.warehouse_location,
      warehouse_location_location_code: warehousing_subset_detail.warehouse_location_location_code,
      warehouse_code: warehousing_subset_detail.warehouse_code,
      warehouse_address: warehousing_subset_detail.warehouse_address,
      area_name: warehousing_subset_detail.area_name,
      storage_env_cond: warehousing_subset_detail.storage_env_cond,
      Entrusting_enterprise_name: warehousing_subset_detail.Entrusting_enterprise_name,
      quality_status: warehousing_subset_detail.quality_status,
      bonded_status: warehousing_subset_detail.bonded_status
    };
    viewModel.getGridModel("warehousing_subset_recordList").appendRow(warehousing_subset_record);
  });
}
viewModel.get("button30zd") &&
  viewModel.get("button30zd").on("click", function (data) {
    //同意--单击
    warehousing_subset_detailList_copy();
    var currDate = getCurrentDateTimeString();
    viewModel.get("acpt_flg").setValue("1");
    viewModel.get("send_status").setValue("3"); // 传送状态
    viewModel.get("approve_status").setValue("1");
    viewModel.get("check_status").setValue("2"); // 校验状态=已校验
    viewModel.get("confirming_status").setValue("1"); // 确认状态=已确认
    viewModel.get("update_reason").setValue("");
    viewModel.get("ext_modifier").setValue(viewModel.get("apply_upd").getValue()); // 修改人
    viewModel.get("ext_modifier_time").setValue(currDate); // 修改时间
    viewModel.get("approve_user_no").setValue(cb.utils.getUser(cb.context.getUserId()).identityId);
    var apply_upd_no = viewModel.get("apply_upd_no").getValue();
    var advanceArrivalNoticeNo = viewModel.get("warehousingAcceptanceSheet_AdvanceArrivalNoticeNo").getValue();
    var roleUserRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getUserById", { userId: apply_upd_no }, function (err, res) {}, viewModel, { async: false });
    var userInfo = roleUserRes.result.userInfo;
    if (userInfo) {
      var mailReceiver = [userInfo.email];
      var subject = "【提醒】入库验收单数据子集（入库单编号： " + advanceArrivalNoticeNo + "）修改审核通过";
      var content = "您好：<br>入库验收单数据子集（入库单编号： " + advanceArrivalNoticeNo + "）的申请修改审核通过。";
      var roleUserRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.sendMailPublic", { mailReceiver, subject, content }, function (err, res) {}, viewModel, { async: false });
    }
    viewModel.biz.do("save", viewModel);
  });
viewModel.get("button28hd") &&
  viewModel.get("button28hd").on("click", function (data) {
    //不同意--单击
    warehousing_subset_detailList_revert();
    viewModel.get("acpt_flg").setValue("1");
    viewModel.get("approve_status").setValue("2");
    viewModel.get("update_reason").setValue("");
    viewModel.get("approve_user_no").setValue(cb.utils.getUser(cb.context.getUserId()).identityId);
    var apply_upd_no = viewModel.get("apply_upd_no").getValue();
    var advanceArrivalNoticeNo = viewModel.get("warehousingAcceptanceSheet_AdvanceArrivalNoticeNo").getValue();
    var roleUserRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getUserById", { userId: apply_upd_no }, function (err, res) {}, viewModel, { async: false });
    var userInfo = roleUserRes.result.userInfo;
    if (userInfo) {
      var mailReceiver = [userInfo.email];
      var subject = "【提醒】入库验收单数据子集（入库单编号： " + advanceArrivalNoticeNo + "）修改审核不通过";
      var content = "您好：<br>入库验收单数据子集（入库单编号： " + advanceArrivalNoticeNo + "）的申请修改审核不通过，如需修改，请重新申请修改。";
      var roleUserRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.sendMailPublic", { mailReceiver, subject, content }, function (err, res) {}, viewModel, { async: false });
    }
    viewModel.biz.do("save", viewModel);
  });