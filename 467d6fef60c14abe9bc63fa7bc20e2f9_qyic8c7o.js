viewModel.on("customInit", function (data) {
  // 应用运维1详情--页面初始化
  //获取页面mode
  const mode = viewModel.getParams().mode;
  var promise = new cb.promise();
  // 调用后端函数
  cb.rest.invokeFunction("AT15F4999417400008.beFunc.getUserInfo", {}, function (err, res) {
    if (err != null) {
      cb.utils.alert("查询数据异常");
      return false;
    } else {
      const isAdmin = res.isAdmin;
      const userInfo = res.currentUser;
      debugger;
      if (mode == "edit") {
        if (isAdmin === 0) {
          viewModel.get("application_title").setDisabled(true);
          viewModel.get("application_code").setDisabled(true);
          viewModel.get("application_assets_code").setDisabled(true);
          viewModel.get("application_category").setDisabled(true);
          viewModel.get("application_business_category").setDisabled(true);
          viewModel.get("application_status").setDisabled(true);
          viewModel.get("application_develop_mode").setDisabled(true);
          viewModel.get("application_level").setDisabled(true);
          viewModel.get("application_scale").setDisabled(true);
          viewModel.get("application_usage_rate").setDisabled(true);
          viewModel.get("application_deploy_location").setDisabled(true);
          viewModel.get("application_deploy_mode").setDisabled(true);
          viewModel.get("application_domain_old").setDisabled(true);
          viewModel.get("application_domain").setDisabled(true);
          viewModel.get("application_pm_name").setDisabled(true);
          viewModel.get("application_pm_dev_name").setDisabled(true);
          viewModel.get("application_pm_ops_name").setDisabled(true);
          viewModel.get("application_pm_security_name").setDisabled(true);
          viewModel.get("application_security_level").setDisabled(true);
          viewModel.get("application_is_outnet").setDisabled(true);
          viewModel.get("application_desc").setDisabled(true);
          viewModel.get("application_risks").setDisabled(true);
        }
      }
      if (mode == "browse") {
        if (isAdmin === 2) {
          viewModel.get("btnEdit").setVisible(false);
          viewModel.get("btnCopy").setVisible(false);
          viewModel.get("btnUnstop").setVisible(false);
          viewModel.get("btnStop").setVisible(false);
          viewModel.get("btnSubmit").setVisible(false);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnWorkflow").setVisible(false);
          viewModel.get("btnDelete").setVisible(false);
          viewModel.get("btnBizFlowPush").setVisible(false);
          viewModel.get("btnModelPreview").setVisible(false);
        }
      }
    }
    promise.resolve();
  });
  return promise;
});
// 监听编辑按钮
viewModel.get("btnEdit").on("click", function () {
  var promise = new cb.promise();
  // 调用后端函数
  cb.rest.invokeFunction("AT15F4999417400008.beFunc.getUserInfo", {}, function (err, res) {
    if (err != null) {
      cb.utils.alert("查询数据异常");
      return false;
    } else {
      const isAdmin = res.isAdmin;
      const userInfo = res.currentUser;
      const mode = viewModel.getParams().mode;
      if (mode == "edit") {
        if (isAdmin === 0) {
          viewModel.get("application_title").setDisabled(true);
          viewModel.get("application_code").setDisabled(true);
          viewModel.get("application_assets_code").setDisabled(true);
          viewModel.get("application_category").setDisabled(true);
          viewModel.get("application_business_category").setDisabled(true);
          viewModel.get("application_status").setDisabled(true);
          viewModel.get("application_develop_mode").setDisabled(true);
          viewModel.get("application_level").setDisabled(true);
          viewModel.get("application_scale").setDisabled(true);
          viewModel.get("application_usage_rate").setDisabled(true);
          viewModel.get("application_deploy_location").setDisabled(true);
          viewModel.get("application_deploy_mode").setDisabled(true);
          viewModel.get("application_domain_old").setDisabled(true);
          viewModel.get("application_domain").setDisabled(true);
          viewModel.get("application_pm_name").setDisabled(true);
          viewModel.get("application_pm_dev_name").setDisabled(true);
          viewModel.get("application_pm_ops_name").setDisabled(true);
          viewModel.get("application_pm_security_name").setDisabled(true);
          viewModel.get("application_security_level").setDisabled(true);
          viewModel.get("application_is_outnet").setDisabled(true);
          viewModel.get("application_desc").setDisabled(true);
          viewModel.get("application_risks").setDisabled(true);
        }
      }
      if (mode == "browse") {
        if (isAdmin === 2) {
          viewModel.get("btnEdit").setVisible(false);
          viewModel.get("btnCopy").setVisible(false);
          viewModel.get("btnUnstop").setVisible(false);
          viewModel.get("btnStop").setVisible(false);
          viewModel.get("btnSubmit").setVisible(false);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnWorkflow").setVisible(false);
          viewModel.get("btnDelete").setVisible(false);
          viewModel.get("btnBizFlowPush").setVisible(false);
          viewModel.get("btnModelPreview").setVisible(false);
        }
      }
    }
    promise.resolve();
  });
  return promise;
});
viewModel.get("application_pm_ops_name") &&
  viewModel.get("application_pm_ops_name").on("beforeBrowse", function (data) {
    // 运维接口人--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: "1596323361329413"
    });
  });
viewModel.get("application_pm_name") &&
  viewModel.get("application_pm_name").on("beforeBrowse", function (data) {
    // 项目经理--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: "1596323361329413"
    });
  });
viewModel.get("application_pm_dev_name") &&
  viewModel.get("application_pm_dev_name").on("beforeBrowse", function (data) {
    // 研发负责人--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: "1596323361329413"
    });
  });
viewModel.get("application_pm_security_name") &&
  viewModel.get("application_pm_security_name").on("beforeBrowse", function (data) {
    // 安全负责人--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: "1596323361329413"
    });
  });