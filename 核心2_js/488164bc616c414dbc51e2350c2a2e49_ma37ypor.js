viewModel.on("afterLoadData", function (data) {
  document.querySelector(".textAreaValue pre").style.whiteSpace = "pre-wrap";
});
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
    if (org.indexOf("环保") > -1) {
      daqu_id = viewModel.get("item338rh").getValue(); //大区
      daqu_name = viewModel.get("item274ob").getValue(); //大区
      jibie_id = viewModel.get("item368ni").getValue(); //级别
      jibie_name = viewModel.get("item298ec").getValue(); //级别
      baZhang_id = viewModel.get("item997oc").getValue(); //环保大区巴长
      baZhang_name = viewModel.get("item926fe").getValue();
      baZhangZu = viewModel.get("item1265gh").getValue(); //环保巴长组
    } else if (org.indexOf("游乐") > -1) {
      daqu_id = viewModel.get("item469ng").getValue(); //大区
      daqu_name = viewModel.get("item403xg").getValue(); //大区
      jibie_id = viewModel.get("item511qa").getValue(); //级别
      jibie_name = viewModel.get("item439pc").getValue(); //级别
      baZhang_id = viewModel.get("item1142zf").getValue(); //游乐大区巴长
      baZhang_name = viewModel.get("item1069lk").getValue();
      baZhangZu = viewModel.get("item1327kg").getValue(); //游乐巴长组
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
    if (name != "") {
      viewModel.get("keHuMingCheng").setValue(name);
    }
    if (email != "") {
      viewModel.get("keHuYouXiang").setValue(email);
    }
    if (phone != "") {
      viewModel.get("keHuDianHua").setValue(phone);
    }
    if (message != "") {
      viewModel.get("xuQiuXiangQing").setValue(message);
    }
    if (company != "") {
      viewModel.get("keHuGongSi").setValue(company);
    }
    viewModel.get("laiYuanYeMian").setValue(filedForm);
    if (time != "") {
      viewModel.get("xunPanJieShouSJ").setValue(time.length > 16 ? time : time + ":01");
      viewModel.get("xunPanShiDuan").setValue(getHourFromTime(time));
    }
    checkAfterEmailUpdate();
  });
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
      return tempArry[1].split(":")[0];
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
// 客户邮箱--值改变后
viewModel.get("keHuYouXiang") &&
  viewModel.get("keHuYouXiang").on("afterValueChange", function (data) {
    checkAfterEmailUpdate();
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
  if (email == null || email.trim() == "" || !validateEmail(email)) {
    viewModel.get("youXiangJiaoYan").setValue("");
    viewModel.get("chongFuXunPanShJ").setValue("");
    viewModel.get("shouPaiYeWuYuan_name").setValue("");
    viewModel.get("shouPaiYeWuYuan").setValue("");
    viewModel.get("custCode").setValue("");
    viewModel.get("custId").setValue("");
    return;
  }
  let orgid = viewModel.get("org_id").getValue();
  let tel = viewModel.get("keHuDianHua").getValue();
  let customerName = viewModel.get("keHuMingCheng").getValue();
  if (customerName == null || customerName == "") {
    //客户名称必录--需要校验
    return;
  }
  let clueCode = viewModel.get("code").getValue();
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.checkClueExisted",
    { reqClueCode: clueCode, reqCustomerName: customerName, reqTel: tel, reqEmail: email, reqOrgId: orgid, userid: viewModel.get("xunPanRenY").getValue() },
    function (err, res) {
      debugger;
      let emailValidateMsg = "该组织下无重复数据![" + new Date() + "]";
      let chongFuXunPanShJ = "";
      let shouPaiYeWuYuan_name = "";
      let shouPaiYeWuYuan = "";
      let rst = res.rst;
      if (rst) {
        let clueInfo = res.data[0];
        if (clueInfo.verifystate != 2) {
          emailValidateMsg = "经检测,有重复数据且尚未审核，不允许录入!" + clueInfo.code;
        } else {
          emailValidateMsg = res.msg + " 询盘单:" + clueInfo.code;
        }
        chongFuXunPanShJ = clueInfo.xunPanJieShouSJ;
        shouPaiYeWuYuan = clueInfo.yeWuYuan;
        cb.rest.invokeFunction("GT3734AT5.APIFunc.getStaffNameByID", { userId: shouPaiYeWuYuan }, function (err, res) {
          if (err == null) {
            if (res.code == "200") {
              shouPaiYeWuYuan_name = res.data.name;
              viewModel.get("shouPaiYeWuYuan_name").setValue(shouPaiYeWuYuan_name);
            }
          }
        });
        viewModel.get("custCode").setValue(clueInfo.custCode);
        viewModel.get("custId").setValue(clueInfo.custId);
        viewModel.get("ShangJiBianMa").setValue("");
        viewModel.get("ShangJiId").setValue("");
        viewModel.get("xianSuoLeiXing").setValue("2"); //重复询盘
        viewModel.get("xianSuoLeiXing").setState("bCanModify", false);
      } else {
        viewModel.get("xianSuoLeiXing").setValue("1"); //新询盘
        viewModel.get("xianSuoLeiXing").setState("bCanModify", true);
      }
      viewModel.get("chongFuXunPanShJ").setValue(chongFuXunPanShJ);
      viewModel.get("shouPaiYeWuYuan_name").setValue(shouPaiYeWuYuan_name);
      viewModel.get("shouPaiYeWuYuan").setValue(shouPaiYeWuYuan);
      viewModel.get("youXiangJiaoYan").setValue(emailValidateMsg);
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
viewModel.get("xuQiuChanPin_productName") &&
  viewModel.get("xuQiuChanPin_productName").on("beforeBrowse", function (data) {
    // 需求产品--参照弹窗打开前
    let condition = { isExtend: true, simpleVOs: [] };
    let orgName = viewModel.get("org_id_name").getValue();
    let op = "is_null";
    let value1 = null;
    if (orgName.indexOf("建机事业部") > -1) {
      op = "eq";
      value1 = viewModel.get("xiangMu").getValue();
    }
    condition.simpleVOs.push({
      field: "xiangMu",
      op: op,
      value1: value1
    });
    this.setFilter(condition);
  });
viewModel.get("laiYuanWangZhan_YuMing") &&
  viewModel.get("laiYuanWangZhan_YuMing").on("beforeBrowse", function (data) {
    // 来源网站--参照弹窗打开前
    let condition = { isExtend: true, simpleVOs: [] };
    let orgName = viewModel.get("org_id_name").getValue();
    let op = "eq";
    let value1 = 0;
    if (orgName.indexOf("建机事业部") > -1) {
      value1 = 1;
    } else if (orgName.indexOf("环保事业部") > -1) {
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
viewModel.get("yeWuYuan_name") &&
  viewModel.get("yeWuYuan_name").on("afterValueChange", function (data) {
    // 业务员--值改变后
    let ywyName = viewModel.get("yeWuYuan_name").getValue();
    let ywyId = viewModel.get("yeWuYuan").getValue();
  });
viewModel.get("button33ei") &&
  viewModel.get("button33ei").on("click", function (data) {
    // 重传--单击
    let verifystate = viewModel.get("verifystate").getValue();
    let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
    if (verifystate != "2" || tongBuZhuangTai == true) {
      cb.utils.alert("温馨提示，单据未审核或者已同步不能传递！" + tongBuZhuangTai, "info");
      return;
    } else {
      let id = viewModel.get("id").getValue();
      cb.rest.invokeFunction("GT3734AT5.APIFunc.synStaffToCrmApi", { businessId: id }, function (err, res) {
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
          cb.utils.alert("温馨提示！同步档案生成失败", "error");
        }
      });
    }
  });