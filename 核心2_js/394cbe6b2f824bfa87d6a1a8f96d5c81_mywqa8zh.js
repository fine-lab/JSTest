let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = request.data;
    var ZGYS_ITEM = [];
    var ZGYS_PANTR = [];
    var ZGYS_TERM = [];
    var table = {};
    var fhcs = new Array();
    //字符前面
    function prefixInteger(num, length) {
      return (num / Math.pow(10, length)).toFixed(length).substr(2); // (num / Math.pow(10, length)).toFixed(length).substr(2)
    }
    //查询销售退货的数据
    let url = "https://www.example.com/" + date.id;
    let apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify(null));
    var jsapiResponse = JSON.parse(apiResponse);
    var zhub = jsapiResponse.data;
    var zbtable = zhub.saleReturnDetails;
    var xsddId = zbtable[0].orderId;
    // 根据客户id，查询客户档案维护的SAP客户编码
    let clientId = date.agentId;
    let sql = "select * from aa.merchant.Merchant where id = '" + clientId + "'";
    var khres = ObjectStore.queryByYonQL(sql, "productcenter");
    let orgId = khres[0].orgId;
    // 调用YS客户档案详情查询接口
    let url1 = "https://www.example.com/" + clientId + "&orgId" + orgId;
    let KHDAResponse = openLinker("GET", url1, "SCMSA", JSON.stringify(null));
    let clientData = JSON.parse(KHDAResponse);
    let clientCode = clientData.data.merchantDefine.define1;
    //调取销售订单 获取开票状态
    let url2 = "https://www.example.com/" + xsddId;
    let XSDDResponse = openLinker("GET", url2, "SCMSA", JSON.stringify(null));
    let JSXSDDResponse = JSON.parse(XSDDResponse);
    var kpzt = JSXSDDResponse.data.headFreeItem.define3;
    //获取员工编码
    var StaffId = date.corpContact;
    let url4 = "https://www.example.com/" + StaffId;
    let StaffResponse = openLinker("GET", url4, "SCMSA", JSON.stringify(null));
    let StaffJson = JSON.parse(StaffResponse);
    var StaffCode;
    if (StaffJson.code == 200) {
      StaffCode = StaffJson.data.code;
    } else {
      throw new Error(StaffJson.message);
    }
    var AUART = "";
    if (false) {
      //开票前
      var struc = {
        ZGYS_HEAD: {
          EXNUM: zhub.code,
          AUART: "ZD23", //出仓单退货 ZD23    销售退货申请 ZB43     ZR11是创建
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          VKGRP: "GQ8", //销售部门  zhub.saleDepartmentId_name
          KUNNR: "2000003284", //客户编号   clientCode
          WAERK: "CNY", //销售和分销凭证货币
          BSTKD: "SAPmegnxin", //客户参考
          ZMODE: "A",
          ZTERM: "Z101",
          ACTION: "I",
          SENDER: "GYS", //发送系统
          RECEIVER: "SAP" //接受系统
        }
      };
      //循环子表
      for (var j = 0; j < zbtable.length; j++) {
        let wlbmnumber = zbtable[j].realProductCode;
        var s1 = {
          EXNUM: zhub.code,
          EXNUMIT: zbtable[j].lineno, //行号   zbtable[j].lineno     0001
          VBELN_F: "0050000132", //开票前填写 销售订单号  zhub.orderNo
          POSNR_F: "000010", //开票前填写 销售订单行号  zbtable[j].lineno
          MATNR: "000000002200002941", //物料编码  wlbmnumber
          ARKTX: "测试贺卡纸", //物料名称    zbtable[j].productName
          WERKS: "1250",
          CHARG: "0000038541", //批次号
          LGORT: "9001", //货位编码 01    02
          KWMENG: "19", // 出库数量
          VRKME: "KG", //单位
          KBETR: "201.00", // 单价
          KOEIN: "1",
          EDATU: "20220927", // YS 计划发货日期
          UPDATEFLAG: "I"
        };
        ZGYS_ITEM.push(s1);
        var s2 = {
          EXNUM: zhub.code,
          POSPP: "ZM", // 默认ZM
          POSPNR: "0000505550", //员工编码
          UPDATEFLAG: "I"
        };
        ZGYS_PANTR.push(s2);
        var s3 = {
          EXNUM: zhub.code, //单据号
          EXNUMIT: zbtable[j].lineno, //行号   zbtable[j].lineno
          KBETR: "201.00", //要是修改填 价格
          KSCHL: "ZB00", //固定值
          WAERS: "CNY", //固定值
          KRECH: "C", //价格 是单价就写C   总额就写B
          UPDATEFLAG: "I"
        };
        ZGYS_TERM.push(s3);
        //循环子表
      }
    } else {
      //开票后
      var struc = {
        ZGYS_HEAD: {
          EXNUM: zhub.code,
          AUART: "ZB43", //出仓单退货 ZD23   销售退货申请 ZB43     ZR11是创建   kpzt=="A"
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          VKGRP: "GQ8", //销售部门  zhub.saleDepartmentId_name
          KUNNR: "2000003284", //客户编号  clientCode 是从SAP回写回来的。
          WAERK: "CNY", //销售和分销凭证货币
          BSTKD: "SAPmegnxin", //客户参考
          ZMODE: "A",
          ZTERM: "Z101",
          ACTION: "I",
          ZBILL01: "1", //发票类型 1
          SENDER: "GYS", //发送系统
          RECEIVER: "SAP" //接受系统
        }
      };
      //循环子表
      for (var j = 0; j < zbtable.length; j++) {
        let number = zbtable[j].realProductCode;
        var digits = 18;
        var wlbm = prefixInteger(parseInt(number), digits);
        var s1 = {
          EXNUM: zhub.code,
          EXNUMIT: zbtable[j].lineno, //行号   zbtable[j].lineno
          VBELN_F: "0050000132",
          POSNR_F: "000010", //zbtable[j].lineno
          MATNR: "000000002200002941", //物料编码  wlbm
          ARKTX: "测试贺卡纸", //物料名称    zbtable[j].productName  "ZMATNR": "增值税专用发票",
          WERKS: "1250",
          CHARG: "0000038541", //批次号
          LGORT: "9001", //货位编码 01    02
          KWMENG: "19", // 出库数量
          VRKME: "KG", //单位
          KBETR: "201.00", // 单价
          KOEIN: "1",
          EDATU: "20220927", // YS 计划发货日期
          UPDATEFLAG: "I"
        };
        ZGYS_ITEM.push(s1);
        var s2 = {
          EXNUM: zhub.code,
          POSPP: "ZM", // 默认ZM
          POSPNR: "0000505550", //员工编码   StaffCode
          UPDATEFLAG: "I"
        };
        ZGYS_PANTR.push(s2);
        var s3 = {
          EXNUM: zhub.code, //单据号
          EXNUMIT: zbtable[j].lineno, //行号  zbtable[j].lineno
          KBETR: "201.00", //要是修改填 价格
          KSCHL: "ZB00", //固定值
          WAERS: "CNY", //固定值
          KRECH: "C", //价格 是单价就写C   总额就写B
          UPDATEFLAG: "I"
        };
        ZGYS_TERM.push(s3);
        //循环子表
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
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let QRresponse = func1.execute(null, body);
    let QRstrResponses = JSON.parse(QRresponse.strResponse);
    var mesage = QRstrResponses.ZFM_SD_SALEORDER_ACCESS.OUTPUT.ZGYS_RTNH;
    return { mesage };
  }
}
exports({ entryPoint: MyAPIHandler });