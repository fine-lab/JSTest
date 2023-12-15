viewModel.on("customInit", function (data) {
  // 伙伴资源看板详情--页面初始化
});
//设置时间带时分秒
var formatDateTime = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
};
var formatMonth = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  return y + "" + m;
};
viewModel.on("afterLoadData", function () {
  //当前页面状态
  var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
  if (currentState == "add") {
    //新增状态
    let org_id = viewModel.get("org_id").getValue();
    viewModel.get("part_create_date").setValue(formatDateTime(new Date()));
    viewModel.get("part_is_pre_invest").setValue(true);
    viewModel.get("part_is_pre_invest2").setValue("Y");
    if (!org_id || org_id == "") {
      let staffRes = cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
        viewModel.get("part_partner_name").setValue(staffData.org_id_name);
      }
    }
    viewModel.get("part_pro_month").setValue("202310"); //formatMonth(new Date())
  }
});
viewModel.on("modeChange", function (data) {
  if (viewModel.get("part_is_pre_invest2").getValue() == "Y") {
    viewModel.get("part_pre_project_code").setVisible(false);
    viewModel.get("part_contract_code").setState("bIsNull", true);
  } else {
    viewModel.get("part_pre_project_code").setVisible(true);
    viewModel.get("part_contract_code").setState("bIsNull", false);
  }
});
function SynAdvisors() {
  let id = viewModel.get("org_id").getValue();
  let name = viewModel.get("org_id_name").getValue();
  cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.SynAdvisors", { id, name }, function (err, res) {
    debugger;
  });
}
var promise = new cb.promise();
viewModel.on("beforeSave", function (args) {
  debugger;
  var data = JSON.parse(args.data.data);
  if (data._status == "Update") {
    data.part_mod_date = ormatDateTime(new Date());
    let staffRes = cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
    let staff = staffRes.result;
    if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
      let staffData = staff.data.data[0];
      data.part_mod_psn = staffData.id;
      data.part_mod_psn_name = staffData.name;
      if (staffData.mobile) {
        data.part_mod_psn_contact = staffData.mobile.split("-")[1];
      } else {
        data.part_mod_psn_contact = staffData.email;
      }
    }
  }
  let count = viewModel.getGridModel("part_out_resouce_advisorList").getRowsCount();
  data.part_advisor_num = count;
  let part_project_status = viewModel.getGridModel("part_project_status").getValue();
  if (part_project_status !== "PRO02" && part_project_status !== "PRO04" && part_project_status !== "PRO05") {
    if (count <= 0) {
      cb.utils.alert("顾问列表不能为空！", "error");
      return false;
    }
    data.part_is_closed2 = "N";
  } else {
    data.part_is_closed2 = "Y";
    data.pre_close_month = data.part_pro_month;
  }
  args.data.data = JSON.stringify(data);
  let bodyRows = viewModel.getGridModel("part_out_resouce_advisorList").getRows();
  let partnerRow = [];
  if (bodyRows && bodyRows.length > 0) {
    for (var bi = 0; bi < bodyRows.length; bi++) {
      let part_advisor = bodyRows[bi].part_advisor;
      if (partnerRow.includes(part_advisor)) {
        cb.utils.alert("顾问列表存在重复顾问，请重新选择！", "error");
        return false;
      }
      partnerRow.push(part_advisor);
    }
  }
  let id = viewModel.get("id").getValue();
  let part_outsouce_mode = viewModel.get("part_outsouce_mode").getValue();
  let part_start_date = viewModel.get("part_start_date").getValue();
  let part_end_date = viewModel.get("part_end_date").getValue();
  let part_pro_month = viewModel.get("part_pro_month").getValue();
  let part_pre_project = viewModel.get("part_pre_project").getValue();
  let part_link_project = viewModel.get("part_link_project").getValue();
  let caRes = cb.rest.invokeFunction(
    "AT17E908FC08280001.backDesignerFunction.checkAdvisor",
    { id, advisors: partnerRow, part_outsouce_mode, part_start_date, part_end_date, part_pro_month, part_pre_project, part_link_project },
    function (err, res) {},
    viewModel,
    { async: false }
  );
  if (caRes && caRes.result && caRes.result.adRes && caRes.result.adRes.length > 0) {
    cb.utils.alert("顾问【" + caRes.result.adRes[0].part_advisor_name + "】已参与项目【" + caRes.result.adRes[0].part_project_name + "】！", "error");
    return false;
  }
  let part_contract_code = viewModel.get("part_contract_code").getValue();
  if (!part_contract_code || part_contract_code.trim().length == 0) {
    cb.utils.confirm(
      "合同编号未填写，是否提交?",
      function () {
        //点击确认  放行
        promise.resolve();
      },
      function () {
        return false;
      }
    );
    return promise;
  }
});
viewModel.on("afterSave", function (args) {
  let part_pre_project = viewModel.get("part_pre_project").getValue();
  let part_contract_code = viewModel.get("part_contract_code").getValue();
  cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.linkPreProject", { part_pre_project, part_contract_code }, function (err, res) {});
});
function confirmS(content) {
  cb.utils.confirm(
    content,
    function () {},
    function (args) {}
  );
}
var promise = new cb.promise();
viewModel.get("button33rk") &&
  viewModel.get("button33rk").on("click", function (data) {
    // 关闭--单击
    var id = viewModel.get("id").getValue();
    cb.utils.confirm(
      "关闭后将不能恢复，确认关闭?",
      function () {
        //点击确认  放行
        let res = cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.closeContract", { id }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
        promise.resolve();
      },
      function () {
        return false;
      },
      "",
      "确认",
      "取消"
    );
    return promise;
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 伙伴名称--值改变后
    SynAdvisors();
  });
viewModel.get("button56qe").on("click", function () {
  let id = viewModel.get("org_id").getValue();
  let name = viewModel.get("org_id_name").getValue();
  if (id && name) {
    cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.SynAdvisors", { id, name }, function (err, res) {
      cb.utils.alert("同步完成！");
    });
  }
});
viewModel.get("part_pre_project_code") &&
  viewModel.get("part_pre_project_code").on("afterValueChange", function (data) {
    if (data && data.value) {
      //预投入项目--值改变后
      cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.queryProDetail", { id: data.value.id }, function (err, res) {
        if (res && res.proDetail) {
          let part_out_resouce_advisorList = res.proDetail.part_out_resouce_advisorList;
          for (let num = 0; num < part_out_resouce_advisorList.length; num++) {
            viewModel.get("part_out_resouce_advisorList").appendRow({
              part_advisor: part_out_resouce_advisorList[num].part_advisor,
              part_advisor_name: part_out_resouce_advisorList[num].part_advisor_name,
              part_advisor_advisorName: part_out_resouce_advisorList[num].part_advisor_name,
              part_advisor_certlevel: part_out_resouce_advisorList[num].part_advisor_certlevel,
              part_advisor_prodline: part_out_resouce_advisorList[num].part_advisor_prodline,
              part_advisor_field: part_out_resouce_advisorList[num].part_advisor_field,
              part_advisor_direct: part_out_resouce_advisorList[num].part_advisor_direct,
              part_advisor_mobile: part_out_resouce_advisorList[num].part_advisor_mobile
            });
          }
        }
      });
    }
  });