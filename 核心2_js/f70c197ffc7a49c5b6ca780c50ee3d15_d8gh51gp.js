let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //数据HPV模板导入 hpv导入数据保存api
    var datasAll = request.wordsDatas;
    var idNumber = datasAll["身份证号"];
    if (idNumber != null) {
      if (idNumber.length != 18 && idNumber.length != 16) {
        var err = "  -- 身份证号格式错误,请重新输入 --  ";
        throw new Error(err);
      }
    }
    if (datasAll.hasOwnProperty("样本编号*") != true) {
      var err = "  -- '样本编号'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("采样时间*") != true) {
      var err = "  -- '采样时间'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样时间*") != true) {
      var err = "  -- '收样时间'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("姓名*") != true) {
      var err = "  -- '姓名'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("籍贯*") != true) {
      var err = "  -- '籍贯'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("联系电话*") != true) {
      var err = "  -- '联系电话'是必填项,不能为空 --  ";
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
    } else if (datasAll.hasOwnProperty("样本类型*") != true) {
      var err = "  -- '样本类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("HPV型别*") != true) {
      var err = "  -- 'HPV型别'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("细胞学检查*") != true) {
      var err = "  -- '细胞学检查'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("阴道镜检查*") != true) {
      var err = "  -- '阴道镜检查'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("组织活检*") != true) {
      var err = "  -- '组织活检'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("手术类型*") != true) {
      var err = "  -- '手术类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("术前术后*") != true) {
      var err = "  -- '术前术后'是必填项,不能为空 --  ";
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
    } else if (datasAll.hasOwnProperty("组织*") != true) {
      var err = "  -- '组织'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售员*") != true) {
      var err = "  -- '销售员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售部门*") != true) {
      var err = "  -- '销售部门'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("ID*") != true) {
      var err = "  -- 'ID'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("录入员*") != true) {
      var err = "  -- '录入员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("细胞学检查补充结果*") != true) {
      var err = "  -- '细胞学检查补充结果'是必填项,不能为空 --  ";
      throw new Error(err);
    }
    //校验手机号是不是十一位;
    var phone = datasAll["联系电话*"];
    phone = phone + "";
    if (phone.length != 11) {
      throw new Error("手机号错误请检查");
    }
    var myreg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      throw new Error(" -- 联系电话格式不正确 -- ");
    }
    var phones = "+86-" + phone + "";
    //枚举
    var YBLX = datasAll["样本类型*"];
    if (YBLX != "10" && YBLX != "20" && YBLX != "30") {
      throw new Error("  -- 样本类型输入有误,请重新输入 --  ");
    }
    //枚举
    var XXBJC = datasAll["细胞学检查*"];
    if (XXBJC != "00" && XXBJC != "10" && XXBJC != "20" && XXBJC != "30" && XXBJC != "40" && XXBJC != "70" && XXBJC != "99" && XXBJC != "999") {
      throw new Error("  -- 细胞学检查输入有误,请重新输入 --  ");
    }
    //枚举
    var SSLXS = datasAll["手术类型*"];
    if (SSLXS != "10" && SSLXS != "20" && SSLXS != "30" && SSLXS != "40" && SSLXS != "50" && SSLXS != "60") {
      throw new Error("  -- 手术类型输入有误,请重新输入 --  ");
    }
    //枚举
    var SQSHS = datasAll["术前术后*"];
    if (SQSHS != "10" && SQSHS != "20" && SQSHS != "30") {
      throw new Error("  -- 术前术后输入有误,请重新输入 --  ");
    }
    //枚举
    var hpvfxs = datasAll["HPV分型"];
    if (hpvfxs != null) {
      if (hpvfxs != "1" && hpvfxs != "2" && hpvfxs != "3") {
        throw new Error("  -- HPV分型输入有误,请重新输入 --  ");
      }
    }
    var cyDate = datasAll["采样时间*"]; //采样时间;
    //判断获取的日期是什么类型是number的话就处理日期
    var cyhasNumber = typeof cyDate;
    cyDate = time(cyDate).Dates;
    if (cyhasNumber == "string") {
      var err = "  -- 采样时间时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var syDate = datasAll["收样时间*"]; //收样时间;
    //判断获取的日期是什么类型是number的话就处理日期
    var syhasNumber = typeof syDate;
    syDate = time(syDate).Dates;
    if (syhasNumber == "string") {
      var err = "  -- 收样时间时间格式不正确,请重新输入 --  ";
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
      var err = "  -- 拟报告日期格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    var sjbgDate = datasAll["实际报告日期"]; //实际报告日期;
    if (sjbgDate != null) {
      //判断获取的日期是什么类型是number的话就处理日期
      var sjbghasNumber = typeof sjbgDate;
      sjbgDate = time(sjbgDate).Dates;
      if (sjbghasNumber == "string") {
        var err = "  -- 实际报告日期格式不正确,请重新输入 --  ";
        throw new Error(err);
      }
    }
    var sjsj7 = datasAll["手术时间"]; //手术时间;
    if (sjsj7 != null) {
      //判断获取的日期是什么类型是number的话就处理日期
      var sjsj7Number = typeof sjsj7;
      sjsj7 = time(sjsj7).Dates;
      if (sjsj7Number == "string") {
        var err = "  -- 手术时间日期格式不正确,请重新输入 --  ";
        throw new Error(err);
      }
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
    var zhuZ = datasAll["组织*"]; //组织  fullname
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
    var settlement = datasAll["送检单位*"]; //送检单位   enterpriseName
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
      yangbenbianhao: Ybnumbers, //样本编号
      caiyangshijian: cyDate, //采样时间
      shouyangriqi: syDate, //收样日期
      xingming: datasAll["姓名*"],
      dataId: datasAll["ID*"],
      jiguan: datasAll["籍贯*"],
      nianling: datasAll["年龄"],
      idCard: datasAll["身份证号"],
      lianxidianhua: phones,
      jinjilianxidianhua1: datasAll["紧急联系电话1"],
      jinjilianxidianhua2: datasAll["紧急联系电话2"],
      songjiandanwei: settlementresId,
      merchant: jsMerchant,
      songjiandanweibeizhu: datasAll["送检单位备注"],
      songjiankeshi: datasAll["送检科室*"], //送检单位 跟结算单位一样取值
      songjianyi: datasAll["送检医师*"],
      ybType: datasAll["样本类型*"],
      hpvFx: datasAll["HPV分型"],
      hpvType: datasAll["HPV型别*"],
      hpvTime: datasAll["检查时间"], //检查时间
      xbxjcType: datasAll["细胞学检查*"],
      xibaoxuejianchabuchongjieguo: datasAll["细胞学检查补充结果*"],
      xbTime: datasAll["细胞学检查时间"],
      yindaojingjiancha: datasAll["阴道镜检查*"],
      ydTime: datasAll["阴道镜检查时间"],
      zzhj: datasAll["组织活检*"],
      zzhjTime: datasAll["活检检查时间"],
      jiazubingshi: datasAll["家族病史"],
      jiwangshi: datasAll["既往史"],
      shoushushijian: sjsj7, //手术时间
      ssType: datasAll["手术类型*"],
      sqshType: datasAll["术前术后*"],
      beizhu: datasAll["备注"],
      hpvLCZD: datasAll["临床诊断"],
      yiyuanbianhao: datasAll["医院编号"],
      inspectionStyle: "01",
      shouyangdanleixing: sampleReceiptId,
      adminOrgVO: businessId, //业务部门
      insItems: testingsId, //检测项目
      wuliaodanhao: datasAll["物流单号"],
      taxRate: taxRate, //税率id
      qujiabiaoshuie: shuie,
      qujiabiaowushuijine: wushuijine,
      qujiabiaohanshuijine: money,
      jisongriqi: jsDate,
      nibaogaoriqi: nbgDate,
      vorgId: zhuZId, //组织
      chanpinxian: weihuID, //产品线
      ludanyuan: peoZIds, //录入员
      staffNew: peoZId //员工
    };
    var res = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });