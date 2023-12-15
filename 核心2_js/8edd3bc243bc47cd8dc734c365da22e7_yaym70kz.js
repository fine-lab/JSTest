let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  vtrantypecode: "vtrantypecode",
  nexchangerate: "nexchangerate",
  corigcurrencyid_code: "corigcurrencyid",
  youridHere: "youridHere",
  ntotalorigmny: "ntotalorigmny",
  pk_org_v_code: "pk_org_v", // 销售组织
  depid_code: "depid", // 销售部门
  personnelid_code: "personnelid", //销售人员
  headQuartersRes: "vdef16", //使用总部资源
  ordersrc_code: "vdef8", // 订单获取方式
  code: "vbillcode", // 合同编码
  ctname: "ctname", // 合同名称
  xiangmu_code: "vdef17", // 项目
  openct: "openct", // 是否框架合同
  subscribedate: "subscribedate", //签订日期
  dbilldate: "dbilldate", //单据日期
  valdate: "valdate", //合作开始日期
  invallidate: "invallidate", //合作结束日期
  verifystate: "fstatusflag", //合同状态
  ntotaltaxmny: "ntotaltaxmny", //合同金额
  settletype_code: "vdef12", //结算方式
  guaranteeperiod: "vdef9", //合同约定质保期
  retentionmoney: "vdef10", //质保金额
  vdef13_code: "vdef13", //合同类型编码
  ccontract_code: "vdef14", //关联销售合同
  cprojectid_code: "vdef15", //关联项目
  pk_customer_v_code: "pk_customer", //客户
  customerPsn_code: "vdef19", //经办人
  party_code: "signorg", //乙方单位
  partyDept_code: "vdef27", //经办部门
  partyPsn_code: "vdef28", //经办人
  bankaccount: "bankaccount", //银行账号
  pk_fct_ar_bList: {
    pk_fct_ar_bList: "fct_ar_b",
    advertisingtype_code: "vbdef2", //收入小类
    installmenttype_code: "vbdef3", //分期类型
    isOnLine: "vbdef4", //线上线下
    onlineplatform_code: "vbdef5", //线上平台
    bengintime: "vbdef6", //合作开始日期
    endtime: "vbdef7", //合作结束日期
    norigtaxmny: "norigtaxmny", //含税金额
    ctaxcodeid_code: "ctaxcodeid", //税率
    emeo: "vbdef8" //备注
  },
  pk_fct_ar_planList: {
    pk_fct_ar_planList: "fct_ar_plan",
    begindate: "vdef7", //起始日期
    enddate: "vdef8", //终止日期
    date: "vdef1", //确认月份
    planmoney: "planmoney", //确认收入金额
    unplanmoney: "vdef2", //确认收入不含税金额
    shuilv_code: "vdef3", //税率
    taxmoney: "vdef6", //税金金额
    memo: "vdef4", //备注
    advertisingtype_code: "vdef10", //收入类型
    accountnum: "vdef9" // 第几期
  },
  pk_fct_ar_memora_adList: {
    pk_fct_ar_memora_adList: "fct_ar_memora",
    vmemoracode: "vmemoracode",
    recplan: "recplan",
    paydate: "paydate",
    money: "money",
    vmemo: "vmemo"
  },
  translate: function (bill) {
    Object.keys(this)
      .filter((item) => typeof item == "string" || typeof item == "object")
      .forEach((from) => {
        if (typeof this[from] == "string" && bill[from]) {
          bill[this[from]] = bill[from];
        }
        if (typeof this[from] == "object" && Array.isArray(bill[from])) {
          bill[from].forEach((sitem) => {
            Object.keys(this[from]).forEach((sfrom) => {
              if (sitem[sfrom]) {
                sitem[this[from][sfrom]] = sitem[sfrom];
              }
            });
          });
          if (this[from][from]) {
            bill[this[from][from]] = bill[from];
          }
        }
      });
  }
};
const nccEnv = {
  clientId: "yourIdHere",
  clientSecret: "yourSecretHere",
  pubKey:
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS5avjb7GbHWNXB5XPC4gJRJHmvwyPMCvyKV6EJ7mq6kjiJBIf+t5Q8guRD41rswF7Nt+hWKs0rnWCc9ypqcTJwtbtHTkjOlD/I7C1KszyEbPT8mBRr0nQd203rfWZ+oKkPl1ENpmlDiNgStRjHZWvZM1ZzPd3yDhHZaUma0iCHwIDAQAB",
  username: "1",
  userCode: "gxq",
  password: "",
  grantType: "client_credentials",
  secretLevel: "L0",
  busiCenter: "01",
  busiId: "",
  repeatCheck: "",
  tokenUrl: "http://58.56.41.39:6066/nccloud/opm/accesstoken"
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function createArCt(bill) {
      let url = "http://58.56.41.39:6066/nccloud/api/fct/ar/insert";
      let header = { "content-type": "application/json;charset=utf-8" };
      bip2NccMap.translate(bill);
      bill.organizer = bill.pk_org_v;
      bill.pk_org = bill.pk_org_v;
      bill.earlysign = "N";
      bill.vtrantypecode = "FCT2-Cxx-01";
      bill.nexchangerate = "1"; // 折本汇率
      bill.mountcalculation = "0"; // 计划金额计算方式
      bill.ntotalgpamount = bill.ntotaltaxmny;
      bill.norigcopamount = bill.ntotaltaxmny;
      bill.ntotalcopamount = bill.ntotaltaxmny;
      let body = { fct_ar: bill };
      let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
      return { body, res };
    }
    let billid = request.bill.id;
    var bipopenct;
    if (request.bill.openct == "Y") {
      bipopenct = true;
    } else {
      bipopenct = 0;
    }
    let res = createArCt(request.bill);
    let letcode = res.res.code;
    if (letcode == "1000000000") {
      let letmessage = res.res.message;
      var object1 = { id: billid, beianzhuangtai: "1", openct: bipopenct, isWfControlled: "1" };
      var res122 = ObjectStore.updateById("AT168837E809980003.AT168837E809980003.ad1", object1, "ybfcd0be3d");
    } else {
    }
    return { res, res122, bipopenct };
  }
}
exports({ entryPoint: MyAPIHandler });