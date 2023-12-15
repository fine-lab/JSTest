let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = {
      code: -1,
      message: "未找到相关单据"
    };
    let code_array = request.code_array;
    let access_token = request.access_token;
    let my_util = new Object();
    {
      my_util.getconfig = function () {
        let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
        let res = func1.execute();
        return res;
      };
      //查询组织对应的账簿
      my_util.getAccbookCode = function (orgid) {
        let sql = "select * from 	bd.virtualaccbody.VirtualAccbody where id='" + orgid + "'";
        let res = ObjectStore.queryByYonQL(sql, "finbd");
        if (res.length > 0) {
          return res[0].code;
        } else {
          return "";
        }
      };
      //查询对应的供应商,根据调出仓库查询组织
      my_util.getGongyingshang = function (wareid) {
        let sql = "select * from 		aa.warehouse.Warehouse where id='" + wareid + "'";
        let res = ObjectStore.queryByYonQL(sql, "productcenter");
        if (res.length > 0) {
          let org = res[0].ownerorg;
          let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
          let config = func1.execute();
          let sql2 = "select * from 		aa.org.FinanceOrg where org='" + org + "'";
          let res2 = ObjectStore.queryByYonQL(sql2, "productcenter");
          if (res2.length > 0) {
            return config.gongyingshang_config[res2[0].code];
          } else {
            return "";
          }
        } else {
          return "";
        }
      };
      //创建相应凭证
      my_util.createPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      my_util.queryPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      my_util.updatePzStatus = function (param) {
        let id = param.id;
        let pingzheng_status = param.pingzheng_status;
        let pingzheng_code = param.pingzheng_code;
        var object = { id: id, pingzheng_status: pingzheng_status + "", pingzheng_code: pingzheng_code + "" };
        var res = ObjectStore.updateById("AT15CFB6F808300003.AT15CFB6F808300003.zc_daiobochayi", object, "eab1692d");
        return res;
      };
    }
    let config = my_util.getconfig();
    for (let i = 0; i < code_array.length; i++) {
      let code = code_array[i];
      let func1 = extrequire("AT15CFB6F808300003.zcYewu.querychayidan");
      let res = func1.execute({
        code: code
      });
      result.chayibill = res;
      // 第二步 根据差异单数据生成相应参数
      let accbookCode = my_util.getAccbookCode(res.main.org_id);
      if (accbookCode == null || accbookCode == "") {
        result.code = -2;
        result.message = "未找到相应账簿";
        return result;
      }
      let pingzheng_code = res.main.pingzheng_code;
      if (pingzheng_code != null && pingzheng_code != "") {
        var query_pz_parm = {
          url: "https://www.example.com/",
          param: {
            accbookCode: accbookCode,
            billcodeMin: res.main.pingzheng_code,
            billcodeMax: res.main.pingzheng_code
          },
          access_token: access_token
        };
        let queryPz_result = my_util.queryPz(query_pz_parm);
        if (queryPz_result.code == 200) {
          let pz_array = queryPz_result.data.recordList;
          if (pz_array.length > 0) {
            return {
              code: -3,
              message: "单号" + res.main.code + "相应差异单已生成凭证",
              pz_array: pz_array
            };
          }
        }
      }
      let description = "调入单号" + res.main.diaoru_code + " 差异单号" + "" + res.main.code + "生成";
      let body = [];
      let total_money = 0;
      for (let j = 0; j < res.sub.length; j++) {
        total_money = total_money + res.sub[j].chayi_money;
        let debit_obj = {
          description: description,
          accsubjectCode: "1403",
          debitOriginal: res.sub[j].chayi_money,
          debitOrg: res.sub[j].chayi_money,
          clientAuxiliaryList: [
            {
              filedCode: "0006",
              valueCode: res.sub[j].invcode
            },
            {
              filedCode: "0008",
              valueCode: res.sub[j].invclscode
            }
          ]
        };
        body.push(debit_obj);
      }
      total_money = total_money.toFixed(2);
      {
        let diaochu_ware = res.main.diaochu_ware;
        let gongyingshang_code = my_util.getGongyingshang(diaochu_ware);
        if (gongyingshang_code == null || gongyingshang_code == "") {
          result.code = -3;
          result.message = "未找到相应供应商";
          return result;
        }
        let obj = {
          description: description,
          accsubjectCode: "224101",
          creditOriginal: total_money,
          creditOrg: total_money,
          clientAuxiliaryList: [
            {
              filedCode: "0004",
              valueCode: gongyingshang_code
            }
          ]
        };
        body.push(obj);
      }
      if (total_money != 0) {
        let parm = {
          accbookCode: accbookCode,
          voucherTypeCode: "1",
          makerMobile: config.pz_config.makerMobile,
          bodies: body
        };
        result.parm = parm;
        var myparm = {
          url: "https://www.example.com/",
          param: parm,
          access_token: access_token
        };
        let tmp_result = my_util.createPz(myparm);
        if (i == 0) {
          result = tmp_result;
        }
        if (result.code == "200") {
          //当生成凭证成功后回填差异单生成凭证状态
          let updateParm = {
            id: res.main.id,
            pingzheng_status: 1,
            pingzheng_code: tmp_result.data.billCode
          };
          result.updateParm = updateParm;
          my_util.updatePzStatus(updateParm);
        } else {
        }
      } else {
        let updateParm = {
          id: res.main.id,
          pingzheng_status: 1,
          pingzheng_code: "金额为0，无须生成"
        };
        result.updateParm = updateParm;
        my_util.updatePzStatus(updateParm);
      }
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });