let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let bg = request.bg;
    let sqlxmdetail = "select id,classifyid from bd.project.ProjectVO where dr=0 and code='" + bg.ziduan2 + "'";
    let resxmdetail = ObjectStore.queryByYonQL(sqlxmdetail, "ucfbasedoc");
    let saveResult = {};
    //当前会计月
    let qianshouri = request.qianshouri;
    let dateData = getData(qianshouri);
    let dqkjqj = substring(dateData.data.startDate, 0, 7);
    //上期会计月
    let beforedate = getBeforeData(dateData.data.startDate);
    let beforekjqj = beforedate.data.month;
    //查询成本归集主表信息
    let func7 = extrequire("GT62395AT3.backDefaultGroup.updateBGJIN");
    let func6 = extrequire("GT62395AT3.backDefaultGroup.getCBGJdataNew");
    let func5 = extrequire("GT59740AT1.backDefaultGroup.updatejzResult");
    let func4 = extrequire("GT62395AT3.backDefaultGroup.addcbjzNew");
    let func3 = extrequire("GT62395AT3.backDefaultGroup.getBeforeCbjzMoney");
    let func2 = extrequire("GT62395AT3.backDefaultGroup.getBalanceQuery");
    let func1 = extrequire("GT59740AT1.backDefaultGroup.getXMdata");
    let ziduan2 = bg.ziduan2;
    let isjz = false;
    if (resxmdetail.length > 0) {
      let cbgjdata = func6.execute(dqkjqj, bg.ziduan2, bg.dept_code);
      let cbgjres = cbgjdata.res;
      if (cbgjres.length > 0) {
        let cbgj = cbgjres[0];
        let rgcbsql = "select * from GT62395AT3.GT62395AT3.rgcbnew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let fwcbsql = "select * from GT62395AT3.GT62395AT3.fwcbnew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let yscbsql1 = "select * from GT62395AT3.GT62395AT3.yscbnew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let zzfysql = "select * from GT62395AT3.GT62395AT3.zzfynew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let lwcbsql = "select * from GT62395AT3.GT62395AT3.lwcbnew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let zjclsql = "select * from GT62395AT3.GT62395AT3.zjclnew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let bgjesql = "select * from GT62395AT3.GT62395AT3.bgjenew where dr=0 and cbgjnew_id='" + cbgj.id + "'";
        let rgcbres = ObjectStore.queryByYonQL(rgcbsql);
        let fwcbres = ObjectStore.queryByYonQL(fwcbsql);
        let yscbres = ObjectStore.queryByYonQL(yscbsql1);
        let zzfyres = ObjectStore.queryByYonQL(zzfysql);
        let lwcbres = ObjectStore.queryByYonQL(lwcbsql);
        let zjclres = ObjectStore.queryByYonQL(zjclsql);
        let bgjeres = ObjectStore.queryByYonQL(bgjesql);
        let cbjzMoney = 0.0;
        let yjzcbbl = 0;
        let mlv = 0;
        let httotalMoney = 0.0;
        let ystitalMoney = 0.0;
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
        let sqlxm = "";
        //结构部
        if (bg.dept_code == "B") {
          sqlxm = "select defineCharacter.attrext9 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "A1") {
          sqlxm = "select defineCharacter.attrext7 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "A2") {
          sqlxm = "select defineCharacter.attrext14 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "C") {
          sqlxm = "select defineCharacter.attrext10 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "D") {
          sqlxm = "select defineCharacter.attrext8 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "F") {
          sqlxm = "select defineCharacter.attrext15 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        }
        var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
        let yscbsql =
          "select (service_fee+service_charge+freight+direct_materials+artificial+make) as yscb  from GT99994AT1.GT99994AT1.projectbudget_completionnew where dr=0 and projectbudgetnew_id in (select id from GT99994AT1.GT99994AT1.projectbudgetnew where dr=0 and sanheyusuanbumenbianma='" +
          bg.dept_code +
          "' and xiangmubianma='" +
          bg.ziduan2 +
          "' and huijiqijian leftlike '" +
          dqkjqj +
          "' )";
        let resyscb = ObjectStore.queryByYonQL(yscbsql);
        httotalMoney = resxm.length > 0 ? resxm[0].money : httotalMoney;
        ystitalMoney = resyscb.length > 0 ? resyscb[0].yscb : ystitalMoney;
        var benqisql = "";
        var benqisql1 = "";
        if (bg.dept_code != "D") {
          benqisql =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_code='" +
            bg.dept_code +
            "' and document_status in('1','2') and baogaori between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          benqisql1 =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_code='" +
            bg.dept_code +
            "' and document_status in('3','4') and update_data between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
        } else {
          benqisql =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_name like '材料部' and document_status in('1','2') and baogaori between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          benqisql1 =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_name like '材料部' and document_status in('3','4') and update_data between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
        }
        if (bg.dept_code == "D") {
          let benqiqssql =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_name like '材料部' and document_status in('1','2') and qianshouri between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          let benqiqssql1 =
            "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_name like '材料部' and document_status in('3','4') and update_data between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          var bqhtqsDataList = ObjectStore.queryByYonQL(benqiqssql);
          var bqhtqsDataList1 = ObjectStore.queryByYonQL(benqiqssql1);
          let bqqsbgje = 0;
          if (bqhtqsDataList.length > 0) {
            bqqsbgje += bqhtqsDataList[0].baogaojine;
          }
          if (bqhtqsDataList1.length > 0) {
            bqqsbgje += bqhtqsDataList1[0].baogaojine;
          }
          bg.baogaojine = bqqsbgje;
        }
        var bqhtDataList = ObjectStore.queryByYonQL(benqisql);
        var bqhtDataList1 = ObjectStore.queryByYonQL(benqisql1);
        //本期出具报告金额
        let bqcjbgje = 0;
        if (bqhtDataList.length > 0) {
          bqcjbgje += bqhtDataList[0].baogaojine;
        }
        if (bqhtDataList1.length > 0) {
          bqcjbgje += bqhtDataList1[0].baogaojine;
        }
        //单价合同成本结转(材料部常规合同执行单价合同成本结转计算、其他部门单价正常计算)
        if ((bg.dept_code == "D" && resxmdetail[0].classifyid == "2710655216620544") || resxmdetail[0].classifyid == "2710655740761600") {
          //本期签收报告金额
          let bqqsbgMoney = bg.baogaojine;
          //累计总出具报告金额
          let totalcjbgje = bgjeres[0].qichuleijichujubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijichujubaogaojine;
          //累计已签收报告金额
          let totalljyqsbgje = bgjeres[0].qichuleijiqianshoubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijiqianshoubaogaojine;
          //期初已结转成本
          let sqyjzcb =
            rgcbres[0].qichuleijijiezhuan +
            fwcbres[0].qichuleijijiezhuan +
            yscbres[0].qichuleijijiezhuan +
            zzfyres[0].qichuleijijiezhuan +
            lwcbres[0].qichuleijijiezhuan +
            zjclres[0].qichuleijijiezhuan;
          let isLast = false;
          let zbgsql1 =
            "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_code='" +
            bg.dept_code +
            "' and qianshouri  between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          let bqbgDataList = ObjectStore.queryByYonQL(zbgsql1);
          if (bqbgDataList.length > 0) {
            a: for (var i = 0; i < bqbgDataList.length; i++) {
              var bqdata = bqbgDataList[i];
              if (bqdata.isEnd == "1") {
                isLast = true;
                break a;
              }
            }
          }
          if (isLast) {
            yjzcbbl = 1;
            isjz = true;
          } else {
            if (totalcjbgje - totalljyqsbgje + bqcjbgje / 1.06 !== 0) {
              yjzcbbl = MoneyFormatReturnBd(bqqsbgMoney / 1.06 / (totalcjbgje - totalljyqsbgje + bqcjbgje / 1.06), 8);
              if (parseFloat(yjzcbbl) >= 1) {
                yjzcbbl = 1;
              } else if (parseFloat(yjzcbbl) < 0) {
                yjzcbbl = 0;
              }
              isjz = true;
            } else {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "累计出具报告金额-累计已签收报告金额+本期出具报告金额/1.06这个结果为0"
              };
            }
          }
          if (isjz) {
            mlv = MoneyFormatReturnBd((bqqsbgMoney / 1.06 + totalljyqsbgje - (parseFloat(cbjzMoney) + parseFloat(sqyjzcb))) / (bqqsbgMoney / 1.06 + totalljyqsbgje), 2);
            benqijiezhuanrengongchengben = MoneyFormatReturnBd((rgcbres[0].qichujiecun + rgcbres[0].benqifasheng) * yjzcbbl, 2);
            benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (yscbres[0].qichujiecun + yscbres[0].benqifasheng), 2);
            benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (fwcbres[0].qichujiecun + fwcbres[0].benqifasheng), 2);
            benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (lwcbres[0].qichujiecun + lwcbres[0].benqifasheng), 2);
            benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (zzfyres[0].qichujiecun + zzfyres[0].benqifasheng), 2);
            benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(yjzcbbl * (zjclres[0].qichujiecun + zjclres[0].new4), 2);
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
            mlv = MoneyFormatReturnBd((bqqsbgMoney / 1.06 + totalljyqsbgje - (parseFloat(cbjzMoney) + parseFloat(sqyjzcb))) / (bqqsbgMoney / 1.06 + totalljyqsbgje), 2);
          }
          //常规合同
        } else if (bg.dept_code != "D" && resxmdetail[0].classifyid == "2710655216620544") {
          //是否末期
          let isLast = false;
          let zbgsql1 =
            "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_code='" +
            bg.dept_code +
            "' and qianshouri  between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          let bqbgDataList = ObjectStore.queryByYonQL(zbgsql1);
          let historybgqsMoney = bgjeres[0].qichuleijiqianshoubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijiqianshoubaogaojine;
          let beforejzMoney =
            rgcbres[0].qichuleijijiezhuan +
            fwcbres[0].qichuleijijiezhuan +
            yscbres[0].qichuleijijiezhuan +
            zzfyres[0].qichuleijijiezhuan +
            lwcbres[0].qichuleijijiezhuan +
            zjclres[0].qichuleijijiezhuan;
          if (bqbgDataList.length > 0) {
            a: for (var i = 0; i < bqbgDataList.length; i++) {
              var bqdata = bqbgDataList[i];
              if (bqdata.isEnd == "1") {
                isLast = true;
                break a;
              }
            }
          }
          if (isLast) {
            if (resxm.length > 0 && resxm[0].money != 0) {
              yjzcbbl = 1;
              benqijiezhuanrengongchengben = MoneyFormatReturnBd((rgcbres[0].qichujiecun + rgcbres[0].benqifasheng) * yjzcbbl, 2);
              benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (yscbres[0].qichujiecun + yscbres[0].benqifasheng), 2);
              benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (fwcbres[0].qichujiecun + fwcbres[0].benqifasheng), 2);
              benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (lwcbres[0].qichujiecun + lwcbres[0].benqifasheng), 2);
              benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (zzfyres[0].qichujiecun + zzfyres[0].benqifasheng), 2);
              benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(yjzcbbl * (zjclres[0].qichujiecun + zjclres[0].new4), 2);
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
              mlv = MoneyFormatReturnBd((historybgqsMoney + bg.baogaojine / 1.06 - beforejzMoney - parseFloat(cbjzMoney)) / (historybgqsMoney + bg.baogaojine / 1.06), 2);
              isjz = true;
            } else {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "对应部门金额为0"
              };
            }
          } else {
            if (resxm.length > 0 && resxm[0].money != 0) {
              let yscbMoney = 0.0;
              if (resyscb.length > 0) {
                yscbMoney = resyscb[0].yscb;
              }
              yjzcbbl = MoneyFormatReturnBd((historybgqsMoney + bg.baogaojine / 1.06) / (resxm[0].money / 1.06), 8);
              if (parseFloat(yjzcbbl) >= 1) {
                yjzcbbl = 1;
              }
              if (parseFloat(yjzcbbl) < 0) {
                yjzcbbl = 0;
              }
              let totgjje =
                rgcbres[0].qichuleijiguiji +
                rgcbres[0].benqifasheng +
                fwcbres[0].qichuleijiguiji +
                fwcbres[0].benqifasheng +
                yscbres[0].qichuleijiguiji +
                yscbres[0].benqifasheng +
                zzfyres[0].qichuleijiguiji +
                zzfyres[0].benqifasheng +
                lwcbres[0].qichuleijiguiji +
                lwcbres[0].benqifasheng +
                zjclres[0].qichuleijiguiji +
                zjclres[0].new4;
              let benqijiezhuanrengongchengbengjbl = MoneyFormatReturnBd((rgcbres[0].qichuleijiguiji + rgcbres[0].benqifasheng) / totgjje, 8);
              let benqijiezhuanyunshuchengbengjbl = MoneyFormatReturnBd((yscbres[0].qichuleijiguiji + yscbres[0].benqifasheng) / totgjje, 8);
              let benqijiezhuanfuwuchengbengjbl = MoneyFormatReturnBd((fwcbres[0].qichuleijiguiji + fwcbres[0].benqifasheng) / totgjje, 8);
              let benqijiezhuanlaowuchengbengjbl = MoneyFormatReturnBd((lwcbres[0].qichuleijiguiji + lwcbres[0].benqifasheng) / totgjje, 8);
              let benqijiezhuanzhizaofeiyonggjbl = MoneyFormatReturnBd((zzfyres[0].qichuleijiguiji + zzfyres[0].benqifasheng) / totgjje, 8);
              let benqijiezhuanzhijiecailiaobl = MoneyFormatReturnBd((zjclres[0].qichuleijiguiji + zjclres[0].new4) / totgjje, 8);
              benqijiezhuanrengongchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanrengongchengbengjbl * yjzcbbl - rgcbres[0].qichuleijijiezhuan, 2);
              benqijiezhuanyunshuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanyunshuchengbengjbl * yjzcbbl - yscbres[0].qichuleijijiezhuan, 2);
              benqijiezhuanfuwuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanfuwuchengbengjbl * yjzcbbl - fwcbres[0].qichuleijijiezhuan, 2);
              benqijiezhuanlaowuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanlaowuchengbengjbl * yjzcbbl - lwcbres[0].qichuleijijiezhuan, 2);
              benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanzhizaofeiyonggjbl * yjzcbbl - zzfyres[0].qichuleijijiezhuan, 2);
              benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanzhijiecailiaobl * yjzcbbl - zjclres[0].qichuleijijiezhuan, 2);
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
              mlv = MoneyFormatReturnBd((historybgqsMoney + bg.baogaojine / 1.06 - beforejzMoney - parseFloat(cbjzMoney)) / (historybgqsMoney + bg.baogaojine / 1.06), 2);
              isjz = true;
            } else {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "对应部门金额为0"
              };
            }
          }
          //总包干合同
        } else if (resxmdetail[0].classifyid == "2710655493510400") {
          //是否末期
          let isLast = false;
          let zbgsql1 =
            "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
            bg.ziduan2 +
            "'" +
            " and dept_code='" +
            bg.dept_code +
            "' and qianshouri  between '" +
            dateData.data.startDate +
            "' and '" +
            dateData.data.endDate +
            "'";
          let bqbgDataList = ObjectStore.queryByYonQL(zbgsql1);
          if (bqbgDataList.length > 0) {
            a: for (var i = 0; i < bqbgDataList.length; i++) {
              var bqdata = bqbgDataList[i];
              if (bqdata.isEnd == "1") {
                isLast = true;
                break a;
              }
            }
          }
          if (isLast) {
            yjzcbbl = 1;
            let sqlBg = "select sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" + " and ziduan2='" + bg.ziduan2 + "'  group by ziduan2";
            var resBgMoney = ObjectStore.queryByYonQL(sqlBg);
            let totalljyqsbgje = bgjeres[0].qichuleijiqianshoubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijiqianshoubaogaojine;
            let beforejzMoney =
              rgcbres[0].qichuleijijiezhuan +
              fwcbres[0].qichuleijijiezhuan +
              yscbres[0].qichuleijijiezhuan +
              zzfyres[0].qichuleijijiezhuan +
              lwcbres[0].qichuleijijiezhuan +
              zjclres[0].qichuleijijiezhuan;
            benqijiezhuanrengongchengben = MoneyFormatReturnBd((rgcbres[0].qichujiecun + rgcbres[0].benqifasheng) * yjzcbbl, 2);
            benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (yscbres[0].qichujiecun + yscbres[0].benqifasheng), 2);
            benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (fwcbres[0].qichujiecun + fwcbres[0].benqifasheng), 2);
            benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (lwcbres[0].qichujiecun + lwcbres[0].benqifasheng), 2);
            benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (zzfyres[0].qichujiecun + zzfyres[0].benqifasheng), 2);
            benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(yjzcbbl * (zjclres[0].qichujiecun + zjclres[0].new4), 2);
            cbjzMoney = MoneyFormatReturnBd(
              parseFloat(benqijiezhuanrengongchengben) +
                parseFloat(benqijiezhuanyunshuchengben) +
                parseFloat(benqijiezhuanfuwuchengben) +
                parseFloat(benqijiezhuanlaowuchengben) +
                parseFloat(benqijiezhuanzhijiecailiao) +
                parseFloat(benqijiezhuanzhizaofeiyong),
              2
            );
            mlv = MoneyFormatReturnBd((resBgMoney[0].baogaojine / 1.06 + totalljyqsbgje - beforejzMoney - cbjzMoney) / (resBgMoney[0].baogaojine / 1.06 + totalljyqsbgje), 2);
            isjz = true;
          } else {
            saveResult = {
              code: "999",
              message: "报告关联项目合同编码" + bg.ziduan2 + "未完结"
            };
          }
        }
        if (isjz) {
          let cbjzdata = {
            cbjzMoney: cbjzMoney,
            dept_code: bg.dept_code,
            main_Id: cbgj.id,
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
          let bgjeData = {
            main_Id: cbgj.id,
            id: bgjeres[0].id,
            benqichujubaogaojine: bqcjbgje / 1.06,
            benqiqianshoubaogaojine: bg.baogaojine / 1.06
          };
          //将本期出具报告金额、本期签收报告金额更新过去
          func7.execute(bgjeData);
          let addcbjzMoney = func4.execute(cbjzdata);
          let addResult = addcbjzMoney.cgSaveres;
          if (addResult != undefined) {
            saveResult = {
              code: "200",
              message: "报告关联项目合同编码" + bg.ziduan2 + "在" + dqkjqj + "成本结转成功"
            };
          } else {
            saveResult = {
              code: "999",
              message: "报告关联项目合同编码" + bg.ziduan2 + "在" + dqkjqj + "成本结转失败"
            };
          }
        } else {
          saveResult = {
            code: "999",
            message: "报告关联项目合同编码" + bg.ziduan2 + "在成本归集未找到"
          };
        }
      }
    } else {
      saveResult = {
        code: "999",
        message: "报告关联项目合同编码" + bg.ziduan2 + "在项目档案未找到"
      };
    }
    return { saveResult };
    //获取上个月开始结尾
    function getData(date) {
      var nowdays = new Date(date);
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      month = parseInt(month);
      month = month + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var startDate = year + "-" + month + "-01 00:00:00"; //上个月第一天
      var endDate = year + "-" + month + "-" + myDate.getDate() + " 23:59:00"; //上个月最后一天
      var data = {
        startDate: startDate,
        endDate: endDate
      };
      return { data };
    }
    function getBeforeData(date) {
      var nowdays = new Date(date);
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var monthdate = year + "-" + month; //上个月
      var data = {
        month: monthdate
      };
      return { data };
    }
  }
}
exports({ entryPoint: MyAPIHandler });