let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  vtrantypecode: "vtrantypecode",
  nexchangerate: "nexchangerate",
  pk_org_v_code: "pk_org", // 采购组织
  depid_code: "depid", //部门
  personnelid_code: "personnelid", //承办人员
  cvendorid_code: "cvendorid",
  code: "vbillcode", //合同编码
  openctbip: "openct",
  earlysignbip: "earlysign",
  //合同类型ctrantypeid
  cprojectid_code: "cprojectid", //项目
  corigcurrencyid_code: "corigcurrencyid", //币种
  vdef5_vbillcode: "vdef5", //关联销售合同
  vdef7_vbillcode: "vdef7", //关联补充合同
  vdef8_code: "vdef8", //关联补充合同项目
  norigpshamount: "norigpshamount", //  累计付款金额
  norigpshamount: "norigcopamount", //  累计应付金额
  norigplanamount: "norigplanamount", //  累计预付款金额
  unconfpayableori: "unconfpayableori", //未确认应付金额
  norikpmny: "norikpmny", //  累计收票金额
  unconfpaymentori: "unconfpaymentori", //  未确认付款金额
  signorg_code: "signorg", //甲方单位
  pk_fct_ap_bList: {
    pk_fct_ap_bList: "fct_ap_b",
    wuliao_code: "pk_material", //  物料
    shui_code: "ctaxcodeid",
    nccaigoufanganhid: "youridHere",
    nccaigoufanganbid: "youridHere"
  },
  pk_fct_ap_planList: {
    pk_fct_ap_planList: "fct_ap_plan",
    begindate: "begindate", //预计付款日期
    planrate: "planrate", //付款比例%
    planmoney: "planmoney" //预计付款金额
  },
  translate: function (bill) {
    Object.keys(this)
      .filter((item) => typeof item == "string" || typeof item == "object")
      .forEach((from) => {
        if (typeof this[from] == "string" && bill[from]) {
          bill[this[from]] = bill[from];
          delete bill[from];
        }
        if (typeof this[from] == "object" && Array.isArray(bill[from])) {
          bill[from].forEach((sitem) => {
            Object.keys(this[from]).forEach((sfrom) => {
              if (sitem[sfrom]) {
                sitem[this[from][sfrom]] = sitem[sfrom];
                delete sitem[sfrom];
              }
            });
          });
          if (this[from][from]) {
            bill[this[from][from]] = bill[from];
            delete bill[from];
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
      let url = "http://58.56.41.39:6066/nccloud/api/fct/ap/insert";
      let header = { "content-type": "application/json;charset=utf-8" };
      bip2NccMap.translate(bill);
      bill.organizer = bill.pk_org;
      bill.signorg = bill.pk_org;
      bill.earlysign = "N";
      bill.vtrantypecode = "FCT1-Cxx-01";
      bill.subscribedate = bill.valdate;
      bill.nexchangerate = "1.00"; // 折本汇率
      bill.mountcalculation = "0"; // 计划金额计算方式
      let body = { fct_ap: bill };
      let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
      return { body, res };
    }
    let billid = request.bill.id;
    var openct;
    var earlysign;
    if (request.bill.openct == 1) {
      openct = true;
    } else {
      openct = false;
    }
    if (request.bill.earlysign == 1) {
      earlysign = true;
    } else {
      earlysign = false;
    }
    let res = createArCt(request.bill);
    let letcode = res.res.code;
    if (letcode == "1000000000") {
      let letmessage = res.res.message;
      var object1 = { id: billid, shifubeian: "1", openct: openct, earlysign: earlysign, isWfControlled: "1" };
      var res122 = ObjectStore.updateById("AT168837E809980003.AT168837E809980003.ad_pu1", object1, "ybf0122bfb");
    }
    return { request, res, openct, earlysign };
  }
}
exports({ entryPoint: MyAPIHandler });