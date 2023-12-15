let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataList = param.data;
    let data = dataList[0];
    // 客户类型客户类型（ 'CO' 收货人'VE' 供应商，‘PD’生产商）
    let customerName = context.name != null ? context.name : "";
    let customerType = customerName == "客户档案" ? "CO" : customerName == "供应商档案" ? "VE" : customerName == "生产商档案" ? "PD" : "";
    let country = data.country_code != undefined ? data.country_code : "";
    let bodyData = {
      customerId: data.code.toUpperCase(), //客户id
      customerType: customerType, //客户类型
      customerDescr1: data.name.zh_CN, //客户名称
      customerDescr2: "", //客户名称(第二语言)
      activeFlag: "Y", //激活标记
      refOwner: null, //隶属单位
      easyCode: "", //助记码
      address1: "", //地址
      address2: "",
      address3: "",
      address4: "",
      country: country, //国家
      province: "", //省份
      city: "", //城市
      district: "", //区县
      street: "", //街道
      routeCode: null, //默认线路
      zipCode: "", //邮政编码
      stopStation: "", //站点
      contact1: "", //联系人1
      contact1Email: "", //电子邮件地址1
      contact1Fax: "", //传真
      contact1Tel1: "", //手机号
      contact1Tel2: "", //固定电话
      contact1Title: "", //职位1
      contact2: "", //联系人2
      contact2Fax: "", //传真
      contact2Tel1: "", //电话
      contact2Tel2: "", //固定电话
      contact2Title: "", //职位2
      contact3: "", //联系人3
      contact3Fax: "", //传真
      contact3Tel1: "", //电话
      contact3Tel2: "", //固定电话
      contact3Title: "", //职位3
      currency: "CNY", //币种
      userDefine1: "", //生产厂商主键
      bankAccount: "", //银行账号
      userDefine2: "", //用户自定义
      userDefine3: "", //用户自定义
      userDefine4: "", //用户自定义
      userDefine5: "", //用户自定义
      notes: "" //备注(text)
    };
    let list = new Array();
    list.push(bodyData);
    let headerData = {
      header: list
    };
    let body = {
      data: headerData
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });