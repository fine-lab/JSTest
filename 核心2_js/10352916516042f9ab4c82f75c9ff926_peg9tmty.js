let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = param.data;
    let ArrList = new Array();
    for (let k = 0; k < Data.length; k++) {
      // 单号
      let AdvanceArrivalNoticeNo = Data[k].AdvanceArrivalNoticeNo;
      // 委托方id
      var the_client_code = Data[k].the_client_code;
      var timezone = 8; //目标时区时间，东八区
      // 本地时间和格林威治的时间差，单位为分钟
      var offset_GMT = new Date().getTimezoneOffset();
      // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var nowDate = new Date().getTime();
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      // 当前日期时间戳
      var endDate = new Date(date).getTime();
      let _status = Data[k]._status;
      if (_status == "Update") {
        let sql = "select fromDate,toDate,expiryDate from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where id = '" + the_client_code + "'";
        let res = ObjectStore.queryByYonQL(sql);
        // 开始委托时间
        let fromDate = res[0].fromDate;
        let fromDate_date = new Date(fromDate);
        let fromDate_time = fromDate_date.getTime();
        // 停止委托时间
        let toDate = res[0].toDate;
        let toDate_date = new Date(toDate);
        let toDate_time = toDate_date.getTime();
        // 备案凭证有效期
        let expiryDate = res[0].expiryDate;
        let expiryDate_date = new Date(expiryDate);
        let expiryDate_time = expiryDate_date.getTime();
        if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
          var messageList = {};
          let UpdateList = Data[k].product_lisList;
          if (UpdateList != undefined || UpdateList != null) {
            if (UpdateList.length > 0) {
              let UpdateArrList = new Array();
              for (let j = 0; j < UpdateList.length; j++) {
                // 子表id
                let Sunid = UpdateList[j].id;
                // 数量
                let UpdateQuantity = UpdateList[j].quantity;
                // 不合格数
                let UpdateNoQualified_quantity = UpdateList[j].NoQualified_quantity;
                // 隔离数
                let UpdateIsolation_number = UpdateList[j].Isolation_number;
                if (UpdateQuantity < UpdateNoQualified_quantity || UpdateQuantity < UpdateIsolation_number || UpdateQuantity < UpdateNoQualified_quantity + UpdateIsolation_number) {
                  messageList = {
                    子表行号: j + 1,
                    错误信息: "不合格数加上隔离数的总和大于总数量!"
                  };
                  ArrList.push(messageList);
                }
              }
            }
          }
        } else {
          messageList = {
            预到货单号为: AdvanceArrivalNoticeNo,
            错误信息: "委托方合同不在有效期内不可新增！"
          };
          ArrList.push(messageList);
        }
      } else {
        let sql = "select fromDate,toDate,expiryDate from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where id = '" + the_client_code + "'";
        let res = ObjectStore.queryByYonQL(sql);
        // 开始委托时间
        let fromDate = res[0].fromDate;
        let fromDate_date = new Date(fromDate);
        let fromDate_time = fromDate_date.getTime();
        // 停止委托时间
        let toDate = res[0].toDate;
        let toDate_date = new Date(toDate);
        let toDate_time = toDate_date.getTime();
        // 备案凭证有效期
        let expiryDate = res[0].expiryDate;
        let expiryDate_date = new Date(expiryDate);
        let expiryDate_time = expiryDate_date.getTime();
        if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
          let List = Data[k].product_lisList;
          var object = {};
          if (List != undefined || List != null) {
            if (List.length > 0) {
              for (let i = 0; i < List.length; i++) {
                // 子表id
                let Sunid = List[i].id;
                // 数量
                let quantity = List[i].quantity;
                // 不合格数
                let NoQualified_quantity = List[i].NoQualified_quantity;
                // 隔离数
                let Isolation_number = List[i].Isolation_number;
                if (quantity < NoQualified_quantity || quantity < Isolation_number || quantity < NoQualified_quantity + Isolation_number) {
                  object = {
                    子表行号: i + 1,
                    错误信息: "不合格数加上隔离数的总和大于总数量！"
                  };
                  ArrList.push(object);
                }
              }
            }
          }
        } else {
          object = {
            预到货单号为: AdvanceArrivalNoticeNo,
            错误信息: "委托方合同不在有效期内不可新增！"
          };
          ArrList.push(object);
        }
      }
    }
    if (ArrList.length > 0) {
      throw new Error(JSON.stringify(ArrList));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });