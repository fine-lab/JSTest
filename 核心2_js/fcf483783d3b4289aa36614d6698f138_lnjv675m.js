viewModel.on("customInit", function (data) {
  cb.rest.invokeFunction("GT34544AT7.authManager.getAppContext", {}, function (err, res) {
    console.log("你的信息");
    console.log(res);
    console.log("你的组织单元");
    let orgid = res.res.currentUser.orgId;
    console.log(orgid);
    viewModel.get("AuthOrg").setValue(orgid);
  });
  viewModel.on("afterMount", function () {
    cb.rest.invokeFunction("GT3AT33.utils.areaAdminOrg", {}, function (err, res) {
      console.log("res", JSON.stringify(res));
      viewModel.get("item1241kd").setValue(JSON.stringify(res.arr));
    });
    cb.rest.invokeFunction("GT3AT33.utils.adminOrg", {}, function (err, res) {
      viewModel.get("item1318td").setValue(JSON.stringify(res.arr));
    });
    cb.rest.invokeFunction("GT3AT33.utils.isGXY", {}, function (err, res) {
      if (!cb.utils.isEmpty(err)) {
        viewModel.get("item1326fg").setValue(false);
      } else {
        viewModel.get("item1326fg").setValue(res.res);
      }
    });
  });
  viewModel.on("afterLoadData", () => {
    setTimeout(function () {
      viewModel.get("charge").setValue("0");
      viewModel.get("endDate").setState("bIsNull", false); //权限结束时间
      viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setState("bIsNull", false); //服务项目
      viewModel.get("beginDate").setState("bIsNull", false); //权限开始时间
      let item1335rf = viewModel.get("item1335rf").getValue(); //云科技运维管理员
      let item1421ei = viewModel.get("item1421ei").getValue(); //行业区域运维管理员
      let item1508hf = viewModel.get("item1508hf").getValue(); //运营商运维管理员
      let item1596ef = viewModel.get("item1596ef").getValue(); //组织运维管理员
      let item2586rb = viewModel.get("item2586rb").getValue(); //创建人主任职ID
      if (item1335rf !== "0" && item1335rf !== undefined) {
        //如果是云科技运维管理员，授权组织为供销云科技
        let item = viewModel.get("item1986ve_name"); //授权组织
        cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: 2482145385959680 }]);
        viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: false }); //使用组织
        viewModel.execute("updateViewMeta", { code: "form7xg", visible: false }); //授权设置
        viewModel.execute("updateViewMeta", { code: "form26bg", visible: false }); //服务项目
        viewModel.execute("updateViewMeta", { code: "form62ja", visible: false }); //运营商/行业区域管理信息
        viewModel.get("item1986ve_name").setState("bIsNull", false);
        viewModel.get("item2051dd_name").setState("bIsNull", false);
        viewModel.get("item1925fe_UserName").setState("bIsNull", false);
        viewModel.get("item1862xc_name").setState("bIsNull", false);
      } else if ((item1421ei !== "0" && item1421ei !== undefined) || (item1508hf !== "0" && item1508hf !== undefined)) {
        //如果是行业区域运维管理员 或者 运营商运维管理员，授权组织当前用户员工主任职
        viewModel.execute("updateViewMeta", { code: "form128aa", visible: false }); //授权期限/角色有效期
        viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: false }); //使用组织
        viewModel.execute("updateViewMeta", { code: "form7xg", visible: false }); //授权设置
        viewModel.execute("updateViewMeta", { code: "form26bg", visible: false }); //服务项目
        viewModel.execute("updateViewMeta", { code: "form52hf", visible: false }); //云科技管理信息
        viewModel.get("item2121mb_sysManagerOrg_name").setState("bIsNull", false);
        viewModel.get("item2187bj_name").setState("bIsNull", false);
        viewModel.get("item2331kg_UserName").setState("bIsNull", false);
        viewModel.get("item2257gh_name").setState("bIsNull", false);
        viewModel.get("item2257gh_name").setValue("组织管理员ZZGL_YWZZ001");
        viewModel.get("item2257gh").setValue("1666506968080056323");
        let item = viewModel.get("test_GxyRole_name"); //角色
        cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: "1666506968080056323" }]);
        item = viewModel.get("item2121mb_sysManagerOrg_name"); //组织
        cb.utils.triggerReferBrowse(item, [{ field: "sysManagerOrg", op: "eq", value1: item2586rb }]);
      } else if (item1596ef !== "0" && item1508hf == "0" && item1421ei == "0" && item1335rf == "0") {
        //如果是组织运维管理员，只能授权业务类角色
        viewModel.execute("updateViewMeta", { code: "form62ja", visible: false }); //运营商/行业区域管理信息
        viewModel.execute("updateViewMeta", { code: "form52hf", visible: false }); //云科技管理信息
        viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setState("bIsNull", false); //服务项目
        viewModel.get("AuthType").setReadOnly(true);
        let item = viewModel.get("org_id_name");
        cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: item2586rb }]);
      }
      if (item1596ef == "0" && item1508hf == "0" && item1421ei == "0" && item1335rf == "0") {
        viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setState("bIsNull", true); //服务项目
        viewModel.execute("updateViewMeta", { code: "form62ja", visible: false }); //运营商/行业区域管理信息
        viewModel.execute("updateViewMeta", { code: "form7xg", visible: false }); //授权设置
        viewModel.execute("updateViewMeta", { code: "form26bg", visible: false }); //服务项目
        viewModel.execute("updateViewMeta", { code: "form52hf", visible: false }); //云科技管理信息
        viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: false }); //使用组织
        viewModel.execute("updateViewMeta", { code: "form128aa", visible: false }); //授权期限/角色有效期
        viewModel.execute("updateViewMeta", { code: "form45nd", visible: false }); //授权角色类型
      }
    }, 3000);
  });
});
viewModel.get("test_GxyOrgRole_name") &&
  viewModel.get("test_GxyOrgRole_name").on("beforeBrowse", function (data) {
    var oid = viewModel.get("OrderOrg").getValue();
    console.log("参照打开前 oid = ");
    console.log(oid);
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: oid
    });
    this.setFilter(condition);
  });
viewModel.on("afterSave", function (args) {
  console.log("after save args", JSON.stringify(args.res));
});
viewModel.on("afterDelete", function (args) {
});
viewModel.get("test_GxyService_name") && viewModel.get("test_GxyService_name").on("beforeBrowse", function (data) {});
viewModel.get("test_OrderServiceUseOrg_test_GxyService_name") &&
  viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").on("afterValueChange", function (data) {
    var data = viewModel.get("item859zb").getValue();
    var sql = "select GxyServiceCode,Userquantity,UsedUserquantity from GT3AT33.GT3AT33.test_OrderService where id='" + data + "'";
    var dd = [];
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      var obj = list[0];
      viewModel.get("item861zf").setValue(obj.UsedUserquantity);
    });
  });
viewModel.get("gxyUserOrg_UserName") &&
  viewModel.get("gxyUserOrg_UserName").on("beforeBrowse", function (data) {
    // 用户名称--参照弹窗打开前
    let org_id_check = viewModel.get("org_id_name").getValue();
    if (cb.utils.isEmpty(org_id_check)) {
      cb.utils.alert("请先选择授权组织", "info ");
      return false;
    }
    let isGXY = viewModel.get("item1335rf").getValue(); //云科技运维管理员
    if (isGXY == "0") {
      let promise = new cb.promise();
      let org_id = viewModel.get("org_id").getValue();
      let AreaAdmin = viewModel.get("item1241kd").getValue(); //管理区域组织
      let OrgAdmin = viewModel.get("item1318td").getValue(); //管理组织
      const isorgAdmin = OrgAdmin.includes(org_id);
      const isareaAdmin = AreaAdmin.includes(org_id);
      var condition = [];
      if (isorgAdmin) {
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          field: "ManageOrg",
          op: "eq",
          value1: org_id
        });
        viewModel.get("gxyUserOrg_UserName").setFilter(myFilter);
        promise.resolve();
      } else if (isareaAdmin) {
        cb.rest.invokeFunction(
          "GT3AT33.utils.OrgAuthByOrgId",
          { org_id: org_id }, //根据使用组织查询该区域管理员的组织权限
          function (err, res) {
            if (err !== null || res.arr.length == 0) {
              //如果报错，强行根据使用组织来过滤用户，不然会展示全部
              var myFilter = { isExtend: true, simpleVOs: [] };
              myFilter.simpleVOs.push({
                field: "ManageOrg",
                op: "eq",
                value1: org_id
              });
              viewModel.get("gxyUserOrg_UserName").setFilter(myFilter);
              promise.resolve();
            }
            res.arr.push(org_id);
            var myFilter = { isExtend: true, simpleVOs: [] };
            myFilter.simpleVOs.push({
              field: "ManageOrg",
              op: "in",
              value1: res.arr
            });
            viewModel.get("gxyUserOrg_UserName").setFilter(myFilter);
            promise.resolve();
          }
        );
      }
    }
    return promise;
  });
viewModel.get("test_OrderServiceUseOrg_test_GxyService_name") &&
  viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").on("beforeBrowse", function (data) {
    // 可用服务项目--参照弹窗打开前
    let promise = new cb.promise();
    let org_id = viewModel.get("org_id").getValue(); //使用组织ID
    let isGXY = viewModel.get("item1326fg").getValue();
    if (!isGXY) {
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "UseOrg",
        op: "eq",
        value1: org_id
      });
      myFilter.simpleVOs.push({
        field: "charge",
        op: "eq",
        value1: "1"
      });
      myFilter.simpleVOs.push({
        field: "CloseFlag",
        op: "eq",
        value1: "0"
      });
      viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setFilter(myFilter);
    }
  });
viewModel.get("test_GxyRole_name") &&
  viewModel.get("test_GxyRole_name").on("beforeBrowse", function (data) {
    // 授权角色--参照弹窗打开前
    let promise = new cb.promise();
    let test_GxyService = viewModel.get("test_GxyService").getValue();
    cb.rest.invokeFunction("GT3AT33.role.canUseRole", { test_GxyService: test_GxyService }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询免费服务时报错" + JSON.stringify(err), "error");
      }
      let roleArr = res.roleArr;
      if (roleArr.length == 0) {
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          //如果没有查询到内容，说明用户没有选择服务。这时候，一个角色也不展示。
          field: "id",
          op: "in",
          value1: "roleArr002500351654165151dsgjkiojdsgpsadoigjrpdakgjsdpiok"
        });
        viewModel.get("test_GxyRole_name").setFilter(myFilter);
        cb.utils.alert("请先选择服务", "success");
        promise.resolve();
      }
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "id",
        op: "in",
        value1: roleArr
      });
      viewModel.get("test_GxyRole_name").setFilter(myFilter);
      promise.resolve();
    });
    return promise;
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    // 使用组织--参照弹窗打开前
    let isGXY = viewModel.get("item1326fg").getValue();
    if (!isGXY) {
      let AreaAdmin = viewModel.get("item1241kd").getValue(); //管理区域组织
      let OrgAdmin = viewModel.get("item1318td").getValue(); //管理组织
      var condition = [];
      if (!cb.utils.isEmpty(AreaAdmin) && cb.utils.isEmpty(OrgAdmin)) {
        condition = JSON.parse(AreaAdmin);
      } else if (cb.utils.isEmpty(AreaAdmin) && !cb.utils.isEmpty(OrgAdmin)) {
        condition = JSON.parse(OrgAdmin);
      } else if (!cb.utils.isEmpty(AreaAdmin) && !cb.utils.isEmpty(OrgAdmin)) {
        condition = JSON.parse(AreaAdmin);
        let OrgAdminArr = JSON.parse(OrgAdmin);
        for (let i = 0; i < OrgAdminArr.length; i++) {
          condition.push(OrgAdminArr[i]);
        }
      }
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "id",
        op: "in",
        value1: condition
      });
      viewModel.get("org_id_name").setTreeFilter(myFilter);
    }
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 使用组织--值改变后
    console.log("使用组织--值改变后", JSON.stringify(data));
  });
viewModel.get("item2187bj_name") &&
  viewModel.get("item2187bj_name").on("beforeBrowse", function (data) {
    // 组织管理员用户组织--参照弹窗打开前
    let promise = new cb.promise();
    let item2121mb = viewModel.get("item2121mb").getValue(); //授权组织
    cb.rest.invokeFunction("GT3AT33.utils.OrgAuthByOrgId", { org_id: item2121mb }, function (err, res) {
      if (err !== null) {
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          field: "id",
          op: "eq",
          value1: item2121mb
        });
        viewModel.get("item2187bj_name").setTreeFilter(myFilter);
        promise.resolve();
      } else {
        res.arr.push(item2121mb);
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          field: "id",
          op: "in",
          value1: res.arr
        });
        viewModel.get("item2187bj_name").setTreeFilter(myFilter);
        promise.resolve();
      }
    });
    return promise;
  });
viewModel.get("item1986ve_name") &&
  viewModel.get("item1986ve_name").on("afterValueChange", function (data) {
    // 授权组织--值改变后
  });
viewModel.get("item1986ve_name") &&
  viewModel.get("item1986ve_name").on("beforeValueChange", function (data) {
    // 授权组织--值改变前
    let item2607ch = viewModel.get("item2607ch").getValue();
    if (item2607ch !== "0") {
      viewModel.get("AuthType").setValue("0");
      viewModel.get("item1862xc").clear();
      viewModel.get("item1925fe").clear();
      viewModel.get("item2051dd").clear();
      viewModel.get("item1925fe_StaffNew_name").clear(); //客户管理员
      viewModel.get("item1925fe_StaffNew_name").clear(); //客户管理员
      viewModel.get("item2051dd_name").clear(); //客户组织
    }
    viewModel.get("item2607ch").setValue("1");
  });
viewModel.get("AuthType") &&
  viewModel.get("AuthType").on("afterValueChange", function (data) {
    // 授权角色类型--值改变后
    let value = data.value.value;
    if (value == "1") {
      viewModel.execute("updateViewMeta", { code: "form62ja", visible: false }); //运营商/行业区域管理信息
      viewModel.execute("updateViewMeta", { code: "form52hf", visible: false }); //云科技管理信息
      viewModel.get("item1986ve_name").setState("bIsNull", true);
      viewModel.get("item2051dd_name").setState("bIsNull", true);
      viewModel.get("item1925fe_UserName").setState("bIsNull", true);
      viewModel.get("item1862xc_name").setState("bIsNull", true);
      viewModel.get("item2121mb_name").setState("bIsNull", true);
      viewModel.get("item2187bj_name").setState("bIsNull", true);
      viewModel.get("item2331kg_UserName").setState("bIsNull", true);
      viewModel.get("item2257gh_name").setState("bIsNull", true);
      viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: true }); //使用组织
      viewModel.execute("updateViewMeta", { code: "form26bg", visible: true }); //服务项目
      viewModel.execute("updateViewMeta", { code: "form7xg", visible: true }); //授权设置
      viewModel.execute("updateViewMeta", { code: "form128aa", visible: true }); //授权期限/角色有效期
      viewModel.get("endDate").setState("bIsNull", false); //权限结束时间
      viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setState("bIsNull", false); //服务项目
      viewModel.get("beginDate").setState("bIsNull", false); //权限开始时间
      let item2586rb = viewModel.get("item2586rb").getValue(); //创建人主任职ID
      let item = viewModel.get("org_id_name"); //设置使用组织
      cb.utils.triggerReferBrowse(item, [{ field: "staff_org_id", op: "eq", value1: item2586rb }]);
      viewModel.get("test_GxyRole_name").clear();
      viewModel.get("gxyUserOrg_UserName").clear();
      viewModel.get("endDate").clear();
    } else if (value == "0") {
      //将业务类角色的必填项改为非必填项
      viewModel.get("endDate").setState("bIsNull", true); //权限结束时间
      viewModel.get("test_OrderServiceUseOrg_test_GxyService_name").setState("bIsNull", true); //服务项目
      viewModel.get("beginDate").setState("bIsNull", true); //权限开始时间
      let item1335rf = viewModel.get("item1335rf").getValue(); //云科技运维管理员
      let item1421ei = viewModel.get("item1421ei").getValue(); //行业区域运维管理员
      let item1508hf = viewModel.get("item1508hf").getValue(); //运营商运维管理员
      let item1596ef = viewModel.get("item1596ef").getValue(); //组织运维管理员
      let item2586rb = viewModel.get("item2586rb").getValue(); //创建人主任职ID
      if (item1335rf !== "0" && !cb.utils.isEmpty(item1335rf)) {
        //如果是云科技运维管理员，授权组织为供销云科技
        let item = viewModel.get("item1986ve_name");
        cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: 2482145385959680 }]);
        item = viewModel.get("item2121mb_StaffNew");
        cb.utils.triggerReferBrowse(item, [{ field: "staff_org_id", op: "eq", value1: 2482145385959680 }]);
        viewModel.execute("updateViewMeta", { code: "form62ja", visible: false }); //运营商/行业区域管理信息
        viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: false }); //使用组织
        viewModel.execute("updateViewMeta", { code: "form26bg", visible: false }); //服务项目
        viewModel.execute("updateViewMeta", { code: "form7xg", visible: false }); //授权设置
        viewModel.execute("updateViewMeta", { code: "form128aa", visible: false }); //授权期限/角色有效期
        viewModel.execute("updateViewMeta", { code: "form52hf", visible: true }); //云科技管理信息
        viewModel.get("item1986ve_name").setState("bIsNull", false);
        viewModel.get("item2051dd_name").setState("bIsNull", false);
        viewModel.get("item1925fe_UserName").setState("bIsNull", false);
        viewModel.get("item1862xc_name").setState("bIsNull", false);
      } else if (item1421ei !== 0 || item1508hf !== 0) {
        //如果是行业区域运维管理员 或者 运营商运维管理员，授权组织当前用户员工主任职
        let item = viewModel.get("item2121mb_StaffNew"); //授权组织
        cb.utils.triggerReferBrowse(item, [{ field: "staff_org_id", op: "eq", value1: item2586rb }]);
        viewModel.execute("updateViewMeta", { code: "form52hf", visible: false }); //云科技管理信息
        viewModel.execute("updateViewMeta", { code: "99bda0997705464e9fb36ec439b3afe5", visible: false }); //使用组织
        viewModel.execute("updateViewMeta", { code: "form26bg", visible: false }); //服务项目
        viewModel.execute("updateViewMeta", { code: "form7xg", visible: false }); //授权设置
        viewModel.execute("updateViewMeta", { code: "form128aa", visible: false }); //授权期限/角色有效期
        viewModel.execute("updateViewMeta", { code: "form62ja", visible: true }); //运营商/行业区域管理信息
        viewModel.get("item2121mb_name").setState("bIsNull", false);
        viewModel.get("item2187bj_name").setState("bIsNull", false);
        viewModel.get("item2331kg_UserName").setState("bIsNull", false);
        viewModel.get("item2257gh_name").setState("bIsNull", false);
      } else if (item1596ef !== 0) {
        //如果是组织运维管理员，只能授权业务类角色
        let item = viewModel.get("org_id_name");
        cb.utils.triggerReferBrowse(item, [{ field: "staff_org_id", op: "eq", value1: item2586rb }]);
      }
    }
  });
viewModel.get("item2738nb") &&
  viewModel.get("item2738nb").on("afterValueChange", function (data) {
    // 现有管理员--值改变后
    let value = data.value; //现有管理员名字
    if (!cb.utils.isEmpty(value)) {
      cb.utils.alert("您选择的组织存在启用中的管理员，名称：" + value, "error");
      viewModel.get("item2051dd_name").clear(); //组织
      viewModel.get("item2396hd").clear();
      viewModel.get("item1925fe_StaffNew_name").clear(); //用户
      viewModel.get("item1925fe").clear();
    }
  });
viewModel.get("item2676rj") &&
  viewModel.get("item2676rj").on("afterValueChange", function (data) {
    // 现有管理员--值改变后
    let value = data.value; //现有管理员名字
    if (!cb.utils.isEmpty(value)) {
      cb.utils.alert("您选择的组织存在启用中的管理员，名称：" + value, "error");
      viewModel.get("item2187bj_name").clear(); //组织
      viewModel.get("item2528ef").clear();
      viewModel.get("item2331kg_name").clear(); //用户
      viewModel.get("item2331kg").clear();
    }
  });
viewModel.get("item2121mb_sysManagerOrg_name") &&
  viewModel.get("item2121mb_sysManagerOrg_name").on("beforeBrowse", function (data) {
    // 授权组织--参照弹窗打开前
  });
viewModel.get("item2121mb_sysManagerOrg_name") &&
  viewModel.get("item2121mb_sysManagerOrg_name").on("afterValueChange", function (data) {
    // 授权组织--值改变后
  });
viewModel.get("item2121mb_sysManagerOrg_name") &&
  viewModel.get("item2121mb_sysManagerOrg_name").on("beforeValueChange", function (data) {
    // 授权组织--值改变前
    let item2607ch = viewModel.get("item2607ch").getValue();
    if (item2607ch !== "0") {
      viewModel.get("AuthType").setValue("0");
      viewModel.get("item2528ef").clear();
      viewModel.get("item2331kg").clear();
      viewModel.get("item2257gh").clear();
      viewModel.get("item2187bj_name").clear(); //组织管理员用户组织
      viewModel.get("item2331kg_name").clear(); //组织管理员名称
      viewModel.get("item2257gh_name").clear(); //授权角色
    }
    viewModel.get("item2607ch").setValue("1");
  });
viewModel.get("item1925fe_UserName") &&
  viewModel.get("item1925fe_UserName").on("afterValueChange", function (data) {
    // 客户管理员--值改变后
    let value = data.value;
    let oldValue = data.oldValue;
    if (value == null) {
      viewModel.get("gxyUserOrg_UserName").clear();
    }
  });
viewModel.get("item2257gh_name") &&
  viewModel.get("item2257gh_name").on("afterValueChange", function (data) {
    // 授权角色--值改变后
    let item2858fc = viewModel.get("item2858fc").getValue();
    if (item2858fc !== "0" && item2858fc !== undefined) {
      let value = data.value;
      let oldValue = data.oldValue;
      if (value == null) {
        viewModel.get("test_GxyRole_name").clear();
      } else {
        let item = viewModel.get("test_GxyRole_name");
        cb.utils.triggerReferBrowse(item, [{ field: "id", op: "eq", value1: value.id }]);
      }
    }
    viewModel.get("item2858fc").setValue("1");
  });
viewModel.get("item1862xc_name") &&
  viewModel.get("item1862xc_name").on("afterValueChange", function (data) {
    // 授权角色--值改变后
    let item2858fc = viewModel.get("item2858fc").getValue();
    if (item2858fc !== "0" && item2858fc !== undefined) {
      let value = data.value;
      let oldValue = data.oldValue;
      if (value == null) {
        viewModel.get("test_GxyRole_name").clear();
      }
    }
    viewModel.get("item2858fc").setValue("1");
  });
viewModel.get("item2331kg_UserName") &&
  viewModel.get("item2331kg_UserName").on("afterValueChange", function (data) {
    // 组织管理员名称--值改变后
    let value = data.value;
    let oldValue = data.oldValue;
    if (value == null) {
      viewModel.get("gxyUserOrg_UserName").clear();
    }
  });
viewModel.get("item1862xc_name") &&
  viewModel.get("item1862xc_name").on("beforeBrowse", function (data) {
    // 授权角色--参照弹窗打开前
    let roleArr = ["MULTI101", "MULTI301", "MULTI201"];
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "code",
      op: "in",
      value1: roleArr
    });
    viewModel.get("item1862xc_name").setFilter(myFilter);
  });
viewModel.get("gxyUserOrg_UserName") &&
  viewModel.get("gxyUserOrg_UserName").on("afterValueChange", function (data) {
    // 用户名称--值改变后
  });
viewModel.get("item2331kg_UserName") &&
  viewModel.get("item2331kg_UserName").on("beforeBrowse", function (data) {
    // 组织管理员名称--参照弹窗打开前
    let item2187bj_name = viewModel.get("item2187bj_name").getValue();
    if (cb.utils.isEmpty(item2187bj_name)) {
      cb.utils.alert("请先选择管理员所在组织！", "success");
      return false;
    }
  });
viewModel.get("test_org_userrole_1547955004463120392") &&
  viewModel.get("test_org_userrole_1547955004463120392").on("nextPage", function (data) {
    // 卡片组--下一步
  });