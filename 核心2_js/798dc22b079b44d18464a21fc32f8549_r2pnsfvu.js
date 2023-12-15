// 预订单 列表root
function initExt(event) {
  var viewModel = this;
  (function () {
    // 调用代理商与代理商客户品种关系
    cb.rest.invokeFunction("0ef12b46d44a4414a0f1231014252deb", {}, function (err, res) {
      viewModel.res = res || {};
      console.log("res获取完毕");
    });
  })();
  // 按钮相关处理
  viewModel.get("button8230952be").on("click", function () {
    let rows = viewModel.getGridModel().getSelectedRows();
    let pushIds = rows.filter((v) => v.verifystate === 2).map((v) => v.id);
    if (rows.length === 0 || pushIds.length === 0) {
      cb.utils.alert("请至少选择一条审批态数据！");
      return;
    }
    cb.rest.invokeFunction("a0cb319694c84744b6afc657a73fda50", { pushIds }, function (err, res) {
      console.log("预订单测试推送", err, res);
      if (err) {
        // 网关可能有问题或者服务本身有问题。
        cb.utils.alert(err.message || JSON.stringify(err), "error");
        return;
      }
      if (!res) {
        // 服务通了或者网关通了。
        cb.utils.alert(err.message, "error");
        return;
      }
      if (!res["ncRes"]) {
        cb.utils.alert(res, "error");
        return;
      }
      let ncRes = res.ncRes;
      let data = JSON.parse(ncRes.data);
      if (data.code == "500") {
        var msg = "NC处理失败 ";
        let innerData = data.data || [];
        innerData.forEach(function (v) {
          msg += v.resultdescription;
        });
        cb.utils.alert(msg, "error");
        return;
      } else if (data.code == "200") {
        cb.utils.alert(data.message || data.resultdescription || "处理成功");
        return;
      } else {
        cb.utils.alert(data.message || data.errormessage || JSON.stringify(ncRes), "error");
        return;
      }
    });
  });
  // 测试推送撤回   withdrawnNCBill
  viewModel.get("button8230952kh").on("click", function () {
    let rows = viewModel.getGridModel().getSelectedRows();
      .map((v) => v.id);
    if (rows.length === 0 || pushIds.length === 0) {
      cb.utils.alert("请至少选择一条数据！");
      return;
    }
    cb.rest.invokeFunction("b96505c43d324bda9dac68cf06c58c03", { pushIds }, function (err, res) {
      console.log("预订单测试推送撤回", err, res);
      debugger;
      if (err) {
        // 网关可能有问题或者服务本身有问题。
        cb.utils.alert(err.message || JSON.stringify(err), "error");
        return;
      }
      if (!res) {
        // 服务通了或者网关通了。
        cb.utils.alert(err.message, "error");
        return;
      }
      if (!res["ncRes"]) {
        cb.utils.alert(res, "error");
        return;
      }
      let ncRes = res.ncRes;
      let data = JSON.parse(ncRes.data);
      if (data.code == "500") {
        var msg = "NC处理失败 ";
        let innerData = data.data || [];
        innerData.forEach(function (v) {
          msg += v.resultdescription || v.message;
        });
        cb.utils.alert(msg, "error");
        return;
      } else if (data.code == "200") {
        cb.utils.alert(data.resultdescription || data.message || "处理成功");
        return;
      } else {
        cb.utils.alert(data.message || data.errormessage || JSON.stringify(ncRes), "error");
        return;
      }
    });
  });
  viewModel.on("afterMount", function () {
    console.log("afterMount invoke");
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      //业务员组织过滤
      filtervm
        .get("operator")
        .getFromModel()
        .on("beforeBrowse", function (data) {
          let org_id = filtervm.get("org_id").getFromModel().getValue();
          if (!org_id) {
            cb.utils.alert("请先选择销售组织！");
            return false;
          }
          let field = data.field;
          var condition = {
            isExtend: true,
            simpleVOs: [
              {
                field: "mainJobList.org_id",
                op: "eq",
                value1: org_id
              }
            ]
          };
          this.setFilter(condition);
        });
      //代理商组织过滤
      filtervm
        .get("cmmssn_merchant")
        .getFromModel()
        .on("beforeBrowse", function (data) {
          let org_id = filtervm.get("org_id").getFromModel().getValue();
          if (!org_id) {
            cb.utils.alert("请先选择销售组织！");
            return false;
          }
          let field = data.field;
          var condition = {
            isExtend: true,
            simpleVOs: [
              {
                field: "org_id",
                op: "eq",
                value1: org_id
              }
            ]
          };
          this.setFilter(condition);
        });
      //客户组织过滤
      filtervm
        .get("merchant")
        .getFromModel()
        .on("beforeBrowse", function (data) {
          let org_id = filtervm.get("org_id").getFromModel().getValue();
          if (!org_id) {
            cb.utils.alert("请先选择销售组织！");
            return false;
          }
          let field = data.field;
          var condition = {
            isExtend: true,
            simpleVOs: [
              {
                field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
                op: "eq",
                value1: org_id
              }
            ]
          };
          this.setFilter(condition);
        });
      filtervm
        .get("expectedDeceivingDate")
        .getFromModel()
        .on("beforeBrowse", function (data) {
          let org_id = filtervm.get("org_id").getFromModel().getValue();
        });
      //交易类型过滤
      filtervm
        .get("bustype")
        .getFromModel()
        .on("beforeBrowse", function () {
          var condition = {
            isExtend: true,
            simpleVOs: []
          };
          condition.simpleVOs.push({
            field: "code",
            op: "in",
            value1: ["CreditSale", "CashSale"]
          });
          this.setFilter(condition);
        });
      filtervm
        .get("org_id")
        .getFromModel()
        .on("afterValueChange", function (data) {
          filtervm.get("cmmssn_merchant").getFromModel().setValue(null);
          filtervm.get("merchant").getFromModel().setValue(null);
          filtervm.get("operator").getFromModel().setValue(null);
        });
    });
  });
  viewModel.on("beforeSearch", function (args) {
    const filtervm = viewModel.getCache("FilterViewModel");
    console.log("beforeSearch", viewModel.res);
    let org_id = filtervm.get("org_id").getFromModel().getValue();
    if (org_id == null || org_id == undefined) {
      args.isExtend = true;
      commonVOs = args.params.condition.commonVOs;
      commonVOs.push({
        itemName: "org_id",
        op: "eq",
        value1: 0
      });
    }
  });
  // 附件
  viewModel.on("beforeAttachmentExecute", function (event) {
    viewModel.getCache("attachmentCondition").uploadInBrowse = true;
    viewModel.getCache("attachmentCondition").readOnly = false;
  });
  // 删除动作绑定
  viewModel.get("button8230952ma").setVisible(false);
}