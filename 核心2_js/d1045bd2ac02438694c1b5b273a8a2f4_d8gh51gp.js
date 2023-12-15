let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询检测订单
    var jcddRes = request.data;
    var jcddid = jcddRes.id;
    var ybbm = jcddRes.sampleCode; //样本编号
    var sydType = jcddRes.SampleUnitType; //收样单类型
    var jcxmid = jcddRes.testItemCode; //项目id
    var inspection = jcddRes.InspectionForm;
    //生成收入凭证
    var ispingzhenghao = jcddRes.hasOwnProperty("srpingzhenghao");
    if (ispingzhenghao == true) {
      throw new Error("已经生成收入凭证、无法进行重复生成");
    }
    //收样单类型为：【临床免费】、【科研免费】的直接退出
    if (sydType == "1585841400606883840") {
      //临床免费(1585841400606883840)
      return { sydType };
    } else if (sydType == "1585840799320899588") {
      //科研免费(1585840799320899588)
      return { sydType };
    }
    //检测项目含税单价
    var yclje = jcddRes.jcprojecthanshuidanjia != undefined ? jcddRes.jcprojecthanshuidanjia : 0;
    var hbje = Number(yclje).toFixed(2);
    //根据检测项目id获取检测项目code
    var jcxmSql = "select * from bd.project.ProjectVO where id = '" + jcxmid + "'";
    var jcxmRes = ObjectStore.queryByYonQL(jcxmSql, "ucfbasedoc");
    var jcxmCode = jcxmRes[0].code;
    //调用查询员工接口
    var staffid = jcddRes.SampleReceiver;
    var peoSql = "select * from hred.staff.Staff where id = '" + staffid + "'";
    var peores = ObjectStore.queryByYonQL(peoSql, "hrcloud-staff-mgr");
    var mobileOld = peores[0].mobile;
    var ygcode = peores[0].code;
    var ygbmid = jcddRes.department;
    var mobile = replace(mobileOld, "+86-", "");
    //查询部门
    let deptSql = "select code from org.funcadminorg.funcadminorg where tenantid = 'youridHere' and id = '" + ygbmid + "'";
    var deptRes = ObjectStore.queryByYonQL(deptSql, "ucf-staff-center");
    var deptCode = deptRes[0].code;
    //查询客户档案
    var khDAid = jcddRes.jiesuandanwei;
    var khdaSql = "select * from aa.merchant.Merchant where id = '" + khDAid + "'";
    var khdaRes = ObjectStore.queryByYonQL(khdaSql, "productcenter");
    var hkflid2 = khdaRes[0].customerClass;
    var level = 0;
    var khdaCode = "";
    while (true) {
      //查询客户档案分类2
      var khflSql2 = "select * from aa.custcategory.CustCategory where id = '" + hkflid2 + "'";
      var khflRes2 = ObjectStore.queryByYonQL(khflSql2, "productcenter");
      level = khflRes2[0].level;
      if (level == 1) {
        khdaCode = khflRes2[0].code;
        break;
      } else {
        hkflid2 = khflRes2[0].parent;
      }
    }
    // 辅助核算项
    var auxSql = "select * from epub.dimension.MultiDimensionExt";
    var auxRes = ObjectStore.queryByYonQL(auxSql, "fiepub");
    var borrow = []; // 借
    var loan = []; //贷
    //查询科目对照表
    var orgId = jcddRes.organizationId;
    //查询收样
    var sampleSql = "select * from	epub.accountbook.AccountBook where accentity = '" + orgId + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "fiepub");
    if (sampleRes.length == 0) {
      throw "该单据的收样组织没有配置账簿，请维护";
    }
    var zhbcode = sampleRes[0].code;
    var subjectRes = request.dateList;
    for (var i = 0; i < subjectRes.length; i++) {
      var kmjdType = subjectRes[i].borrowLendEnum; //借（1） 或者 贷（2）
      if (kmjdType == "1") {
        borrow.push(subjectRes[i]);
      } else {
        loan.push(subjectRes[i]);
      }
    }
    if (borrow.length == 0) {
      throw new Error("没有借方科目");
    } else if (loan.length == 0) {
      throw new Error("没有贷方科目");
    }
    //生成==成本凭证
    var pzbody = {
      accbookCode: zhbcode, //账簿code
      voucherTypeCode: "1", //凭证类型code
      makerMobile: mobile //  mobile
    };
    //收入凭证
    var srbodsz = [];
    var srbodi = {};
    var srclientData = [];
    //项目
    var filedCodexm = "";
    var valueCodexm = jcxmCode;
    //辅助核算 客户 auxRes[3].sourcedoccode
    var filedCodesrkh = "";
    var valueCodesrkh = khdaRes[0].code;
    //辅助核算 部门
    var filedCodesrbm = "";
    var valueCodesrbm = deptCode;
    //辅助核算 员工
    var filedCodesrry = "";
    var valueCodesrry = ygcode;
    //辅助核算 检测项目
    var filedCodesrjcxm = "";
    var valueCodesrjcxm = "";
    //辅助核算 销售渠道
    var filedCodesrxxqd = "";
    var valueCodesrxxqd = khdaCode;
    for (var i = 0; i < auxRes.length; i++) {
      var auxResCode = auxRes[i].code;
      if (auxResCode == "0002") {
        //项目
        filedCodexm = auxResCode;
      } else if (auxResCode == "0005") {
        //客户
        filedCodesrkh = auxResCode;
      } else if (auxResCode == "0001") {
        //部门
        filedCodesrbm = auxResCode;
      } else if (auxResCode == "0003") {
        //员工
        filedCodesrry = auxResCode;
      } else if (auxResCode == "0011") {
        //检测项目
        filedCodesrjcxm = auxResCode;
        valueCodesrjcxm = auxRes[i].sourcedoccode;
      } else if (auxResCode == "0014") {
        //销售渠道
        filedCodesrxxqd = auxResCode;
      }
    }
    //借
    var flzklinjian = false; //应收账款-临检
    var flzkkeyan = false; //应收账款-科研
    //借  收入凭证
    for (var i = 0; i < borrow.length; i++) {
      var borrowData = borrow[i];
      var kmbm = borrowData.accountCode;
      var kmName = borrowData.accountName;
      var fenluNum = borrowData.fenlu;
      //收样单类型
      if (sydType == "1585839648250265603" || sydType == "1585840928148422665") {
        //临床收费(1585840928148422665)、个人现金(1585839648250265603)
        if (fenluNum == "17" && flzklinjian == false) {
          flzklinjian = true;
        } else {
          continue;
        }
        jieone(kmName, kmbm, hbje, filedCodesrkh, valueCodesrkh);
      } else if (sydType == "1585841331888979976") {
        //科研收费(1585841331888979976)
        if (fenluNum == "16" && flzkkeyan == false) {
          flzkkeyan = true;
        } else {
          continue;
        }
        jieone(kmName, kmbm, hbje, filedCodesrkh, valueCodesrkh);
      }
    }
    function jieone(kmName, kmbm, hbje, filedCodesrkh, valueCodesrkh) {
      srbodi = {
        description: kmName, //摘要
        accsubjectCode: kmbm, // 科目编码
        debitOriginal: hbje, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: hbje //	本币借方金额（借贷不能同时填写，原币本币都要填写）
      };
      srclientData = [
        {
          filedCode: filedCodesrkh,
          valueCode: valueCodesrkh
        }
      ];
      //组装收入date
      var srzhjs = srbodi;
      srzhjs.clientAuxiliaryList = srclientData;
      srbodsz.push(srzhjs);
    }
    function jietwo(kmName, kmbm, hbje, filedCodesrbm, valueCodesrbm, filedCodesrry, valueCodesrry) {
      srbodi = {
        description: kmName, //摘要
        accsubjectCode: kmbm, // 科目编码
        debitOriginal: hbje, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: hbje //	本币借方金额（借贷不能同时填写，原币本币都要填写）
      };
      srclientData = [
        {
          filedCode: filedCodesrbm,
          valueCode: valueCodesrbm
        },
        {
          filedCode: filedCodesrry,
          valueCode: valueCodesrry
        }
      ];
    }
    //贷
    var flsrlinjian = false; //主营业务收入-临检
    var flsrkeyan = false; //主营业务收入-科研
    var flyjshuifei = false; //应交税费
    var flshuifshuie = jcddRes.jcprojectshuie;
    var fljcprojectwushuidanjia = jcddRes.jcprojectwushuidanjia;
    //循环 贷
    for (var i = 0; i < loan.length; i++) {
      var loanData = loan[i];
      var kmbm = loanData.accountCode;
      var description = loanData.accountName;
      var fenluNum = loanData.fenlu;
      //收入凭证
      if (sydType == "1585839648250265603" || sydType == "1585840928148422665") {
        //临床收费(1585840928148422665)、个人现金(1585839648250265603)
        if (fenluNum == "19" && flsrlinjian == false) {
          flsrlinjian = true;
        } else {
          continue;
        }
        dai(description, kmbm, hbje, filedCodesrkh, valueCodesrkh, filedCodexm, valueCodexm, filedCodesrxxqd, valueCodesrxxqd);
      } else if (sydType == "1585841331888979976") {
        //科研收费(1585841331888979976)
        //贷 （主营业务收入-科研）22
        if (fenluNum == "20" && flsrkeyan == false) {
          hbje = jcddRes.jcprojectwushuidanjia != undefined ? jcddRes.jcprojectwushuidanjia : 0;
          flsrkeyan = true;
          fljcprojectwushuidanjia = hbje.toFixed(2);
          dai(description, kmbm, fljcprojectwushuidanjia, filedCodesrkh, valueCodesrkh, filedCodexm, valueCodexm, filedCodesrxxqd, valueCodesrxxqd);
        } else if (fenluNum == "22" && flyjshuifei == false) {
          hbje = jcddRes.jcprojectshuie != undefined ? jcddRes.jcprojectshuie : 0;
          flyjshuifei = true;
          if (hbje == 0) {
            continue;
          }
          flshuifshuie = hbje.toFixed(2);
          dai22(description, kmbm, flshuifshuie);
        } else {
          continue;
        }
      } else {
      }
    }
    function dai(description, kmbm, hbje, filedCodesrkh, valueCodesrkh, filedCodexm, valueCodexm, filedCodesrxxqd, valueCodesrxxqd) {
      srbodi = {
        description: description, //摘要
        accsubjectCode: kmbm, // 科目编码
        creditOriginal: hbje, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: hbje //	本币贷方金额（借贷不能同时填写，原币本币都要填写）
      };
      srclientData = [
        {
          filedCode: filedCodesrkh,
          valueCode: valueCodesrkh
        },
        {
          filedCode: filedCodexm,
          valueCode: valueCodexm
        },
        {
          filedCode: filedCodesrxxqd,
          valueCode: valueCodesrxxqd
        }
      ];
      //组装收入date
      var srzhjs = srbodi;
      srzhjs.clientAuxiliaryList = srclientData;
      srbodsz.push(srzhjs);
    }
    function dai22(description, kmbm, hbje) {
      srbodi = {
        description: description, //摘要
        accsubjectCode: kmbm, // 科目编码
        creditOriginal: hbje, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: hbje //	本币贷方金额（借贷不能同时填写，原币本币都要填写）
      };
      //组装收入date
      var srzhjs = srbodi;
      srbodsz.push(srzhjs);
    }
    if (sydType == "1585839648250265603" || sydType == "1585840928148422665") {
      //临床收费(1585840928148422665)、个人现金(1585839648250265603)
      if (flzklinjian == false) {
        throw new Error("收入凭证--借方科目：【应收账款-临检】未在【收入&成本科目对照表】中维护");
      } else if (flsrlinjian == false) {
        throw new Error("收入凭证--贷方科目：【主营业务收入-临检】未在【收入&成本科目对照表】中维护");
      }
    } else if (sydType == "1585841331888979976") {
      //科研收费(1585841331888979976)
      if (flzkkeyan == false) {
        throw new Error("收入凭证--借方科目：【应收账款-科研】未在【收入&成本科目对照表】中维护");
      } else if (flsrkeyan == false && fljcprojectwushuidanjia != 0) {
        throw new Error("收入凭证--贷方科目：【主营业务收入-科研】未在【收入&成本科目对照表】中维护");
      } else if (flyjshuifei == false && flshuifshuie != 0) {
        throw new Error("收入凭证--贷方科目：【应交税费】未在【收入&成本科目对照表】中维护");
      }
    }
    var srbody = pzbody;
    srbody.bodies = srbodsz;
    //成本凭证保存
    let func = extrequire("AT15F164F008080007.utils.getWayUrl");
    let funcres = func.execute(null);
    var gatewayUrl = funcres.gatewayUrl;
    let subjectUrl = gatewayUrl + "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    let subjectApi = openLinker("POST", subjectUrl, "AT15F164F008080007", JSON.stringify(srbody));
    var subjectApijs = JSON.parse(subjectApi);
    if (subjectApijs.code == "200") {
      //回写收入单号
      var billlcode = "记-" + subjectApijs.data.billCode;
      var cbbillCode = { id: jcddid, srpingzhenghao: billlcode };
      var cbbillCodeRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", cbbillCode, "71a4dca4");
      var isBillCode = cbbillCodeRes.srpingzhenghao;
      if (isBillCode != billlcode) {
        throw new Error("回写成本单号失败!");
      }
    } else {
      throw new Error("保存失败：" + subjectApijs.message);
    }
    return { subjectApijs };
  }
}
exports({ entryPoint: MyAPIHandler });