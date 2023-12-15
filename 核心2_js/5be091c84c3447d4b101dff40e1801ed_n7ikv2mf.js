viewModel.on("customInit", function (data) {
  function formatDate(date) {
    var month = date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }
  function formatMonth() {
    var date = new Date();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    return month;
  }
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      viewModel.get("billDate").setValue(formatDate(new Date()));
      //主组织默认值
      let staffRes = cb.rest.invokeFunction("GT5258AT16.pubFunction.getStaffByUserId", { userId: cb.rest.AppContext.user.userId }, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
        viewModel.get("orgName").setValue(staffData.org_id_name);
        viewModel.get("linkman").setValue(staffData.id);
        viewModel.get("linkman_name").setValue(staffData.name);
        if (staffData.mobile) {
          viewModel.get("mobile").setValue(staffData.mobile.split("-")[1]);
        }
      }
      addPartners();
    }
  });
  function addPartners() {
    //查询默认伙伴
    cb.rest.invokeFunction("GT5258AT16.yswbzyytd.queryDefPart", { platform: "2" }, function (err, res) {
      debugger;
      console.log(res);
      var gridModel = viewModel.getGridModel();
      if (res && res.links && res.links.length > 0) {
        var links = res.links;
        for (var a1 = 0; a1 < links.length; a1++) {
          var partner1 = {
            responseStatus: "1",
            hasDefaultInit: true,
            _tableDisplayOutlineAll: false,
            partnerDoc: links[a1].id,
            partnerDoc_partner_name: links[a1].partnerName,
            serviceAreaName: links[a1].serviceAreaName,
            projectNum: links[a1].projectNum,
            projectSatis: links[a1].projectSatis,
            introduce: links[a1].introduce,
            partner: links[a1].partner,
            partner_name: links[a1].partnerName,
            partnerName: links[a1].partnerName,
            isPublic: "N"
          };
          gridModel.appendRow(partner1);
        }
      }
    });
  }
});
var girdModel = viewModel.getGridModel();
girdModel
  .getEditRowModel()
  .get("partnerDoc_partner_name")
  .on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "partner_contacts_prlList.platform",
      op: "eq",
      value1: "2"
    });
    this.setFilter(condition);
  });
viewModel.get("button27ck") &&
  viewModel.get("button27ck").on("click", function (data) {
    // 发布伙伴--单击
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    if (isClose == "Y") {
      cb.utils.alert("该单据已终止，无法发布！");
      return;
    }
    debugger;
    //生成反馈单
    let res = cb.rest.invokeFunction("GT5258AT16.yswbzyytd.generateFKD", { id }, function (err, res) {}, viewModel, { async: false });
    console.log(res);
    cb.utils.alert("发布完成！");
    viewModel.execute("refresh");
  });
viewModel.get("button43qh") &&
  viewModel.get("button43qh").on("click", function (data) {
    // 终止--单击
    var id = viewModel.get("id").getValue();
    cb.utils.confirm(
      "终止后将无法发布伙伴，并且伙伴也无法进行响应，确认继续终止？",
      function () {
        let res = cb.rest.invokeFunction("GT5258AT16.yswbzyytd.terminateYSWBYTD", { id, isClose: "Y" }, function (err, res) {}, viewModel, { async: false });
        console.log(res);
        cb.utils.alert("终止完成！");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
viewModel.get("button60ph") &&
  viewModel.get("button60ph").on("click", function (data) {
    // 激活--单击
    var id = viewModel.get("id").getValue();
    cb.utils.confirm(
      "确认继续激活？",
      function () {
        let res = cb.rest.invokeFunction("GT5258AT16.yswbzyytd.terminateYSWBYTD", { id, isClose: "N" }, function (err, res) {}, viewModel, { async: false });
        console.log(res);
        cb.utils.alert("终止完成！");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
//保存后增加默认伙伴
viewModel.on("afterSave", function (args) {
});