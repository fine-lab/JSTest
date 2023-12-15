let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = request.data;
    var ZGYS_ITEM = [];
    var ZGYS_PANTR = [];
    var ZGYS_TERM = [];
    var table = {};
    //查询销售退货的数据
    let url = "https://www.example.com/" + date.id;
    let apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify(null));
    var jsapiResponse = JSON.parse(apiResponse);
    if (jsapiResponse.code == 200) {
      var zhub = jsapiResponse.data;
    } else {
      throw new Error("查询异常：" + JSON.stringify(jsapiResponse.message));
    }
    var zbtable = zhub.saleReturnDetails;
    var xsddId = zbtable[0].orderId;
    // 根据客户id，查询客户档案维护的SAP客户编码
    let clientId = date.agentId;
    let sql = "select * from aa.merchant.Merchant where id = '" + clientId + "'";
    var khres = ObjectStore.queryByYonQL(sql, "productcenter");
    var orgId = "";
    if (khres.length > 0) {
      orgId = khres[0].orgId;
    } else {
      throw new Error("该客户不存在，请检查");
    }
    // 调用YS客户档案详情查询接口
    let url1 = "https://www.example.com/" + clientId + "&orgId=" + orgId;
    let KHDAResponse = openLinker("GET", url1, "SCMSA", JSON.stringify(null));
    let clientData = JSON.parse(KHDAResponse);
    let clientCode = "";
    if (clientData.code == 200) {
      clientCode = clientData.data.merchantCharacter.attrext1 != undefined ? clientData.data.merchantCharacter.attrext1 : undefined;
      if (clientCode == undefined) {
        throw new Error("SAP客户编码未维护，请同步后进行操作");
      }
    } else {
      throw new Error("查询客户档案详情信息失败：" + JSON.stringify(clientData.message));
    }
    //调取销售订单 获取开票状态以及销售订单号
    let url2 = "https://www.example.com/" + xsddId;
    let XSDDResponse = openLinker("GET", url2, "SCMSA", JSON.stringify(null));
    let JSXSDDResponse = JSON.parse(XSDDResponse);
    var xxddsj = "";
    if (JSXSDDResponse.code == 200) {
      xxddsj = JSXSDDResponse.data;
    } else {
      throw new Error("查询销售订单失败：" + JSXSDDResponse.message);
    }
    var zdyx = xxddsj.orderDefineCharacter != undefined ? xxddsj.orderDefineCharacter : undefined;
    if (zdyx == undefined) {
      throw new Error("启润单号和开票状态，未在单据中维护");
    }
    //销售订单号
    var vbeln = xxddsj.orderDefineCharacter.attrext4 != undefined ? xxddsj.orderDefineCharacter.attrext4 : undefined;
    if (vbeln == undefined) {
      throw new Error("销售订单号，未在单据中维护");
    }
    //开票状态
    var ZBILSTATUS = xxddsj.orderDefineCharacter.attrext3 != undefined ? xxddsj.orderDefineCharacter.attrext3 : undefined;
    if (ZBILSTATUS == undefined) {
      throw new Error("开票状态，未在单据中维护");
    }
    //获取员工编码
    var StaffId = date.corpContact != undefined ? date.corpContact : undefined;
    if (StaffId == undefined) {
      throw new Error("销售业务员，未在单据中维护");
    }
    let url4 = "https://www.example.com/" + StaffId;
    let StaffResponse = openLinker("GET", url4, "SCMSA", JSON.stringify(null));
    let StaffJson = JSON.parse(StaffResponse);
    var StaffCode;
    if (StaffJson.code == 200) {
      StaffCode = StaffJson.data.code;
    } else {
      throw new Error(StaffJson.message);
    }
    if (ZBILSTATUS == "A") {
      //开票前
      var struc = {
        ZGYS_HEAD: {
          EXNUM: zhub.id,
          AUART: "ZD23", //出仓单退货 ZD23    销售退货申请 ZB43     ZR11是创建    kpzt=="A"
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          VKGRP: zhub.saleDepartmentId_code, //销售部门  zhub.saleDepartmentId_name    "GQ8"
          KUNNR: clientCode, //客户编号   clientCode    "2000003284"
          WAERK: zhub.currencyCode, //销售和分销凭证货币
          BSTKD: zhub.code, //客户参考  "SAPmegnxin"
          ZMODE: "A",
          ZTERM: "Z101",
          ACTION: "I",
          SENDER: "GYS", //发送系统
          RECEIVER: "SAP" //接受系统
        }
      };
      //循环子表
      for (var j = 0; j < zbtable.length; j++) {
        //获取批次号 TODO
        if (zbtable[j].stockCode != "9001") {
          var batckno = zbtable[j].batchNo != undefined ? zbtable[j].batchNo : undefined;
          if (batckno == undefined) {
            throw new Error("批次号未在系统中维护");
          }
        }
        var wlnumberid = zbtable[j].productId;
        var sq1l = "select * from pc.product.ProductFreeDefine where id = " + wlnumberid;
        var sqlea = ObjectStore.queryByYonQL(sq1l, "productcenter");
        var SAPwl = sqlea[0].define1 != undefined ? sqlea[0].define1 : undefined;
        if (SAPwl == undefined) {
          throw new Error("物料编码未在系统中维护");
        }
        var str = xxddsj.auditDate;
        var str1 = replace(str, "-", "");
        var vouchdate = substring(str1, 0, 8);
        var s1 = {
          EXNUM: zhub.id,
          EXNUMIT: zbtable[j].id, //行号   zbtable[j].lineno     0001
          VBELN_F: vbeln, // 销售订单号    "0050000132"     vbeln
          POSNR_F: xxddsj.orderDetails[j].firstlineno, // 销售订单行号    "000010" xxddsj.orderDetails[0].firstlineno  行号
          MATNR: SAPwl, //物料编码  SAPwl    "000000002200002941"
          ARKTX: zbtable[j].productName, //物料名称    zbtable[j].productName  "测试贺卡纸"
          WERKS: "1250",
          CHARG: batckno, //批次号    batckno     "0000038541"
          LGORT: zbtable[j].stockCode, //货位编码  "9001"
          KWMENG: zbtable[j].priceQty, // 出库数量   zbtable[j].priceQty     "19"
          VRKME: zbtable[j].qtyName, //单位   zbtable[j].qtyName    "KG"
          KBETR: zbtable[j].natTaxUnitPrice, // 单价  "201.00"   xxddsj.orderDetailPrices.natTaxUnitPrice
          KOEIN: "1",
          EDATU: vouchdate, // YS 计划发货日期     vouchdate    "20220927"
          UPDATEFLAG: "I"
        };
        ZGYS_ITEM.push(s1);
        var s2 = {
          EXNUM: zhub.id,
          POSPP: "ZM", // 默认ZM
          POSPNR: StaffCode, //员工编码  "0000505550"   yyw
          UPDATEFLAG: "I"
        };
        ZGYS_PANTR.push(s2);
        var s3 = {
          EXNUM: zhub.id, //单据号
          EXNUMIT: zbtable[j].id, //行号   zbtable[j].lineno
          KBETR: zbtable[j].natTaxUnitPrice, //要是修改填 价格   "201.00"    zbtable[j].natTaxUnitPrice
          KSCHL: "ZB00", //固定值
          WAERS: zhub.currencyCode, //固定值"CNY"
          KRECH: "C", //价格 是单价就写C   总额就写B
          UPDATEFLAG: "I"
        };
        ZGYS_TERM.push(s3);
      }
    } else {
      //开票后
      var struc = {
        ZGYS_HEAD: {
          EXNUM: zhub.id,
          AUART: "ZB43", //出仓单退货 ZD23    销售退货申请 ZB43     ZR11是创建
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          VKGRP: zhub.saleDepartmentId_code, //销售部门  zhub.saleDepartmentId_name    "GQ8"
          KUNNR: clientCode, //客户编号   clientCode    "2000003284"
          WAERK: zhub.currencyCode, //销售和分销凭证货币
          BSTKD: zhub.code, //客户参考
          ZMODE: "A",
          ZTERM: "Z101",
          ACTION: "I",
          SENDER: "GYS", //发送系统
          RECEIVER: "SAP" //接受系统
        }
      };
      //循环子表
      for (var j = 0; j < zbtable.length; j++) {
        //获取批次号
        if (zbtable[j].stockCode != "9001") {
          var batckno = zbtable[j].batchNo != undefined ? zbtable[j].batchNo : undefined;
          if (batckno == undefined) {
            throw new Error("批次号未在系统中维护");
          }
        }
        //获取SAP物料编号
        var wlnumberid = zbtable[j].productId;
        var sq1l = "select * from pc.product.ProductFreeDefine where id = " + wlnumberid;
        var sqlea = ObjectStore.queryByYonQL(sq1l, "productcenter");
        var SAPwl = sqlea[0].productCharacterDef.attrext1 != undefined ? sqlea[0].productCharacterDef.attrext1 : undefined;
        if (SAPwl == undefined) {
          throw new Error("该物料未在系统中维护SAP物料编码");
        }
        var str = xxddsj.auditDate;
        var str1 = replace(str, "-", "");
        var vouchdate = substring(str1, 0, 8);
        var s1 = {
          EXNUM: zhub.id,
          EXNUMIT: zbtable[j].id, //行号   zbtable[j].lineno     0001
          VBELN_F: vbeln, // 销售订单号    "0050000132"     vbeln
          POSNR_F: xxddsj.orderDetails[j].firstlineno, // 销售订单行号    "000010" xxddsj.orderDetails[0].firstlineno  行号
          MATNR: SAPwl, //物料编码  SAPwl    "000000002200002941"
          ARKTX: zbtable[j].productName, //物料名称    zbtable[j].productName  "测试贺卡纸"
          WERKS: "1250",
          CHARG: batckno, //批次号    batckno     "0000038541"
          LGORT: zbtable[j].stockCode, //货位编码  "9001" reponse.result.zhub.saleReturnDetails[0].stockCode
          KWMENG: zbtable[j].priceQty, // 出库数量   zbtable[j].priceQty     "19"
          VRKME: zbtable[j].qtyName, //单位   zbtable[j].qtyName    "KG"
          KBETR: zbtable[j].natTaxUnitPrice, // 单价  "201.00"   xxddsj.orderDetailPrices.natTaxUnitPrice
          KOEIN: "1",
          EDATU: vouchdate, // YS 计划发货日期     vouchdate    "20220927"
          UPDATEFLAG: "I"
        };
        ZGYS_ITEM.push(s1);
        var s2 = {
          EXNUM: zhub.id,
          POSPP: "ZM", // 默认ZM
          POSPNR: StaffCode, //员工编码   "0000505550"
          UPDATEFLAG: "I"
        };
        ZGYS_PANTR.push(s2);
        var s3 = {
          EXNUM: zhub.id, //单据号
          EXNUMIT: zbtable[j].id, //行号   zbtable[j].lineno
          KBETR: zbtable[j].natTaxUnitPrice, //要是修改填 价格   "201.00"    zbtable[j].natTaxUnitPrice
          KSCHL: "ZB00", //固定值
          WAERS: zhub.currencyCode, //固定值"CNY"
          KRECH: "C", //价格 是单价就写C   总额就写B
          UPDATEFLAG: "I"
        };
        ZGYS_TERM.push(s3);
      }
    }
    table.ZGYS_ITEM = ZGYS_ITEM;
    table.ZGYS_PANTR = ZGYS_PANTR;
    table.ZGYS_TERM = ZGYS_TERM;
    var body = {
      funName: "ZFM_SD_SALEORDER_ACCESS"
    };
    body.structure = struc;
    body.tables = table;
    let func1 = extrequire("AT15C9C13409B00004.A3.sendSap");
    let QRresponse = func1.execute(null, body);
    let QRstrResponses = JSON.parse(QRresponse.strResponse);
    var mesage = QRstrResponses.ZFM_SD_SALEORDER_ACCESS.OUTPUT.ZGYS_RTNH;
    return { mesage };
  }
}
exports({ entryPoint: MyAPIHandler });