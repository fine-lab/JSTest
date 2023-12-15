let AbstractTrigger = require("AbstractTrigger");
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let LogToDB = true;
    let commUrl = null;
    let commResp = null;
    if (true) {
      let baseDataType = 25; //客户类别
      let baseDataTypeDes = "客户类别";
      let yonsql =
        "select *,T1.id as entryid,T2.ds_sequence,T2.id as ds_id from 	AT1703B12408A00002.AT1703B12408A00002.baseDataCopy inner join AT1703B12408A00002.AT1703B12408A00002.baseDataCopyEntry T1 on T1.baseDataCopy_id=id " +
        "  inner join AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence T2 on T2.id=T1.u8ds " +
        " where dr=0 and T1.dr=0 and T2.dr=0 and T1.syncRst=0 and baseDataType='" +
        baseDataType +
        "' and T2.isEnabled=1 " +
        " order by level ,baseTs limit 100 ";
      let queryRst = ObjectStore.queryByYonQL(yonsql, "developplatform");
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes, reqt: JSON.stringify(queryRst), resp: "" }));
      let u8Domain = getU8Domain("customerclass/add");
      let ds_sequence = 1;
      for (var i in queryRst) {
        let rstObj = queryRst[i];
        ds_sequence = rstObj.T2_ds_sequence;
        let entryid = rstObj.entryid;
        let dbaseId = rstObj.baseID;
        let id = rstObj.id;
        let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccNewToken").execute(null, { id: rstObj.ds_id });
        let accessToken = null;
        if (funcRes.rst) {
          accessToken = funcRes.accessToken;
        }
        if (accessToken == null || accessToken == "") {
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes + "3-AccessToken为空异常-无法对接U8", reqt: "", resp: "" })
          ); //调用领域内函数写日志
          return { rst: false, msg: "AccessToken为空异常-无法对接U8" };
        }
        commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
        commUrl = commUrl + "&biz_id=" + dbaseId + "&sync=1&ds_sequence=1";
        let reqBody = {
          code: rstObj.baseCode,
          name: rstObj.baseName,
          rank: parseInt(rstObj.level) + ""
        };
        commResp = postman("post", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({ customerclass: reqBody }));
        let commRespObj = JSON.parse(commResp);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes, reqt: JSON.stringify(reqBody), resp: commResp }));
        let isSuccess = false;
        let errmsg = "";
        let res_tradeid = "";
        let res_id = "";
        if (commRespObj.errcode == 0) {
          isSuccess = true;
          res_tradeid = commRespObj.tradeid;
          res_id = commRespObj.id;
        } else {
          isSuccess = false;
          errmsg = commRespObj.errmsg;
          if (includes(errmsg, "编码已经存在，不可重复") || includes(errmsg, "存在相同的编码")) {
            isSuccess = true;
          }
        }
        ObjectStore.updateById(
          "AT1703B12408A00002.AT1703B12408A00002.baseDataCopy",
          {
            id: id,
            updFlag: rstObj.updFlag == 1 ? true : false,
            baseDataCopyEntryList: {
              id: entryid,
              _status: "Update",
              syncTime: getNowDate(),
              baseDataCopy_id: id,
              syncRst: isSuccess,
              syncFailure: errmsg,
              res_tradeid: res_tradeid,
              res_id: res_id,
              syncReqt: JSON.stringify({ customerclass: reqBody }),
              syncResp: commResp
            }
          },
          "yb60af18ba"
        );
      }
      if (queryRst.length > 50) {
        return;
      }
    }
    {
      let baseDataType = 5; //1会计科目/2部门/3员工/4供应商/5客户/6项目/
      let baseDataTypeDes = "客户";
      let pageSize = 50;
      let baseDataToU8urlKey = "yourKeyHere"; //customer/edit
      let scountsql =
        "select count(1) as cunt from 	AT1703B12408A00002.AT1703B12408A00002.baseDataCopy inner join AT1703B12408A00002.AT1703B12408A00002.baseDataCopyEntry T1 on T1.baseDataCopy_id=id " +
        "  inner join AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence T2 on T2.id=T1.u8ds " +
        " where dr=0 and T1.dr=0 and T2.dr=0 and T1.syncRst=0 and baseDataType='" +
        baseDataType +
        "' and T2.isEnabled=1 ";
      let queryCountRst = ObjectStore.queryByYonQL(scountsql, "developplatform");
      let yonsql =
        "select *,T1.id as entryid,T2.ds_sequence,T2.id as ds_id from 	AT1703B12408A00002.AT1703B12408A00002.baseDataCopy inner join AT1703B12408A00002.AT1703B12408A00002.baseDataCopyEntry T1 on T1.baseDataCopy_id=id " +
        "  inner join AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence T2 on T2.id=T1.u8ds " +
        " where dr=0 and T1.dr=0 and T2.dr=0 and T1.syncRst=0 and baseDataType='" +
        baseDataType +
        "' and T2.isEnabled=1 " +
        " order by level ,baseTs limit " +
        pageSize;
      let queryRst = ObjectStore.queryByYonQL(yonsql, "developplatform");
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes + "-DB", reqt: JSON.stringify(queryRst), resp: "Count:" + queryCountRst[0].cunt })
      );
      let clsRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.baseDataCopy where baseDataType='25' and dr=0", "developplatform");
      let u8Domain = getU8Domain(baseDataToU8urlKey);
      let ds_sequence = 1;
      for (var i in queryRst) {
        let rstObj = queryRst[i];
        ds_sequence = rstObj.T2_ds_sequence;
        let entryid = rstObj.entryid;
        let dbaseId = rstObj.baseID;
        let id = rstObj.id;
        let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccNewToken").execute(null, { id: rstObj.ds_id });
        let accessToken = null;
        if (funcRes.rst) {
          accessToken = funcRes.accessToken;
        }
        if (accessToken == null || accessToken == "") {
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes + "3-AccessToken为空异常-无法对接U8", reqt: "", resp: "" })
          ); //调用领域内函数写日志
          return { rst: false, msg: "AccessToken为空异常-无法对接U8" };
        }
        commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
        commUrl = commUrl + "&biz_id=" + dbaseId + "&sync=1&ds_sequence=1";
        let sort_code = "";
        for (var j in clsRst) {
          let clsObj = clsRst[j];
          if (clsObj.baseID == rstObj.extDefine1) {
            sort_code = clsObj.baseCode;
            break;
          }
        }
        if (sort_code == "") {
          sort_code = "Q";
        }
        rstObj.baseName = replace(rstObj.baseName, "'", "‘");
        rstObj.baseName = replace(rstObj.baseName, '"', "“"); //u8不支持'和"
        let reqBody = {
          code: rstObj.baseCode,
          name: rstObj.baseName.length > 95 ? substring(rstObj.baseName, 0, 95) : rstObj.baseName,
          abbrname: rstObj.baseName.length > 60 ? substring(rstObj.baseName, 0, 60) : rstObj.baseName, //客户简称
          extDefine1: rstObj.extDefine1,
          sort_code: sort_code //所属分类码
        };
        commResp = postman("post", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({ customer: reqBody }));
        let commRespObj = JSON.parse(commResp);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes, reqt: JSON.stringify({ customer: reqBody }), resp: commResp })
        );
        let isSuccess = false;
        let errmsg = "";
        let res_tradeid = "";
        let res_id = "";
        if (commRespObj.errcode == 0) {
          isSuccess = true;
          res_tradeid = commRespObj.tradeid;
          res_id = commRespObj.id;
          errmsg = "success";
        } else {
          isSuccess = false;
          errmsg = commRespObj.errmsg;
          if (includes(errmsg, "编码已经存在，不可重复") || includes(errmsg, "存在相同的编码")) {
            isSuccess = true;
            res_id = rstObj.baseCode; //返回的就是编码
          } else if (includes(errmsg, "客户简称已经存在，不可重复")) {
            let abbrname = rstObj.baseName + "(" + rstObj.baseCode + ")";
            reqBody.abbrname = abbrname.length > 60 ? substring(abbrname, 0, 60) : abbrname;
            commResp = postman("post", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({ customer: reqBody }));
            commRespObj = JSON.parse(commResp);
            if (commRespObj.errcode == 0) {
              isSuccess = true;
              res_tradeid = commRespObj.tradeid;
              res_id = commRespObj.id;
            } else {
              isSuccess = false;
              errmsg = commRespObj.errmsg;
              if (includes(errmsg, "编码已经存在，不可重复") || includes(errmsg, "存在相同的编码")) {
                isSuccess = true;
                res_id = rstObj.baseCode; //返回的就是编码
              }
            }
          }
        }
        ObjectStore.updateById(
          "AT1703B12408A00002.AT1703B12408A00002.baseDataCopy",
          {
            id: id,
            updFlag: rstObj.updFlag == 1 ? true : false,
            baseDataCopyEntryList: {
              id: entryid,
              _status: "Update",
              syncTime: getNowDate(),
              baseDataCopy_id: id,
              syncRst: isSuccess,
              syncFailure: errmsg,
              res_tradeid: res_tradeid,
              res_id: res_id,
              syncReqt: JSON.stringify({ customer: reqBody }),
              syncResp: commResp
            }
          },
          "yb60af18ba"
        );
      }
    }
  }
}
exports({ entryPoint: MyTrigger });