let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //数据SOA(	肿瘤检测导入模板api)
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
    } else if (datasAll.hasOwnProperty("姓名*") != true) {
      var err = "  -- '受检者姓名'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("年龄*") != true) {
      var err = "  -- '年龄'是必填项,不能为空 --  ";
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
    } else if (datasAll.hasOwnProperty("对照样本采样日期*") != true) {
      var err = "  -- '对照样本采样日期*'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("样本类型*") != true) {
      var err = "  -- '样本类型'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("检测项目编码*") != true) {
      var err = "  -- '检测项目编码'是必填项,不能为空 --  ";
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
    } else if (datasAll.hasOwnProperty("销售部门*") != true) {
      var err = "  -- '销售部门'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("销售员*") != true) {
      var err = "  -- '销售员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("录入员*") != true) {
      var err = "  -- '录入员'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("收样日期*") != true) {
      var err = "  -- '收样日期'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("ID*") != true) {
      var err = "  -- 'ID'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("民族*") != true) {
      var err = "  -- '民族'是必填项,不能为空 --  ";
      throw new Error(err);
    } else if (datasAll.hasOwnProperty("出生年月*") != true) {
      var err = "  -- '出生年月'是必填项,不能为空 --  ";
      throw new Error(err);
    }
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
    var jsrphone = datasAll["接收人电话"];
    if (jsrphone != null) {
      jsrphone = jsrphone + "";
      if (jsrphone.length != 11) {
        var err = "  -- 接收人电话不满11位，请检查 --  ";
        throw new Error(err);
      }
      if (!myreg.test(jsrphone)) {
        throw new Error(" -- 接收人电话格式不正确 -- ");
      }
      jsrphone = "+86-" + jsrphone + "";
    }
    //枚举
    var YBLX = datasAll["样本类型*"];
    if (YBLX != "10" && YBLX != "20" && YBLX != "30" && YBLX != "40" && YBLX != "50" && YBLX != "60" && YBLX != "70" && YBLX != "80" && YBLX != "99") {
      throw new Error("  -- 样本类型输入有误,请重新输入 --  ");
    }
    //枚举
    var sexs = datasAll["性别"];
    if (sexs != null) {
      if (sexs != "1" && sexs != "2") {
        throw new Error("  -- 性别输入有误,请重新输入 --  ");
      }
    }
    //验证整数或数字
    var tall = datasAll["身高"];
    if (tall != null) {
      var tallNumber = typeof tall;
      if (tallNumber != "number") {
        throw new Error("  -- 身高输入格式有误,请重新输入 --  ");
      }
    }
    var tizs = datasAll["体重"];
    if (tizs != null) {
      var tizsNumber = typeof tizs;
      if (tizsNumber != "number") {
        throw new Error("  -- 体重输入格式有误,请重新输入 --  ");
      }
    }
    var ccage = datasAll["初潮年龄"];
    if (ccage != null) {
      var ccageNumber = typeof ccage;
      if (ccageNumber != "number") {
        throw new Error("  -- 初潮年龄输入格式有误,请重新输入 --  ");
      }
    }
    var rscss = datasAll["妊娠次数"];
    if (rscss != null) {
      var rscssNumber = typeof rscss;
      if (rscssNumber != "number") {
        throw new Error("  -- 妊娠次数输入格式有误,请重新输入 --  ");
      }
    }
    var sccss = datasAll["生产次数"];
    if (sccss != null) {
      var sccssNumber = typeof sccss;
      if (sccssNumber != "number") {
        throw new Error("  -- 生产次数输入格式有误,请重新输入 --  ");
      }
    }
    var lccss = datasAll["流产次数"];
    if (lccss != null) {
      var lccssNumber = typeof lccss;
      if (lccssNumber != "number") {
        throw new Error("  -- 流产次数输入格式有误,请重新输入 --  ");
      }
    }
    //判断【突变鉴定是否为本公司检测产品】传的值是否正确
    var isjccpTF = datasAll["突变鉴定是否为本公司检测产品"];
    if (isjccpTF != null) {
      isjccpTF = isjccpTF + "";
      if (isjccpTF != "true" && isjccpTF != "false") {
        throw new Error("-- '突变鉴定是否为本公司检测产品'输入有误,请重新输入 --");
      }
    }
    //如果【突变鉴定是否为本公司检测产品】为 ‘true’  产品名称必填
    if (isjccpTF == "true") {
      var cpmc = datasAll["如是，产品名称"];
      if (cpmc == null) {
        throw new Error("  -- '如是，产品名称',不能为空 --  ");
      }
    }
    var cyDate = datasAll["对照样本采样日期*"]; //采样时间;*
    //判断获取的日期是什么类型是number的话就处理日期
    var cyhasNumber = typeof cyDate;
    if (cyhasNumber == "string") {
      var err = "  -- 对照样本采样日期格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    cyDate = time(cyDate).Dates;
    var dzybcyrq = datasAll["肿瘤样本采样日期"]; //采样时间;*
    //判断获取的日期是什么类型是number的话就处理日期
    var dzybcyrqNumber = typeof dzybcyrq;
    if (dzybcyrqNumber == "string") {
      var err = "  -- 肿瘤样本采样日期格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    dzybcyrq = time(dzybcyrq).Dates;
    var dzybsyrq = datasAll["肿瘤样本收样日期"]; //收样日期;*
    //判断获取的日期是什么类型是number的话就处理日期
    var dzybsyrqNumber = typeof dzybsyrq;
    if (dzybsyrqNumber == "string") {
      var err = "  -- 肿瘤样本收样日期格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    dzybsyrq = time(dzybsyrq).Dates;
    var csny = datasAll["出生年月*"]; //出生年月*
    //判断获取的日期是什么类型是number的话就处理日期
    var csnyrqNumber = typeof csny;
    if (csnyrqNumber == "string") {
      var err = "  -- '出生年月'格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    csny = time(csny).Dates;
    var jsDate = datasAll["寄送日期*"]; //寄送日期; *
    //判断获取的日期是什么类型是number的话就处理日期
    var jshasNumber = typeof jsDate;
    if (jshasNumber == "string") {
      var err = "  -- 寄送日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    jsDate = time(jsDate).Dates;
    var nbgDate = datasAll["拟报告日期*"]; //拟报告日期; *
    //判断获取的日期是什么类型是number的话就处理日期
    var nbghasNumber = typeof nbgDate;
    if (nbghasNumber == "string") {
      var err = "  -- 拟报告日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    nbgDate = time(nbgDate).Dates;
    var syrqDate = datasAll["收样日期*"]; //收样日期; *
    //判断获取的日期是什么类型是number的话就处理日期
    var syrqNumber = typeof syrqDate;
    if (syrqNumber == "string") {
      var err = "  -- 收样日期时间格式不正确,请重新输入 --  ";
      throw new Error(err);
    }
    syrqDate = time(syrqDate).Dates;
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
      var err = "  -- 业务员查询为空,请检查'销售员'字段 --  ";
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
    //查询收样单类型id
    var sampleReceipt = datasAll["收样单类型*"]; //收样单类型
    var sampleReceiptSql = "select * from bd.basedocdef.CustomerDocVO where name = '" + sampleReceipt + "' and dr=0";
    var sampleReceiptres = ObjectStore.queryByYonQL(sampleReceiptSql, "ucfbasedoc");
    if (sampleReceiptres.length == 0) {
      var err = "  -- 收样单类型查询为空,请检查'收样单类型'字段 --  ";
      throw new Error(err);
    }
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
      var err = "  -- 业务部门查询为空,请检查'业务部门'字段 --  ";
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
    var YBnumbers = datasAll["样本编号*"] + "";
    var Ybnumbers = YBnumbers.replace(/[, ]/g, "");
    var object = {
      yangbenbianhao: Ybnumbers,
      xingming: datasAll["姓名*"],
      xingbie: datasAll["性别"],
      jiguan: datasAll["籍贯"],
      minzu: datasAll["民族*"],
      soaJZBScsny: csny,
      nianling: datasAll["年龄*"],
      idCard: datasAll["身份证号"],
      lianxidianhua: phones,
      dataId: datasAll["ID*"],
      zlType: datasAll["样本类型*"],
      otherTxt: datasAll["肿瘤样本取样部位"],
      duizhaoyangbenquyangbuwei: datasAll["对照样本取样部位"],
      qiepianbianhao: datasAll["组织编号1(病理号)"],
      qiepianbianhao2: datasAll["组织编号2(病理号)"],
      zhongliuyangbenshouyangriqi: dzybsyrq,
      shengao: datasAll["身高"],
      tizhong: datasAll["体重"],
      chuchaonianling: datasAll["初潮年龄"],
      renshencishu: datasAll["妊娠次数"],
      shengchancishu: datasAll["生产次数"],
      liuchancishu: datasAll["流产次数"],
      merchant: jsMerchant, //结算单位
      songjiandanwei: settlementresId, //送检单位
      songjiandanweibeizhu: datasAll["送检单位备注"],
      songjiankeshi: datasAll["送检科室*"], //送检单位 跟结算单位一样取值
      songjianyi: datasAll["送检医师*"],
      caiyangshijian: cyDate, //采样时间
      zhongliuyangbencaiyangriqi: dzybcyrq, //肿瘤样本采样日期
      shouyangriqi: syrqDate, //收样日期
      beizhu: datasAll["备注"],
      qiepianbianhao: datasAll["切片编号"],
      yiyuanbianhao: datasAll["医院编号"],
      jiazubingshi: datasAll["家族疾病史"],
      zhongliuleixing: datasAll["肿瘤类型"],
      binglileixing: datasAll["病理类型"],
      linchuangfenqi: datasAll["临床分期"],
      chuciquezhenshijian: datasAll["初次确诊时间"],
      shifuzhuanyi: datasAll["是否转移"],
      shifuzhuanyibuwei: datasAll["转移部位"],
      jiwangzhiliaofangshi: datasAll["既往治疗方式"],
      shoushushi: datasAll["手术史"],
      shuxueshishuxueshijian: datasAll["输血史/输血时间"],
      jiwangzhiliaoyongyaofanganshijian: datasAll["既往治疗用药方案"],
      yongyaoshijian: datasAll["用药时间"],
      gerenjiyinjianceshi: datasAll["个人基因检测史"],
      jiaxizhongqinshutedingjiyinpeixitubianqingkuang: datasAll["家系中亲属特定基因胚系突变情况"],
      tubianxiedaizheyubenrendeguanxi: datasAll["突变携带者与本人的关系"],
      tubianjiandingshifuweibengongsijiancechanpin: isjccpTF, //突变鉴定是否为本公司检测产品
      chanpinmingchen: cpmc, //产品名称
      hpvLCZD: datasAll["临床诊断"],
      jiwangshi: datasAll["既往史"],
      insItems: testingsId, //检测项目
      chanpinxian: weihuID, //产品线
      inspectionStyle: "01",
      shouyangdanleixing: sampleReceiptId, //收样单类型
      jisongriqi: jsDate, //寄送日期
      nibaogaoriqi: nbgDate, //拟报告日期
      taxRate: taxRate, //税率id
      qujiabiaoshuie: shuie,
      qujiabiaowushuijine: wushuijine,
      qujiabiaohanshuijine: money,
      wuliaodanhao: datasAll["物流单号"],
      baogaojieshouren: datasAll["报告接收人"],
      jieshourendianhua: jsrphone,
      youjidizhi: datasAll["邮寄地址"],
      vorgId: zhuZId, //组织
      adminOrgVO: businessId, //业务部门
      staffNew: peoZId, //业务员
      ludanyuan: peoZIds, //录入员
      zhuangtai: "10", //状态
      checkStatus: "00", //检测单状态
      isbg: "false" //是否发出报告
    };
    var res = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });