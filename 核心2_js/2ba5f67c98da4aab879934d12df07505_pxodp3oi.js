viewModel.on("customInit", function (data) {
  viewModel.get("xunPanFenLei").setVisible(false);
  if (viewModel.getParams().mode == "add") {
    viewModel.get("baZhangZu").setVisible(true);
    viewModel.get("button66yk").setVisible(true);
  } else {
    viewModel.get("baZhangZu").setVisible(false);
    viewModel.get("button66yk").setVisible(false);
  }
  viewModel.get("platform").setVisible(false);
});
const setPlatformVisible = () => {
  let langVal = viewModel.get("xunPanYuY").getValue(); //7俄语
  let consultTypeVal = viewModel.get("xunPanLeiXing").getValue(); //3竞价
  if (langVal == undefined || langVal == "" || langVal == null || consultTypeVal == undefined || consultTypeVal == "" || consultTypeVal == null) {
    viewModel.get("platform").setVisible(false);
    viewModel.get("platform").setState("bIsNull", true);
    viewModel.get("platform").setValue("");
  } else {
    if (langVal == 7 && consultTypeVal == 3) {
      viewModel.get("platform").setVisible(true);
      viewModel.get("platform").setState("bIsNull", false);
    } else {
      viewModel.get("platform").setVisible(false);
      viewModel.get("platform").setState("bIsNull", true);
      viewModel.get("platform").setValue("");
    }
  }
};
const setReDoActionVisible = (menuCode) => {
  let user = cb.rest.AppContext.user;
  let userName = user.userName;
  let isVisible = false;
  if (userName == "王西亚" || userName == "闫富森" || userName == "gole") {
    isVisible = true;
  }
  let verifystate = viewModel.get("verifystate").getValue();
  let custCode = viewModel.get("custCode").getValue();
  if (verifystate == "2" && (custCode == undefined || custCode == "")) {
    isVisible = true;
  } else {
    isVisible = false;
  }
  viewModel.get(menuCode).setVisible(isVisible);
};
viewModel.on("afterProcessWorkflow", function (data) {
  setOtherVisible();
});
viewModel.on("afterMount", function (params) {
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.getLimitFieldApi",
    { billNo: billNo },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("权限控制异常");
        return false;
      } else {
        if (res.data.length > 0) {
          let data = res.data;
          for (let i in data) {
            let dataObj = data[i]; //let isMain = dataObj.isMain;
            let fieldParamsList = dataObj.FieldParamsList;
            let isList = dataObj.isList;
            let isVisilble = dataObj.isVisilble;
            for (j in fieldParamsList) {
              let fieldParams = fieldParamsList[j];
              let fieldName = fieldParams.fieldName;
              let isMain = fieldParams.isMain;
              let childrenField = fieldParams.childrenField;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
                } else {
                  viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                  viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
                }
              }
            }
          }
        }
      }
    },
    viewModel,
    { domainKey: "yourKeyHere" }
  );
});
viewModel.on("afterRule", function (data) {
  if (viewModel.getParams().mode == "edit" && viewModel.get("verifystate").getValue() == 2) {
    viewModel.setReadOnly(true);
    viewModel.get("btnSave").setDisabled(true);
    viewModel.get("btnSaveAndAdd").setDisabled(true);
    document.querySelector(".textAreaValue pre").style.whiteSpace = "pre-wrap";
  }
  setOtherVisible();
});
function setOtherVisible() {
  let orgName = viewModel.get("org_id_name").getValue();
  viewModel.get("xiangMu").setVisible(orgName.includes("建机"));
  let xunPanYuY = viewModel.get("xunPanYuY").getValue();
  let xpVisible = xunPanYuY.includes("10");
  viewModel.get("xunPanYuY_qt").setVisible(xpVisible);
  let xunPanLeiXing = viewModel.get("xunPanLeiXing").getValue();
  viewModel.get("xunPanLeiXing_qt").setVisible(xunPanLeiXing.includes("13"));
}
viewModel.on("modeChange", function (data) {
  setOtherVisible();
  if (viewModel.getParams().mode == "edit") {
    let yeWuYuan = viewModel.get("yeWuYuan").getValue();
    let baZhang = viewModel.get("baZhang").getValue();
    let xunPanRenY = viewModel.get("xunPanRenY").getValue();
    let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoleApi", {}, function (err, res) {}, viewModel, { async: false });
    let staffId = rest.result.data.currentUser.staffId;
    if (staffId == xunPanRenY && staffId != baZhang) {
      viewModel.get("yeWuYuan_name").setState("bIsNull", true);
      viewModel.get("yeWuYuan_name").setVisible(false);
    }
    setSelfYwy();
  }
});
viewModel.on("afterLoadData", function (data) {
  setReDoActionVisible("button33ei");
  document.querySelector(".textAreaValue pre").style.whiteSpace = "pre-wrap";
  let yeWuYuan = viewModel.get("yeWuYuan").getValue();
  let baZhang = viewModel.get("baZhang").getValue();
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoleApi", {}, function (err, res) {}, viewModel, { async: false });
  let staffId = rest.result.data.currentUser.staffId;
  let xunPanRenY = viewModel.get("xunPanRenY").getValue();
  if (yeWuYuan == null || yeWuYuan == "" || baZhang == yeWuYuan || baZhang == xunPanRenY) {
    viewModel.get("xunPanFenLei").setVisible(true);
  } else {
    viewModel.get("xunPanFenLei").setVisible(staffId != yeWuYuan && staffId != xunPanRenY);
  }
  if (xunPanRenY != undefined && xunPanRenY != "") {
    viewModel.get("baZhangZu").setVisible(xunPanRenY == staffId);
  } else {
    viewModel.get("baZhangZu").setVisible(true);
  }
  setChkRstVisible();
  setOtherVisible();
  if (viewModel.getParams().mode == "edit") {
    setSelfYwy();
  }
  setPlatformVisible();
});
//检测询盘重复，显示校验结果
function setChkRstVisible() {
  let youXiangJiaoYan = viewModel.get("youXiangJiaoYan").getValue();
  if (youXiangJiaoYan == null || youXiangJiaoYan == "" || youXiangJiaoYan.includes("有重复")) {
    viewModel.get("youXiangJiaoYan").setVisible(true);
    viewModel.get("chongFuXunPanShJ").setVisible(true);
    viewModel.get("shouPaiYeWuYuan_name").setVisible(true);
  } else {
    viewModel.get("youXiangJiaoYan").setVisible(false);
    viewModel.get("chongFuXunPanShJ").setVisible(false);
    viewModel.get("shouPaiYeWuYuan_name").setVisible(false);
  }
}
//枚举-三大事业部：建机事业部1/环保事业部2/游乐事业部3
viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("beforeBrowse", function (data) {
    // 国家--参照弹窗打开前
    let orgName = viewModel.get("org_id_name").getValue();
    if (orgName.indexOf("建机事业部") > -1) {
      let jjxm = viewModel.get("xiangMu").getValue();
      if (jjxm == null || jjxm == "") {
        cb.utils.alert("温馨提示，请先选择建机项目！", "info");
        return false;
      }
    }
  });
viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    let daqu_id = viewModel.get("item211dd").getValue(); //大区
    let daqu_name = viewModel.get("item149ak").getValue(); //大区
    let jibie_id = viewModel.get("item229ea").getValue();
    let jibie_name = viewModel.get("item161qc").getValue();
    let baZhang_id = viewModel.get("item856bh").getValue(); //建机大区巴长
    let baZhang_name = viewModel.get("item787yj").getValue();
    let baZhangZu = viewModel.get("item1204dk").getValue(); //建机巴长组
    let baZhangDeptId = viewModel.get("item1389di").getValue(); //建机巴长部门
    if (org.indexOf("环保") > -1) {
      daqu_id = viewModel.get("item338rh").getValue(); //大区
      daqu_name = viewModel.get("item274ob").getValue(); //大区
      jibie_id = viewModel.get("item368ni").getValue(); //级别
      jibie_name = viewModel.get("item298ec").getValue(); //级别
      baZhang_id = viewModel.get("item997oc").getValue(); //环保大区巴长
      baZhang_name = viewModel.get("item926fe").getValue();
      baZhangZu = viewModel.get("item1265gh").getValue(); //环保巴长组
      baZhangDeptId = viewModel.get("item1449cj").getValue(); //环保巴长部门
    } else if (org.indexOf("游乐") > -1) {
      daqu_id = viewModel.get("item469ng").getValue(); //大区
      daqu_name = viewModel.get("item403xg").getValue(); //大区
      jibie_id = viewModel.get("item511qa").getValue(); //级别
      jibie_name = viewModel.get("item439pc").getValue(); //级别
      baZhang_id = viewModel.get("item1142zf").getValue(); //游乐大区巴长
      baZhang_name = viewModel.get("item1069lk").getValue();
      baZhangZu = viewModel.get("item1327kg").getValue(); //游乐巴长组
      baZhangDeptId = viewModel.get("item1510ae").getValue(); //游乐巴长部门
    }
    viewModel.get("daqu").setValue(daqu_id); //id
    viewModel.get("daqu_mingCheng").setValue(daqu_name); //名称
    viewModel.get("jibie_mingCheng").setValue(jibie_name); //id
    viewModel.get("jibie").setValue(jibie_id); //名称
    let orgName = viewModel.get("org_id_name").getValue();
    if (orgName.indexOf("建机事业部") > -1) {
      let jjxm = viewModel.get("xiangMu").getValue();
      let countryId = viewModel.get("guojia").getValue();
      setJJManager(jjxm, countryId, baZhang_id, baZhang_name, baZhangZu);
    } else {
      viewModel.get("baZhang").setValue(baZhang_id); //id
      viewModel.get("baZhang_name").setValue(baZhang_name); //名称
      viewModel.get("baZhangZu").setValue(baZhangZu); //巴长组
      viewModel.get("baZhangOrgId").setValue(baZhangDeptId); //巴长部门
    }
  });
// 来源页面--值改变后
viewModel.get("xunPanNeiRong") &&
  viewModel.get("xunPanNeiRong").on("afterValueChange", function (data) {
    let xunPanNeiRong = viewModel.get("xunPanNeiRong").getValue();
    if (xunPanNeiRong == null || xunPanNeiRong == "") {
      return;
    }
    xunPanNeiRong = xunPanNeiRong.trim();
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    //事业部、项目、语种、渠道
    let langVal = viewModel.get("xunPanYuY").getValue();
    let consultTypeVal = viewModel.get("xunPanLeiXing").getValue();
    let name = getValFromClueByKey(xunPanNeiRong, "Name:", "Email:");
    let email = getValFromClueByKey(xunPanNeiRong, "Email:", "Phone:");
    let phone = getValFromClueByKey(xunPanNeiRong, "Phone:", "Company:");
    let company = getValFromClueByKey(xunPanNeiRong, "Company:", "Message:");
    let message = getValFromClueByKey(xunPanNeiRong, "Message:", "Country:");
    let time = getValFromClueByKey(xunPanNeiRong, "Date/Time:", "Coming from (referer):");
    let filedForm = getValFromClueByKey(xunPanNeiRong, "Coming from (referer):", "Sent from (ip address):");
    if (email != "") {
      viewModel.get("keHuYouXiang").setValue(email);
    }
    if (phone != "") {
      phone = phone.replaceAll("'", "");
      if (phone.length > 50) {
        phone = phone.substring(0, 50);
      }
      viewModel.get("keHuDianHua").setValue(phone);
    }
    if (message != "") {
      viewModel.get("xuQiuXiangQing").setValue(message);
    }
    if (company != "") {
      company = company.replaceAll("'", "");
      viewModel.get("keHuGongSi").setValue(company);
    }
    viewModel.get("laiYuanYeMian").setValue(filedForm);
    if (time != "") {
      viewModel.get("xunPanJieShouSJ").setValue(time.length > 16 ? time : time + ":01");
      viewModel.get("xunPanShiDuan").setValue(getHourFromTime(time));
    }
    if (name != "") {
      name = name.replaceAll("'", "");
      viewModel.get("keHuMingCheng").setValue(name);
      updateCustName();
    }
    checkAfterEmailUpdate();
  });
function updateCustName() {
  let sjStr = viewModel.get("xunPanJieShouSJ").getValue();
  if (sjStr == undefined || sjStr == "") {
    return;
  }
  sjStr = sjStr.substring(0, 10);
  let xunPanNeiRong = viewModel.get("xunPanNeiRong").getValue();
  if (xunPanNeiRong == undefined || xunPanNeiRong == null || xunPanNeiRong == "") {
    return;
  }
  xunPanNeiRong = xunPanNeiRong.trim();
  let name = getValFromClueByKey(xunPanNeiRong, "Name:", "Email:");
  if (name != "") {
    let companyStr = "";
    let company = viewModel.get("keHuGongSi").getValue();
    if (company != undefined && company != "") {
      companyStr = "(" + company + ")";
    }
    name = name.replaceAll("'", "");
    viewModel.get("keHuMingCheng").setValue(sjStr + name + companyStr);
  }
}
function getValFromClueByKey(clueReq, keyWord, lastKeyWord) {
  if (lastKeyWord == undefined || lastKeyWord == null) {
    lastKeyWord = "\n";
  }
  var tempArry = clueReq.split(keyWord);
  if (tempArry.length < 2) {
    return "";
  }
  var tempStr = tempArry[1];
  var tempStr1 = tempStr.split(lastKeyWord)[0].trim();
  return tempStr1;
}
function getHourFromTime(timeStr) {
  var reg = /^[0-9,/:-\s]+$/;
  if (!isNaN(Date.parse(new Date(timeStr.replace(/-/g, "/")))) && reg.test(timeStr)) {
    var tempArry = timeStr.split(" ");
    if (tempArry.length > 1) {
      return Number(tempArry[1].split(":")[0]);
    } else {
      return "";
    }
  }
  return "";
}
// 询盘语言--值改变前
viewModel.get("xunPanNeiRong") &&
  viewModel.get("xunPanNeiRong").on("beforeValueChange", function (data) {
    let xunPanYuYObj = viewModel.get("xunPanYuY").getSelectedNodes();
    if (xunPanYuYObj == null || xunPanYuYObj.text == null) {
    }
    let xunPanLeiXingObj = viewModel.get("xunPanLeiXing").getSelectedNodes();
    if (xunPanLeiXingObj == null || xunPanLeiXingObj.text == null) {
    }
  });
const chkEnterpriseEmail = () => {
  let email = viewModel.get("keHuYouXiang").getValue();
  if (email == undefined || email == null || email.trim() == "" || !validateEmail(email)) {
    viewModel.get("EnterpriseEmail").setValue("");
  } else {
    let clueCode = viewModel.get("code").getValue();
    let orgid = viewModel.get("org_id").getValue();
    let orgName = viewModel.get("org_id_name").getValue();
    debugger;
    let resp = cb.rest.invokeFunction("GT3734AT5.APIFunc.chkEmailSufxApi", { reqClueCode: clueCode, reqEmail: email, reqOrgId: orgid, reqOrgName: orgName }, function (err, res) {}, viewModel, {
      async: false
    });
    let rest = resp.result;
    let resMsg = rest.msg;
    if (rest.rst) {
      if (rest.usable) {
        //有重复数据（）
        let clueInfo = rest.data[0];
        if (resMsg.includes("企业邮箱")) {
          //企业邮箱--相同后缀
          viewModel.get("youXiangJiaoYan").setValue("");
        } else {
          //完全相同
          if (resMsg.includes("不允许录入")) {
            //与尚未审核的线索重复，不允许录入
            if (clueInfo.verifystate != 2) {
              let emailValidateMsg = "经检测,有重复数据且尚未审核，不允许录入!线索编码:" + clueInfo.code + "询盘人员:" + clueInfo.xunPanRenY_name;
              viewModel.get("youXiangJiaoYan").setValue(emailValidateMsg);
            }
          } else {
            //潜客中的联系人邮箱重复了
          }
        }
      } else {
        //无重复数据（包括邮箱相同或同后缀）
        viewModel.get("youXiangJiaoYan").setValue("");
      }
      viewModel.get("EnterpriseEmail").setValue(resMsg);
    } else {
      //参数出错的情况
      viewModel.get("EnterpriseEmail").setValue("");
    }
  }
};
// 客户邮箱--值改变后
viewModel.get("keHuYouXiang") &&
  viewModel.get("keHuYouXiang").on("afterValueChange", function (data) {
    checkAfterEmailUpdate();
    chkEnterpriseEmail();
  });
viewModel.get("keHuMingCheng") &&
  viewModel.get("keHuMingCheng").on("afterValueChange", function (data) {
    // 客户名称--值改变后
    checkAfterEmailUpdate();
  });
viewModel.get("keHuDianHua") &&
  viewModel.get("keHuDianHua").on("afterValueChange", function (data) {
    // 客户名称--值改变后
    checkAfterEmailUpdate();
  });
const validateEmail = (str) => /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
function checkAfterEmailUpdate() {
  let email = viewModel.get("keHuYouXiang").getValue();
  if (email == undefined || email == null || email.trim() == "" || !validateEmail(email)) {
    let xunpanLeiXing = viewModel.get("xunPanLeiXing").getValue();
    if (xunpanLeiXing != "7" && xunpanLeiXing != "15" && xunpanLeiXing != "16") {
      //地推陌拜-优化在线 竞价在线
      viewModel.get("youXiangJiaoYan").setValue("");
      viewModel.get("chongFuXunPanShJ").setValue("");
      viewModel.get("shouPaiYeWuYuan_name").setValue("");
      viewModel.get("shouPaiYeWuYuan").setValue("");
      viewModel.get("custCode").setValue("");
      viewModel.get("custId").setValue("");
      return;
    } else {
      email = "1111111111";
    }
  }
  let orgid = viewModel.get("org_id").getValue();
  let orgName = viewModel.get("org_id_name").getValue();
  let tel = viewModel.get("keHuDianHua").getValue();
  let customerName = viewModel.get("keHuMingCheng").getValue();
  if (customerName == null || customerName == "") {
    //客户名称必录--需要校验
    return;
  }
  if (customerName.includes("'")) {
    cb.utils.alert("客户名称包含特殊字符，请检查!", "error");
    viewModel.get("youXiangJiaoYan").setValue("");
    return;
  }
  if (tel) {
    if (tel.includes("'")) {
      cb.utils.alert("电话包含特殊字符，请检查!", "error");
      viewModel.get("youXiangJiaoYan").setValue("");
      return;
    }
  }
  let clueCode = viewModel.get("code").getValue();
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.checkClueExisted",
    { reqClueCode: clueCode, reqCustomerName: customerName, reqTel: tel, reqEmail: email, reqOrgId: orgid, reqOrgName: orgName, userid: viewModel.get("xunPanRenY").getValue() },
    function (err, res) {
      debugger;
      let emailValidateMsg = "该组织下无重复数据![" + new Date() + "]";
      let chongFuXunPanShJ = "";
      let shouPaiYeWuYuan_name = "";
      let shouPaiYeWuYuan = "";
      if (err != null) {
        cb.utils.alert("参数异常:" + err.message, "error");
        emailValidateMsg = "";
      } else {
        let rst = res.rst;
        if (rst) {
          let clueInfo = res.data[0];
          if (clueInfo.verifystate != 2) {
            emailValidateMsg = "经检测,有重复数据且尚未审核，不允许录入!线索编码:" + clueInfo.code + "询盘人员:" + clueInfo.xunPanRenY_name;
          } else {
            emailValidateMsg = res.msg + " 潜客:" + clueInfo.code;
            chongFuXunPanShJ = clueInfo.khxxlysj;
            shouPaiYeWuYuan = clueInfo.Sales;
            shouPaiYeWuYuan_name = clueInfo.Sales_name;
          }
          viewModel.get("custCode").setValue(clueInfo.code);
          viewModel.get("custId").setValue(clueInfo.id);
          viewModel.get("ShangJiBianMa").setValue("");
          viewModel.get("ShangJiId").setValue("");
          viewModel.get("xianSuoLeiXing").setValue("2"); //重复询盘
          viewModel.get("xianSuoLeiXing").setState("bCanModify", false);
        } else {
          viewModel.get("xianSuoLeiXing").setValue("1"); //新询盘
          viewModel.get("xianSuoLeiXing").setState("bCanModify", true);
        }
      }
      viewModel.get("chongFuXunPanShJ").setValue(chongFuXunPanShJ);
      viewModel.get("shouPaiYeWuYuan_name").setValue(shouPaiYeWuYuan_name);
      viewModel.get("shouPaiYeWuYuan").setValue(shouPaiYeWuYuan);
      viewModel.get("youXiangJiaoYan").setValue(emailValidateMsg);
      setChkRstVisible();
    }
  );
}
// 国家--值改变后
viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("afterValueChange", function (data) {
    updateTitle();
  });
// 询盘人员--值改变后
viewModel.get("xunPanRenY_name") &&
  viewModel.get("xunPanRenY_name").on("afterValueChange", function (data) {
    updateTitle();
    setSelfYwy();
  });
// 所需产品--值改变后
viewModel.get("xuQiuChanPin_productName") &&
  viewModel.get("xuQiuChanPin_productName").on("afterValueChange", function (data) {
    updateTitle();
  });
function updateTitle() {
  var userName = viewModel.get("xunPanRenY_name").getValue();
  var country = viewModel.get("guojia_guoJiaMingCheng").getValue();
  var productName = viewModel.get("xuQiuChanPin_productName").getValue();
  var clueTitle = userName + " " + (country == undefined ? "" : country) + " " + (productName == undefined ? "" : productName);
  viewModel.get("titleName").setValue(clueTitle);
}
viewModel.get("laiYuanWangZhan_YuMing") &&
  viewModel.get("laiYuanWangZhan_YuMing").on("beforeBrowse", function (data) {
    // 来源网站--参照弹窗打开前
    let condition = { isExtend: true, simpleVOs: [] };
    let orgName = viewModel.get("org_id_name").getValue();
    let op = "eq";
    let value1 = 0;
    if (orgName.indexOf("建机") > -1) {
      value1 = 1;
    } else if (orgName.indexOf("环保") > -1) {
      value1 = 2;
    } else if (orgName.indexOf("游乐") > -1) {
      value1 = 3;
    } else {
      value1 = 0;
    }
    condition.simpleVOs.push({
      field: "XiangMu",
      op: op,
      value1: value1
    });
    this.setFilter(condition);
  });
viewModel.get("xiangMu") &&
  viewModel.get("xiangMu").on("afterValueChange", function (data) {
    // 建机项目--值改变后
    let jjXiangMu = viewModel.get("xiangMu").getValue();
    if (jjXiangMu == null || jjXiangMu == "") {
      return;
    }
    let countryName = viewModel.get("guojia_guoJiaMingCheng").getValue();
    if (countryName == null || countryName == "") {
      return;
    }
    let countryId = viewModel.get("guojia").getValue();
    let baZhang_id = viewModel.get("item856bh").getValue(); //建机大区巴长
    let baZhang_name = viewModel.get("item787yj").getValue();
    let baZhangZu = viewModel.get("item1204dk").getValue(); //建机巴长组
    setJJManager(jjXiangMu, countryId, baZhang_id, baZhang_name, baZhangZu);
  });
//根据国家、建机项目信息获取并设置大区经理/巴长信息
function setJJManager(jjXiangMu, countryId, baZhang_id, baZhang_name, baZhangZu) {
  cb.rest.invokeFunction("GT3734AT5.APIFunc.getJJManagerApi", { jjxm: jjXiangMu, countryId: countryId }, function (err, res) {
    if (err == null) {
      let baZhangZuJJ = res.baZhangZu;
      let daQuXiangMuJingLi = res.daQuXiangMuJingLi;
      let daQuXiangMuJingLiName = res.daQuXiangMuJingLiName;
      if (daQuXiangMuJingLi == undefined || daQuXiangMuJingLi == null || daQuXiangMuJingLi == "") {
        viewModel.get("baZhang").setValue(baZhang_id); //id
        viewModel.get("baZhang_name").setValue(baZhang_name); //名称
      } else {
        viewModel.get("baZhang").setValue(daQuXiangMuJingLi);
        viewModel.get("baZhang_name").setValue(daQuXiangMuJingLiName);
      }
      if (baZhangZuJJ == undefined || baZhangZuJJ == null || baZhangZuJJ == "") {
        viewModel.get("baZhangZu").setValue(baZhangZu);
      } else {
        viewModel.get("baZhangZu").setValue(baZhangZuJJ);
      }
    }
  });
}
function getTextFromEnumObj(enumObj, val) {
  if (val == undefined || val == null) {
    val = enumObj.getValue();
  }
  let dataArray = enumObj.__data.keyMap;
  for (var idx in dataArray) {
    let itemData = dataArray[idx];
    if (itemData.value == val) {
      return itemData.text;
    }
  }
  return "";
}
viewModel.get("button33ei") &&
  viewModel.get("button33ei").on("click", function (data) {
    // 重传--单击
    let verifystate = viewModel.get("verifystate").getValue();
    let custCode = viewModel.get("custCode").getValue();
    if (verifystate != "2") {
      cb.utils.alert("温馨提示,单据未审核或者已同步不能传递！", "info");
      return;
    }
    if (custCode != undefined && custCode != "") {
      cb.utils.alert("温馨提示,单据已生成潜客,不能重新生成！", "info");
      return;
    }
    let id = viewModel.get("id").getValue();
    cb.rest.invokeFunction("GT3734AT5.APIFunc.reCreateGSApi", { businessId: id }, function (err, res) {
      debugger;
      if (err == null) {
        console.log("res=" + res);
        var rst = res.rst;
        if (rst) {
          cb.utils.alert("温馨提示！同步档案已生成[" + res.customerId + "]", "info");
        } else {
          cb.utils.alert("温馨提示！同步档案生成失败[" + res.msg + "]", "error");
        }
      } else {
        cb.utils.alert("温馨提示！同步档案生成失败[" + err.message + "]", "error");
      }
    });
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    let orgName = viewModel.get("org_id_name").getValue();
    viewModel.get("xiangMu").setVisible(orgName.includes("建机"));
    viewModel.get("platform").setVisible(false);
  });
viewModel.get("xunPanJieShouSJ") &&
  viewModel.get("xunPanJieShouSJ").on("afterValueChange", function (data) {
    let xunPanJieShouSJ = viewModel.get("xunPanJieShouSJ").getValue();
    if (xunPanJieShouSJ == undefined || xunPanJieShouSJ == "") {
      return;
    } else {
      viewModel.get("xunPanShiDuan").setValue(getHourFromTime(xunPanJieShouSJ));
    }
    updateCustName();
  });
viewModel.get("xunPanYuY") &&
  viewModel.get("xunPanYuY").on("afterValueChange", function (data) {
    // 语言--值改变后
    setPlatformVisible();
  });
viewModel.get("xunPanLeiXing") &&
  viewModel.get("xunPanLeiXing").on("afterValueChange", function (data) {
    // 客户来源--值改变后
    setSelfYwy();
    setPlatformVisible();
  });
function setSelfYwy() {
  let xunpanLeiXing = viewModel.get("xunPanLeiXing").getValue();
  if (xunpanLeiXing == "1" || xunpanLeiXing == "7") {
    //自我开发
    let xunPanRenY_name = viewModel.get("xunPanRenY_name").getValue();
    if (xunPanRenY_name != undefined && xunPanRenY_name != "") {
      viewModel.get("yeWuYuan_name").setValue(xunPanRenY_name);
      viewModel.get("yeWuYuan").setValue(viewModel.get("xunPanRenY").getValue());
    }
  } else {
    viewModel.get("yeWuYuan_name").setValue("");
    viewModel.get("yeWuYuan").setValue("");
  }
  if (xunpanLeiXing == "7") {
    //地推陌拜
    viewModel.get("laiYuanWangZhan_YuMing").setState("bIsNull", true);
    viewModel.get("keHuYouXiang").setState("bIsNull", true);
    viewModel.get("keHuDianHua").setState("bIsNull", false);
  } else {
    viewModel.get("laiYuanWangZhan_YuMing").setState("bIsNull", false);
    viewModel.get("keHuYouXiang").setState("bIsNull", false);
    viewModel.get("keHuDianHua").setState("bIsNull", true);
  }
  if (xunpanLeiXing == "2" || xunpanLeiXing == "3" || xunpanLeiXing == "5") {
    viewModel.get("laiYuanWangZhan_YuMing").setState("bIsNull", false);
  } else {
    viewModel.get("laiYuanWangZhan_YuMing").setState("bIsNull", true);
  }
  if (xunpanLeiXing == "15" || xunpanLeiXing == "16") {
    //客户来源增添：优化在线 竞价在线 客户邮箱不必填，客户电话必填;其他不变
    viewModel.get("keHuYouXiang").setState("bIsNull", true);
    viewModel.get("keHuDianHua").setState("bIsNull", false);
  }
}
viewModel.get("baZhang_name") &&
  viewModel.get("baZhang_name").on("beforeBrowse", function (data) {
    // 业务组负责人--参照弹窗打开前
    let mainOrgId = "yourIdHere"; //河南国立控股有限公司
    let condition = { isExtend: true, simpleVOs: [] };
    let op = "eq";
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: op,
      value1: mainOrgId
    });
    let baZhangZu = viewModel.get("baZhangZu").getValue();
    if (baZhangZu != undefined && baZhangZu != "") {
      let bazhangList = baZhangZu.split(",");
      condition.simpleVOs.push({
        field: "name",
        op: "in",
        value1: bazhangList
      });
    }
    this.setFilter(condition);
  });
viewModel.get("button66yk") &&
  viewModel.get("button66yk").on("click", function (data) {
    // 邮箱查重--单击
    debugger;
    let nowChkTime = new Date().getTime();
    let lastChkTime = viewModel.getCache("lastChkTime");
    if (lastChkTime == undefined) {
      viewModel.setCache("lastChkTime", nowChkTime);
    } else {
      let cha = nowChkTime - lastChkTime;
      if (cha < 30000) {
        cb.utils.alert("温馨提示！请不要频繁检测，至少间隔30秒", "info");
        return;
      }
      viewModel.setCache("lastChkTime", nowChkTime);
    }
    checkAfterEmailUpdate();
  });