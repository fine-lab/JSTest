let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      //调用api
      let body = "";
      let url = "";
      let uri = "AT163BD39E08680003";
      //领域key
      let domainkey = "yourkeyHere";
      let sql = "";
      let dt;
      //校验参数
      let sumqty = 0; //整单数量
      let summoney = 0; //整单金额
      let errMsg = "";
      //获取客户信息
      url = "https://www.example.com/" + param.data[0].agentId + "";
      let apiResCusClass = JSON.parse(openLinker("GET", url, uri, ""));
      if (apiResCusClass.code != 200) {
        throw new Error("获取客户信息失败：" + JSON.stringify(apiResCusClass));
      }
      if (
        typeof apiResCusClass.data.customerClass == "undefined" ||
        apiResCusClass.data.customerClass == null ||
        apiResCusClass.data.customerClass == "" ||
        apiResCusClass.data.customerClass == "undefined"
      ) {
        throw new Error("客户分类为空");
      }
      //现存量校验
      for (var i = 0; i < param.data[0].orderDetails.length; i++) {
        var ck = "";
        if (
          typeof param.data[0].orderDetails[i].stockId == "undefined" ||
          param.data[0].orderDetails[i].stockId == null ||
          param.data[0].orderDetails[i].stockId == "" ||
          param.data[0].orderDetails[i].stockId == "undefined"
        ) {
          if (
            typeof apiResCusClass.data.merchantAppliedDetail.deliveryWarehouse == "undefined" ||
            apiResCusClass.data.merchantAppliedDetail.deliveryWarehouse == null ||
            apiResCusClass.data.merchantAppliedDetail.deliveryWarehouse == "" ||
            apiResCusClass.data.merchantAppliedDetail.deliveryWarehouse == "undefined"
          ) {
            throw new Error("客户发货仓库为空");
          } else {
            ck = apiResCusClass.data.merchantAppliedDetail.deliveryWarehouse;
          }
        } else {
          ck = param.data[0].orderDetails[i].stockId;
        }
        sql = "SELECT shangpinbianma FROM AT163BD39E08680003.AT163BD39E08680003.shangpindangan WHERE shangpinbianma= '" + param.data[0].orderDetails[i].productId + "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length > 0) {
          //校验可用量
          url = "https://www.example.com/";
          body = "";
          body = '{"product":"' + param.data[0].orderDetails[i].productId + '","warehouse":"' + ck + '"}';
          let apiResKyl = JSON.parse(openLinker("POST", url, uri, body));
          if (apiResKyl.code != 200) {
            errMsg += param.data[0].orderDetails[i].productName + "可用量查询失败:" + JSON.stringify(apiResKyl);
          }
          let kyl;
          kyl = 0;
          if (apiResKyl.data != null) {
            for (var j = 0; j < apiResKyl.data.length; j++) {
              kyl += apiResKyl.data[j].availableqty;
            }
          }
          if (param.data[0].orderDetails[i].qty > kyl) {
            errMsg += param.data[0].orderDetails[i].productName + "【缺货】";
          }
        }
        sumqty += param.data[0].orderDetails[i].qty;
        summoney += param.data[0].orderDetails[i].oriSum;
      }
      if (errMsg.length > 0) {
        throw new Error("可用量校验：" + errMsg);
      }
      if (param.data[0].createSource == "2") {
        //客户发货时效校验
        if (typeof param.data[0].hopeReceiveDate == "undefined" || param.data[0].hopeReceiveDate == null || param.data[0].hopeReceiveDate == "") {
          errMsg += "期望收货日期为空";
        } else {
          sql = "SELECT shijian,n FROM AT163BD39E08680003.AT163BD39E08680003.kehufahuoshixiaodangan where kehufenleibianma =  '" + apiResCusClass.data.customerClass + "'";
          dt = ObjectStore.queryByYonQL(sql, domainkey);
          if (dt.length == 0) {
            errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]未配置发货时效";
          } else if (dt.length > 1) {
            errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]重复配置发货时效";
          } else {
            var timezone = 8; //目标时区时间，东八区
            var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
            var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
            var time = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
            //检验下单时间是否超过配置的时间
            let time1 = new Date("2022-1-1 " + dt[0].shijian.toString());
            let time2 = new Date("2022-1-1 " + time.toLocaleTimeString().toString());
            if (time1 < time2) {
              //超过当天下单时间 N+1
              dt[0].n = dt[0].n + 1;
            }
            var consignTime = new Date(param.data[0].hopeReceiveDate);
            //根据配置计算的发货时间
            time.setDate(time.getDate() + dt[0].n);
            var stime = time.getFullYear().toString() + "-" + (time.getMonth() + 1).toString() + "-" + time.getDate().toString();
            if (consignTime < new Date(stime)) {
              errMsg += "发货时间不能早于【" + stime + "】";
            }
          }
        }
        if (errMsg.length > 0) {
          throw new Error("发货时效：" + errMsg);
        }
        //客户起订量
        sql = "SELECT qidingshuliang,qidingjine1,yueshumoshi FROM AT163BD39E08680003.AT163BD39E08680003.kehuqidingliangdangan where kehufenleibianma =  '" + apiResCusClass.data.customerClass + "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length == 0) {
          errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]未配置起订量";
        } else if (dt.length > 1) {
          errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]重复配置起订量";
        } else {
          if (dt[0].yueshumoshi == "1") {
            if ((sumqty < dt[0].qidingshuliang) & (summoney < dt[0].qidingjine1)) {
              errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + sumqty + "】";
              errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + summoney + "】";
              errMsg += "数量和金额必须满足一个！";
            }
          } else {
            if (sumqty < dt[0].qidingshuliang) {
              errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + sumqty + "】";
            }
            if (summoney < dt[0].qidingjine1) {
              errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + summoney + "】";
            }
          }
        }
        if (errMsg.length > 0) {
          throw new Error("起订量：" + errMsg);
        }
      } else {
        //现存量校验
        for (var i = 0; i < param.data[0].orderDetails.length; i++) {
          //商品最低限价
          sql =
            "SELECT zuidixianjia FROM   AT163BD39E08680003.AT163BD39E08680003.kehucankaojia WHERE  IFNULL(zuidixianjia,0)<>0 and  shangpinbianma = '" + param.data[0].orderDetails[i].productId + "'";
          dt = ObjectStore.queryByYonQL(sql, domainkey);
          if (dt.length != 0) {
            if (dt[0].zuidixianjia > param.data[0].orderDetails[i].oriUnitPrice) {
              throw new Error(param.data[0].orderDetails[i].productName + "最低限价：[" + dt[0].zuidixianjia + "](不含税)");
            }
          }
        }
      }
    } catch (e) {
      throw new Error("订单校验失败：" + e.toString());
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});