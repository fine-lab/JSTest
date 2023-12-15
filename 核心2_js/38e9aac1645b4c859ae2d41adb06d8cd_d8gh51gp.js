let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datasAll = request.wordsDatas;
    if (datasAll.hasOwnProperty("组织*") != true) {
      var err = "  -- '组织'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("项目编码*") != true) {
      var err = "  -- '项目编码'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("样本编号*") != true) {
      var err = "  -- '样本编号'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("受检者姓名*") != true) {
      var err = "  -- '受检者姓名'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("性别*") != true) {
      var err = "  -- '性别'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("年龄*") != true) {
      var err = "  -- '年龄'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("联系电话*") != true) {
      var err = "  -- '联系电话'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("身份证号*") != true) {
      var err = "  -- '身份证号'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("送检单位*") != true) {
      var err = "  -- '送检单位'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("送检科室*") != true) {
      var err = "  -- '送检科室'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("送检医师*") != true) {
      var err = "  -- '送检医师'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("病案号*") != true) {
      var err = "  -- '病案号'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("临床诊断*") != true) {
      var err = "  -- '临床诊断'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("血常规*") != true) {
      var err = "  -- '血常规'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("检测时期*") != true) {
      var err = "  -- '检测时期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("血液样本类型*") != true) {
      var err = "  -- '血液样本类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("采样时间*") != true) {
      var err = "  -- '采样时间'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样日期*") != true) {
      var err = "  -- '收样日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样人*") != true) {
      var err = "  -- '收样人'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("寄送日期*") != true) {
      var err = "  -- '寄送日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("拟报告日期*") != true) {
      var err = "  -- '拟报告日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("送检形式*") != true) {
      var err = "  -- '送检形式'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样单类型*") != true) {
      var err = "  -- '收样单类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售部门*") != true) {
      var err = "  -- '销售部门'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售员*") != true) {
      var err = "  -- '销售员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("录入员*") != true) {
      var err = "  -- '录入员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("报告接收人*") != true) {
      var err = "  -- '报告接收人'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("接收人电话*") != true) {
      var err = "  -- '接收人电话'是必填项,不能为空 --  ";
      throw new Error(err);
    }
    //校验联系电话
    var phone = datasAll["联系电话*"];
    phone = phone + "";
    if (phone.length != 11) {
      var err = "  -- 不满11位，请检查 --  ";
      throw new Error(err);
    }
    var myreg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      throw new Error(" -- 联系电话格式不正确 -- ");
    }
    var phones = "+86-" + phone + "";
    //校验紧急联系电话
    var Jjphone = datasAll["紧急联系电话"];
    if (Jjphone != null) {
      Jjphone = Jjphone + "";
      if (Jjphone.length != 11) {
        var err = "  -- 不满11位，请检查 --  ";
        throw new Error(err);
      }
      if (!myreg.test(Jjphone)) {
        throw new Error(" -- 联系电话格式不正确 -- ");
      }
      var Jjphone = "+86-" + Jjphone + "";
    }
    //校验紧急联系电话
    var jsrphone = datasAll["接收人电话*"];
    if (jsrphone != null) {
      jsrphone = jsrphone + "";
      if (jsrphone.length != 11) {
        var err = "  -- 不满11位，请检查 --  ";
        throw new Error(err);
      }
      if (!myreg.test(jsrphone)) {
        throw new Error(" -- 联系电话格式不正确 -- ");
      }
    }
    //校验身份证号格式
    var idNumber = datasAll["身份证号*"];
    if (idNumber.length != 18 && idNumber.length != 16) {
      throw new Error("--身份证号格式错误,请重新输入--");
    }
    //血液样本类型枚举校验
    var YBLX = datasAll["血液样本类型*"];
    if (
      YBLX != "10" &&
      YBLX != "20" &&
      YBLX != "30" &&
      YBLX != "40" &&
      YBLX != "50" &&
      YBLX != "60" &&
      YBLX != "70" &&
      YBLX != "80" &&
      YBLX != "90" &&
      YBLX != "100" &&
      YBLX != "110" &&
      YBLX != "120" &&
      YBLX != "130" &&
      YBLX != "140" &&
      YBLX != "150" &&
      YBLX != "999"
    ) {
      throw new Error("  -- 样本类型输入有误,请重新输入 --  ");
    }
    //检测时期枚举校验
    var jcsq = datasAll["检测时期*"];
    if (jcsq != "10" && jcsq != "20" && jcsq != "30" && jcsq != "99") {
      throw new Error("-- 检测时期输入有误,请重新输入--");
    }
    //枚举
    var sexs = datasAll["性别*"];
    if (sexs != "1" && sexs != "2") {
      throw new Error("  -- 性别输入有误,请重新输入 --  ");
    }
    var cyDate = datasAll["采样时间*"]; //采样时间;*
    //判断获取的日期是什么类型是number的话就处理日期
    var cyhasNumber = typeof cyDate;
    cyDate = time(cyDate).Dates;
    if (cyhasNumber == "string") {
      var err = "  -- 采样时间时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var syDate = datasAll["收样日期*"]; //收样时间;*
    //判断获取的日期是什么类型是number的话就处理日期
    var syhasNumber = typeof syDate;
    syDate = time(syDate).Dates;
    if (syhasNumber == "string") {
      var err = "  -- 收样日期-日期格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var jsDate = datasAll["寄送日期*"]; //寄送日期; *
    //判断获取的日期是什么类型是number的话就处理日期
    var jshasNumber = typeof jsDate;
    jsDate = time(jsDate).Dates;
    if (jshasNumber == "string") {
      var err = "  -- 寄送日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var nbgDate = datasAll["拟报告日期*"]; //拟报告日期; *
    //判断获取的日期是什么类型是number的话就处理日期
    var nbghasNumber = typeof nbgDate;
    nbgDate = time(nbgDate).Dates;
    if (nbghasNumber == "string") {
      var err = "  -- 拟报告日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var dzybDate = datasAll["对照样本采样时间"]; //对照样本采样时间
    var dzybDateNumber = typeof dzybDate;
    if (dzybDateNumber == "string") {
      throw new Error("--拟报告日期时间格式不正确,请重新输入--");
    }
    dzybDate = time(dzybDate).Dates;
    //送检形式 校验
    var gysId = "";
    var sjystype = datasAll["送检形式*"];
    if (sjystype == 1) {
      sjystype = "0" + sjystype;
    } else if (sjystype == 2) {
      sjystype = "0" + sjystype;
      if (datasAll.hasOwnProperty("外送单位") != true) {
        throw new Error("-- 送检形式是委外'外送单位'是必填项,不能为空 --  ");
      }
      //获取供应商的ID  （根据名称获取）
      var gysName = datasAll["外送单位"];
      gysName = gysName.replace(/[, ]/g, "");
      var gysSql = "select id from aa.vendor.Vendor where name = '" + gysName + "'";
      var gysRes = ObjectStore.queryByYonQL(gysSql, "yssupplier");
      if (gysRes.length == 0) {
        throw new Error("未查询到【" + gysName + "】该供应商，请检查！");
      }
      gysId = gysRes[0].id;
    } else {
      throw new Error("--送检形式-格式不正确,请重新输入--");
    }
    function time(Dates) {
      var format = "-";
      let time = new Date((Dates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
      let year = time.getFullYear() + "";
      let month = time.getMonth() + 1 + "";
      let date = time.getDate() + "";
      const hours = time.getHours().toLocaleString();
      const minutes = time.getMinutes();
      if (format && format.length === 1) {
        Dates = year + format + month + format + date + " " + hours + ":" + minutes;
      }
      Dates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      return { Dates };
    }
    var zhuZ = datasAll["组织*"]; //组织
    var zzSql = "select * from org.func.BaseOrg where name = '" + zhuZ + "' and dr=0 ";
    var zzres = ObjectStore.queryByYonQL(zzSql, "orgcenter");
    if (zzres.length == 0) {
      var err = "  -- 组织查询为空,请检查组织 --  ";
      throw new Error(err);
    }
    //查询组织id
    var zhuZId = zzres[0].id;
    //查询录入员
    var luRPeo = datasAll["录入员*"];
    var peoSqls = "select * from hred.staff.Staff where name = '" + luRPeo + "' and dr=0";
    var peoress = ObjectStore.queryByYonQL(peoSqls, "hrcloud-staff-mgr");
    if (peoress.length == 0) {
      var err = "  -- 业务员查询为空,请检查'录入员'字段 --  ";
      throw new Error(err);
    }
    //查询员工id(录入员)
    var peoZIds = peoress[0].id;
    var peoYg = datasAll["销售员*"]; //员工
    var peoSql = "select * from hred.staff.Staff where name = '" + peoYg + "' and dr=0";
    var peores = ObjectStore.queryByYonQL(peoSql, "hrcloud-staff-mgr");
    if (peores.length == 0) {
      var err = "  -- 销售员查询为空,请检查'销售员'字段 --  ";
      throw new Error(err);
    }
    //查询员工id
    var peoZId = peores[0].id;
    //查询送检单位id
    var settlement = datasAll["送检单位*"]; //送检
    var settlementSql = "select * from aa.merchant.Merchant where name = '" + settlement + "'";
    var settlementres = ObjectStore.queryByYonQL(settlementSql, "productcenter");
    if (settlementres.length == 0) {
      var err = "  -- 送检单位查询为空,请检查'送检单位'字段 --  ";
      throw new Error(err);
    }
    var settlementresId = settlementres[0].id;
    //获取收样单类型ID
    var sampleReceipt = datasAll["收样单类型*"]; //收样单类型
    var sampleReceiptSql = "select * from bd.basedocdef.CustomerDocVO where name = '" + sampleReceipt + "' and dr=0";
    var sampleReceiptres = ObjectStore.queryByYonQL(sampleReceiptSql, "ucfbasedoc");
    if (sampleReceiptres.length == 0) {
      var err = "  -- 收样单类型查询为空,请检查'收样单类型'字段 --  ";
      throw new Error(err);
    }
    var sampleReceiptId = sampleReceiptres[0].id;
    //获取检测项目编码
    var testings = datasAll["项目编码*"]; //检测项目编码
    var testingsSql = "select * from bd.project.ProjectVO where code = '" + testings + "' and dr = 0";
    var testingsres = ObjectStore.queryByYonQL(testingsSql, "ucfbasedoc");
    if (testingsres.length == 0) {
      var err = "  -- 检测项目编码查询为空,请检查'检测项目编码'字段 --  ";
      throw new Error(err);
    }
    //检测项目编码id
    var testingsId = testingsres[0].id;
    var arrayByTestingsres = testingsres[0];
    //产品线
    if (arrayByTestingsres.hasOwnProperty("defineCharacter") == false) {
      throw new Error(" -- 检测方法未维护 --");
    }
    var attrext = arrayByTestingsres.defineCharacter;
    if (attrext.hasOwnProperty("attrext12") == false) {
      var err = "-- " + arrayByTestingsres.code + "：项目没有绑定产品线,请检查 --";
      throw new Error(err);
    }
    var weihuID = attrext.attrext12;
    if (attrext.hasOwnProperty("attrext42") == false) {
      var err = "-- " + arrayByTestingsres.code + "：项目没有绑定检测方式,请检查 --";
      throw new Error(err);
    }
    var defineJCFS = attrext.attrext42;
    var business = datasAll["销售部门*"]; //业务部门id
    var businessSql = "select * from org.func.Dept where name = '" + business + "' and dr = 0";
    var businessres = ObjectStore.queryByYonQL(businessSql, "ucf-org-center");
    if (businessres.length == 0) {
      var err = "  -- 销售部门查询为空,请检查'销售部门'字段 --  ";
      throw new Error(err);
    }
    //查询业务部门id
    var businessId = businessres[0].id;
    //强关联
    var zsSql = "select * from org.func.BaseOrg where parentorgid='" + zhuZId + "' and name='" + business + "' and dr=0";
    var zsres = ObjectStore.queryByYonQL(zsSql, "orgcenter");
    if (zsres.length == 0) {
      throw new Error(" -- 组织与部门不匹配 -- ");
    }
    var deptId = zsres[0].id;
    //查询销售员   deptId:查询所有这个部门的销售员
    var peoSql = "select * from hred.staff.Staff where name = '" + peoYg + "' and deptId='" + deptId + "' and dr=0";
    var peores = ObjectStore.queryByYonQL(peoSql, "hrcloud-staff-mgr");
    if (peores.length == 0) {
      throw new Error(" -- 销售员与部门不匹配 -- ");
    }
    //检测项目名称
    var testingsName = testingsres[0].name;
    //收样取价表
    var wushuijine = "";
    var shuie = "";
    var money = "";
    var taxRate = "";
    if (sampleReceipt == "科研免费" || sampleReceipt == "临床免费") {
      wushuijine = 0;
      shuie = 0;
      money = 0;
      taxRate = "1557375121875797818";
    } else if (sampleReceipt == "个人现金业务") {
      if (datasAll.hasOwnProperty("税率(个人)") != true) {
        throw new Error("--收样单类型是【个人现金业务】 '税率(个人)'是必填项,不能为空 --");
      } else if (datasAll.hasOwnProperty("含税单价(个人)") != true) {
        throw new Error("--收样单类型是【个人现金业务】 '含税单价(个人)'是必填项,不能为空 --");
      }
      var slAll = datasAll["税率(个人)"]; //税率查询id       '"+slAll+"'
      money = datasAll["含税单价(个人)"];
      var SldaSql = "select * from bd.taxrate.TaxRateVO where code = '" + slAll + "'";
      var Sldares = ObjectStore.queryByYonQL(SldaSql, "ucfbasedoc");
      if (Sldares.length == 0) {
        throw new Error("--税率【" + slAll + "】查询为空,请重新输入--");
      }
      var slNataxRate = Sldares[0].ntaxRate;
      slNataxRate = 1 + slNataxRate / 100;
      wushuijine = money / slNataxRate;
      shuie = money - wushuijine;
      taxRate = Sldares[0].id;
    } else if (sampleReceipt == "临床收费" || sampleReceipt == "科研收费") {
      var PricingSql =
        "select * from AT15F164F008080007.AT15F164F008080007.pricTable where merchant = '" +
        settlementresId +
        "' and project = '" +
        testingsId +
        "' and sydType = '" +
        sampleReceiptId +
        "' and dr = 0";
      var Pricingres = ObjectStore.queryByYonQL(PricingSql, "developplatform");
      if (Pricingres.length == 0) {
        var err = "  -- 收入取价表查询为空,请检查'送检单位,检测项目,收样单类型'字段是否在收入取价表存在税率税额 --  ";
        throw new Error(err);
      }
      wushuijine = Pricingres[0].wushuijine;
      shuie = Pricingres[0].shuie;
      money = Pricingres[0].money;
      taxRate = Pricingres[0].taxRate;
    } else {
      throw new Error("收样单类型输入有误，请排查！");
    }
    //查询客户档案
    var customerProfileSql = "select * from aa.merchant.Merchant where name = '" + settlement + "'";
    var customerProfileres = ObjectStore.queryByYonQL(customerProfileSql, "productcenter");
    var customerProfileId = customerProfileres[0].id;
    //根据客户档案id查询 客户适用范围  看是否 客户单位是否有这个组织
    var RangeSql = "select * from aa.merchant.MerchantApplyRange4UsePower where merchantId = '" + customerProfileId + "' and orgId = '" + zhuZId + "'";
    var Rangeres = ObjectStore.queryByYonQL(RangeSql, "productcenter");
    if (Rangeres.length == 0) {
      var err = "  -- 送检单位与组织不匹配,请重新输入 --  ";
      throw new Error(err);
    }
    //根据送检单位和收样单类型去获取【结算单位】
    var jsdwSql = "select jsMerchant from AT15F164F008080007.AT15F164F008080007.jSandSj where sjMerchant = '" + settlementresId + "' and sydType = '" + sampleReceiptId + "' and dr = 0";
    var jsdwRes = ObjectStore.queryByYonQL(jsdwSql, "developplatform");
    if (jsdwRes.length == 0) {
      var err = "  -- 结算单位在【送检&结算单位配置】界面中没有匹配到--请检查 --  ";
      throw new Error(err);
    }
    var jsMerchant = jsdwRes[0].jsMerchant;
    var YBnumbers = datasAll["样本编号*"] + "";
    var Ybnumbers = YBnumbers.replace(/[, ]/g, "");
    var object = {
      zhuangtai: "10", //状态
      checkStatus: "00", //检测单状态
      isbg: "false", //是否发出报告
      vorgId: zhuZId, //组织
      insItems: testingsId, //检测项目
      jiancefangfa: defineJCFS, //检测方式
      yangbenbianhao: Ybnumbers, //样本编号
      xingming: datasAll["受检者姓名*"], //受检者姓名
      xingbie: datasAll["性别*"], //性别
      nianling: datasAll["年龄*"],
      lianxidianhua: phones, //联系电话
      jinjilianxidianhua1: Jjphone, //紧急联系电话
      idCard: datasAll["身份证号*"], //身份证号
      songjiandanwei: settlementresId, //送检单位
      merchant: jsMerchant, //结算单位
      songjiankeshi: datasAll["送检科室*"], //送检科室
      songjianyi: datasAll["送检医师*"],
      binganhao: datasAll["病案号*"],
      hpvLCZD: datasAll["临床诊断*"],
      xuechanggui: datasAll["血常规*"],
      jiazubingshi: datasAll["家族疾病史"],
      jiwangshi: datasAll["既往史"],
      jcsqType: jcsq, //枚举
      xyType: datasAll["血液样本类型*"], //枚举
      caiyangshijian: cyDate, //采样时间
      dzYbType: datasAll["对照样本类型"], //对照样本类型
      dzYbTime: dzybDate, //对照样本采样时间
      shouyangriqi: syDate, //收样日期
      shouyangren: datasAll["收样人*"], //收样日期
      jisongriqi: jsDate, //寄送日期
      nibaogaoriqi: nbgDate, //拟报告日期
      inspectionStyle: sjystype, //送检形式
      vendor: gysId, //外送单位
      shouyangdanleixing: sampleReceiptId, //收样单类型
      adminOrgVO: businessId, //业务部门
      staffNew: peoZId, //销售员
      ludanyuan: peoZIds, //录入员
      baogaojieshouren: datasAll["报告接收人*"], //报告接收人
      jieshourendianhua: jsrphone, //报告接收电话
      beizhu: datasAll["备注"],
      chanpinxian: weihuID, //产品线
      taxRate: taxRate, //税率id
      qujiabiaoshuie: shuie,
      qujiabiaowushuijine: wushuijine,
      qujiabiaohanshuijine: money
    };
    var res = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });