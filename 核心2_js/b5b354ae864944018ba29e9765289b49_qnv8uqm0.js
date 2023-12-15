let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var checkdate = AddDays(Date(), 0);
    var sql =
      "select HTGLZB_id.shenpixinxi,HTGLZB_id.zhidanren,HTGLZB_id.new49,HTGLZB_id.ziduan1,ziduan2,yuedingshoukuanjine,shijishoukuanjine,shoukuanjieduan from GT70723AT7.GT70723AT7.SKXYZB left join HTGLZB_id SKXYZB on HTGLZB_id=SKXYZB.id ";
    sql = sql + "where   ziduan2<'" + checkdate + "'  and shifuyiwanchengshoukuan=2 ";
    var title = "收款预计日期预警消息";
    var res1 = ObjectStore.queryByYonQL(sql);
    if (res1 !== undefined && res1.length > 0) {
      for (let x = 0; x < 1; x++) {
        //某某客户“甲方名称”所签订的某某合同“合同名称”约于“约定收款日期”收取“收款阶段”，截止今日仅剩7天/3天/1天。
        //实际收款金额大于等于约定收款金额则判断收款已经完成
        //所有的合同都需要推送预警，不需要根据哪个用户。推送给审批流程环节的经营管理部负责人、财务负责人、合同制单人
        let messgae = res1[x];
        var kumc = messgae.HTGLZB_id_new49;
        var hemc = messgae.HTGLZB_id_ziduan1;
        var skrq = messgae.ziduan2;
        var skjd = messgae.shoukuanjieduan;
        var zdr = messgae.HTGLZB_id_zhidanren;
        var user = messgae.HTGLZB_id_shenpixinxi;
        let map = [];
        if (user !== undefined) {
          let resuser = user.split("&");
          for (let u = 0; u < resuser.length; u++) {
            map.push(resuser[u]);
          }
        }
        var yuedingshoukuanjine = messgae.yuedingshoukuanjine;
        var content = "客户" + kumc + "的" + hemc + "合同约定于" + skrq + "收取" + getshoukuan(skjd) + "款,金额为" + yuedingshoukuanjine + ",截止今日已逾期,请催款!";
        //根据用户id 查询客户的友互通id
        let base_path = "https://www.example.com/" + zdr;
        //请求数据
        let apiHeader = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
        let apiResponse = ublinker("get", base_path, JSON.stringify(apiHeader), null);
        let result1 = JSON.parse(apiResponse);
        let code = result1.code;
        if (code !== "200") {
          throw new Error("查询用户对应人员错误 " + result1.message);
        } else {
          let uspaceReceiver = result1.data.user_id;
          map.push(uspaceReceiver);
          var messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: map,
            channels: ["uspace"],
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          var result = sendMessage(messageInfo);
        }
      }
    }
    function getshoukuan(type) {
      let typename = "";
      if ("1" === type) {
        typename = "预收款";
      } else if ("2" === type) {
        typename = "首笔款";
      } else if ("3" === type) {
        typename = "二次款";
      } else if ("4" === type) {
        typename = "三次款";
      } else if ("5" === type) {
        typename = "四次款";
      } else if ("6" === type) {
        typename = "五次款";
      } else if ("7" === type) {
        typename = "六次款";
      } else if ("8" === type) {
        typename = "尾款";
      } else if ("9" === type) {
        typename = "押金";
      }
      return typename;
    }
    function AddDays(date, days) {
      var nd = new Date(date);
      nd = nd.valueOf();
      nd = nd + days * 24 * 60 * 60 * 1000;
      nd = new Date(nd);
      var y = nd.getFullYear();
      var m = nd.getMonth() + 1;
      var d = nd.getDate();
      if (m <= 9) m = "0" + m;
      if (d <= 9) d = "0" + d;
      var cdate = y + "-" + m + "-" + d;
      return cdate;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });