let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  baseOrg_code: "pk_org",
  vtrantypecode: "vtrantypecode",
  nexchangerate: "nexchangerate",
  corigcurrencyid_code: "corigcurrencyid",
  personnelid_code: "personnelid",
  depid_code: "depid",
  cvendorid_code: "cvendorid",
  party: "pk_customer",
  project_name: "cprojectid",
  htwytk: "vdef1",
  htwyj: "vdef2",
  wyjzfbl: "vdef3",
  sydfhtmb: "vdef4",
  glht_code: "vdef5",
  sfbcht: "vdef6",
  partyjb_name: "vdef28",
  department_name: "vdef29",
  customerjb: "vdef30",
  pk_fct_ap_bList: {
    pk_fct_ap_bList: "fct_ap_b",
    incomecategory_code: "vbdef1",
    advertisingtype_code: "vbdef2",
    installmenttype_name: "vbdef4",
    isOnLine: "vbdef5",
    onlineplatform_name: "vbdef6"
  },
  pk_fct_ap_planList: {
    pk_fct_ap_planList: "fct_ap_plan"
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
  tokenUrl: "https://www.example.com/"
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function createArCt(bill) {
      let url = "https://www.example.com/";
      let header = { "content-type": "application/json;charset=utf-8" };
      bip2NccMap.translate(bill);
      bill.organizer = bill.pk_org;
      bill.signorg = bill.pk_org;
      bill.openct = "false";
      bill.earlysign = "N";
      bill.dbilldate = bill.pubts;
      bill.vtrantypecode = "FCT1-Cxx-01";
      bill.subscribedate = bill.valdate;
      bill.nexchangerate = "1.00"; // 折本汇率
      bill.mountcalculation = "0"; // 计划金额计算方式
      let body = { fct_ap: bill };
      let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
      return res;
    }
    let res = createArCt(request.bill);
    return { request, res };
  }
}
exports({ entryPoint: MyAPIHandler });