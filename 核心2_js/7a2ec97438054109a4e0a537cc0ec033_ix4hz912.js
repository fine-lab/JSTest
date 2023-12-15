let AbstractTrigger = require("AbstractTrigger");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let billObj = param.data[0];
    let custCode = billObj.code;
    let custId = billObj.id;
    let merchant_name = billObj.merchant_name;
    if (merchant_name != null || custId == "") {
      return;
    }
    let companyName = billObj.MingChen;
    var respObj = ObjectStore.selectById("GT3734AT5.GT3734AT5.GongSi", { id: custId, compositions: [{ name: "LianXiRenXinXiList" }, { name: "YinHangXinXiList" }, { name: "ShangJiXinXiList" }] });
    let org_id = respObj.org_id;
    let address = respObj.address;
    let lxrName = respObj.LianXiRenXinXiList[0].XingMing;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let res = AppContext();
    let obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let saveUrl = DOMAIN + "/yonbip/digitalModel/merchant/save";
    let bodyObj = {
      data: {
        _status: "Insert", //操作标识, Insert:新增、Update:更新
        createOrg: org_id, //管理组织
        code: "N" + custCode, //客户编码(不能为空，新增会自动重新生成)
        name: { zh_CN: companyName },
        shortname: { zh_CN: companyName },
        enterpriseName: companyName,
        merchantAppliedDetail: {
          //业务信息
          stopstatus: false
        },
        taxPayingCategories: 0, //纳税类别, 0:一般纳税人、1:小规模纳税人、2:海外纳税、    示例：0
        customerClass: "1570120969749004346", //客户分类id--中国
        merchantOptions: false, //是否商家， true:是、false:否
        enterpriseNature: 0, //企业类型, 0:企业、1:个人、2:非营利组织
        extendCustomer: custId,
        address: address,
        merchantAddressInfos: [
          {
            //地址信息
            addressCode: custCode + "Z-1",
            address: address,
            isDefault: "是", //默认地址, true:是、false:否、
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          }
        ],
        merchantContacterInfos: [
          {
            //联系人信息
            fullName: { zh_CN: lxrName },
            isDefault: "是", //默认地址, true:是、false:否
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          }
        ],
        merchantApplyRanges: [
          {
            //客户适用组织
            orgId: org_id,
            isCreator: true,
            rangeType: 1,
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          }
        ],
        merchantAgentFinancialInfos: [],
        merchantAgentInvoiceInfos: [],
        merchantCorpImages: [],
        merchantAttachments: []
      }
    };
    let jsonStr = JSON.stringify(bodyObj);
    let saveApiRes = openLinker("POST", saveUrl, "GZTBDM", JSON.stringify(bodyObj)); //添加客户档案
    let saveApiResObj = JSON.parse(saveApiRes);
    if (saveApiResObj.code == 200) {
      //成功
      let sysCustId = saveApiResObj.data.id;
      let sysCustCode = saveApiResObj.data.code;
      //回写潜客关联档案
      let biObj = { id: custId, isRelated: true, autoRelated: true, merchant: sysCustId, relateArchTime: getNowDate() };
      let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
      return { rst: true, msg: "success" };
    } else {
      //失败
      let msg = saveApiResObj.message;
      if (includes(msg, "名称重复")) {
        //重复潜客-归为同一客户档案
        if (!respObj.isRelated) {
          let biObj = { id: custId, isRelated: true, merchant: sysCustId, relateArchTime: getNowDate() };
          let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
        }
      }
      return { rst: false, msg: saveApiResObj.message };
    }
    return { rst: false, msg: "异常" };
  }
}
exports({ entryPoint: MyTrigger });