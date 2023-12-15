let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let billAction = param.action;
    let pdata = param.data[0];
    let code = pdata.code;
    let id = pdata.id;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let url = DOMAIN + "/pxodp3oi/selfApiClass/glSelfApi/updateGiftBill";
    if (billAction == "save") {
      let othOutRecords = pdata.othOutRecords;
      for (var i in othOutRecords) {
        let recordObj = othOutRecords[i];
        let extendSrcBEntryId = recordObj.extendSrcBEntryId;
        let extendSrcBillId = recordObj.extendSrcBillId;
        let extendSrcBillCode = recordObj.extendSrcBillCode;
        if (!extendSrcBEntryId) {
          continue;
        }
        let querySql =
          "select qty,m.code from st.othoutrecord.OthOutRecords inner join st.othoutrecord.OthOutRecord m on m.id=mainid where extendSrcBEntryId='" +
          extendSrcBEntryId +
          "' and mainid != '" +
          id +
          "'";
        var res = ObjectStore.queryByYonQL(querySql, "ustock");
        let sumQty = recordObj.qty;
        let codeList = [];
        if (res.length > 0) {
          for (var j in res) {
            sumQty = sumQty + res[j].qty;
            codeList.push(res[j].m_code);
          }
        }
        codeList.push(code);
        let qSql = "select lysl from AT17854C0208D8000B.AT17854C0208D8000B.lplymx inner join AT17854C0208D8000B.AT17854C0208D8000B.lply m on m.id=lply_id where id = '" + extendSrcBEntryId + "'";
        let resp = ObjectStore.queryByYonQL(qSql, "developplatform");
        if (resp.length > 0 && sumQty > resp[0].lysl) {
          throw new Error("出库数量总数[" + sumQty + "]大于可领用数量[" + resp[0].lysl + "],不能保存!");
        }
        let paramsBody = { extendSrcBEntryId: extendSrcBEntryId, extendSrcBillId: extendSrcBillId, sumQty: sumQty, ckdh: codeList.toString() };
        let commResp = openLinker("POST", url, "AT17854C0208D8000B", JSON.stringify(paramsBody));
      }
    } else if (billAction == "delete") {
      //按订单code查询
      let qSql =
        "select id as extendSrcBEntryId,m.id as extendSrcBillId,m.code as extendSrcBillCode from AT17854C0208D8000B.AT17854C0208D8000B.lplymx inner join AT17854C0208D8000B.AT17854C0208D8000B.lply m on m.id=lply_id where ckdh like '" +
        code +
        "'";
      var resp = ObjectStore.queryByYonQL(qSql, "developplatform");
      for (var i in resp) {
        let recordObj = resp[i];
        let extendSrcBEntryId = recordObj.extendSrcBEntryId;
        let extendSrcBillId = recordObj.extendSrcBillId;
        let extendSrcBillCode = recordObj.extendSrcBillCode;
        let querySql = "select qty,m.code from st.othoutrecord.OthOutRecords inner join st.othoutrecord.OthOutRecord m on m.id=mainid where extendSrcBEntryId='" + extendSrcBEntryId + "'";
        var res = ObjectStore.queryByYonQL(querySql, "ustock");
        let sumQty = 0;
        let codeList = [];
        if (res.length > 0) {
          for (var j in res) {
            sumQty = sumQty + res[j].qty;
            codeList.push(res[j].m_code);
          }
        }
        let ckdh = codeList.length > 0 ? codeList.toString() : "";
        let paramsBody = { extendSrcBEntryId: extendSrcBEntryId, extendSrcBillId: extendSrcBillId, sumQty: sumQty, ckdh: ckdh };
        let commResp = openLinker("POST", url, "AT17854C0208D8000B", JSON.stringify(paramsBody));
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });