let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //委外项目数据id
    var projectId = request.wID;
    //根据id查询收样管理单
    var selSySql = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where id = '" + projectId + "'";
    var selSyres = ObjectStore.queryByYonQL(selSySql, "developplatform");
    //收样单检测项目id
    var insItemsId = selSyres[0].insItems;
    //查询项目的数据库
    var testingsSql = "select * from bd.project.ProjectVO where id = '" + insItemsId + "'";
    var testingsres = ObjectStore.queryByYonQL(testingsSql, "ucfbasedoc");
    //检测项目code编码
    var codes = testingsres[0].code;
    selSyres[0].codes = codes;
    //检测项目名称
    var projectName = testingsres[0].name;
    selSyres[0].projectNames = projectName;
    //查询税率
    var taxRateId = selSyres[0].taxRate;
    var taxrateSql = "select * from bd.taxrate.TaxRateVO where id='" + taxRateId + "'";
    var taxrateres = ObjectStore.queryByYonQL(taxrateSql, "ucfbasedoc");
    if (taxrateres.length == 0) {
      var err = "  -- 税率查询为空,请检查 --  ";
      throw new Error(err);
    }
    var ntaxRate = taxrateres[0].ntaxRate;
    selSyres[0].ntaxRate = ntaxRate;
    //查询产品线
    var chanpinxianId = selSyres[0].chanpinxian != undefined ? selSyres[0].chanpinxian : 0;
    if (chanpinxianId != 0) {
      var CPNumbsSql = "select * from bd.basedocdef.CustomerDocVO where id = '" + chanpinxianId + "'";
      var CPNumbsRes = ObjectStore.queryByYonQL(CPNumbsSql, "ucfbasedoc");
      if (CPNumbsRes.length == 0) {
        var err = "  -- 产品线字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var nams = CPNumbsRes[0].name;
      selSyres[0].nams = nams;
    }
    //业务员数据库查询
    if (selSyres[0].staffNew != undefined) {
      var staffNews = selSyres[0].staffNew;
      var peoSql = "select * from hred.staff.Staff where id = '" + staffNews + "'";
      var peores = ObjectStore.queryByYonQL(peoSql, "hrcloud-staff-mgr");
      if (peores.length == 0) {
        var err = "  -- 员工查询为空,请检查'员工'字段 --  ";
        throw new Error(err);
      }
      var peoZname = peores[0].name;
      selSyres[0].peoZname = peoZname;
    }
    //录入员数据库查询
    if (selSyres[0].ludanyuan != undefined) {
      var ludanyuans = selSyres[0].ludanyuan;
      var peoSqls = "select * from hred.staff.Staff where id = '" + ludanyuans + "'";
      var peoress = ObjectStore.queryByYonQL(peoSqls, "hrcloud-staff-mgr");
      if (peoress.length == 0) {
        var err = "  -- 员工查询为空,请检查'录入员'字段 --  ";
        throw new Error(err);
      }
      var lrys = peoress[0].name;
      selSyres[0].lrys = lrys;
    }
    //供应商(外送单位引用)数据库查询
    if (selSyres[0].vendor != undefined) {
      var vendors = selSyres[0].vendor;
      var gysSql = "select name from aa.vendor.Vendor where id = '" + vendors + "'";
      var gysRes = ObjectStore.queryByYonQL(gysSql, "yssupplier");
      if (gysRes.length == 0) {
        throw new Error("未查询到该供应商，请检查！");
      }
      var gysResname = gysRes[0].name;
      selSyres[0].gysResname = gysResname;
    }
    //组织数据库查询
    if (selSyres[0].vorgId != undefined) {
      var vorgIds = selSyres[0].vorgId; //'
      var zzSql = "select * from org.func.BaseOrg where id = '" + vorgIds + "'";
      var zzres = ObjectStore.queryByYonQL(zzSql, "orgcenter");
      if (zzres.length == 0) {
        var err = "  -- 组织字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var zhuZname = zzres[0].name;
      selSyres[0].zhuZname = zhuZname;
    }
    //收样单类型数据库查询
    if (selSyres[0].shouyangdanleixing != undefined) {
      var shouyangdanleixings = selSyres[0].shouyangdanleixing;
      var sampleReceiptSql = "select * from bd.basedocdef.CustomerDocVO where id = '" + shouyangdanleixings + "'";
      var sampleReceiptres = ObjectStore.queryByYonQL(sampleReceiptSql, "ucfbasedoc");
      if (sampleReceiptres.length == 0) {
        var err = "  -- 收样单类型字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var sampleReceiptresNames = sampleReceiptres[0].name;
      selSyres[0].sampleReceiptresNames = sampleReceiptresNames;
    }
    //业务  部门数据库查询
    if (selSyres[0].adminOrgVO != undefined) {
      var adminOrgVOs = selSyres[0].adminOrgVO;
      var BusinessDepartment = "select * from org.func.Dept where id = '" + adminOrgVOs + "'";
      var BusinessDepartmentRes = ObjectStore.queryByYonQL(BusinessDepartment, "ucf-org-center");
      if (BusinessDepartmentRes.length == 0) {
        var err = "  -- 业务部门字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var BusinessDepartmentResNames = BusinessDepartmentRes[0].name;
      selSyres[0].BusinessDepartmentResNames = BusinessDepartmentResNames;
    }
    //结算单位数据库查询
    if (selSyres[0].merchant != undefined) {
      var merchants = selSyres[0].merchant;
      var SettlementUnit = "select * from aa.merchant.Merchant where id = '" + merchants + "'";
      var SettlementUnitRes = ObjectStore.queryByYonQL(SettlementUnit, "productcenter");
      if (SettlementUnitRes.length == 0) {
        var err = "  -- 结算单位字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var SettlementUnitNams = SettlementUnitRes[0].name;
      selSyres[0].SettlementUnitNams = SettlementUnitNams;
    }
    //判断类型
    if (selSyres[0].inspectionStyle != undefined) {
      if (selSyres[0].inspectionStyle == "01") {
        var sjxss = "自检";
      } else if (selSyres[0].inspectionStyle == "02") {
        var sjxss = "委外";
      }
      selSyres[0].sjxss = sjxss;
    }
    //判断状态
    if (selSyres[0].zhuangtai != undefined) {
      if (selSyres[0].zhuangtai == "10") {
        var zts = "待提交";
      } else if (selSyres[0].zhuangtai == "20") {
        var zts = "待收样";
      } else if (selSyres[0].zhuangtai == "30") {
        var zts = "已收样";
      } else if (selSyres[0].zhuangtai == "40") {
        var zts = "已完成";
      } else if (selSyres[0].zhuangtai == "50") {
        var zts = "已作废";
      }
      selSyres[0].zts = zts;
    }
    //检测单状态
    if (selSyres[0].checkStatus != undefined) {
      if (selSyres[0].checkStatus == "00") {
        var csts = "待检测";
      } else if (selSyres[0].checkStatus == "05") {
        var csts = "启动检测";
      } else if (selSyres[0].checkStatus == "10") {
        var csts = "检测中";
      } else if (selSyres[0].checkStatus == "20") {
        var csts = "已完成";
      } else if (selSyres[0].checkStatus == "30") {
        var csts = "已终止";
      }
      selSyres[0].csts = csts;
    }
    //是否发出报告
    if (selSyres[0].isbg != undefined) {
      if (selSyres[0].isbg == "true") {
        var isfalsess = "是";
      } else if (selSyres[0].isbg == "false") {
        var isfalsess = "否";
      }
      selSyres[0].isfalsess = isfalsess;
    }
    //亲属是否做过
    if (selSyres[0].qinshushifuzuoguocijiancha != undefined) {
      if (selSyres[0].qinshushifuzuoguocijiancha == "true") {
        var isfalsesss = "是";
      } else if (selSyres[0].qinshushifuzuoguocijiancha == "false") {
        var isfalsesss = "否";
      }
      selSyres[0].isfalsesss = isfalsesss;
    }
    //家族成员中存在45岁绝经
    if (selSyres[0].soaJZBS1 != undefined) {
      if (selSyres[0].soaJZBS1 == "true") {
        var isjuej = "是";
      } else if (selSyres[0].soaJZBS1 == "false") {
        var isjuej = "否";
      }
      selSyres[0].isjuej = isjuej;
    }
    //是否有女性后代
    if (selSyres[0].soaJZBS2 != undefined) {
      if (selSyres[0].soaJZBS2 == "true") {
        var isgirl = "是";
      } else if (selSyres[0].soaJZBS2 == "false") {
        var isgirl = "否";
      }
      selSyres[0].isgirl = isgirl;
    }
    //样本类型
    if (selSyres[0].ybType != undefined) {
      if (selSyres[0].ybType == "10") {
        var ybTS = "宫颈脱落细胞";
      } else if (selSyres[0].ybType == "20") {
        var ybTS = "石蜡切片";
      } else if (selSyres[0].ybType == "30") {
        var ybTS = "其他";
      }
      selSyres[0].ybTS = ybTS;
    }
    if (selSyres[0].hpvFx != undefined) {
      if (selSyres[0].hpvFx == "1") {
        var hpvfxs = "是";
      } else if (selSyres[0].hpvFx == "2") {
        var hpvfxs = "否";
      } else if (selSyres[0].hpvFx == "3") {
        var hpvfxs = "/";
      }
      selSyres[0].hpvfxs = hpvfxs;
    }
    //细胞学检查类型
    if (selSyres[0].xbxjcType != undefined) {
      if (selSyres[0].xbxjcType == "00") {
        var xbxjcs = "正常";
      } else if (selSyres[0].xbxjcType == "10") {
        var xbxjcs = "炎症";
      } else if (selSyres[0].xbxjcType == "20") {
        var xbxjcs = "挖空细胞";
      } else if (selSyres[0].xbxjcType == "30") {
        var xbxjcs = "LSIL";
      } else if (selSyres[0].xbxjcType == "40") {
        var xbxjcs = "HSIL";
      } else if (selSyres[0].xbxjcType == "70") {
        var xbxjcs = "AGC（非典型腺细胞）";
      } else if (selSyres[0].xbxjcType == "99") {
        var xbxjcs = "其他";
      } else if (selSyres[0].xbxjcType == "999") {
        var xbxjcs = "未做检查";
      }
      selSyres[0].xbxjcs = xbxjcs;
    }
    //手术类型
    if (selSyres[0].ssType != undefined) {
      if (selSyres[0].ssType == "10") {
        var sslxs = "leep（环形电切术）";
      } else if (selSyres[0].ssType == "20") {
        var sslxs = "CKC(冷刀锥切术)";
      } else if (selSyres[0].ssType == "30") {
        var sslxs = "子宫切除";
      } else if (selSyres[0].ssType == "40") {
        var sslxs = "物理治疗（激光、冷冻等)";
      } else if (selSyres[0].ssType == "50") {
        var sslxs = "未做手术";
      } else if (selSyres[0].ssType == "60") {
        var sslxs = "/";
      }
      selSyres[0].sslxs = sslxs;
    }
    //术前术后类型
    if (selSyres[0].ssType != undefined) {
      if (selSyres[0].sqshType == "10") {
        var sqshs = "术前";
      } else if (selSyres[0].sqshType == "20") {
        var sqshs = "术后";
      } else if (selSyres[0].sqshType == "30") {
        var sqshs = "/";
      }
      selSyres[0].sqshs = sqshs;
    }
    if (selSyres[0].hpvLCZD != undefined) {
      if (selSyres[0].hpvLCZD == "10") {
        var lczds = "卵巢储备功能减退（DOR）";
      } else if (selSyres[0].hpvLCZD == "20") {
        var lczds = "卵泡耗竭";
      } else if (selSyres[0].hpvLCZD == "30") {
        var lczds = "卵巢早衰（POI）";
      } else if (selSyres[0].hpvLCZD == "40") {
        var lczds = "早绝经";
      } else if (selSyres[0].hpvLCZD == "50") {
        var lczds = "/";
      }
      selSyres[0].lczds = lczds;
    }
    if (selSyres[0].soaLCType != undefined) {
      if (selSyres[0].soaLCType == "10") {
        var lczdsS = "卵巢储备功能减退（DOR）";
      } else if (selSyres[0].soaLCType == "20") {
        var lczdsS = "卵泡耗竭";
      } else if (selSyres[0].soaLCType == "30") {
        var lczdsS = "卵巢早衰（POI）";
      } else if (selSyres[0].soaLCType == "40") {
        var lczdsS = "早绝经";
      } else if (selSyres[0].soaLCType == "50") {
        var lczdsS = "/";
      }
      selSyres[0].lczdsS = lczdsS;
    }
    if (selSyres[0].smaYBType != undefined) {
      if (selSyres[0].smaYBType == "1") {
        var smaYB = "外周血";
      } else if (selSyres[0].smaYBType == "2") {
        var smaYB = "羊水";
      } else if (selSyres[0].smaYBType == "3") {
        var smaYB = "其他";
      }
      selSyres[0].smaYB = smaYB;
    }
    //  性别
    if (selSyres[0].xingbie != undefined) {
      if (selSyres[0].xingbie == "1") {
        var xbs = "男";
      } else if (selSyres[0].xingbie == "2") {
        var xbs = "女";
      }
      selSyres[0].xbs = xbs;
    }
    //失眠
    if (selSyres[0].shimian != undefined) {
      if (selSyres[0].shimian == "20") {
        var sms = "有 轻度";
      } else if (selSyres[0].shimian == "30") {
        var sms = "有 不明显";
      } else if (selSyres[0].shimian == "40") {
        var sms = "有 欠佳";
      } else if (selSyres[0].shimian == "50") {
        var sms = "无";
      }
      selSyres[0].sms = sms;
    }
    if (selSyres[0].dnaYBType != undefined) {
      if (selSyres[0].dnaYBType == "1") {
        var dnaybs = "全血";
      } else if (selSyres[0].dnaYBType == "2") {
        var dnaybs = "血浆";
      } else if (selSyres[0].dnaYBType == "3") {
        var dnaybs = "脑脊液";
      } else if (selSyres[0].dnaYBType == "4") {
        var dnaybs = "肺泡灌洗液";
      } else if (selSyres[0].dnaYBType == "5") {
        var dnaybs = "痰液";
      } else if (selSyres[0].dnaYBType == "6") {
        var dnaybs = "咽拭子";
      } else if (selSyres[0].dnaYBType == "7") {
        var dnaybs = "鼻拭子";
      } else if (selSyres[0].dnaYBType == "8") {
        var dnaybs = "鼻咽拭子";
      } else if (selSyres[0].dnaYBType == "9") {
        var dnaybs = "胸水";
      } else if (selSyres[0].dnaYBType == "10") {
        var dnaybs = "腹水";
      } else if (selSyres[0].dnaYBType == "11") {
        var dnaybs = "穿刺组织";
      } else if (selSyres[0].dnaYBType == "12") {
        var dnaybs = "石蜡切片";
      } else if (selSyres[0].dnaYBType == "13") {
        var dnaybs = "新鲜组织";
      } else if (selSyres[0].dnaYBType == "14") {
        var dnaybs = "房水";
      } else if (selSyres[0].dnaYBType == "15") {
        var dnaybs = "呼吸道病灶灌洗液";
      } else if (selSyres[0].dnaYBType == "16") {
        var dnaybs = "非呼吸道病灶灌洗液";
      } else if (selSyres[0].dnaYBType == "17") {
        var dnaybs = "脓液";
      } else if (selSyres[0].dnaYBType == "18") {
        var dnaybs = "尿液";
      } else if (selSyres[0].dnaYBType == "19") {
        var dnaybs = "阴性对照";
      } else if (selSyres[0].dnaYBType == "20") {
        var dnaybs = "阳性对照";
      } else if (selSyres[0].dnaYBType == "21") {
        var dnaybs = "脑脊液其他";
      } else if (selSyres[0].dnaYBType == "22") {
        var dnaybs = "呼吸道其他";
      } else if (selSyres[0].dnaYBType == "23") {
        var dnaybs = "局灶其他";
      }
      selSyres[0].dnaybs = dnaybs;
    }
    if (selSyres[0].dnaSYType != undefined) {
      if (selSyres[0].dnaSYType == "1") {
        var DNAS = "DNA";
      } else if (selSyres[0].dnaSYType == "2") {
        var DNAS = "RNA";
      } else if (selSyres[0].dnaSYType == "3") {
        var DNAS = "DR";
      }
      selSyres[0].DNAS = DNAS;
    }
    return { selSyres };
  }
}
exports({ entryPoint: MyAPIHandler });