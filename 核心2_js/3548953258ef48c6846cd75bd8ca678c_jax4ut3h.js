let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //基础配置信息
    var config = {
      token_url: "https://www.example.com/", //获取token接口地址
      appCode: "89076615-609f-45ef-85da-2fc0effd16bf", //开放平台appCode
      appKey: "yourKeyHere", //开放平台appKey
      appSecret: "yourSecretHere", //开放平台appSecret
      api_key: "yourkeyHere", //简道云api_key
      app_id: "youridHere", //简道云app_id
      JDY_dataListUrl: "https://www.example.com/", //简道云查询多条数据接口
      JDY_UpdateUrl: "https://www.example.com/", //修改单条数据接口
      entry_id: {
        entry_a: "63579d893ff160000acfdd7e", //对公预付（有发票） -- JDY通用报销单
        entry_b: "635a49c8ce28a4000ad6110a", //对公预付（无发票） -- JDY对公预付款（无发票）
        entry_c: "6375e1278327a60008c6ec14", //对公预付核销       -- JDY对公预付核销单
        entry_d: "63579da527a64c0008a3b5cb", //个人借款           -- JDY借款单
        entry_e: "", //公司借款单 -- JDY借款单
        entry_f: "635a553e96cc12000a5cfef1", //销售报销（与商机关联）-- JDY借款单
        entry_g: "6371bc4bc0d809000af566c6", //非销售报销（与商机管理） -- JDY通用报销单
        entry_h: "635f9e657f88f50008d1ea9d", //报销（不予商机关联） -- JDY通用报销单
        entry_l: "6362301790187a000ac307de" //团建费报销 -- JDY通用报销单
      },
      YS_entity_type: {
        entry_b: "entry_b", //对公预付(无发票)
        entry_b_loanbillbvos: "entry_b_loanbillbvos", //对公预付(无发票)_loanbillbvos
        entry_b_loansettleinfovos: "entry_b_loansettleinfovos" //对公预付(无发票)_loansettleinfovos
      },
      entry: {
        entry_b: {
          entry_id: "youridHere", //对公预付（无发票） -- JDY对公预付款（无发票）
          saveDataUrl: "https://www.example.com/", //保存数据接口
          auditUrl: "https://www.example.com/", //审核接口
          entity_type: "entry_b" //对公预付(无发票)
        },
        entry_a: {
          entry_id: "youridHere", //对公预付（有发票） -- JDY对公预付款（有发票）
          saveDataUrl: "https://www.example.com/", //保存数据接口
          auditUrl: "	https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/znbz/rbsm/api/bill/expensebill/audit", //审核接口
          entity_type: "entry_a" //对公预付(有发票)
        }
      },
      YS_API_url_list: {
        getStaffUrl: "https://www.example.com/", //获取员工信息接口
        getUserMessageUrl: "https://www.example.com/" //查询租户下用户身份接口
      }
    };
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });