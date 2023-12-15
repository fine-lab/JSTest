let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    var verifystate = param.data[0].verifystate;
    if (verifystate == "0") {
      //授权伙伴类型
      param.data[0].set("shouquanhuobanleixing", param.data[0].sqhblx);
      //授权产品线
      param.data[0].set("shouquanchanpinxian", param.data[0].shenqingchanpinxian0);
      //授权领域
      param.data[0].set("shouquanlingyu", param.data[0].sqfwly);
      //授权服务行业
      param.data[0].set("shouquanxingye", param.data[0].sqfwhy);
      //授权伙伴登记
      param.data[0].set("shouquanhuobandengji", param.data[0].sqhbdj);
      //授权地域范围
      param.data[0].set("shouquandiyufanwei", param.data[0].shenqingdiyufanwei);
    }
    //审批中
    else if (verifystate == "1") {
      //给授权人/授权日期/授权组织赋值
      let param1 = {};
      let queryUserInfo = extrequire("GT18952AT11.zzsq.queryUserInfo");
      let res = queryUserInfo.execute(param1);
      if (res !== null) {
        //授权人姓名
        param.data[0].set("shouquanren", res.name);
        param.data[0].set("shouquanrenid", res.id);
        //授权日期
        var dd = formatDate(new Date());
        param.data[0].set("shouquanriqi", dd);
        let param2 = { orgId: res.orgId };
        let QueryOrgInfo = extrequire("GT18952AT11.zzsq.QueryOrgInfo");
        let org = QueryOrgInfo.execute(param2);
        if (org.code == "200") {
          let data = org.data;
          param.data[0].set("shouquanzuzhiid", data.id);
          param.data[0].set("shouquanzuzhicode", data.code);
          param.data[0].set("shouquanzuzhi", data.name.zh_CN);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });