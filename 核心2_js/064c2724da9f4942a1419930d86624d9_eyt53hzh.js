run = function (event) {
  var viewModel = this;
  viewModel.on("afterMount", function () {
    let wkwTestId = viewModel.get("id").getValue();
    console.log("id>>>>>>>>>>>>>>>>" + wkwTestId);
  });
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  let updateProLics = function (materialId, isBatchManage, isExpiryDateManage, expireDateNo, expireDateUnit) {
    return new Promise((resolve, reject) => {
      invokeFunction1(
        "GT22176AT10.sygl.updateProLics",
        { materialId: materialId, isBatchManage: isBatchManage, isExpiryDateManage: isExpiryDateManage, expireDateNo: expireDateNo, expireDateUnit: expireDateUnit },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  let gspInfoGridModel = viewModel.getGridModel("sy01_gsp_infosList");
  viewModel.get("button37ud").on("click", function (data) {
    gspInfoGridModel.appendRow({});
  });
  viewModel.get("button32ki").on("click", function (data) {
    let indexArr = gspInfoGridModel.getSelectedRowIndexes();
    gspInfoGridModel.deleteRows(indexArr);
  });
  viewModel.on("afterMount", function () {
    viewModel.on("beforeAttachment", function (params) {
      if (params.childrenField != undefined && params.childrenField == "SY01_wl_cpzzList") {
        params.objectName = "mdf";
      }
    });
  });
  viewModel.on("modeChange", function (data) {
    if (data == "edit") {
      let extendSyzt = viewModel.get("extend_syzt").getValue();
      //首营状态:extendSyzt == 1  已审批
      if (extendSyzt == 1 || extendSyzt == "1") {
        let extend_tym = viewModel.get("extend_tym"); //通用名
        extend_tym.setState("bCanModify", false);
        let extend_pzwh = viewModel.get("extend_pzwh"); //批准文号
        extend_pzwh.setState("bCanModify", false);
        let extend_yhlb_curingTypeName = viewModel.get("extend_yhlb_curingTypeName"); //养护类别名称
        extend_yhlb_curingTypeName.setState("bCanModify", false);
        let extend_cctj_storageName = viewModel.get("extend_cctj_storageName"); //存储条件名称
        extend_cctj_storageName.setState("bCanModify", false);
        let extend_jxqlb_nearName = viewModel.get("extend_jxqlb_nearName"); //近效期类别名称
        extend_jxqlb_nearName.setState("bCanModify", false);
        let extend_bc_packing_name = viewModel.get("extend_bc_packing_name"); //包材名称
        extend_bc_packing_name.setState("bCanModify", false);
        let extend_jx_dosagaFormName = viewModel.get("extend_jx_dosagaFormName"); //剂型名称
        extend_jx_dosagaFormName.setState("bCanModify", false);
        let extend_ssxkcyr_ip_name = viewModel.get("extend_ssxkcyr_ip_name"); //上市许可持有人名称
        extend_ssxkcyr_ip_name.setState("bCanModify", false);
        let extend_gsp_spfl_catagoryname = viewModel.get("extend_gsp_spfl_catagoryname"); //GSP商品分类名称
        extend_gsp_spfl_catagoryname.setState("bCanModify", false);
        let extend_cffl = viewModel.get("extend_cffl"); //处方分类
        extend_cffl.setState("bCanModify", false);
        let extend_zlbz = viewModel.get("extend_zlbz"); //质量标准
        extend_zlbz.setState("bCanModify", false);
        let extend_standard_code = viewModel.get("extend_standard_code"); //本位码
        extend_standard_code.setState("bCanModify", false);
        let extend_imregisterlicenseNo = viewModel.get("extend_imregisterlicenseNo"); //进口药品注册号
        extend_imregisterlicenseNo.setState("bCanModify", false);
        let extend_spqk = viewModel.get("extend_spqk"); //商品性能、质量、用途、疗效情况
        extend_spqk.setState("bCanModify", false);
        let extend_ypbcsqpj = viewModel.get("extend_ypbcsqpj"); //药品补充申请批件
        extend_ypbcsqpj.setState("bCanModify", false);
        let extend_spjxzcpj = viewModel.get("extend_spjxzcpj"); //商品/器械注册批件
        extend_spjxzcpj.setState("bCanModify", false);
        let extend_swqfhgz = viewModel.get("extend_swqfhgz"); //生物签发合格证
        extend_swqfhgz.setState("bCanModify", false);
        let extend_sms = viewModel.get("extend_sms"); //说明书
        extend_sms.setState("bCanModify", false);
        let extend_spqxzzcpj = viewModel.get("extend_spqxzzcpj"); //商品/器械再注册批件
        extend_spqxzzcpj.setState("bCanModify", false);
        let extend_jkxkz = viewModel.get("extend_jkxkz"); //进口许可证
        extend_jkxkz.setState("bCanModify", false);
        let extend_jkycpj = viewModel.get("extend_jkycpj"); //进口药材批件
        extend_jkycpj.setState("bCanModify", false);
        let extend_ypbz = viewModel.get("extend_ypbz"); //药品包装
        extend_ypbz.setState("bCanModify", false);
        let extend_jkswzpjybgs = viewModel.get("extend_jkswzpjybgs"); //进口生物制品检验报告书
        extend_jkswzpjybgs.setState("bCanModify", false);
        let extend_jkypzczyy = viewModel.get("extend_jkypzczyy"); //进口药品注册证/医药产品注册证/进口药品批件
        extend_jkypzczyy.setState("bCanModify", false);
        let extend_jkyptgz = viewModel.get("extend_jkyptgz"); //进口药品通关证/进口药品报告书
        extend_jkyptgz.setState("bCanModify", false);
        let extend_jkyp = viewModel.get("extend_jkyp"); //进口药品
        extend_jkyp.setState("bCanModify", false);
        let extend_llyp = viewModel.get("extend_llyp"); //冷链药品
        extend_llyp.setState("bCanModify", false);
        let extend_zsj = viewModel.get("extend_zsj"); //注射剂
        extend_zsj.setState("bCanModify", false);
        let extend_tsyp = viewModel.get("extend_tsyp"); //特殊药品
        extend_tsyp.setState("bCanModify", false);
        let extend_kzlyp = viewModel.get("extend_kzlyp"); //抗肿瘤药
        extend_kzlyp.setState("bCanModify", false);
        let extend_kss = viewModel.get("extend_kss"); //抗肿瘤
        extend_kss.setState("bCanModify", false);
        let extend_pcfdxs = viewModel.get("extend_pcfdxs"); //凭处方单销售
        extend_pcfdxs.setState("bCanModify", false);
        let extend_srfh = viewModel.get("extend_srfh"); //双人复核
        extend_srfh.setState("bCanModify", false);
        let extend_hmhj = viewModel.get("extend_hmhj"); //含麻黄碱
        extend_hmhj.setState("bCanModify", false);
      }
    }
  });
  viewModel.on("afterLoadData", function (data) {
    let extend_is_gspModel = viewModel.get("extend_is_gsp").getValue();
    let extend_syzt = viewModel.get("extend_syzt").getValue();
    if (extend_is_gspModel === true || extend_is_gspModel === 1 || extend_is_gspModel === "true" || extend_is_gspModel === "1") {
      viewModel.execute("updateViewMeta", {
        code: "group187tf", // 容器的编码（从UI设计器属性栏查看）
        visible: true
      });
      viewModel.execute("updateViewMeta", {
        code: "group176kj", // 容器的编码（从UI设计器属性栏查看）
        visible: true
      });
    } else if (extend_is_gspModel == false || extend_is_gspModel === 0 || extend_is_gspModel == "false" || extend_is_gspModel === "0") {
      viewModel.execute("updateViewMeta", {
        code: "group187tf", // 容器的编码（从UI设计器属性栏查看）
        visible: false
      });
      viewModel.execute("updateViewMeta", {
        code: "group176kj", // 容器的编码（从UI设计器属性栏查看）
        visible: false
      });
    }
  });
  viewModel.get("extend_is_gsp").on("afterValueChange", function (data) {
    let extend_is_gspModel = viewModel.get("extend_is_gsp").getValue();
    if (extend_is_gspModel === true || extend_is_gspModel === 1 || extend_is_gspModel === "true" || extend_is_gspModel === "1") {
      viewModel.execute("updateViewMeta", {
        code: "group187tf", // 容器的编码（从UI设计器属性栏查看）
        visible: true
      });
      viewModel.execute("updateViewMeta", {
        code: "group176kj", // 容器的编码（从UI设计器属性栏查看）
        visible: true
      });
    } else if (extend_is_gspModel == false || extend_is_gspModel === 0 || extend_is_gspModel == "false" || extend_is_gspModel === "0") {
      viewModel.execute("updateViewMeta", {
        code: "group187tf", // 容器的编码（从UI设计器属性栏查看）
        visible: false
      });
      viewModel.execute("updateViewMeta", {
        code: "group176kj", // 容器的编码（从UI设计器属性栏查看）
        visible: false
      });
    }
  });
  viewModel.on("modeChange", function (data) {
    if (data == "add") {
      let extend_tym = viewModel.get("extend_tym"); //通用名
      let extend_pzwh = viewModel.get("extend_pzwh"); //批准文号
      let extend_yhlb = viewModel.get("extend_yhlb"); //养护类别
      let extend_yhlb_curingTypeName = viewModel.get("extend_yhlb_curingTypeName"); //养护类别名称
      let extend_cctj = viewModel.get("extend_cctj"); //存储条件
      let extend_cctj_storageName = viewModel.get("extend_cctj_storageName"); //存储条件名称
      let extend_jxqlb = viewModel.get("extend_jxqlb"); //近效期类别
      let extend_jxqlb_nearName = viewModel.get("extend_jxqlb_nearName"); //近效期类别名称
      let extend_bc = viewModel.get("extend_bc"); //包材
      let extend_bc_packing_name = viewModel.get("extend_bc_packing_name"); //包材名称
      let extend_jx = viewModel.get("extend_jx"); //剂型
      let extend_jx_dosagaFormName = viewModel.get("extend_jx_dosagaFormName"); //剂型名称
      let extend_ssxkcyr = viewModel.get("extend_ssxkcyr"); //上市许可持有人
      let extend_ssxkcyr_ip_name = viewModel.get("extend_ssxkcyr_ip_name"); //上市许可持有人名称
      let extend_gsp_spfl = viewModel.get("extend_gsp_spfl"); //GSP商品分类
      let extend_gsp_spfl_catagoryname = viewModel.get("extend_gsp_spfl_catagoryname"); //GSP商品分类名称
      let extend_sysqry = viewModel.get("extend_sysqry"); //首营申请人员
      let extend_sysqry_name = viewModel.get("extend_sysqry_name"); //首营申请人员名称
      let extend_applydep = viewModel.get("extend_applydep"); //首营申请部门
      let extend_applydep_name = viewModel.get("extend_applydep_name"); //首营申请部门
      let extend_syrq_date = viewModel.get("extend_syrq_date"); //首营日期
      let extend_cffl = viewModel.get("extend_cffl"); //处方分类
      let extend_sydh = viewModel.get("extend_sydh"); //首营单号
      let extend__sydh_change = viewModel.get("extend__sydh_change"); //首营变更单号
      let extend_zlbz = viewModel.get("extend_zlbz"); //质量标准
      let extend_standard_code = viewModel.get("extend_standard_code"); //本位码
      let extend_imregisterlicenseNo = viewModel.get("extend_imregisterlicenseNo"); //进口药品注册号
      let extend_spqk = viewModel.get("extend_spqk"); //商品性能、质量、用途、疗效情况
      extend_tym.clear(); //通用名
      extend_pzwh.clear(); //批准文号
      extend_yhlb.clear(); //养护类别
      extend_yhlb_curingTypeName.clear(); //养护类别名称
      extend_cctj.clear(); //存储条件
      extend_cctj_storageName.clear(); //存储条件名称
      extend_jxqlb.clear(); //近效期类别
      extend_jxqlb_nearName.clear(); //近效期类别名称
      extend_bc.clear(); //包材
      extend_bc_packing_name.clear(); //包材名称
      extend_jx.clear(); //剂型
      extend_jx_dosagaFormName.clear(); //剂型名称
      extend_ssxkcyr.clear(); //上市许可持有人
      extend_ssxkcyr_ip_name.clear(); //上市许可持有人名称
      extend_cctj.clear(); //GSP商品分类
      extend_gsp_spfl_catagoryname.clear(); //GSP商品分类名称
      extend_sysqry.clear(); //首营申请人员
      extend_sysqry_name.clear(); //首营申请人员名称
      extend_applydep.clear(); //首营申请部门
      extend_applydep_name.clear(); //首营申请部门
      extend_syrq_date.clear(); //首营日期
      extend_cffl.clear(); //处方分类
      extend_pzwh.clear(); //批准文号
      extend_sydh.clear(); //首营单号
      extend__sydh_change.clear(); //首营变更单号
      extend_zlbz.clear(); //质量标准
      extend_standard_code.clear(); //本位码
      extend_imregisterlicenseNo.clear(); //进口药品注册号
      extend_spqk.clear(); //商品性能、质量、用途、疗效情况
      let extend_syzt = viewModel.get("extend_syzt"); //首营状态
      let extend_ypbcsqpj = viewModel.get("extend_ypbcsqpj"); //药品补充申请批件
      let extend_spjxzcpj = viewModel.get("extend_spjxzcpj"); //商品/器械注册批件
      let extend_swqfhgz = viewModel.get("extend_swqfhgz"); //生物签发合格证
      let extend_sms = viewModel.get("extend_sms"); //说明书
      let extend_spqxzzcpj = viewModel.get("extend_spqxzzcpj"); //商品/器械再注册批件
      let extend_jkxkz = viewModel.get("extend_jkxkz"); //进口许可证
      let extend_jkycpj = viewModel.get("extend_jkycpj"); //进口药材批件
      let extend_ypbz = viewModel.get("extend_ypbz"); //药品包装
      let extend_jkswzpjybgs = viewModel.get("extend_jkswzpjybgs"); //进口生物制品检验报告书
      let extend_jkypzczyy = viewModel.get("extend_jkypzczyy"); //进口药品注册证/医药产品注册证/进口药品批件
      let extend_jkyptgz = viewModel.get("extend_jkyptgz"); //进口药品通关证/进口药品报告书
      let extend_jkyp = viewModel.get("extend_jkyp"); //进口药品
      let extend_llyp = viewModel.get("extend_llyp"); //冷链药品
      let extend_zsj = viewModel.get("extend_zsj"); //注射剂
      let extend_tsyp = viewModel.get("extend_tsyp"); //特殊药品
      let extend_kzlyp = viewModel.get("extend_kzlyp"); //抗肿瘤药
      let extend_kss = viewModel.get("extend_kss"); //抗肿瘤
      let extend_pcfdxs = viewModel.get("extend_pcfdxs"); //凭处方单销售
      let extend_srfh = viewModel.get("extend_srfh"); //双人复核
      let extend_hmhj = viewModel.get("extend_hmhj"); //含麻黄碱
      let extendSyzt = 2; //首营状态:1.已审批;2.未审批
      let boo = false; //Boolean值:true;false
      extend_syzt.setValue(extendSyzt); //首营状态
      extend_ypbcsqpj.setValue(boo); //药品补充申请批件
      extend_spjxzcpj.setValue(boo); //商品/器械注册批件
      extend_swqfhgz.setValue(boo); //生物签发合格证
      extend_sms.setValue(boo); //说明书
      extend_spqxzzcpj.setValue(boo); //商品/器械再注册批件
      extend_jkxkz.setValue(boo); //进口许可证
      extend_jkycpj.setValue(boo); //进口药材批件
      extend_ypbz.setValue(boo); //药品包装
      extend_jkswzpjybgs.setValue(boo); //进口生物制品检验报告书
      extend_jkypzczyy.setValue(boo); //进口药品注册证/医药产品注册证/进口药品批件
      extend_jkyptgz.setValue(boo); //进口药品通关证/进口药品报告书
      extend_jkyp.setValue(boo); //进口药品
      extend_llyp.setValue(boo); //冷链药品
      extend_zsj.setValue(boo); //注射剂
      extend_tsyp.setValue(boo); //特殊药品
      extend_kzlyp.setValue(boo); //抗肿瘤药
      extend_kss.setValue(boo); //抗肿瘤
      extend_pcfdxs.setValue(boo); //凭处方单销售
      extend_srfh.setValue(boo); //双人复核
      extend_hmhj.setValue(boo); //含麻黄碱
    }
  });
  viewModel.get("extend_cctj_storageName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "org_id",
        op: "eq",
        value1: orgId
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    );
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.get("extend_jxqlb_nearName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "org_id",
        op: "eq",
        value1: orgId
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    );
    //设置过滤条件
    this.setFilter(condition);
  });
  //包材没有主组织
  viewModel.get("extend_bc_packing_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "enable",
      op: "eq",
      value1: 1
    });
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.get("extend_jx_dosagaFormName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "org_id",
        op: "eq",
        value1: orgId
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    );
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.get("extend_ssxkcyr_ip_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "org_id",
        op: "eq",
        value1: orgId
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    );
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.get("extend_gsp_spfl_catagoryname").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("orgId").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "org_id",
        op: "eq",
        value1: orgId
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    );
    //设置过滤条件
    this.setFilter(condition);
  });
  viewModel.on("beforeSave", function () {
    let currentState = viewModel.getParams().mode;
    if (currentState != "add") {
      let materialId = viewModel.get("id").getValue();
      let isBatchManage = viewModel.get("detail!isBatchManage").getValue();
      let isExpiryDateManage = viewModel.get("detail!isExpiryDateManage").getValue();
      let expireDateNo = viewModel.get("detail!expireDateNo").getValue();
      let expireDateUnit = viewModel.get("detail!expireDateUnit").getValue();
      let returnPromise = new cb.promise();
      updateProLics(materialId, isBatchManage, isExpiryDateManage, expireDateNo, expireDateUnit).then(
        (res) => {
          returnPromise.resolve();
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
        }
      );
      return returnPromise;
    }
  });
};