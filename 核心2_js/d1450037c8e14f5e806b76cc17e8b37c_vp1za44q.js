let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询检测订单
    var jcddRes = request.data;
    var jcddid = jcddRes.id;
    //已经生成成本凭证的无法进行重复提交
    var ispingzhenghao = jcddRes.hasOwnProperty("pingzhenghao");
    if (ispingzhenghao == true) {
      throw new Error("已经生成成本凭证、无法进行重复生成");
    }
    var ybbm = jcddRes.sampleCode; //样本编码
    var sydType = jcddRes.SampleUnitType; //收样单类型
    var jcxmid = jcddRes.testItemCode; //项目id
    var inspection = jcddRes.InspectionForm;
    //成本总金额;
    var hbje = jcddRes.allMoney;
    hbje = hbje.toFixed(2);
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
    var ygbmid = peores[0].deptId;
    var mobile = replace(mobileOld, "+86-", "");
    //查询部门
    let deptSql = "select code from org.funcadminorg.funcadminorg where tenantid = 'youridHere' and id = '" + ygbmid + "'";
    var deptRes = ObjectStore.queryByYonQL(deptSql, "ucf-staff-center");
    var deptCode = deptRes[0].code;
    // 辅助核算项
    var auxSql = "select * from epub.dimension.MultiDimensionExt";
    var auxRes = ObjectStore.queryByYonQL(auxSql, "fiepub");
    //项目
    var filedCodecb = "";
    var valueCodecb = jcxmCode;
    //辅助核算 部门  dept
    var filedCodesrbm = "";
    var valueCodesrbm = deptCode;
    //辅助核算 人员
    var filedCodesrry = "";
    var valueCodesrry = ygcode;
    for (var i = 0; i < auxRes.length; i++) {
      var auxResCode = auxRes[i].code;
      if (auxResCode == "0002") {
        //项目
        filedCodecb = auxResCode;
      } else if (auxResCode == "0001") {
        //部门
        filedCodesrbm = auxResCode;
      } else if (auxResCode == "0003") {
        //员工
        filedCodesrry = auxResCode;
      }
    }
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
      throw new Error("成本没有借方科目");
    } else if (loan.length == 0) {
      throw new Error("成本没有贷方科目");
    }
    //生成==成本凭证
    var pzbody = {
      accbookCode: zhbcode, //账簿code
      voucherTypeCode: "1", //凭证类型code
      makerMobile: "18372753151" //
    };
    var cbbodsz = [];
    var cbbodi = {};
    var cbclientData = [];
    //分录每一个的判断；
    var fllinjian = false; //主营业务成本-临检
    var flkeyan = false; //主营业务成本-科研
    var fltuiguangfei = false; //销售费用_推广费
    //循环 借
    for (var i = 0; i < borrow.length; i++) {
      var borrowData = borrow[i];
      var kmbm = borrowData.accountCode;
      var kmName = borrowData.accountName;
      var fenluNum = borrowData.fenlu;
      //收样单类型
      //临床收费(1585840928148422665)、个人现金(1585839648250265603)
      if (sydType == "1585840928148422665" || sydType == "1585839648250265603") {
        if (fenluNum == "14" && fllinjian == false) {
          fllinjian = true;
        } else {
          continue;
        }
        cbbodi = {
          description: kmName, //摘要
          accsubjectCode: kmbm, // 科目编码
          debitOriginal: hbje, //原币借方金额（借贷不能同时填写，原币本币都要填写）
          debitOrg: hbje //	本币借方金额（借贷不能同时填写，原币本币都要填写）
        };
        cbclientData = [
          {
            filedCode: filedCodecb,
            valueCode: valueCodecb
          }
        ];
      } else if (sydType == "1585841331888979976") {
        //科研收费(1585841331888979976)
        if (fenluNum == "15" && flkeyan == false) {
          flkeyan = true;
        } else {
          continue;
        }
        cbbodi = {
          description: kmName, //摘要
          accsubjectCode: kmbm, // 科目编码
          debitOriginal: hbje, //原币借方金额（借贷不能同时填写，原币本币都要填写）
          debitOrg: hbje //	本币借方金额（借贷不能同时填写，原币本币都要填写）
        };
        cbclientData = [
          {
            filedCode: filedCodecb,
            valueCode: valueCodecb
          }
        ];
      } else if (sydType == "1585841400606883840" || sydType == "1585840799320899588") {
        //临床免费(1585841400606883840)  科研免费(1585840799320899588)
        if (fenluNum == "18" && fltuiguangfei == false) {
          fltuiguangfei = true;
        } else {
          continue;
        }
        cbbodi = {
          description: kmName, //摘要
          accsubjectCode: kmbm, // 科目编码
          debitOriginal: hbje, //原币借方金额（借贷不能同时填写，原币本币都要填写）
          debitOrg: hbje //	本币借方金额（借贷不能同时填写，原币本币都要填写）
        };
        cbclientData = [
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
      //组装成本子表
      var cbzzjs = cbbodi;
      cbzzjs.clientAuxiliaryList = cbclientData;
      cbbodsz.push(cbzzjs);
    }
    //判断检测订单可以生成字段的就可以
    var isShiji = jcddRes.hasOwnProperty("shiji"); //试剂
    if (isShiji == true) {
      var shiji = jcddRes.shiji;
      if (shiji == "0.0") {
        isShiji = false;
      }
    }
    var isHaocai = jcddRes.hasOwnProperty("haocai"); //耗材
    if (isHaocai == true) {
      var haocai = jcddRes.haocai;
      if (haocai == "0.0") {
        isHaocai = false;
      }
    }
    var isGongzi = jcddRes.hasOwnProperty("gongzi"); //工资
    if (isGongzi == true) {
      var gongzi = jcddRes.gongzi;
      if (gongzi == "0.0") {
        isGongzi = false;
      }
    }
    var isjiangjin = jcddRes.hasOwnProperty("jiangjin"); //奖金
    if (isjiangjin == true) {
      var jiangjin = jcddRes.jiangjin;
      if (jiangjin == "0.0") {
        isjiangjin = false;
      }
    }
    var isyanglaobaoxian = jcddRes.hasOwnProperty("yanglaobaoxian"); //养老保险
    if (isyanglaobaoxian == true) {
      var yanglaobaoxian = jcddRes.yanglaobaoxian;
      if (yanglaobaoxian == "0.0") {
        isyanglaobaoxian = false;
      }
    }
    var isyiliaobaoxian = jcddRes.hasOwnProperty("yiliaobaoxian"); //医疗保险
    if (isyiliaobaoxian == true) {
      var yiliaobaoxian = jcddRes.yiliaobaoxian;
      if (yiliaobaoxian == "0.0") {
        isyiliaobaoxian = false;
      }
    }
    var isshiyebaoxian = jcddRes.hasOwnProperty("shiyebaoxian"); //失业保险
    if (isshiyebaoxian == true) {
      var shiyebaoxian = jcddRes.shiyebaoxian;
      if (shiyebaoxian == "0.0") {
        isshiyebaoxian = false;
      }
    }
    var isshengyubaoxian = jcddRes.hasOwnProperty("shengyubaoxian"); //生育保险
    if (isshengyubaoxian == true) {
      var shengyubaoxian = jcddRes.shengyubaoxian;
      if (shengyubaoxian == "0.0") {
        isshengyubaoxian = false;
      }
    }
    var isgongshangbaoxian = jcddRes.hasOwnProperty("gongshangbaoxian"); //工伤保险
    if (isgongshangbaoxian == true) {
      var gongshangbaoxian = jcddRes.gongshangbaoxian;
      if (gongshangbaoxian == "0.0") {
        isgongshangbaoxian = false;
      }
    }
    var isgongjijin = jcddRes.hasOwnProperty("gongjijin"); //公积金
    if (isgongjijin == true) {
      var gongjijin = jcddRes.gongjijin;
      if (gongjijin == "0.0") {
        isgongjijin = false;
      }
    }
    var isyuangongfuli = jcddRes.hasOwnProperty("yuangongfuli"); //员工福利
    if (isyuangongfuli == true) {
      var yuangongfuli = jcddRes.yuangongfuli;
      if (yuangongfuli == "0.0") {
        isyuangongfuli = false;
      }
    }
    var isgongxuweiwaifei = jcddRes.hasOwnProperty("gongxuweiwaifei"); //工序委外费
    if (isgongxuweiwaifei == true) {
      var gongxuweiwaifei = jcddRes.gongxuweiwaifei;
      if (gongxuweiwaifei == "0.0") {
        isgongxuweiwaifei = false;
      }
    }
    var isshengchanchengben = jcddRes.hasOwnProperty("shengchanchengben"); //生产成本辅助
    if (isshengchanchengben == true) {
      var shengchanchengben = jcddRes.shengchanchengben;
      if (shengchanchengben == "0.0") {
        isshengchanchengben = false;
      }
    }
    var isweiwaiwushuidanjia = jcddRes.hasOwnProperty("weiwaiwushuidanjia"); //委外含税单价
    if (isweiwaiwushuidanjia == true) {
      var weiwaiwushuidanjia = jcddRes.weiwaiwushuidanjia;
      if (weiwaiwushuidanjia == "0.0") {
        isweiwaiwushuidanjia = false;
      }
    }
    //分录每一个的判断；
    var flShiji = false; //试剂
    var flHaocai = false; //耗材
    var flGongzi = false; //工资
    var fljiangjin = false; //奖金
    var flyanglaobaoxian = false; //养老保险
    var flyiliaobaoxian = false; //医疗保险
    var flshiyebaoxian = false; //失业保险
    var flshengyubaoxian = false; //生育保险
    var flgongshangbaoxian = false; //工伤保险
    var flgongjijin = false; //公积金
    var flyuangongfuli = false; //员工福利
    var flgongxuweiwaifei = false; //工序委外费
    var flshengchanchengben = false; //生产成本辅助
    var flweiwaiwushuidanjia = false; //委外含税单价
    //循环 贷
    for (var i = 0; i < loan.length; i++) {
      var loanData = loan[i];
      var kmbm = "";
      var description = "";
      var dfje = "";
      var fenluNum = loanData.fenlu;
      if (fenluNum == "1" && inspection == "01" && flShiji == false) {
        if (isShiji == true) {
          flShiji = true;
          shiji = jcddRes.shiji;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(shiji).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "2" && inspection == "01" && flHaocai == false) {
        if (isHaocai == true) {
          flHaocai = true;
          haocai = jcddRes.haocai;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(haocai).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "3" && inspection == "01" && flGongzi == false) {
        if (isGongzi == true) {
          var gongzi = jcddRes.gongzi;
          flGongzi = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(gongzi).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "4" && inspection == "01" && fljiangjin == false) {
        if (isjiangjin == true) {
          jiangjin = jcddRes.jiangjin;
          fljiangjin = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(jiangjin).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "5" && inspection == "01" && flyanglaobaoxian == false) {
        if (isyanglaobaoxian == true) {
          yanglaobaoxian = jcddRes.yanglaobaoxian;
          flyanglaobaoxian = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(yanglaobaoxian).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "6" && inspection == "01" && flyiliaobaoxian == false) {
        if (isyiliaobaoxian == true) {
          yiliaobaoxian = jcddRes.yiliaobaoxian;
          flyiliaobaoxian = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(yiliaobaoxian).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "7" && inspection == "01" && flshiyebaoxian == false) {
        if (isshiyebaoxian == true) {
          shiyebaoxian = jcddRes.shiyebaoxian;
          flshiyebaoxian = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(shiyebaoxian).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "8" && inspection == "01" && flshengyubaoxian == false) {
        if (isshengyubaoxian == true) {
          shengyubaoxian = jcddRes.shengyubaoxian;
          flshengyubaoxian = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(shengyubaoxian).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "9" && inspection == "01" && flgongshangbaoxian == false) {
        if (isgongshangbaoxian == true) {
          gongshangbaoxian = jcddRes.gongshangbaoxian;
          flgongshangbaoxian = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(gongshangbaoxian).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "10" && inspection == "01" && flgongjijin == false) {
        if (isgongjijin == true) {
          gongjijin = jcddRes.gongjijin;
          flgongjijin = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(gongjijin).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "11" && inspection == "01" && flyuangongfuli == false) {
        if (isyuangongfuli == true) {
          yuangongfuli = jcddRes.yuangongfuli;
          flyuangongfuli = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(yuangongfuli).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "12" && inspection == "01" && flgongxuweiwaifei == false) {
        if (isgongxuweiwaifei == true) {
          gongxuweiwaifei = jcddRes.gongxuweiwaifei;
          flgongxuweiwaifei = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(gongxuweiwaifei).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "13" && inspection == "01" && flshengchanchengben == false) {
        if (isshengchanchengben == true) {
          shengchanchengben = jcddRes.shengchanchengben;
          flshengchanchengben = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = Number(shengchanchengben).toFixed(2);
        } else {
          continue;
        }
      } else if (fenluNum == "21" && inspection == "02" && flweiwaiwushuidanjia == false) {
        if (isweiwaiwushuidanjia == true) {
          flweiwaiwushuidanjia = true;
          description = loanData.accountName;
          kmbm = loanData.accountCode;
          dfje = hbje;
        } else {
          continue;
        }
      } else {
        continue;
      }
      //收样单类型
      //临床收费(1585840928148422665)、个人现金(1585839648250265603)、临床免费(1585841400606883840)
      if (sydType == "1585840928148422665" || sydType == "1585839648250265603" || sydType == "1585841400606883840") {
        dai(description, kmbm, dfje, filedCodecb, valueCodecb);
      } else {
        dai(description, kmbm, dfje, filedCodecb, valueCodecb);
      }
    }
    function dai(description, kmbm, dfje, filedCodecb, valueCodecb) {
      cbbodi = {
        description: description, //摘要
        accsubjectCode: kmbm, // 科目编码
        creditOriginal: dfje, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: dfje //	本币贷方金额（借贷不能同时填写，原币本币都要填写）
      };
      cbclientData = [
        {
          filedCode: filedCodecb,
          valueCode: valueCodecb
        }
      ];
      //组装成本
      var cbzzjs = cbbodi;
      cbzzjs.clientAuxiliaryList = cbclientData;
      cbbodsz.push(cbzzjs);
    }
    if (sydType == "1585840928148422665" || sydType == "1585839648250265603") {
      if (fllinjian == false) {
        throw new Error("借方科目：【主营业务成本-临检】在【收入&成本科目对照表】中没有维护");
      } else if (isShiji == true && flShiji == false) {
        throw new Error("贷方科目：【生产成本_原材料_试剂】在【收入&成本科目对照表】中没有维护");
      } else if (isHaocai == true && flHaocai == false) {
        throw new Error("贷方科目：【生产成本_原材料_耗材】在【收入&成本科目对照表】中没有维护");
      } else if (isGongzi == true && flGongzi == false) {
        throw new Error("贷方科目：【生产成本_人工_工资】在【收入&成本科目对照表】中没有维护");
      } else if (isjiangjin == true && fljiangjin == false) {
        throw new Error("贷方科目：【生产成本_人工_奖金】在【收入&成本科目对照表】中没有维护");
      } else if (isyanglaobaoxian == true && flyanglaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_养老保险】在【收入&成本科目对照表】中没有维护");
      } else if (isyiliaobaoxian == true && flyiliaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_医疗保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshiyebaoxian == true && flshiyebaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_失业保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshengyubaoxian == true && flshengyubaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_生育保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongshangbaoxian == true && flgongshangbaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_工伤保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongjijin == true && flgongjijin == false) {
        throw new Error("贷方科目：【生产成本_人工_公积金】在【收入&成本科目对照表】中没有维护");
      } else if (isyuangongfuli == true && flyuangongfuli == false) {
        throw new Error("贷方科目：【生产成本_人工_员工福利】在【收入&成本科目对照表】中没有维护");
      } else if (isgongxuweiwaifei == true && flgongxuweiwaifei == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-工序委外费】在【收入&成本科目对照表】中没有维护");
      } else if (isshengchanchengben == true && flshengchanchengben == false) {
        throw new Error("贷方科目：【生产成本_辅助生产成本】在【收入&成本科目对照表】中没有维护");
      } else if (isweiwaiwushuidanjia == true && flweiwaiwushuidanjia == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-项目委外费】在【收入&成本科目对照表】中没有维护");
      }
    } else if (sydType == "1585841331888979976") {
      if (flkeyan == false) {
        throw new Error("借方科目：【主营业务成本-科研】在【收入&成本科目对照表】中没有维护");
      } else if (isShiji == true && flShiji == false) {
        throw new Error("贷方科目：【生产成本_原材料_试剂】在【收入&成本科目对照表】中没有维护");
      } else if (isHaocai == true && flHaocai == false) {
        throw new Error("贷方科目：【生产成本_原材料_耗材】在【收入&成本科目对照表】中没有维护");
      } else if (isGongzi == true && flGongzi == false) {
        throw new Error("贷方科目：【生产成本_人工_工资】在【收入&成本科目对照表】中没有维护");
      } else if (isjiangjin == true && fljiangjin == false) {
        throw new Error("贷方科目：【生产成本_人工_奖金】在【收入&成本科目对照表】中没有维护");
      } else if (isyanglaobaoxian == true && flyanglaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_养老保险】在【收入&成本科目对照表】中没有维护");
      } else if (isyiliaobaoxian == true && flyiliaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_医疗保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshiyebaoxian == true && flshiyebaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_失业保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshengyubaoxian == true && flshengyubaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_生育保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongshangbaoxian == true && flgongshangbaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_工伤保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongjijin == true && flgongjijin == false) {
        throw new Error("贷方科目：【生产成本_人工_公积金】在【收入&成本科目对照表】中没有维护");
      } else if (isyuangongfuli == true && flyuangongfuli == false) {
        throw new Error("贷方科目：【生产成本_人工_员工福利】在【收入&成本科目对照表】中没有维护");
      } else if (isgongxuweiwaifei == true && flgongxuweiwaifei == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-工序委外费】在【收入&成本科目对照表】中没有维护");
      } else if (isshengchanchengben == true && flshengchanchengben == false) {
        throw new Error("贷方科目：【生产成本_辅助生产成本】在【收入&成本科目对照表】中没有维护");
      } else if (isweiwaiwushuidanjia == true && flweiwaiwushuidanjia == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-项目委外费】在【收入&成本科目对照表】中没有维护");
      }
    } else if (sydType == "1585841400606883840" || sydType == "1585840799320899588") {
      if (fltuiguangfei == false) {
        throw new Error("借方科目：【销售费用_推广费】在【收入&成本科目对照表】中没有维护");
      } else if (isShiji == true && flShiji == false) {
        throw new Error("贷方科目：【生产成本_原材料_试剂】在【收入&成本科目对照表】中没有维护");
      } else if (isHaocai == true && flHaocai == false) {
        throw new Error("贷方科目：【生产成本_原材料_耗材】在【收入&成本科目对照表】中没有维护");
      } else if (isGongzi == true && flGongzi == false) {
        throw new Error("贷方科目：【生产成本_人工_工资】在【收入&成本科目对照表】中没有维护");
      } else if (isjiangjin == true && fljiangjin == false) {
        throw new Error("贷方科目：【生产成本_人工_奖金】在【收入&成本科目对照表】中没有维护");
      } else if (isyanglaobaoxian == true && flyanglaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_养老保险】在【收入&成本科目对照表】中没有维护");
      } else if (isyiliaobaoxian == true && flyiliaobaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_医疗保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshiyebaoxian == true && flshiyebaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_失业保险】在【收入&成本科目对照表】中没有维护");
      } else if (isshengyubaoxian == true && flshengyubaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_生育保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongshangbaoxian == true && flgongshangbaoxian == false) {
        throw new Error("贷方科目：【生产成本_人工_社保_工伤保险】在【收入&成本科目对照表】中没有维护");
      } else if (isgongjijin == true && flgongjijin == false) {
        throw new Error("贷方科目：【生产成本_人工_公积金】在【收入&成本科目对照表】中没有维护");
      } else if (isyuangongfuli == true && flyuangongfuli == false) {
        throw new Error("贷方科目：【生产成本_人工_员工福利】在【收入&成本科目对照表】中没有维护");
      } else if (isgongxuweiwaifei == true && flgongxuweiwaifei == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-工序委外费】在【收入&成本科目对照表】中没有维护");
      } else if (isshengchanchengben == true && flshengchanchengben == false) {
        throw new Error("贷方科目：【生产成本_辅助生产成本】在【收入&成本科目对照表】中没有维护");
      } else if (isweiwaiwushuidanjia == true && flweiwaiwushuidanjia == false) {
        throw new Error("贷方科目：【生产成本_委外服务费-项目委外费】在【收入&成本科目对照表】中没有维护");
      }
    }
    var cbbody = pzbody;
    cbbody.bodies = cbbodsz;
    let func = extrequire("AT15F164F008080007.utils.getWayUrl");
    let funcres = func.execute(null);
    var gatewayUrl = funcres.gatewayUrl;
    //成本凭证保存
    let subjectUrl = gatewayUrl + "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    let subjectApi = openLinker("POST", subjectUrl, "AT15F164F008080007", JSON.stringify(cbbody));
    var subjectApijs = JSON.parse(subjectApi);
    if (subjectApijs.code == "200") {
      //回写成本单号
      var billlcode = subjectApijs.data.billCode + "";
      var cbbillCode = { id: jcddid, pingzhenghao: billlcode };
      var cbbillCodeRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", cbbillCode, "71a4dca4");
      var isBillCode = cbbillCodeRes.pingzhenghao;
      if (isBillCode != billlcode) {
        throw new Error("回写成本单号失败!");
      }
    } else {
      var mage = "凭证保存异常，凭证分录行数应该大于等于2行！";
      if (mage == subjectApijs.message) {
        throw new Error("保存失败：" + subjectApijs.message + "【缺少借/贷，请检查！】");
      } else {
        throw new Error("保存失败：" + subjectApijs.message);
      }
    }
    return { subjectApijs };
  }
}
exports({ entryPoint: MyAPIHandler });