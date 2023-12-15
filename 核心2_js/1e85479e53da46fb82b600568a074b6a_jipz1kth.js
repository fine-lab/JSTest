let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var flag = false;
    let pdata = param.data[0];
    var address = [];
    var apply = [];
    //赋值变化的
    if (pdata.merchantApplyRanges != null) {
      apply = pdata.merchantApplyRanges;
    }
    //检查区域编码变动的
    if (pdata.merchantAddressInfos != null) {
      pdata.merchantAddressInfos.forEach((data) => {
        var regionCode = data.regionCode;
        if (regionCode != null && regionCode.length > 0) {
          address.push(data);
        }
      });
    }
    //客户查询-得到使用组织范围
    if (address.length > 0) {
      var id = pdata.id;
      if (pdata.id != null) {
        let func1 = extrequire("udinghuo.dataTransmission.getOpenApiToken");
        let res = func1.execute("");
        var token = res.access_token;
        var requrl = "https://www.example.com/" + token + "&id=" + pdata.id;
        var strResponse = postman("GET", requrl, null);
        var responseObj = JSON.parse(strResponse);
        var deptDetail;
        if ("200" == responseObj.code) {
          deptDetail = responseObj.data;
        }
        var regionCode = "";
        var applyarr = deptDetail.merchantApplyRanges;
        if (applyarr.length > 0) {
          applyarr.forEach((data) => {
            apply.push(data);
          });
        }
      }
    }
    //循环地址
    for (let i = 0; i < address.length; i++) {
      var regionId = "",
        regionPath = "",
        regionCode = "";
      debugger;
      regionCode = address[i]["regionCode"];
      if (regionCode != null && regionCode.length > 0) {
        //客户地址-----------
        let base_path = "https://www.example.com/";
        var hmd_contenttype = "application/json;charset=UTF-8";
        let header = {
          "Content-Type": hmd_contenttype
        };
        var simple = {
          code: regionCode
        };
        var body = {
          pageIndex: "1",
          pageSize: "10",
          simple: simple
        };
        let func1 = extrequire("udinghuo.dataTransmission.getOpenApiToken");
        let res = func1.execute("");
        var token = res.access_token;
        //请求数据
        let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
        var obj = JSON.parse(apiResponse);
        var data = obj.data;
        var recordList = data.recordList;
        if (recordList != null && recordList.length > 0) {
          regionPath = recordList[0].path; //"2177117994820096|2177117994820097|2177117994820098|"
        }
      }
      if (regionPath.length > 0) {
        for (let i = 0; i < apply.length; i++) {
          var orgCode = apply[i]["orgCode"];
          var orgid = apply[i]["orgId"];
          if (orgid != null && orgid.length > 0) {
            //然后根据组织id得到仓库配送范围
            var sql =
              "select id,orgid,orgcode,cangku,sheng,shengcode,shengpath,qu,qucode,qucode,qupath,xian,xiancode,xianpath from GT18216AT3.GT18216AT3.warehousegivearea where orgid='" + orgid + "'";
            var res3 = ObjectStore.queryByYonQL(sql, "developplatform");
            if (res3 != null && res3.length > 0) {
              res3.forEach((wrange) => {
                var shengpath = "",
                  qupath = "",
                  xianpath = "";
                if (wrange.shengpath != undefined) {
                  shengpath = wrange.shengpath;
                }
                if (wrange.qupath != undefined) {
                  qupath = wrange.qupath;
                }
                if (wrange.xianpath != undefined) {
                  xianpath = wrange.xianpath;
                }
                //仅仅选择了省
                if (shengpath.length > 0 && qupath.length == 0 && xianpath.length == 0) {
                  if (regionPath.indexOf(shengpath) != -1) {
                    flag = true;
                  }
                }
                //仅仅选择了区
                if (qupath.length > 0 && xianpath.length == 0) {
                  if (regionPath.indexOf(qupath) != -1) {
                    flag = true;
                  }
                }
                //选择了县
                if (xianpath.length > 0) {
                  if (regionPath.indexOf(xianpath) != -1) {
                    flag = true;
                  }
                }
              });
            }
          }
        }
      }
    }
    if (address.length > 0 && !flag) {
      throw new Error("客户地址所有仓库配送范围不合适！");
      return { flag };
    }
  }
}
exports({ entryPoint: MyTrigger });