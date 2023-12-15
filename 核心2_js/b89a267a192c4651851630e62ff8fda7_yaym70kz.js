let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  pk_org: "pk_org",
  pk_psndoc: "pk_psndoc",
  pk_dept: "pk_dept",
  billno: "billno",
  billdata: "billdata",
  pk_supplier: "pk_supplier",
  starttime: "starttime",
  adderss: "adderss",
  qtxq: "qtxq",
  memo: "memo",
  ysfs: "ysfs",
  jsfs: "jsfs",
  code: "code",
  enable: "enable",
  bustype: "bustype",
  verifystate: "verifystate",
  def1: "def1",
  def2: "def2",
  def3: "def3",
  def4: "def4",
  def5: "def5",
  def6: "def6",
  def7: "def7",
  def8: "def8",
  def9: "def9",
  def10: "def10",
  def11: "def11",
  po_orderct_bList: []
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
    let url = "http://58.56.41.39:6066/nccloud/api/wmso/purchasemanage/purchase/addAggPurchaseVO";
    let header = { "content-type": "application/json;charset=utf-8" };
    let po_orderct = {
      name: "",
      gg: "",
      num: "",
      money: "",
      rate: "",
      ratemoney: "",
      unratemoney: "",
      moneynum: "",
      memo: ""
    };
    bip2NccMap.code = request.bill.code; //单据号
    bip2NccMap.pk_psndoc = request.bill.pk_psndoc_code; //人员编码
    bip2NccMap.pk_org = request.bill.org_id_code; //组织编码
    bip2NccMap.pk_dept = request.bill.pk_dept_code; //部门编码
    bip2NccMap.billno = request.bill.billno; //单据号
    bip2NccMap.billdata = request.bill.billdata; //单据日期
    bip2NccMap.pk_supplier = request.bill.pk_supplier_code; //供应商编码
    bip2NccMap.starttime = request.bill.starttime; //交货时间
    bip2NccMap.adderss = request.bill.adderss; //地址
    bip2NccMap.qtxq = request.bill.qtxq; //其他服务
    bip2NccMap.memo = request.bill.memo; //备注
    bip2NccMap.ysfs = request.bill.ysfs; //验收方式
    bip2NccMap.jsfs = request.bill.jsfs_code; //结算方式编码
    bip2NccMap.enable = request.bill.enable; //启用
    bip2NccMap.bustype = request.bill.bustype; //
    bip2NccMap.verifystate = request.bill.verifystate;
    bip2NccMap.def1 = request.bill.yifangdanwei_code;
    bip2NccMap.def2 = request.bill.kaihuxing_code;
    bip2NccMap.def3 = request.bill.yinxingdanganmingchen;
    bip2NccMap.def4 = request.bill.jiafangyinxingzhanghu;
    bip2NccMap.def5 = request.bill.jiafangdizhi;
    bip2NccMap.def6 = request.bill.jiafangdanweidianhua;
    bip2NccMap.def7 = request.bill.yifangdanweinew_code;
    bip2NccMap.def8 = request.bill.danweidianhua;
    bip2NccMap.def9 = request.bill.yifangdizhi;
    bip2NccMap.def10 = request.bill.yinxingzhanghu;
    bip2NccMap.def11 = request.bill.isbenbu;
    request.bill.po_orderct_bList.forEach((item) => {
      po_orderct.name = item.name_code; //物料编码
      po_orderct.gg = item.gg; //规格
      po_orderct.num = item.num; //数量
      po_orderct.money = item.money; //金额
      po_orderct.rate = item.rate_code; // 税率编码
      po_orderct.ratemoney = item.ratemoney; //含税金额
      po_orderct.unratemoney = item.unratemoney; //不含税金额
      po_orderct.moneynum = item.moneynum; //价税合计
      po_orderct.memo = item.memo; //备注
      bip2NccMap.po_orderct_bList.push(po_orderct);
    });
    let res = ObjectStore.nccLinker("POST", url, header, bip2NccMap, nccEnv);
    return request;
  }
}
exports({ entryPoint: MyAPIHandler });