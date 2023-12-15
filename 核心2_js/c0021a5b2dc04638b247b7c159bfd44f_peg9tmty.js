let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    // 当前日期时间戳
    var endDate = new Date(date).getTime();
    // 入库主表
    let mainSql = "select id from AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet";
    let res = ObjectStore.queryByYonQL(mainSql);
    if (res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        let mainId = res[i].id;
        // 入库子表
        let SunSql =
          "select term_validity,date_manufacture,product_code,AdvanceArrivalNoticeNo from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id = '" + mainId + "'";
        let SunRes = ObjectStore.queryByYonQL(SunSql);
        if (SunRes.length > 0) {
          for (let j = 0; j < SunRes.length; j++) {
            // 子表入库单号
            let AdvanceArrivalNoticeNo = SunRes[j].AdvanceArrivalNoticeNo;
            // 产品id
            let product_code = SunRes[j].product_code;
            let ProSql = "select Entrusting_enterprise_name from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id ='" + product_code + "'";
            let ProRes = ObjectStore.queryByYonQL(ProSql);
            if (ProRes.length > 0) {
              // 委托方企业名称
              let Entrusting_enterprise_name = ProRes[0].Entrusting_enterprise_name;
              if (Entrusting_enterprise_name == "巴德医疗科技（上海）有限公司") {
                // 有效期
                let term_validity = SunRes[j].term_validity;
                // 有效期时间戳
                let beginDate = new Date(term_validity).getTime();
                if (endDate < beginDate) {
                  // 转化为天数
                  let days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
                  // 日期向上取整
                  let day = Math.ceil(days);
                  if (day > 0 && day <= 31) {
                    let mailReceiver = ["https://www.example.com/", "https://www.example.com/"];
                    let channels = ["mail"];
                    let messageInfo = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      mailReceiver: mailReceiver,
                      channels: channels,
                      subject: "入库验收单子表预到货通知单号为" + AdvanceArrivalNoticeNo + "的产品近效期预警！",
                      content: "委托方为：" + Entrusting_enterprise_name
                    };
                    let result = sendMessage(messageInfo);
                    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a", "63d4ae79-5e1b-4627-a26d-129493cafedd"];
                    let channelses = ["uspace"];
                    let title = "入库验收单的产品近效期预警！";
                    let content = "入库验收单子表预到货通知单号为：" + AdvanceArrivalNoticeNo + "，委托方为：" + Entrusting_enterprise_name;
                    let messageInfos = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      uspaceReceiver: uspaceReceiver,
                      channels: channelses,
                      subject: title,
                      content: content,
                      groupCode: "prewarning"
                    };
                    let resulte = sendMessage(messageInfos);
                  }
                }
              } else if (Entrusting_enterprise_name == "爱齐（上海）商贸有限公司") {
                // 有效期
                let term_validity = SunRes[j].term_validity;
                // 有效期时间戳
                let beginDate = new Date(term_validity).getTime();
                if (endDate < beginDate) {
                  // 转化为天数
                  let days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
                  // 日期向上取整
                  let day = Math.ceil(days);
                  if (day > 0 && day <= 31) {
                    let mailReceiver = ["https://www.example.com/", "https://www.example.com/"];
                    let channels = ["mail"];
                    let messageInfo = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      mailReceiver: mailReceiver,
                      channels: channels,
                      subject: "入库验收单子表预到货通知单号为" + AdvanceArrivalNoticeNo + "的产品近效期预警！",
                      content: "委托方为：" + Entrusting_enterprise_name
                    };
                    let result = sendMessage(messageInfo);
                    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a", "6f6e0422-0d8b-4c45-a408-ae971457ce40"];
                    let channelses = ["uspace"];
                    let title = "入库验收单的产品近效期预警！";
                    let content = "入库验收单子表预到货通知单号为：" + AdvanceArrivalNoticeNo + "，委托方为：" + Entrusting_enterprise_name;
                    let messageInfos = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      uspaceReceiver: uspaceReceiver,
                      channels: channelses,
                      subject: title,
                      content: content,
                      groupCode: "prewarning"
                    };
                    let resulte = sendMessage(messageInfos);
                  }
                }
              } else if (Entrusting_enterprise_name == "爱德华（上海）医疗用品有限公司") {
                // 有效期
                let term_validity = SunRes[j].term_validity;
                // 有效期时间戳
                let beginDate = new Date(term_validity).getTime();
                if (endDate < beginDate) {
                  // 转化为天数
                  let days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
                  // 日期向上取整
                  let day = Math.ceil(days);
                  if (day > 0 && day <= 31) {
                    let mailReceiver = ["https://www.example.com/", "https://www.example.com/"];
                    let channels = ["mail"];
                    let messageInfo = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      mailReceiver: mailReceiver,
                      channels: channels,
                      subject: "入库验收单子表预到货通知单号为" + AdvanceArrivalNoticeNo + "的产品近效期预警！",
                      content: "委托方为：" + Entrusting_enterprise_name
                    };
                    let result = sendMessage(messageInfo);
                    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a", "ff3117e6-2adc-474d-9be0-65d60eedf2b8"];
                    let channelses = ["uspace"];
                    let title = "入库验收单的产品近效期预警！";
                    let content = "入库验收单子表预到货通知单号为：" + AdvanceArrivalNoticeNo + "，委托方为：" + Entrusting_enterprise_name;
                    let messageInfos = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      uspaceReceiver: uspaceReceiver,
                      channels: channelses,
                      subject: title,
                      content: content,
                      groupCode: "prewarning"
                    };
                    let resulte = sendMessage(messageInfos);
                  }
                }
              } else if (Entrusting_enterprise_name == "飞利浦（中国）投资有限公司") {
                // 有效期
                let term_validity = SunRes[j].term_validity;
                // 有效期时间戳
                let beginDate = new Date(term_validity).getTime();
                if (endDate < beginDate) {
                  // 转化为天数
                  let days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
                  // 日期向上取整
                  let day = Math.ceil(days);
                  if (day > 0 && day <= 31) {
                    let mailReceiver = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
                    let channels = ["mail"];
                    let messageInfo = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      mailReceiver: mailReceiver,
                      channels: channels,
                      subject: "入库验收单子表预到货通知单号为" + AdvanceArrivalNoticeNo + "的产品近效期预警！",
                      content: "委托方为：" + Entrusting_enterprise_name
                    };
                    let result = sendMessage(messageInfo);
                    let uspaceReceiver = [
                      "1a591623-4800-412a-ad38-d0572e7d583a",
                      "ff3117e6-2adc-474d-9be0-65d60eedf2b8",
                      "63d4ae79-5e1b-4627-a26d-129493cafedd",
                      "6f6e0422-0d8b-4c45-a408-ae971457ce40"
                    ];
                    let channelses = ["uspace"];
                    let title = "入库验收单的产品近效期预警！";
                    let content = "入库验收单子表预到货通知单号为：" + AdvanceArrivalNoticeNo + "，委托方为：" + Entrusting_enterprise_name;
                    let messageInfos = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      uspaceReceiver: uspaceReceiver,
                      channels: channelses,
                      subject: title,
                      content: content,
                      groupCode: "prewarning"
                    };
                    let resulte = sendMessage(messageInfos);
                  }
                }
              } else if (Entrusting_enterprise_name == "伯乐实验有限公司") {
                // 有效期
                let term_validity = SunRes[j].term_validity;
                // 有效期时间戳
                let beginDate = new Date(term_validity).getTime();
                if (endDate < beginDate) {
                  // 转化为天数
                  let days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
                  // 日期向上取整
                  let day = Math.ceil(days);
                  if (day > 0 && day <= 31) {
                    let mailReceiver = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
                    let channels = ["mail"];
                    let messageInfo = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      mailReceiver: mailReceiver,
                      channels: channels,
                      subject: "入库验收单子表预到货通知单号为" + AdvanceArrivalNoticeNo + "的产品近效期预警！",
                      content: "委托方为：" + Entrusting_enterprise_name
                    };
                    let result = sendMessage(messageInfo);
                    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a", "ff3117e6-2adc-474d-9be0-65d60eedf2b8", "63d4ae79-5e1b-4627-a26d-129493cafedd"];
                    let channelses = ["uspace"];
                    let title = "入库验收单的产品近效期预警！";
                    let content = "入库验收单子表预到货通知单号为：" + AdvanceArrivalNoticeNo + "，委托方为：" + Entrusting_enterprise_name;
                    let messageInfos = {
                      sysId: "yourIdHere",
                      tenantId: "yourIdHere",
                      uspaceReceiver: uspaceReceiver,
                      channels: channelses,
                      subject: title,
                      content: content,
                      groupCode: "prewarning"
                    };
                    let resulte = sendMessage(messageInfos);
                  }
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });