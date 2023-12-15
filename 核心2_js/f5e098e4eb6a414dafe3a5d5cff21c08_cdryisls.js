let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var arrayId = request.resId;
    var arrayCode = request.resCode;
    var id = arrayId;
    var Code = arrayCode;
    let resData = request.resData;
    let url = "https://www.example.com/" + id;
    var apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
    var apiResponseObj = JSON.parse(apiResponse);
    var data = apiResponseObj.data;
    if (data.status != 1) {
      throw new Error("单据未审核，请审核后重试");
    }
    //人员id
    var renyuanId = data.corpContact;
    //主表id
    var xsddId = data.id;
    //客户id
    var agentId = data.agentId;
    var kehusql = "select * from aa.merchant.Merchant where id = '" + agentId + "'";
    var res = ObjectStore.queryByYonQL(kehusql, "productcenter");
    var orgId = res[0].orgId;
    // 获取业务员
    let ywyId = data.orderDefineCharacter != undefined ? (data.orderDefineCharacter.attrext9 != undefined ? data.orderDefineCharacter.attrext9 : undefined) : undefined;
    if (ywyId == undefined) {
      throw new Error("业务员信息为空，请检查");
    }
    // 获取销售员
    let url11 = "https://www.example.com/" + renyuanId;
    let RenYuanAll = openLinker("GET", url11, "SCMSA", JSON.stringify(null));
    var renyuannum = JSON.parse(RenYuanAll);
    var renyuaniDD = renyuannum.data.code;
    // 业务员信息
    let getYwyUrl = "https://www.example.com/" + ywyId;
    let ywyData = openLinker("GET", getYwyUrl, "SCMSA", null);
    var ywyObject = JSON.parse(ywyData);
    var ywyCode = ywyObject.data.code;
    //调用客户档案url
    let url1 = "https://www.example.com/" + agentId + "&agentId=" + orgId;
    //调用openlinker客户档案
    var kehudangan1 = openLinker("GET", url1, "SCMSA", JSON.stringify({}));
    var kehuAll = JSON.parse(kehudangan1);
    var kehunumber = kehuAll.data.merchantCharacter != undefined ? kehuAll.data.merchantCharacter.attrext1 : undefined;
    if (kehunumber == undefined) {
      throw new Error("该客户SAP编码未维护!");
    }
    // 判断送达方是否为空(送达方客户编码)
    let sdf = data.orderDefineCharacter != undefined ? (data.orderDefineCharacter.attrext21 != undefined ? data.orderDefineCharacter.attrext21 : undefined) : undefined;
    var sdfNumber = undefined;
    if (sdf != undefined) {
      let urlsdf = "https://www.example.com/" + sdf + "&agentId=" + orgId;
      //调用openlinker客户档案
      var sdfdata = openLinker("GET", urlsdf, "SCMSA", JSON.stringify({}));
      var sdfAll = JSON.parse(sdfdata);
      sdfNumber = sdfAll.data.merchantCharacter != undefined ? sdfAll.data.merchantCharacter.attrext1 : undefined;
      if (sdfNumber == undefined) {
        throw new Error("送达方客户SAP编码未维护!");
      }
    }
    var lxrName = data.receiver != undefined ? data.receiver : "";
    var lxrAddress = data.receiveAddress != undefined ? data.receiveAddress : "";
    var lxrPhone = data.receiveMobile != undefined ? data.receiveMobile : "";
    if (sdfNumber != undefined) {
      lxrAddress = data.orderDefineCharacter.attrext22 != undefined ? data.orderDefineCharacter.attrext22 : undefined;
      lxrName = data.orderDefineCharacter.attrext24 != undefined ? data.orderDefineCharacter.attrext24 : undefined;
      lxrPhone = data.orderDefineCharacter.attrext23 != undefined ? data.orderDefineCharacter.attrext23 : undefined;
    }
    //广州启润YS：销售合同分切订单/退货申请行项目
    var ZGYS_ITEM = new Array();
    //广州启润YS系统：合同/退货申请伙伴
    var ZGYS_PANTR = new Array();
    //广州启润YS：销售订单行项目价格条件
    var ZGYS_TERM = new Array();
    let ZGYS_ITEXT = []; // 表体备注
    let ZGYS_HTEXT = [
      // 表头备注
      {
        EXNUM: data.id,
        TDID: "Z002",
        TEXT: data.memo
      },
      {
        EXNUM: data.id,
        TDID: "Z001",
        TEXT: data.code
      }
    ];
    let HDTXT = undefined; // 分切加工单-备注
    //订单子表信息
    var DinDanXinXiZiBiao = data.orderDetails;
    var wuliaozuzhiId = data.settlementOrgId;
    let ZFLAG = ""; // 是否分切标识
    let sendDateStr = data.sendDate;
    let sendDateStrs = replace(sendDateStr, "-", "");
    var sendDate = substring(sendDateStrs, 0, 8);
    let number = DinDanXinXiZiBiao.length;
    let kjfSum = 0;
    for (var q = 0; q < DinDanXinXiZiBiao.length; q++) {
      //仓库id
      var cangkuId = DinDanXinXiZiBiao[q].stockCode;
      // 日期处理
      let ZZLPAYDAYStr = data.paymentExeDetail != undefined ? data.paymentExeDetail[q].fixAccoutDateTime : undefined; // 预计收款日期-最迟收现金日
      let ZCASHDATEStr = data.paymentExeDetail != undefined ? data.paymentExeDetail[q].expiringDateTime : undefined; // 预计收现金日
      var ZZLPAYDAY;
      var ZCASHDATE;
      ZZLPAYDAYStr = data.paymentExeDetail != undefined ? data.paymentExeDetail[q].expiringDateTime : undefined;
      if (ZZLPAYDAYStr != undefined) {
        var d = new Date(Date.parse(ZZLPAYDAYStr.replace(/-/g, "/")));
        ZZLPAYDAYStr = DateAdd("d", 5, d);
        ZZLPAYDAYStr = dateTimeToString(ZZLPAYDAYStr);
        if (ZZLPAYDAYStr != undefined && ZCASHDATEStr != undefined) {
          let ZZLPAYDAYStrs = replace(ZZLPAYDAYStr, "-", "");
          let ZCASHDATEStrs = replace(ZCASHDATEStr, "-", "");
          ZZLPAYDAY = substring(ZZLPAYDAYStrs, 0, 8);
          ZCASHDATE = substring(ZCASHDATEStrs, 0, 8);
        }
      }
      // 金额=含税金额+开机费
      let hanShuiJine = DinDanXinXiZiBiao[q].orderDetailPrices.natSum;
      let kaiJiFei =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext18 != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext18
          : "0";
      kaiJiFei = parseFloat(kaiJiFei);
      let sumJine = hanShuiJine + kaiJiFei;
      //物料id
      var szzz = DinDanXinXiZiBiao[q].productId;
      var skuid = DinDanXinXiZiBiao[q].skuId;
      // 表体备注
      let memo = DinDanXinXiZiBiao[q].memo;
      // 单位
      let bjUnit =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine1 != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine1
          : "";
      if (bjUnit != "") {
        if (bjUnit == "令") {
          bjUnit = "Z06";
        } else if (bjUnit == "件" || bjUnit == "卷") {
          bjUnit = "PC";
        } else if (bjUnit == "张") {
          bjUnit = "SHT";
        }
      }
      if (bjUnit == "吨") {
        bjUnit = "";
      }
      //判断是否分切
      var Qie =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine3 != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine3
          : undefined;
      let MVGR1 = undefined; // 物料组分切或换标
      let BZTXT = undefined; // 分切加工单行-备注
      let GUIGE1 = undefined; // 规格1是宽
      let GUIGE2 = undefined; // 规格2是长
      if (Qie == "是") {
        (ZFLAG = "X"),
          (MVGR1 = "A1"),
          (HDTXT = data.orderDefineCharacter.attrext37 != undefined ? data.orderDefineCharacter.attrext37 : ""),
          (BZTXT = DinDanXinXiZiBiao[q].memo != undefined ? DinDanXinXiZiBiao[q].memo : ""),
          (GUIGE1 =
            DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine6 != undefined
              ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine6
              : undefined),
          (GUIGE2 =
            DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine4 != undefined
              ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine4
              : undefined);
      }
      let numberSum =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine13 != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine13
          : ""; // 报价数量
      let twoNum = numberSum; // 单件卷重(令数)
      let twoUnit = bjUnit; // 卷重/令数单位
      let numberSums = parseFloat(numberSum);
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine10 != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine10 == "卷筒") {
        if (Qie == "是") {
          if (bjUnit == "SHT") {
            twoUnit = "Z06";
            twoNum = numberSums / 500;
            twoNum = parseFloat(twoNum).toFixed(3);
          } else if (bjUnit == "Z06") {
            twoUnit = "SHT";
            twoNum = numberSums * 500;
            twoNum = parseFloat(twoNum).toFixed(3);
          }
        }
      }
      // 报价单位选中件，卷时不用带令数过去
      if (bjUnit == "PC") {
        twoNum = undefined;
        twoUnit = undefined;
      }
      let numberTwoNew = parseFloat(numberSum).toFixed(3);
      if (numberTwoNew == "NaN") {
        throw new Error("报价数量填写有误，请检查后重试");
      }
      // 平板物料选中件传令数量
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine10 != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine10 == "平板") {
        var pbNum = DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine9 != undefined ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine9 : "";
        pbNum = parseFloat(pbNum).toFixed(3);
        twoUnit = "Z06";
        twoNum = pbNum;
      }
      if (twoNum == "NaN") {
        throw new Error("平板物料选中件需传令数，未维护，请检查");
      }
      var sql1 = "select * from pc.product.ProductFreeDefine where id = '" + szzz + "'";
      var wuliao = ObjectStore.queryByYonQL(sql1, "productcenter");
      // 物料编码
      var wuliaonumber = wuliao[0].productCharacterDef.attrext2 != undefined ? wuliao[0].productCharacterDef.attrext2 : undefined;
      if (wuliaonumber == undefined) {
        throw new Error("第" + q + 1 + "行物料未同步至SAP系统，请检查");
      }
      wuliaonumber = fillZero(wuliaonumber);
      // 物料编码
      let productCode = DinDanXinXiZiBiao[q].skuCode != undefined ? DinDanXinXiZiBiao[q].skuCode : undefined;
      if (productCode == undefined) {
        throw new Error("物料编码为空，请检查");
      }
      //查询换标商品
      let hbwlCode = undefined;
      //换标判断 - 辅助物料描述
      var Hbwls =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext10 != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext10
          : undefined;
      if (Hbwls != undefined) {
        var hbsql = "select * from pc.product.ProductFreeDefine where id =" + Hbwls;
        let hbwl = ObjectStore.queryByYonQL(hbsql, "productcenter");
        if (hbwl != undefined && hbwl.length > 0) {
          hbwlCode = hbwl[0].productCharacterDef.attrext2 != undefined ? hbwl[0].productCharacterDef.attrext2 : undefined;
          if (hbwlCode == undefined || hbwlCode == "") {
            throw new Error("该换标物料sap编码不存在!");
          }
        } else {
          throw new Error("该换标物料sap编码不存在!");
        }
      }
      //调取销售订单接口
      let url8 = "https://www.example.com/" + xsddId;
      let XSDDResponse = openLinker("GET", url8, "SCMSA", JSON.stringify(null));
      var xiaoshoudingdannum = JSON.parse(XSDDResponse);
      if (xiaoshoudingdannum.data.headFreeItem != undefined) {
        var zdy = xiaoshoudingdannum.data.orderDefineCharacter.attrext4 != undefined ? xiaoshoudingdannum.data.orderDefineCharacter.attrext4 : undefined;
        if (zdy != undefined) {
          throw new Error(" -- 销售订单号已经存在于SAP系统,请勿重复推送 --  ");
        }
      }
      //获取销售员
      var xiaoshouyuanID = xiaoshoudingdannum.data.corpContactUserName != undefined ? xiaoshoudingdannum.data.corpContactUserName : undefined;
      if (xiaoshouyuanID == undefined) {
        throw new Error("该销售员未在系统维护");
      }
      var picihao = DinDanXinXiZiBiao[q].batchNo != undefined ? DinDanXinXiZiBiao[q].batchNo : undefined;
      // 批次号校验
      if (DinDanXinXiZiBiao[q].stockCode != "9001") {
        if (picihao == undefined) {
          throw new Error("该批次号未在系统维护");
        }
      }
      let ARKTX =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine12 != undefined
            ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine12
            : undefined
          : undefined;
      if (ARKTX == undefined) {
        throw new Error("物料描述未填写，请检查");
      }
      let ZARKTX =
        DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined
          ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext11 != undefined
            ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext11
            : undefined
          : undefined;
      // 是否换标（物料组）
      if (ZARKTX != undefined) {
        MVGR1 = "A3";
      }
      // 表体数据
      var s1 = {
        EXNUM: data.id,
        EXNUMIT: DinDanXinXiZiBiao[q].id,
        MATNR: wuliaonumber, // 物料编码
        ARKTX: ARKTX, // 物料描述
        WERKS: "1250",
        CHARG: picihao,
        LGORT: cangkuId,
        KWMENG: DinDanXinXiZiBiao[q].priceQty + "", // 计价数量
        VRKME: DinDanXinXiZiBiao[q].productAuxUnitName,
        KBETR: sumJine + "", // 含税金额
        KOEIN: "1",
        EDATU: sendDate, // 请求交货日期
        ZMATNR: hbwlCode, // 换标商品SAP编码 - 辅助物料
        ZARKTX: ZARKTX, // 辅助物料描述
        MVGR1: MVGR1, // 物料组
        ZSENMEINS: bjUnit, // 第二计量单位
        ZSENMENGE: numberTwoNew, // 第二单位数量
        GUIGE1: GUIGE1, // 规格1是宽
        GUIGE2: GUIGE2, // 规格2是长
        JHDAT: sendDate, // 表体交货日期
        BZTXT: BZTXT, // 分切单加工行备注
        UPDATEFLAG: "I", // 更新标识
        ZCOILWEIGHT: twoNum, // 单件卷重(令数)
        ZCOIOLWUNIT: twoUnit, // 卷重/令数单位
        BSTKD_E:
          DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine11 != undefined
            ? DinDanXinXiZiBiao[q].orderDetailDefineCharacter.bodyDefine11
            : "" // 订单数据-客户采购订单号(取表体数据)
      };
      ZGYS_ITEM.push(s1);
      let memoH = {
        // 行备注
        EXNUM: data.id,
        EXNUMIT: DinDanXinXiZiBiao[q].id,
        TDID: "Z160",
        TEXT: memo
      };
      ZGYS_ITEXT.push(memoH); // 表体备注
      var s3 = {
        EXNUM: data.id,
        EXNUMIT: DinDanXinXiZiBiao[q].id,
        VBELN: "",
        POSNR: "",
        KBETR: DinDanXinXiZiBiao[q].orderDetailPrices.natTaxUnitPrice + "",
        KSCHL: "ZB00", // 条件类型-含税价格
        WAERS: data.orderPrices.domesticCode,
        KRECH: "C",
        KWERT: "",
        KOEIN: "",
        UPDATEFLAG: "I" // 更新标识
      };
      ZGYS_TERM.push(s3);
      // 条件类型
      let ZF71 = undefined;
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext13 != undefined) {
        // 付款方式附加费
        ZF71 = {
          EXNUM: data.id,
          EXNUMIT: DinDanXinXiZiBiao[q].id,
          VBELN: "",
          POSNR: "",
          KBETR: DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext13 + "",
          KSCHL: "ZF71", // 条件类型-付款方式附加费
          WAERS: data.orderPrices.domesticCode,
          KRECH: "C",
          KWERT: "",
          KOEIN: "",
          UPDATEFLAG: "I" // 更新标识
        };
      }
      if (ZF71 != undefined) {
        ZGYS_TERM.push(ZF71);
      }
      let ZF72 = undefined;
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext14 != undefined) {
        // 对账期附加费
        ZF72 = {
          EXNUM: data.id,
          EXNUMIT: DinDanXinXiZiBiao[q].id,
          VBELN: "",
          POSNR: "",
          KBETR: DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext14 + "",
          KSCHL: "ZF72", // 条件类型-对账期附加费
          WAERS: data.orderPrices.domesticCode,
          KRECH: "C",
          KWERT: "",
          KOEIN: "",
          UPDATEFLAG: "I" // 更新标识
        };
      }
      if (ZF72 != undefined) {
        ZGYS_TERM.push(ZF72);
      }
      let ZF73 = undefined;
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext15 != undefined) {
        // 分切附加费
        ZF73 = {
          EXNUM: data.id,
          EXNUMIT: DinDanXinXiZiBiao[q].id,
          VBELN: "",
          POSNR: "",
          KBETR: DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext15 + "",
          KSCHL: "ZF73", // 条件类型-分切附加费
          WAERS: data.orderPrices.domesticCode,
          KRECH: "C",
          KWERT: "",
          KOEIN: "",
          UPDATEFLAG: "I" // 更新标识
        };
      }
      if (ZF73 != undefined) {
        ZGYS_TERM.push(ZF73);
      }
      let ZF74 = undefined;
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext16 != undefined) {
        // 送货附加费
        ZF74 = {
          EXNUM: data.id,
          EXNUMIT: DinDanXinXiZiBiao[q].id,
          VBELN: "",
          POSNR: "",
          KBETR: DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext16 + "",
          KSCHL: "ZF74", // 条件类型-送货附加费
          WAERS: data.orderPrices.domesticCode,
          KRECH: "C",
          KWERT: "",
          KOEIN: "",
          UPDATEFLAG: "I" // 更新标识
        };
      }
      if (ZF74 != undefined) {
        ZGYS_TERM.push(ZF74);
      }
      if (DinDanXinXiZiBiao[q].orderDetailDefineCharacter != undefined && DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext18 != undefined) {
        // 开机费
        var kjf = DinDanXinXiZiBiao[q].orderDetailDefineCharacter.attrext18;
        let ZB10 = {
          EXNUM: data.id,
          EXNUMIT: DinDanXinXiZiBiao[q].id,
          VBELN: "",
          POSNR: "",
          KBETR: kjf + "",
          KSCHL: "ZB10", // 条件类型-开机费
          WAERS: data.orderPrices.domesticCode,
          KRECH: "B",
          KWERT: "",
          KOEIN: "",
          UPDATEFLAG: "I" // 更新标识
        };
        if (ZB10 != undefined) {
          ZGYS_TERM.push(ZB10);
        }
      }
    }
    let s2 = {
      // 业务员
      EXNUM: data.id,
      VBELN: "",
      POSPP: "ZM",
      POSPNR: renyuaniDD,
      UPDATEFLAG: "I"
    };
    let s4 = {
      // 业务助理
      EXNUM: data.id,
      VBELN: "",
      POSPP: "Z1",
      POSPNR: ywyCode,
      UPDATEFLAG: "I"
    };
    if (sdfNumber != undefined) {
      //  送达放编码不为空
      let s5 = {
        // 送达方
        EXNUM: data.id,
        VBELN: "",
        POSPP: "WE",
        POSPNR: sdfNumber,
        UPDATEFLAG: "I"
      };
      ZGYS_PANTR.push(s5);
    }
    ZGYS_PANTR.push(s4);
    ZGYS_PANTR.push(s2);
    let ZDVMOD = "";
    if (data.shippingChoiceId_name != undefined) {
      if (data.shippingChoiceId_name == "汽车运输") {
        ZDVMOD = "Z1";
      } else if (data.shippingChoiceId_name == "自提") {
        ZDVMOD = "Z2";
      }
    }
    let ZLSCH = "";
    if (data.settlement_name != undefined) {
      if (data.settlement_name == "转账支票") {
        ZLSCH = "A";
      } else if (data.settlement_name == "银行承兑汇票") {
        ZLSCH = "B";
      } else if (data.settlement_name == "电汇") {
        ZLSCH = "G";
      }
    }
    var body = {
      funName: "ZFM_SD_SALEORDER_ACCESS",
      structure: {
        ZGYS_HEAD: {
          EXNUM: data.id,
          VBELN: "",
          AUART: "ZR11",
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          KTGRD: "02", // 会计-账户组
          VKGRP: data.saleDepartmentId_code,
          KUNNR: kehunumber,
          WAERK: data.orderPrices.domesticCode,
          BSTKD: data.purchaseNo, // 采购订单-表头
          KETDAT: sendDate, // 请求交货日期
          ZTERM: "Z104",
          DTSEND: "",
          ACTION: "I",
          ZMODE: "A",
          SENDER: "GYS",
          RECEIVER: "SAP",
          ORDAT: sendDate, // 分切加工单下单日期
          ZZLPAYDAY: ZZLPAYDAY, // 预计收款日期
          ZCASHDATE: ZCASHDATE, // 预计收现金日
          ZLSCH: ZLSCH, // 付款方式
          HDTXT: HDTXT, // 分切加工单-备注
          ZCONTA: lxrName, // 收货人
          ZPHONE: lxrPhone, // 收货人电话
          ZDVMOD: ZDVMOD, // 运输方式 Z1汽运、Z2自提
          ZADDRE: lxrAddress // 收货地址
        }
      },
      tables: {
        ZGYS_ITEM,
        ZGYS_PANTR,
        ZGYS_TERM,
        ZGYS_ITEXT,
        ZGYS_HTEXT
      },
      field: {
        ZFLAG: ZFLAG
      }
    };
    let func1 = extrequire("AT15C9C13409B00004.A3.sendSap");
    let resss = func1.execute(null, body);
    // 解析返回值数据
    let strResponses = JSON.parse(resss.strResponse);
    if (strResponses.ZFM_SD_SALEORDER_ACCESS != undefined) {
      if (resss != null) {
        var obj = strResponses.ZFM_SD_SALEORDER_ACCESS;
        if (obj.OUTPUT != undefined && obj.OUTPUT.ZGYS_RTNH != undefined && obj.OUTPUT.ZGYS_RTNH.TRAN_FLAG != undefined) {
          if (obj.OUTPUT.ZGYS_RTNH.TRAN_FLAG == "0") {
            var val = obj.OUTPUT.ZGYS_RTNH.VBELN;
            //调用自定义项更新接口
            let url2 = "https://www.example.com/";
            var bodyZi = {
              datas: [
                {
                  id: id,
                  orderDefineCharacter: {
                    attrext4: val
                  }
                }
              ]
            };
            //调用openlinker
            var zidingyi = openLinker("POST", url2, "SCMSA", JSON.stringify(bodyZi));
            //自定义项
            var zidingyiAll = JSON.parse(kehudangan1);
            return { strResponses };
          } else {
            return { strResponses };
          }
        } else {
          throw new Error("调用SAP接口失败,请将此信息提供开发:" + JSON.stringify(obj));
        }
      } else {
        // 查询SAP接口失败
        throw new Error("数据为空");
      }
    } else {
      throw new Error("调用SAP接口失败,请将此信息提供开发:" + JSON.stringify(strResponses));
    }
    return {};
  }
}
function DateAdd(interval, number, date) {
  switch (interval) {
    case "y": {
      date.setFullYear(date.getFullYear() + number);
      return date;
    }
    case "q": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
    }
    case "m": {
      date.setMonth(date.getMonth() + number);
      return date;
    }
    case "w": {
      date.setDate(date.getDate() + number * 7);
      return date;
    }
    case "d": {
      date.setDate(date.getDate() + number);
      return date;
    }
    case "h": {
      date.setHours(date.getHours() + number);
      return date;
    }
    case "m": {
      date.setMinutes(date.getMinutes() + number);
      return date;
    }
    case "s": {
      date.setSeconds(date.getSeconds() + number);
      return date;
    }
    default: {
      date.setDate(d.getDate() + number);
      return date;
    }
  }
}
function dateTimeToString(date) {
  var y = date.getFullYear();
  var M = date.getMonth() + 1;
  var d = date.getDate();
  var H = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  return y + "-" + (M < 10 ? "0" + M : M) + "-" + (d < 10 ? "0" + d : d) + " " + (H < 10 ? "0" + H : H) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}
function fillZero(str) {
  if (str.length < 18) {
    const diff = 18 - str.length;
    const zeros = "0".repeat(diff);
    return zeros + str;
  } else {
    return str;
  }
}
exports({ entryPoint: MyAPIHandler });