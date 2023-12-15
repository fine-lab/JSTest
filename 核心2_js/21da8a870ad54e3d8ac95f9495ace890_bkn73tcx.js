let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 根据半成品半成品成本结转单据ID获取项目编码及会计期间
    let cbgj = request.cbgj;
    let gjsql = "select xiangmubianma,huijiqijian from GT62395AT3.GT62395AT3.bcpjz where id='" + cbgj.id + "' and dr=0";
    let gjres = ObjectStore.queryByYonQL(gjsql);
    // 根据部门ID获取部门编码
    let deptCode = cbgj.dept_code;
    let result = {};
    if (gjres.length > 0) {
      let gj = gjres[0];
      let func = extrequire("GT99994AT1.api.getWayUrl");
      let funcres = func.execute(null);
      var httpurl = funcres.gatewayUrl;
      let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
      let res = func1.execute(null);
      let token = res.access_token;
      let yssxSaveurl = httpurl + "/yonbip/fi/ficloud/openapi/voucher/addVoucher?access_token=" + token;
      let contenttype = "application/json;charset=UTF-8";
      let message = "";
      let header = {
        "Content-Type": contenttype
      };
      let body = {
        accbookCode: "0010001",
        voucherTypeCode: "1",
        makerMobile: "13570089953",
        makeTime: gj.huijiqijian
      };
      let bodies = [];
      //	服务成本
      if (parseFloat(cbgj.fwMoney) != 0) {
        let fwjf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060203",
          debitOriginal: cbgj.fwMoney,
          debitOrg: cbgj.fwMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(fwjf);
        let fwdf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060103",
          creditOriginal: cbgj.fwMoney,
          creditOrg: cbgj.fwMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(fwdf);
      }
      //	运输成本
      if (parseFloat(cbgj.ysMoney) != 0) {
        let ysjf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060202",
          debitOriginal: cbgj.ysMoney,
          debitOrg: cbgj.ysMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(ysjf);
        let ysdf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060102",
          creditOriginal: cbgj.ysMoney,
          creditOrg: cbgj.ysMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(ysdf);
      }
      //	劳务成本
      if (parseFloat(cbgj.lwMoney) != 0) {
        let lwjf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060201",
          debitOriginal: cbgj.lwMoney,
          debitOrg: cbgj.lwMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(lwjf);
        let lwdf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060101",
          creditOriginal: cbgj.lwMoney,
          creditOrg: cbgj.lwMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(lwdf);
      }
      //	直接材料
      if (parseFloat(cbgj.zjclMoney) != 0) {
        let zzjf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060204",
          debitOriginal: cbgj.zjclMoney,
          debitOrg: cbgj.zjclMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(zzjf);
        let zzdf = {
          description: substring(gj.huijiqijian, 0, 7) + "半成品成本结转" + deptCode,
          accsubjectCode: "14060104",
          creditOriginal: cbgj.zjclMoney,
          creditOrg: cbgj.zjclMoney,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptCode
            },
            {
              filedCode: "0002",
              valueCode: gj.xiangmubianma
            }
          ]
        };
        bodies.push(zzdf);
      }
      if (bodies.length > 0) {
        body.bodies = bodies;
        let yssxResponse = postman("POST", yssxSaveurl, JSON.stringify(header), JSON.stringify(body));
        let yssxresponseobj = JSON.parse(yssxResponse);
        if (yssxresponseobj.code == "200") {
          var data = yssxresponseobj.code;
          var object = { id: cbgj.id, ispz: "1" };
          var updateres = ObjectStore.updateById("GT62395AT3.GT62395AT3.bcpjz", object, "ybf60e110d");
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.xiangmubianma + "半成品成本结转生成凭证成功"
          };
        } else {
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.xiangmubianma + "半成品成本结转生成凭证失败：" + yssxresponseobj.message
          };
        }
      } else {
        result = {
          code: 200,
          message: "半成品成本结转项金额都为0，无需生成凭证"
        };
      }
    } else {
      result = {
        code: 999,
        message: "半成品成本结转所属成本归集有误或部门映射有误"
      };
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });