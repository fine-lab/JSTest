let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let cbgj = request.cbgj;
    let gjsql = "select projectCode,huijiqijian,dept from GT62395AT3.GT62395AT3.cbgjnew where id='" + cbgj.cbgjnew_id + "' and dr=0";
    let gjres = ObjectStore.queryByYonQL(gjsql);
    let deptsql = "select code dept_code from bd.adminOrg.AdminOrgVO where id='" + gjres[0].dept + "'";
    let deptres = ObjectStore.queryByYonQL(deptsql, "ucf-org-center");
    let result = {};
    if (gjres.length > 0 && deptres.length > 0) {
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
      //人工
      if (cbgj.benqijiezhuanrengongchengben != 0) {
        let rgjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540104",
          debitOriginal: cbgj.benqijiezhuanrengongchengben,
          debitOrg: cbgj.benqijiezhuanrengongchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(rgjf);
        let rgdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060205",
          creditOriginal: cbgj.benqijiezhuanrengongchengben,
          creditOrg: cbgj.benqijiezhuanrengongchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(rgdf);
      }
      //	服务成本
      if (cbgj.benqijiezhuanfuwuchengben != 0) {
        let fwjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540103",
          debitOriginal: cbgj.benqijiezhuanfuwuchengben,
          debitOrg: cbgj.benqijiezhuanfuwuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(fwjf);
        let fwdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060203",
          creditOriginal: cbgj.benqijiezhuanfuwuchengben,
          creditOrg: cbgj.benqijiezhuanfuwuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(fwdf);
      }
      //	运输成本
      if (cbgj.benqijiezhuanyunshuchengben != 0) {
        let ysjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540102",
          debitOriginal: cbgj.benqijiezhuanyunshuchengben,
          debitOrg: cbgj.benqijiezhuanyunshuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(ysjf);
        let ysdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060202",
          creditOriginal: cbgj.benqijiezhuanyunshuchengben,
          creditOrg: cbgj.benqijiezhuanyunshuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(ysdf);
      }
      //	劳务成本
      if (cbgj.benqijiezhuanlaowuchengben != 0) {
        let lwjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540101",
          debitOriginal: cbgj.benqijiezhuanlaowuchengben,
          debitOrg: cbgj.benqijiezhuanlaowuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(lwjf);
        let lwdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060201",
          creditOriginal: cbgj.benqijiezhuanlaowuchengben,
          creditOrg: cbgj.benqijiezhuanlaowuchengben,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(lwdf);
      }
      //	制造成本
      if (cbgj.benqijiezhuanzhizaofeiyong != 0) {
        let zzjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540105",
          debitOriginal: cbgj.benqijiezhuanzhizaofeiyong,
          debitOrg: cbgj.benqijiezhuanzhizaofeiyong,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(zzjf);
        let zzdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060206",
          creditOriginal: cbgj.benqijiezhuanzhizaofeiyong,
          creditOrg: cbgj.benqijiezhuanzhizaofeiyong,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(zzdf);
      }
      //直接材料
      if (cbgj.benqijiezhuanzhijiecailiao != 0) {
        let zzjf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "540106",
          debitOriginal: cbgj.benqijiezhuanzhijiecailiao,
          debitOrg: cbgj.benqijiezhuanzhijiecailiao,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
            }
          ]
        };
        bodies.push(zzjf);
        let zzdf = {
          description: substring(gj.huijiqijian, 0, 7) + "产成品成本结转" + deptres[0].dept_code,
          accsubjectCode: "14060204",
          creditOriginal: cbgj.benqijiezhuanzhijiecailiao,
          creditOrg: cbgj.benqijiezhuanzhijiecailiao,
          rateType: "01",
          clientAuxiliaryList: [
            {
              //部门
              filedCode: "0001",
              valueCode: deptres[0].dept_code
            },
            {
              filedCode: "0002",
              valueCode: gj.projectCode
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
          var object = { id: cbgjnew_id, isVoucher: "true" };
          var updateres = ObjectStore.updateById("GT62395AT3.GT62395AT3.cbgjnew", object, "00bbdc46");
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "产成品成本结转生成凭证成功"
          };
        } else {
          result = {
            code: yssxresponseobj.code,
            message: "月份：" + gj.huijiqijian + "合同：" + gj.projectCode + "产成品成本结转生成凭证失败：" + yssxresponseobj.message
          };
        }
      } else {
        result = {
          code: 200,
          message: "产成品成本结转项金额都为0，无需生成凭证"
        };
      }
    } else {
      result = {
        code: 999,
        message: "产成品成本结转所属成本归集有误或部门映射有误"
      };
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });