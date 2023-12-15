let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let bg = request.bg;
    let cbjzMoney = 0.0;
    let jieyurengongchengben = 0.0;
    let jieyuyunshuchengben = 0.0;
    let jieyufuwuchengben = 0.0;
    let jieyulaowuchengben = 0.0;
    let jieyuzhizaofeiyong = 0.0;
    let qimojiecunzhijiecailiao = 0.0;
    let benqijiezhuanrengongchengben = 0.0;
    let benqijiezhuanyunshuchengben = 0.0;
    let benqijiezhuanfuwuchengben = 0.0;
    let benqijiezhuanlaowuchengben = 0.0;
    let benqijiezhuanzhizaofeiyong = 0.0;
    let benqijiezhuanzhijiecailiao = 0.0;
    let saveResult = {};
    let mlv = 0;
    let func7 = extrequire("GT62395AT3.backDefaultGroup.updateBGJIN");
    let func4 = extrequire("GT62395AT3.backDefaultGroup.addcbjzNew");
    let cbgj = bg;
    let sqlxm = "select defineCharacter.attrext6 define6 from bd.project.ProjectVO where code='" + cbgj.projectCode + "'";
    let resxmList = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
    //结转比例=（项目本期收入+项目期初累计收入）/项目总金额
    if (resxmList.length > 0) {
      let rgcbres = bg.rgcbnewList;
      let fwcbres = bg.fwcbnewList;
      let yscbres = bg.yscbnewList;
      let zzfyres = bg.zzfynewList;
      let lwcbres = bg.lwcbnewList;
      let zjclres = bg.zjclnewList;
      let bgjeres = bg.bgjenewList;
      let resxm = resxmList[0];
      //需要更改
      let yjzcbbl = MoneyFormatReturnBd((bgjeres[0].xiangmubenqishouru + bgjeres[0].xiangmuqichuleijishouru) / resxm.define6, 8);
      if (yjzcbbl > 1) {
        yjzcbbl = 1;
      }
      benqijiezhuanrengongchengben = MoneyFormatReturnBd(rgcbres[0].qichuleijijiezhuan - rgcbres[0].qichuleijiguiji * yjzcbbl, 2);
      benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichuleijijiezhuan - yscbres[0].qichuleijiguiji * yjzcbbl, 2);
      benqijiezhuanfuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichuleijijiezhuan - fwcbres[0].qichuleijiguiji * yjzcbbl, 2);
      benqijiezhuanlaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichuleijijiezhuan - lwcbres[0].qichuleijiguiji * yjzcbbl, 2);
      benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichuleijijiezhuan - zzfyres[0].qichuleijiguiji * yjzcbbl, 2);
      benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(zjclres[0].qichuleijijiezhuan - zjclres[0].qichuleijiguiji * yjzcbbl, 2);
      jieyurengongchengben = MoneyFormatReturnBd(rgcbres[0].qichujiecun + rgcbres[0].benqifasheng - benqijiezhuanrengongchengben, 2);
      jieyuyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichujiecun + yscbres[0].benqifasheng - benqijiezhuanyunshuchengben, 2);
      jieyufuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichujiecun + fwcbres[0].benqifasheng - benqijiezhuanfuwuchengben, 2);
      jieyulaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichujiecun + lwcbres[0].benqifasheng - benqijiezhuanlaowuchengben, 2);
      jieyuzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichujiecun + zzfyres[0].benqifasheng - benqijiezhuanzhizaofeiyong, 2);
      qimojiecunzhijiecailiao = MoneyFormatReturnBd(zjclres[0].qichujiecun + zjclres[0].new4 - benqijiezhuanzhijiecailiao, 2);
      cbjzMoney = MoneyFormatReturnBd(
        parseFloat(benqijiezhuanrengongchengben) +
          parseFloat(benqijiezhuanyunshuchengben) +
          parseFloat(benqijiezhuanfuwuchengben) +
          parseFloat(benqijiezhuanlaowuchengben) +
          parseFloat(benqijiezhuanzhijiecailiao) +
          parseFloat(benqijiezhuanzhizaofeiyong),
        2
      );
      mlv = MoneyFormatReturnBd(
        (bgjeres[0].xiangmubenqishouru +
          bgjeres[0].xiangmuqichuleijishouru -
          (rgcbres[0].qichuleijijiezhuan +
            yscbres[0].qichuleijijiezhuan +
            fwcbres[0].qichuleijijiezhuan +
            lwcbres[0].qichuleijijiezhuan +
            zzfyres[0].qichuleijijiezhuan +
            zjclres[0].qichuleijijiezhuan -
            cbjzMoney)) /
          (bgjeres[0].xiangmubenqishouru + bgjeres[0].xiangmuqichuleijishouru),
        8
      );
      let cbjzdata = {
        cbjzMoney: cbjzMoney,
        dept_code: "",
        main_Id: bg.id,
        yjzcbbl: yjzcbbl,
        mlv: mlv,
        jieyurengongchengben: jieyurengongchengben,
        jieyuyunshuchengben: jieyuyunshuchengben,
        jieyufuwuchengben: jieyufuwuchengben,
        jieyulaowuchengben: jieyulaowuchengben,
        jieyuzhizaofeiyong: jieyuzhizaofeiyong,
        qimojiecunzhijiecailiao: qimojiecunzhijiecailiao,
        benqijiezhuanrengongchengben: benqijiezhuanrengongchengben,
        benqijiezhuanyunshuchengben: benqijiezhuanyunshuchengben,
        benqijiezhuanfuwuchengben: benqijiezhuanfuwuchengben,
        benqijiezhuanlaowuchengben: benqijiezhuanlaowuchengben,
        benqijiezhuanzhizaofeiyong: benqijiezhuanzhizaofeiyong,
        benqijiezhuanzhijiecailiao: benqijiezhuanzhijiecailiao
      };
      let addcbjzMoney = func4.execute(cbjzdata);
      let addResult = addcbjzMoney.cgSaveres;
      if (addResult != undefined) {
        saveResult = {
          code: "200",
          message: "报告关联项目合同编码" + cbgj.projectCode + "成本结转成功"
        };
      } else {
        saveResult = {
          code: "999",
          message: "报告关联项目合同编码" + cbgj.projectCode + "成本结转失败"
        };
      }
    }
    return { saveResult };
  }
}
exports({ entryPoint: MyAPIHandler });