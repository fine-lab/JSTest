viewModel.on("afterLoadData", function (args) {
  let id = args.id;
  if (args.verifystate == 2) {
    viewModel.get("button44sg").setVisible(true);
  } else {
    viewModel.get("button44sg").setVisible(false);
  }
  if (id) {
  } else {
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.queryCurrentUnit", {}, function (err, res) {
      if (res) {
        debugger;
        //采购组织 pk_org_v_name
        if (res.org && res.org[0]) {
          viewModel.get("pk_org_v").setValue(res.org[0].id);
          viewModel.get("pk_org_v_name").setValue(res.org[0].name);
          viewModel.get("signorg").setValue(res.org[0].id);
          viewModel.get("signorg_name").setValue(res.org[0].name);
          viewModel.get("customerAddress").setValue(res.org[0].address);
          viewModel.get("customerTel").setValue(res.org[0].telephone);
        }
        //采购部门 depid_name
        if (res.dept && res.dept[0]) {
          viewModel.get("depid").setValue(res.dept[0].id);
          viewModel.get("depid_name").setValue(res.dept[0].name);
          viewModel.get("jiafangjingbanbumen").setValue(res.dept[0].id);
          viewModel.get("jiafangjingbanbumen_name").setValue(res.dept[0].name);
        }
        // 采购人员
        if (res.user) {
          viewModel.get("personnelid").setValue(res.user.staffId);
          viewModel.get("personnelid_name").setValue(res.user.name);
          viewModel.get("customerjbren").setValue(res.user.staffId);
          viewModel.get("customerjbren_name").setValue(res.user.name);
        }
        if (res.bank && res.bank[0]) {
          viewModel.get("bankaccbas_name").setValue(res.bank[0].acctName);
          viewModel.get("bankaccbas").setValue(res.bank[0].id);
          viewModel.get("customerBankaccbas").setValue(res.bank[0].id);
        }
        if (res.bankkai && res.bankkai[0]) {
          viewModel.get("customerBankaccbas_bankNumber_name").setValue(res.bankkai[0].name);
        }
      }
    });
  }
  var referModel = viewModel.get("cprojectid_name");
});
viewModel.get("button44sg") &&
  viewModel.get("button44sg").on("click", function (data) {
    // 盖章--单击
    debugger;
    const bill = viewModel.getAllData();
    let subscribedate = bill.subscribedate;
    if (undefined == subscribedate) {
      debugger;
      var mode = viewModel.getParams().mode;
      if (mode !== "edit") {
        viewModel.get("subscribedate").setVisible(true);
        viewModel.get("subscribedate").setState("bCanModify", true);
        viewModel.get("subscribedate").setState("bIsNull", false);
        viewModel.get("cghtgzwj").setVisible(true);
        viewModel.get("cghtgzwj").setState("bCanModify", true);
        viewModel.get("cghtgzwj").setState("bIsNull", false);
        viewModel.get("org_id_name").setState("bCanModify", false);
        viewModel.get("pk_org_v_name").setState("bCanModify", false);
        viewModel.get("depid_name").setState("bCanModify", false);
        viewModel.get("personnelid_name").setState("bCanModify", false);
        viewModel.get("code").setState("bCanModify", false);
        viewModel.get("ctname").setState("bCanModify", false);
        viewModel.get("vdef13_name").setState("bCanModify", false);
        viewModel.get("cprojectid_name").setState("bCanModify", false);
        viewModel.get("dbilldate").setState("bCanModify", false);
        viewModel.get("ctamount").setState("bCanModify", false);
        viewModel.get("valdate").setState("bCanModify", false);
        viewModel.get("invallidate").setState("bCanModify", false);
        viewModel.get("openct").setState("bCanModify", false);
        viewModel.get("earlysign").setState("bCanModify", false);
        viewModel.get("ba_boolean").setState("bCanModify", false);
        viewModel.get("headQuartersRes").setState("bCanModify", false);
        viewModel.get("vdef5_code").setState("bCanModify", false);
        viewModel.get("jieyongdanwei_name").setState("bCanModify", false);
        viewModel.get("vdef4").setState("bCanModify", false);
        viewModel.get("vdef1").setState("bCanModify", false);
        viewModel.get("vdef2").setState("bCanModify", false);
        viewModel.get("vdef3").setState("bCanModify", false);
        viewModel.get("verifystate").setState("bCanModify", false);
        viewModel.get("shifubeian").setState("bCanModify", false);
        viewModel.get("vdef20").setState("bCanModify", false);
        viewModel.get("signorg_name").setState("bCanModify", false);
        viewModel.get("customerAddress").setState("bCanModify", false);
        viewModel.get("bankaccbas_name").setState("bCanModify", false);
        viewModel.get("customerEmail").setState("bCanModify", false);
        viewModel.get("customerTel").setState("bCanModify", false);
        viewModel.get("jiafangjingbanbumen_name").setState("bCanModify", false);
        viewModel.get("customerjbren_name").setState("bCanModify", false);
        viewModel.get("cvendorid_name").setState("bCanModify", false);
        viewModel.get("partyAddress").setState("bCanModify", false);
        viewModel.get("gongyingshangyinzhanghu_account").setState("bCanModify", false);
        viewModel.get("partyTel").setState("bCanModify", false);
        viewModel.get("partyjb").setState("bCanModify", false);
        viewModel.get("department").setState("bCanModify", false);
        viewModel.get("htwbsc").setState("bCanModify", false);
        viewModel.get("dfhtmb").setState("bCanModify", false);
        viewModel.get("xgfj").setState("bCanModify", false);
        viewModel.get("pk_fct_ap_b_ad_pu1List").setState("bCanModify", false);
        viewModel.get("pk_fct_ap_memora_ad_pu1List").setState("bCanModify", false);
        viewModel.get("pk_fct_ap_plan_ad_pu1List").setState("bCanModify", false);
        viewModel.get("pk_fct_ap_term_ad_pu1List").setState("bCanModify", false);
        viewModel.biz.do("edit", viewModel);
      }
    } else {
      bill.verifystate = bill.verifystate + "";
      bill.corigcurrencyid_code = "CNY";
      bill.ccurrencyid = "CNY";
      bill.ntotalorigmny = bill.ctamount;
      bill.vdef2 = bill.vdef2 + "";
      bill.vdef3 = bill.vdef3 + "";
      debugger;
      bill.dbilldate = bill.dbilldate;
      if (bill.headQuartersRes == "N") {
        bill.vdef10 = "1";
      } else {
        bill.vdef10 = "0";
      }
      //内部合同
      bill.vdef14 = bill.nabuhetong_code;
      if (bill.vdef6) {
        bill.vdef6 = "Y";
      } else {
        bill.vdef6 = "N";
      }
      if (bill.openct == 1) {
        bill.openctbip = "Y";
      } else {
        bill.openctbip = "N";
      }
      if (bill.earlysign == 1) {
        bill.earlysignbip = "Y";
      } else {
        bill.earlysignbip = "N";
      }
      const depid_code = bill.depid_code.split("_");
      bill.depid_code = depid_code[0];
      if (undefined == bill.jiafangjingbanbumen_code) {
      } else {
        const partyDept_code = bill.jiafangjingbanbumen_code.split("_");
        bill.partyDept_code = partyDept_code[0];
        //甲方经办部门
        bill.vdef48 = partyDept_code[0];
      }
      bill.approver = bill.zuizhongshenpiren_mobile;
      bill.bankaccount = bill.gongyingshangyinzhanghu_account;
      //合同类型
      const vdef13_code = bill.vdef13_code.split("_");
      bill.vdef13 = vdef13_code[0];
      bill.vdef41 = bill.customerAddress;
      bill.vdef42 = bill.customerEmail;
      bill.vdef43 = bill.customerTel;
      bill.vdef44 = bill.partyAddress;
      bill.vdef45 = bill.partyTel;
      bill.vdef46 = bill.partyjb;
      bill.vdef47 = bill.department;
      //甲方经办人
      bill.vdef30 = bill.customerjbren_code;
      if (bill.bankaccbas_code != undefined) {
        bill.ourbankaccount = bill.bankaccbas_code.split("_")[0];
      }
      //借用资质单位
      if (undefined == bill.jieyongdanwei_code) {
      } else {
        const jieyongdanwei = bill.jieyongdanwei_code.split("_");
        bill.vdef11 = jieyongdanwei[0];
      }
      // 关联销售合同 编码 vdef5
      const xsctcode = bill.vdef5_code;
      bill.vdef5 = xsctcode;
      bill.pk_org = bill.pk_org_v_code;
      bill.pk_fct_ap_b_ad_pu1List.forEach((item) => {
        item.pk_financeorg = bill.pk_org_v_code;
        item.ntaxmny = item.norigtaxmny;
        item.csrcid = item.nccaigoufanganhid;
        item.csrcbid = item.nccaigoufanganbid;
        item.top_billid = item.nccaigoufanganhid;
        item.top_itemid = item.nccaigoufanganbid;
        item.Vsrctype = item.caigoufanganleixing;
        item.cunitid = item.wuliaodanwei_code;
        if ("XCGD" == item.Vsrctype) {
          item.top_billtype = "1001A2100000000CK548";
          item.vsrctype = "1001A2100000000CK548";
        } else {
          item.top_billtype = "FACG";
          item.vsrctype = "FACG";
        }
        Object.keys(item).forEach((itemKey) => {
          if (itemKey.indexOf("code") > 0 && item[itemKey].indexOf("_global") > 0) {
            item[itemKey] = item[itemKey].split("_")[0];
          }
        });
      });
      bill.pk_fct_ap_bList = bill.pk_fct_ap_b_ad_pu1List;
      bill.pk_fct_ap_plan_ad_pu1List.forEach((item) => {
        item.vmemoracode = item.planrate + "";
        item.vmemora = item.begindate + "";
        item.vmemo = item.planmoney + "";
      });
      bill.pk_fct_ap_memoraList = bill.pk_fct_ap_plan_ad_pu1List;
      cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.createNCCApCt", { bill }, function (err, res) {
        debugger;
        if (res.res.res.code == "1000000000") {
          cb.utils.alert(res.res.res.data.message || res.res.res.message, "error");
        } else if (res.res.res.code == "1000000001") {
          cb.utils.alert(res.res.res.message || res.res.res.message, "error");
        }
      });
    }
  });
viewModel.on("customInit", function (data) {
  // 广告及宣传服务采购合同详情--页面初始化
});
function setNtotaltaxmny() {
  const rows = viewModel.get("pk_fct_ap_b_ad_pu1List").getRows();
  let ntotaltaxmny = 0;
  rows.forEach((item) => (ntotaltaxmny += item.norigtaxmny));
  viewModel.get("ctamount").setValue(ntotaltaxmny);
}
viewModel.get("pk_fct_ap_b_ad_pu1List") &&
  viewModel.get("pk_fct_ap_b_ad_pu1List").on("afterCellValueChange", function (data) {
    debugger;
    const row = viewModel.get("pk_fct_ap_b_ad_pu1List").getRow(data.rowIndex);
    viewModel.get("pk_fct_ap_b_ad_pu1List").setCellValue(data.rowIndex, "wuliaodanwei", row.danweizhujian);
    viewModel.get("pk_fct_ap_b_ad_pu1List").setCellValue(data.rowIndex, "wuliaodanwei_name", row.danweimingchen);
    if (data.cellName == "nastnum" || data.cellName == "norigtaxprice" || data.cellName == "shui_name") {
      if (row.nastnum && row.norigtaxprice) {
        const norigtaxmny = row.nastnum * row.norigtaxprice;
        viewModel.get("pk_fct_ap_b_ad_pu1List").setCellValue(data.rowIndex, "norigtaxmny", norigtaxmny);
        const norigmny = Math.round((norigtaxmny / (1 + row.ntaxrate / 100)) * 100) / 100; // 未税金额
        const tax = norigtaxmny - norigmny;
        viewModel.get("pk_fct_ap_b_ad_pu1List").setCellValue(data.rowIndex, "ntax", tax);
        viewModel.get("pk_fct_ap_b_ad_pu1List").setCellValue(data.rowIndex, "norigmny", norigmny);
      }
    }
    setNtotaltaxmny();
  });
viewModel.on("afterSave", function (args) {
  debugger;
  if ("3186309230350593" == args.res.personnelid) {
    //查询表体数量和对应的上游单据主键 调用后台函数
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.querycgfan", { res: args.res.id }, function (err, res) {
      if (res) {
        debugger;
      }
    });
  }
});
debugger;
if (viewModel.get("openct")) {
  let openct = viewModel.get("openct").getValue();
  debugger;
}
viewModel.get("openct") &&
  viewModel.get("openct").on("afterValueChange", function (data) {
    //是否框架合同--值改变后
    if (data.value == true) {
      viewModel.get("pk_fct_ap_b_ad_pu1List").appendRow({ nastnum: 0, norigtaxprice: 0, norigtaxmny: 0, norigmny: 0, ntax: 0 });
      viewModel.get("pk_fct_ap_plan_ad_pu1List").appendRow({ planrate: 100, planmoney: 0 });
      debugger;
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("wuliaodanwei_name", "bIsNull", true); //物料单位
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("wuliao_name", "bIsNull", true); //物料
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("nastnum", "bIsNull", true); //数量
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("norigtaxprice", "bIsNull", true); //含税单价
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("shui_name", "bIsNull", true); //税率
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("norigmny", "bIsNull", true); //不含税金额
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("ntax", "bIsNull", true); //税额
      debugger;
    } else {
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("wuliaodanwei_name", "bIsNull", false); //物料单位
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("wuliao_name", "bIsNull", false); //物料
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("nastnum", "bIsNull", false); //数量
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("norigtaxprice", "bIsNull", false); //含税单价
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("shui_name", "bIsNull", false); //税率
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("norigmny", "bIsNull", false); //不含税金额
      viewModel.get("pk_fct_ap_b_ad_pu1List").setColumnState("ntax", "bIsNull", false); //税额
    }
    debugger;
  });
viewModel.on("beforeSave", function (args) {
  debugger;
  //保存前判断表体金额含税和不含税合计
  const bill = viewModel.getAllData();
  const fct_bs = bill.pk_fct_ap_b_ad_pu1List;
  if (bill.valdate > bill.invallidate) {
    cb.utils.alert("合同开始日期不能晚于结束日期", "error");
    return false;
  }
  if (bill.vdef13_name !== "其他费用（与收入无关）") {
    if ((bill.vdef5_code == null || bill.vdef5_code == undefined) && (bill.nabuhetong_ctname == null || bill.nabuhetong_ctname == undefined)) {
      cb.utils.alert("合同类型不等于其他费用（与收入无关）,销售合同和内部合同不能同时为空", "error");
      return false;
    }
    if (bill.vdef5_code !== null && bill.vdef5_code !== undefined && bill.nabuhetong_ctname !== null && bill.nabuhetong_ctname !== undefined) {
      cb.utils.alert("合同类型不等于其他费用（与收入无关）,销售合同和内部合同不能同时有值", "error");
      return false;
    }
  }
  if (!fct_bs.length > 0) {
    cb.utils.alert("合同明细信息不能为空", "error");
    return false;
  }
  const fct_js = bill.pk_fct_ap_plan_ad_pu1List;
  let htmxmoney = 0;
  let jsxxmoney = 0;
  fct_bs.forEach((item) => {
    htmxmoney = htmxmoney + item.norigtaxmny;
  });
  fct_js.forEach((item) => {
    jsxxmoney = jsxxmoney + item.planmoney;
  });
  if (htmxmoney != jsxxmoney) {
    cb.utils.alert("采购结算信息计划金额与合同明细的价税合计金额不相等", "error");
    return false;
  }
  const value = viewModel.get("openct").getValue();
  debugger;
  let planr = 0;
  if (!fct_js.length > 0 && value == false) {
    cb.utils.alert("采购结算信息不能为空", "error");
    return false;
  } else {
    fct_js.forEach((item) => {
      planr = planr + item.planrate;
    });
    if (planr != 100) {
      cb.utils.alert("采购结算信息计划比例之和需要为100", "error");
      return false;
    }
  }
  for (const i = 0; i < fct_bs.length; i++) {
    fctb = fct_bs[i];
    if (fctb.ntax == "0") {
      fctb.ntax = 0;
    }
    if (fctb.norigmny == "0") {
      fctb.norigmny = 0;
    }
    const money = fctb.norigmny + fctb.ntax;
    if (money !== fctb.norigtaxmny) {
      cb.utils.alert("表体不含税金额+税额不等于含税金额", "error");
      return false;
    }
  }
});
viewModel.on("customInit", function (data) {
  //采购合同详情--页面初始化
});