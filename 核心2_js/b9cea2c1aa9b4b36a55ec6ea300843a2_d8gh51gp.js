let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询主表
    var detectOrderSql = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where id='" + request.id + "'";
    var res = ObjectStore.queryByYonQL(detectOrderSql, "developplatform");
    var Generate = res[0].Generate;
    var checkStatus = res[0].checkStatus;
    if (Generate == "true") {
      throw new Error("已经生成报告，不能再次生成");
    }
    if (checkStatus != 10) {
      throw new Error("非检测中，不能生成报告");
    }
    var cbList = new Array();
    var srList = new Array();
    //查询科目对照表
    var sydType = res[0].SampleUnitType; //收样单类型
    var orgId = res[0].organizationId; //组织id
    var subjectSql = "select * from AT15F164F008080007.AT15F164F008080007.insItems where sydType = '" + sydType + "'and org_id = '" + orgId + "'";
    var subjectRes = ObjectStore.queryByYonQL(subjectSql, "developplatform");
    if (subjectRes.length == 0) {
      throw new Error("查询科目对照表中没有检测订单中的收样单类型");
    }
    for (var i = 0; i < subjectRes.length; i++) {
      var kemuData = subjectRes[i];
      var categoryType = kemuData.voucherCategory; // 2 是成本  1 是收入
      if (categoryType == "2") {
        cbList.push(kemuData);
      } else {
        srList.push(kemuData);
      }
    }
    var jcdddata = request.data;
    var ispingzhenghao = jcdddata.hasOwnProperty("pingzhenghao");
    var issrpingzhenghao = jcdddata.hasOwnProperty("srpingzhenghao");
    if (ispingzhenghao != true && issrpingzhenghao != true) {
      //生成成本凭证
      let param = { data: res[0], dateList: cbList };
      let voucher = extrequire("AT15F164F008080007.jcdd.voucher");
      let voucherRes = voucher.execute(param);
      //生成收入凭证
      let paramsr = { data: res[0], dateList: srList };
      let vouchersr = extrequire("AT15F164F008080007.jcdd.operationSub");
      let voucherRessr = vouchersr.execute(paramsr);
    } else if (ispingzhenghao != true) {
      //生成成本凭证
      let param = { data: res[0], dateList: cbList };
      let voucher = extrequire("AT15F164F008080007.jcdd.voucher");
      let voucherRes = voucher.execute(param);
    } else if (issrpingzhenghao != true) {
      //生成收入凭证
      let paramsr = { data: res[0], dateList: srList };
      let vouchersr = extrequire("AT15F164F008080007.jcdd.operationSub");
      let voucherRessr = vouchersr.execute(paramsr);
    }
    //更新时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var strDate = date.getFullYear() + "-";
    var month = date.getMonth() + 1; //月
    var getData = date.getDate(); //日
    var hours = date.getHours(); //时
    var minutes = date.getMinutes(); //分
    var seconds = date.getSeconds(); //秒
    month = month < 10 ? "0" + month : month;
    getData = getData < 10 ? "0" + getData : getData;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    strDate += month + "-" + getData + " " + hours + ":" + minutes + ":" + seconds;
    var updateDate = { id: request.id, generateTime: strDate, Generate: "true", checkStatus: "20" };
    var updateDateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", updateDate, "71a4dca4");
    //更新收样单
    var updateBgDate = { id: sydId, bgDate: strDate, checkStatus: "20", isbg: "true" };
    var updateBgDateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateBgDate, "63fb1ae5");
    return { updateBgDateRes };
  }
}
exports({ entryPoint: MyAPIHandler });