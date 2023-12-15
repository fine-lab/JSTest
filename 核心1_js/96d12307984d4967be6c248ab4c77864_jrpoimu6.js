let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let MODE = "dev";
    let HT_MODE = "YHYF";
    let env = ObjectStore.env();
    let SUPPLIER_CODE = ""; // 调S接口传递的供应商编码
    let FACTORY_CODE = ""; // 库存上载调S接口传递的供应商工厂编码
    let HT_URL = ""; // 要货计划下推接口地址，中融租户推立讯，数算租户推海棠
    let SEND_CODE = ""; // 发送HT还是LX
    let HT_URL_SHI = ""; // 要货指令推送供应商接口
    let CREATE_ATP = ""; // 采购预测推送供应商接口
    let SHIAPPKEY = ""; // 要货计划appKey
    let SHIAPPSECRET = ""; // 要货计划appSecret
    let X_HW_ID = ""; // S的授权信息
    let X_HW_APPKEY = ""; // S的授权信息
    let HT_URL_CHANGE = ""; // 要货指令变更推送
    let HT_SOURCE_CHANNEL = "";
    let HT_URL_CPART = "/cpart";
    let HT_TOKEN = "";
    if (env.tenantId == "jrpoimu6") {
      // 多多云-YS试用
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      SUPPLIER_CODE = "Z03B4B";
      FACTORY_CODE = "Z03B4B-001";
      SHIAPPKEY = "yourKEYHere";
      SHIAPPSECRET = "yourSECRETHere";
      SEND_CODE = "HT";
      HT_URL = "https://www.example.com/" + HT_MODE + "/test";
      HT_URL_SHI = "/createOrder";
      CREATE_ATP = "/createATP";
      HT_URL_CHANGE = "/orderChange";
      HT_SOURCE_CHANNEL = HT_MODE;
      HT_TOKEN = HT_MODE == "DDY" ? "DDY@23sk" : "YHYFMy*8H"; //DDY DDY@23sk  YHYF YHYFMy*8H
      MODE = "dev";
    } else if (env.tenantId == "qcbzpfxs") {
      // 多多云-YS生产
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      SUPPLIER_CODE = "Z03B4B";
      FACTORY_CODE = "Z03B4B-001";
      SHIAPPKEY = "yourKEYHere";
      SHIAPPSECRET = "yourSECRETHere";
      SEND_CODE = "HT";
      HT_URL = "https://www.example.com/";
      HT_URL_SHI = "/createOrder";
      CREATE_ATP = "/createATP";
      HT_URL_CHANGE = "/orderChange";
      HT_SOURCE_CHANNEL = "DDY";
      HT_TOKEN = "yourTOKENHere";
      MODE = "prod";
    } else if (env.tenantId == "gozou9uj") {
      // 翼海云峰-YS生产
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      SUPPLIER_CODE = "Z00Z35";
      FACTORY_CODE = "Z00Z35-003";
      SHIAPPKEY = "yourKEYHere";
      SHIAPPSECRET = "yourSECRETHere";
      SEND_CODE = "HT";
      HT_URL = "https://www.example.com/";
      HT_URL_SHI = "/createOrder";
      CREATE_ATP = "/createATP";
      HT_URL_CHANGE = "/orderChange";
      HT_SOURCE_CHANNEL = "YHYF";
      HT_TOKEN = "yourTOKENHere";
      MODE = "prod";
    }
    const BASE_DATA = {
      dev: {
        //认证id
        X_HW_ID: X_HW_ID,
        //认证appkey
        X_HW_APPKEY: X_HW_APPKEY,
        //接口地址头
        URL: "https://apigw-scs-beta.huawei.com",
        //工厂编码
        FACTORY_CODE: FACTORY_CODE,
        //客户编码 0971代表终端，157代表华技,数字能源填写118390，S云计算技术有限公司112725
        CUSTOMER_CODE: "112725",
        // 海棠接口
        HT_URL: HT_URL,
        //通道标识
        HT_SOURCE_CHANNEL: HT_SOURCE_CHANNEL,
        // 海棠静态token
        HT_TOKEN: HT_TOKEN,
        // 库存组织ID
        ORGANIZATION_ID: "yourIDHere",
        // 供应商编码
        SUPPLIER_CODE: SUPPLIER_CODE,
        // 采购模式
        BIZ_MODEL: "",
        // 欠料等级(支持多个，用英文逗号拼接)
        LEVEL: "1,2,3,4",
        // 业务模式
        CALC_MODE_FLAG: "Y",
        SEND_CODE: SEND_CODE,
        HT_URL_SHI: HT_URL_SHI,
        HT_URL_CHANGE: HT_URL_CHANGE,
        HT_URL_CPART: HT_URL_CPART,
        //要货计划appKey
        APPKEY: SHIAPPKEY,
        //要货计划appSecret
        APPSECRET: SHIAPPSECRET
      },
      prod: {
        //认证id
        X_HW_ID: X_HW_ID,
        //认证appkey
        X_HW_APPKEY: X_HW_APPKEY,
        //接口地址头
        URL: "https://apigw-scs.huawei.com",
        //工厂编码
        FACTORY_CODE: FACTORY_CODE,
        //客户编码 0971代表终端，157代表华技
        CUSTOMER_CODE: "112725",
        // 海棠接口
        HT_URL: HT_URL,
        //通道标识
        HT_SOURCE_CHANNEL: HT_SOURCE_CHANNEL,
        // 海棠静态token
        HT_TOKEN: "yourTOKENHere",
        // 库存组织ID
        ORGANIZATION_ID: "yourIDHere",
        // 供应商编码
        SUPPLIER_CODE: SUPPLIER_CODE,
        // 采购模式
        BIZ_MODEL: "",
        // 欠料等级(支持多个，用英文逗号拼接)
        LEVEL: "1,2,3,4",
        // 业务模式
        CALC_MODE_FLAG: "Y",
        SEND_CODE: SEND_CODE,
        HT_URL_CPART: HT_URL_CPART,
        HT_URL_SHI: HT_URL_SHI,
        HT_URL_CHANGE: HT_URL_CHANGE,
        //要货计划appKey
        APPKEY: SHIAPPKEY,
        HT_SOURCE_CHANNEL: HT_SOURCE_CHANNEL,
        //要货计划appSecret
        APPSECRET: SHIAPPSECRET
      }
    };
    const API_URL = {
      //接口-库存上载：库存数据在首次调用或需要全量刷新时【注意：此接口不是更新，是全量删除后持久化新的数据】
      IMPORT_INVENTORY: "/api/service/esupplier/importInventory/1.0.0",
      //接口-库存上载：但是后续如果只新增、不修改的话，可以调这个接口（这个最少可以传一笔数据都可以）
      APPEND_INVENTORY: "/api/service/esupplier/appendInventory/1.0.0",
      //接口-云预测查询
      QUERY_FORECAST_CLOUD: "/api/service/esupplier/queryForecastCloud/1.0.0",
      //接口-需求预测创建
      CREATE_ATP: CREATE_ATP,
      //回写eSupplier华为云供需匹配补货进度服务
      UpdateForecastCloud: "/api/service/esupplier/updateForecastCloud/1.0.0"
    };
    const AUTH_INFO = {
      USER: "luxshare",
      KEY: "yourKEYHere"
    };
    return { BASE: BASE_DATA[MODE], API_URL: API_URL, AUTH_INFO: AUTH_INFO };
  }
}
exports({ entryPoint: MyTrigger });