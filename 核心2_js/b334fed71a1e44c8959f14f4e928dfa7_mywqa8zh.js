let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var arrayId = request.resId;
    var arrayCode = request.resCode;
    var id = arrayId;
    var Code = arrayCode;
    let url = "https://www.example.com/" + id;
    //调用openlinker
    var apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
    //转化
    var apiResponseObj = JSON.parse(apiResponse);
    //对象
    var data = apiResponseObj.data;
    //客户id
    var agentId = data.agentId;
    var kehusql = "select * from aa.merchant.Merchant where id = '" + agentId + "'";
    var res = ObjectStore.queryByYonQL(kehusql, "productcenter");
    var orgId = res[0].orgId;
    //调用客户档案url
    let url1 = "https://www.example.com/" + agentId + "&agentId=" + orgId;
    //调用openlinker  客户档案
    var kehudangan1 = openLinker("GET", url1, "SCMSA", JSON.stringify({}));
    var kehuAll = JSON.parse(kehudangan1);
    //广州启润YS：销售合同分切订单/退货申请行项目
    var ZGYS_ITEM = new Array();
    //广州启润YS系统：合同/退货申请伙伴
    var ZGYS_PANTR = new Array();
    //广州启润YS：销售订单行项目价格条件
    var ZGYS_TERM = new Array();
    //订单信息
    var DinDanXinXiZiBiao = data.orderDetails;
    for (var q = 0; q < DinDanXinXiZiBiao.length; q++) {
      var s1 = {
        EXNUM: data.code, //单据编号
        EXNUMIT: DinDanXinXiZiBiao[q].firstlineno,
        MATNR: "000000002200002941", //DinDanXinXiZiBiao[q].realProductCode
        ARKTX: "测试贺卡纸", //DinDanXinXiZiBiao[q].productName
        WERKS: "1250",
        CHARG: "0000038541",
        LGORT: "9001", //01
        KWMENG: DinDanXinXiZiBiao[q].priceQty,
        VRKME: "KG", //DinDanXinXiZiBiao[q].productAuxUnitName
        KBETR: DinDanXinXiZiBiao[q].orderDetailPrices.natTaxUnitPrice,
        KOEIN: "1",
        EDATU: DinDanXinXiZiBiao[q].sendDate
      };
      var s2 = {
        EXNUM: data.code, //单据编号
        VBELN: "",
        POSPP: "ZM",
        POSPNR: "0000505550",
        UPDATEFLAG: "I"
      };
      var s3 = {
        EXNUM: data.code, //单据编号
        EXNUMIT: DinDanXinXiZiBiao[q].firstlineno,
        VBELN: "",
        POSNR: "",
        KBETR: DinDanXinXiZiBiao[q].orderDetailPrices.natTaxUnitPrice,
        KSCHL: "ZB00",
        WAERS: data.orderPrices.domesticCode,
        KRECH: "C",
        KWERT: "",
        KOEIN: ""
      };
      ZGYS_ITEM.push(s1);
      ZGYS_PANTR.push(s2);
      ZGYS_TERM.push(s3);
    }
    var body = {
      funName: "ZFM_SD_SALEORDER_ACCESS",
      structure: {
        ZGYS_HEAD: {
          EXNUM: data.code, //外部系统单据号
          VBELN: "",
          AUART: "ZR11",
          VKORG: "1250",
          VTWEG: "10",
          SPART: "22",
          VKBUR: "1340",
          VKGRP: "GQ8", //销售部门 (销售组)  data.salesOrgId_name
          KUNNR: "2000003284", //客户编号
          WAERK: data.orderPrices.domesticCode, //销售和分销凭证货币
          BSTKD: "SAPmegnxin", //客户参考
          ZTERM: "Z107", //付款条件
          DTSEND: "",
          ACTION: "I", //更新标识（I：创建；U：修改；D：删除）
          ZMODE: "A",
          SENDER: "GYS", //发送系统
          RECEIVER: "SAP" //接收系统
        }
      },
      tables: {
        ZGYS_ITEM,
        ZGYS_PANTR,
        ZGYS_TERM
      }
    };
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let resss = func1.execute(null, body);
    let strResponses = JSON.parse(resss.strResponse);
    if (resss != null) {
      var obj = strResponses.ZFM_SD_SALEORDER_ACCESS;
      if (obj.OUTPUT.ZGYS_RTNH.TRAN_FLAG == "0") {
        var val = obj.OUTPUT.ZGYS_RTNH.VBELN;
        //调用自定义项更新接口
        let url2 = "https://www.example.com/";
        var bodyZi = {
          billnum: "voucher_order",
          datas: [
            {
              id: id,
              code: Code,
              definesInfo: [
                {
                  define1: val,
                  isHead: true,
                  isFree: true
                }
              ]
            }
          ]
        };
        //调用openlinker
        var zidingyi = openLinker("POST", url2, "SCMSA", JSON.stringify(bodyZi));
        //自定义项
        var zidingyiAll = JSON.parse(kehudangan1);
      } else {
        return { IS: "调用SAP接口失败" };
      }
      //查询SAP接口成功
      var sult = JSON.stringify(strResponses);
      throw new Error(sult);
    } else {
      // 查询SAP接口失败
      throw new Error("调用SAP接口失败");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });