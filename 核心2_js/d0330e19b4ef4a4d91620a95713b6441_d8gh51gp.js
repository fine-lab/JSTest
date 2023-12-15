let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //数据  委外项目导入数据保存api
    var datasAll = request.wordsDatas;
    if (datasAll.hasOwnProperty("样本编号*") != true) {
      throw new Error("  -- '样本编号'是必填项,不能为空 --  ");
    } else if (datasAll.hasOwnProperty("组织*") != true) {
      var err = "  -- '组织'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售员*") != true) {
      var err = "  -- '业务员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("录入员*") != true) {
      var err = "  -- '录入员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售部门*") != true) {
      var err = "  -- '业务部门'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("送检单位*") != true) {
      var err = "  -- '送检单位'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("检测项目编码*") != true) {
      var err = "  -- '检测项目编码'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("受检者姓名*") != true) {
      var err = "  -- '受检者姓名'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样日期*") != true) {
      var err = "  -- '收样日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("采样时间*") != true) {
      var err = "  -- '采样时间'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样单类型*") != true) {
      var err = "  -- '收样单类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("寄送日期*") != true) {
      var err = "  -- '寄送日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("拟报告日期*") != true) {
      var err = "  -- '拟报告日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("样本类型*") != true) {
      var err = "  -- '样本类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("外送单位*") != true) {
      throw new Error(" -- '外送单位'是必填项,不能为空 -- ");
    }
    var phone = datasAll["联系电话"];
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
    //枚举
    var yblxs = datasAll["样本类型*"];
    if (yblxs != "10" && yblxs != "20" && yblxs != "30") {
      throw new Error("  -- 样本类型输入有误,请重新输入 --  ");
    }
    var cyDate = datasAll["采样时间*"]; //采样时间;
    //判断获取的日期是什么类型是number的话就处理日期
    var cyhasNumber = typeof cyDate;
    cyDate = time(cyDate).Dates;
    if (cyhasNumber == "string") {
      var err = "  -- 采样时间时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var syDate = datasAll["收样日期*"]; //收样时间;
    //判断获取的日期是什么类型是number的话就处理日期
    var syhasNumber = typeof syDate;
    syDate = time(syDate).Dates;
    if (syhasNumber == "string") {
      var err = "  -- 收样日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var jsDate = datasAll["寄送日期*"]; //寄送日期;
    //判断获取的日期是什么类型是number的话就处理日期
    var jshasNumber = typeof jsDate;
    jsDate = time(jsDate).Dates;
    if (jshasNumber == "string") {
      var err = "  -- 寄送日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var nbgDate = datasAll["拟报告日期*"]; //拟报告日期;
    //判断获取的日期是什么类型是number的话就处理日期
    var nbghasNumber = typeof nbgDate;
    nbgDate = time(nbgDate).Dates;
    if (nbghasNumber == "string") {
      var err = "  -- 拟报告日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
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
    var zzSql = "select * from org.func.BaseOrg where name = '" + zhuZ + "' and dr=0";
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
    var settlement = datasAll["送检单位*"]; //送检单位
    var settlementSql = "select * from aa.merchant.Merchant where name = '" + settlement + "'";
    var settlementres = ObjectStore.queryByYonQL(settlementSql, "productcenter");
    if (settlementres.length == 0) {
      var err = "  -- 送检单位查询为空,请检查'送检单位'字段 --  ";
      throw new Error(err);
    }
    //查询送检单位id
    var settlementresId = settlementres[0].id;
    var sampleReceipt = datasAll["收样单类型*"]; //收样单类型
    var sampleReceiptSql = "select * from bd.basedocdef.CustomerDocVO where name = '" + sampleReceipt + "' and dr=0";
    var sampleReceiptres = ObjectStore.queryByYonQL(sampleReceiptSql, "ucfbasedoc");
    if (sampleReceiptres.length == 0) {
      var err = "  -- 收样单类型查询为空,请检查'收样单类型'字段 --  ";
      throw new Error(err);
    }
    //查询收样单类型id
    var sampleReceiptId = sampleReceiptres[0].id;
    var testings = datasAll["检测项目编码*"]; //检测项目编码
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
      throw new Error(" -- 产品线未维护 --");
    }
    var attrext = arrayByTestingsres.defineCharacter;
    if (attrext.hasOwnProperty("attrext12") == false) {
      var err = "-- " + arrayByTestingsres.code + "：项目没有绑定产品线,请检查 --";
      throw new Error(err);
    }
    var weihuID = attrext.attrext12;
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
    //根据客户档案id查询 客户适用范围  看是否 客户单位是否有这个组织
    var RangeSql = "select * from aa.merchant.MerchantApplyRange4UsePower where merchantId = '" + settlementresId + "' and orgId = '" + zhuZId + "'";
    var Rangeres = ObjectStore.queryByYonQL(RangeSql, "productcenter");
    if (Rangeres.length == 0) {
      var err = "  -- 结算单位与组织不匹配,请重新输入 --  ";
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
    //获取供应商的ID  （根据名称获取）
    //根据送检单位和收样单类型去获取【结算单位】
    var gysName = datasAll["外送单位*"];
    gysName = gysName.replace(/[, ]/g, "");
    var gysSql = "select id from aa.vendor.Vendor where name = '" + gysName + "'";
    var gysRes = ObjectStore.queryByYonQL(gysSql, "yssupplier");
    if (gysRes.length == 0) {
      throw new Error("未查询到【" + gysName + "】该供应商，请检查！");
    }
    var gysId = gysRes[0].id;
    var YBnumbers = datasAll["样本编号*"] + "";
    var Ybnumbers = YBnumbers.replace(/[, ]/g, "");
    var object = {
      zhuangtai: "10", //状态
      checkStatus: "00", //检测单状态
      isbg: "false", //是否发出报告
      yangbenbianhao: Ybnumbers,
      vorgId: zhuZId, //组织
      adminOrgVO: businessId, //业务部门
      staffNew: peoZId, //业务员
      ludanyuan: peoZIds, //录入员
      merchant: jsMerchant, //结算单位
      songjiandanwei: settlementresId, //送检单位
      songjiandanweibeizhu: datasAll["送检单位备注"],
      insItems: testingsId, //检测项目
      chanpinxian: weihuID, //产品线
      yuanyangbenbianhao: datasAll["原样本编号"],
      wuliaodanhao: datasAll["物流单号"],
      shouyangriqi: syDate, //收样日期
      caiyangshijian: cyDate, //采样时间
      inspectionStyle: "02",
      shouyangdanleixing: sampleReceiptId, //收样单类型
      vendor: gysId, //外送单位（供应商）
      taxRate: taxRate, //税率id
      qujiabiaoshuie: shuie,
      qujiabiaowushuijine: wushuijine,
      qujiabiaohanshuijine: money,
      jisongriqi: jsDate, //寄送日期
      nibaogaoriqi: nbgDate, //拟报告日期
      xingming: datasAll["受检者姓名*"],
      idCard: datasAll["身份证号"],
      nianling: datasAll["年龄"],
      lianxidianhua: phones,
      ybType: datasAll["样本类型*"],
      beizhu: datasAll["备注"]
    };
    var res = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });