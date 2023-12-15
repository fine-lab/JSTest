let AbstractAPIHandler = require("AbstractAPIHandler");
const getU8Domain = (keyParams) => {
  let U8DOMAIN = "https://www.example.com/";
  return U8DOMAIN + keyParams;
};
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
const batchHandle = (id) => {
  let vSyncCRst = ObjectStore.queryByYonQL("select *,accBook.code from AT1703B12408A00002.AT1703B12408A00002.voucherSync where id='" + id + "'", "developplatform");
  if (vSyncCRst.length == 0) {
    return { rst: false, msg: "数据异常，未查到镜像凭证数据!" };
  }
  let pdata = vSyncCRst[0];
  let locked = pdata.locked;
  if (locked == 1) {
    return { rst: true, msg: "已锁定，可以弃审该凭证了!" };
  }
  let syncRst = pdata.syncRst;
  let displayName = pdata.displayName;
  let voucherCode = pdata.voucherCode;
  if (syncRst != undefined && syncRst == 1) {
    //已同步
    //查询U8中凭证是否删除
    let voucherIdU8 = pdata.voucherIdU8;
    let voucherCodeU8 = pdata.voucherCodeU8;
    let syncFailure = pdata.syncFailure;
    let makeTime = pdata.makeTime;
    if (makeTime.length > 10) {
      makeTime = makeTime.substring(0, 10);
    }
    let accBook_code = pdata.accBook_code;
    let dsSequenceObj = extrequire("AT1703B12408A00002.selfServ.getU8dsSequence").execute(null, { accbookCode: accBook_code }); //getU8dsSequence(accbook.code);
    if (dsSequenceObj == null) {
      //没找到U8账套配置
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "异常-没有配置YS账簿与U8账套的对应", reqt: accbook.code, resp: "" }));
      return { rst: false, msg: "数据异常-没找到U8账套配置" };
    }
    let ds_sequence = dsSequenceObj.ds_sequence; //数据源
    let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccessToken").execute(null);
    let accessToken = null;
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "AccessToken为空异常-无法对接U8", reqt: "", resp: "" })); //调用领域内函数写日志
      return { rst: false, msg: "AccessToken为空异常-无法对接U8，不能删除!" };
    }
    let u8Domain = getU8Domain("voucherlist/batch_get");
    let baseDataType = "获取凭证列表信息";
    let cno_id = voucherIdU8;
    let coutno_id = voucherCodeU8; //外部系统编码
    let commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
    commUrl = commUrl + "&page_index=1&rows_per_page=10&ds_sequence=" + ds_sequence;
    if (coutno_id) {
      //有外部系统编号就以此为条件查询
      commUrl = commUrl + "&coutno_id=" + coutno_id;
    } else {
      //否则以日期和凭证ID进行查询--凭证id可能会变-存在不准确风险
      commUrl = commUrl + "&bill_date_from=" + makeTime + "&bill_date_to=" + makeTime + "&cno_id=" + cno_id;
    }
    let commResp = postman("get", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({}));
    let rstObj = JSON.parse(commResp);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: commResp }));
    if (rstObj.errcode != 0) {
      return { rst: false, msg: "凭证:" + displayName + "[" + voucherCode + "]检测U8接口失败，请重试![" + rstObj.errmsg + "]" };
    }
    if (rstObj.voucherlist.entry.length > 0) {
      return { rst: false, msg: "凭证:" + displayName + "[" + voucherCode + "]已同步到U8，不能加锁修改，请先删除对应凭证!" };
    } else {
      //没有查到对应凭证
      ObjectStore.updateById(
        "AT1703B12408A00002.AT1703B12408A00002.voucherSync",
        { id: id, locked: true, syncRst: false, syncFailure: "", voucherIdU8: "", voucherCodeU8: "", tradeid: "" },
        "ybf4caba5e"
      );
      return { rst: true, msg: "凭证:" + displayName + "[" + voucherCode + "]已锁定，可以执行弃审操作!" };
    }
  } else {
    ObjectStore.updateById(
      "AT1703B12408A00002.AT1703B12408A00002.voucherSync",
      { id: id, locked: true, syncRst: false, syncFailure: "", voucherIdU8: "", voucherCodeU8: "", tradeid: "" },
      "ybf4caba5e"
    );
    return { rst: true, msg: "凭证:" + displayName + "[" + voucherCode + "]已锁定，可以执行弃审操作!" };
  }
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let id = request.id;
    if (id == undefined || id == null || id == "") {
      //批处理
      let voucherIds = request.voucherIds;
      let idArray = voucherIds.split(",");
      for (var i in idArray) {
        id = idArray[i];
        batchHandle(id);
      }
      return { rst: true, msg: "success" };
    }
    let vSyncCRst = ObjectStore.queryByYonQL("select *,accBook.code from AT1703B12408A00002.AT1703B12408A00002.voucherSync where id='" + id + "'", "developplatform");
    if (vSyncCRst.length == 0) {
      return { rst: false, msg: "数据异常，未查到镜像凭证数据!" };
    }
    let pdata = vSyncCRst[0];
    let locked = pdata.locked;
    if (locked == 1) {
      return { rst: true, msg: "已锁定，可以弃审该凭证了!" };
    }
    let syncRst = pdata.syncRst;
    let displayName = pdata.displayName;
    let voucherCode = pdata.voucherCode;
    if (syncRst != undefined && syncRst == 1) {
      //已同步
      //查询U8中凭证是否删除
      let voucherIdU8 = pdata.voucherIdU8;
      let voucherCodeU8 = pdata.voucherCodeU8;
      let syncFailure = pdata.syncFailure;
      let makeTime = pdata.makeTime;
      if (makeTime.length > 10) {
        makeTime = makeTime.substring(0, 10);
      }
      let accBook_code = pdata.accBook_code;
      let dsSequenceObj = extrequire("AT1703B12408A00002.selfServ.getU8dsSequence").execute(null, { accbookCode: accBook_code }); //getU8dsSequence(accbook.code);
      if (dsSequenceObj == null) {
        //没找到U8账套配置
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "异常-没有配置YS账簿与U8账套的对应", reqt: accbook.code, resp: "" }));
        return { rst: false, msg: "数据异常-没找到U8账套配置" };
      }
      let ds_sequence = dsSequenceObj.ds_sequence; //数据源
      let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccessToken").execute(null);
      let accessToken = null;
      if (funcRes.rst) {
        accessToken = funcRes.accessToken;
      }
      if (accessToken == null || accessToken == "") {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "AccessToken为空异常-无法对接U8", reqt: "", resp: "" })); //调用领域内函数写日志
        return { rst: false, msg: "AccessToken为空异常-无法对接U8，不能删除!" };
      }
      let u8Domain = getU8Domain("voucherlist/batch_get");
      let baseDataType = "获取凭证列表信息";
      let cno_id = voucherIdU8;
      let coutno_id = voucherCodeU8; //外部系统编码
      let commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
      commUrl = commUrl + "&page_index=1&rows_per_page=10&ds_sequence=" + ds_sequence;
      if (coutno_id) {
        //有外部系统编号就以此为条件查询
        commUrl = commUrl + "&coutno_id=" + coutno_id;
      } else {
        //否则以日期和凭证ID进行查询--凭证id可能会变-存在不准确风险
        commUrl = commUrl + "&bill_date_from=" + makeTime + "&bill_date_to=" + makeTime + "&cno_id=" + cno_id;
      }
      let commResp = postman("get", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({}));
      let rstObj = JSON.parse(commResp);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: commResp }));
      if (rstObj.errcode != 0) {
        return { rst: false, msg: "凭证:" + displayName + "[" + voucherCode + "]检测U8接口失败，请重试![" + rstObj.errmsg + "]" };
      }
      if (rstObj.voucherlist.entry.length > 0) {
        return { rst: false, msg: "凭证:" + displayName + "[" + voucherCode + "]已同步到U8，不能加锁修改，请先删除对应凭证!" };
      } else {
        //没有查到对应凭证
        ObjectStore.updateById(
          "AT1703B12408A00002.AT1703B12408A00002.voucherSync",
          { id: id, locked: true, syncRst: false, syncFailure: "", voucherIdU8: "", voucherCodeU8: "", tradeid: "" },
          "ybf4caba5e"
        );
        return { rst: true, msg: "凭证:" + displayName + "[" + voucherCode + "]已锁定，可以执行弃审操作!" };
      }
    } else {
      ObjectStore.updateById(
        "AT1703B12408A00002.AT1703B12408A00002.voucherSync",
        { id: id, locked: true, syncRst: false, syncFailure: "", voucherIdU8: "", voucherCodeU8: "", tradeid: "" },
        "ybf4caba5e"
      );
      return { rst: true, msg: "凭证:" + displayName + "[" + voucherCode + "]已锁定，可以执行弃审操作!" };
    }
    return { rst: true, data: vSyncCRst, msg: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });