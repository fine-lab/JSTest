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
    let func6 = extrequire("GT62395AT3.backDefaultGroup.getCBGJdata");
    let func5 = extrequire("GT59740AT1.backDefaultGroup.updatejzResult");
    let func4 = extrequire("GT59740AT1.backDefaultGroup.addcbjz");
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
        let rgcbsql = "select * from GT62395AT3.GT62395AT3.rgcb where dr=0 and cbgj_id='" + cbgj.id + "'";
        let fwcbsql = "select * from GT62395AT3.GT62395AT3.fwcb where dr=0 and cbgj_id='" + cbgj.id + "'";
        let yscbsql1 = "select * from GT62395AT3.GT62395AT3.yscb where dr=0 and cbgj_id='" + cbgj.id + "'";
        let zzfysql = "select * from GT62395AT3.GT62395AT3.zzfy where dr=0 and cbgj_id='" + cbgj.id + "'";
        let lwcbsql = "select * from GT62395AT3.GT62395AT3.lwcb where dr=0 and cbgj_id='" + cbgj.id + "'";
        let rgcbres = ObjectStore.queryByYonQL(rgcbsql);
        let fwcbres = ObjectStore.queryByYonQL(fwcbsql);
        let yscbres = ObjectStore.queryByYonQL(yscbsql1);
        let zzfyres = ObjectStore.queryByYonQL(zzfysql);
        let lwcbres = ObjectStore.queryByYonQL(lwcbsql);
        let bqqsbgjesql = "";
        if (bg.dept_code != "D") {
          if (bg.is_supplement == "0") {
            bqqsbgjesql =
              "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
              bg.ziduan2 +
              "'" +
              " and dept_code='" +
              bg.dept_code +
              "' and is_supplement='0' and qianshouri between '" +
              dateData.data.startDate +
              "' and '" +
              dateData.data.endDate +
              "'";
          } else if (bg.is_supplement == "1") {
            bqqsbgjesql =
              "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
              bg.ziduan2 +
              "'" +
              " and dept_code='" +
              bg.dept_code +
              "' and is_supplement='1' and is_supplement between '" +
              dateData.data.startDate +
              "' and '" +
              dateData.data.endDate +
              "'";
          }
        } else {
          if (bg.is_supplement == "0") {
            bqqsbgjesql =
              "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
              bg.ziduan2 +
              "'" +
              " and dept_name like '材料部' and is_supplement='0' and qianshouri between '" +
              dateData.data.startDate +
              "' and '" +
              dateData.data.endDate +
              "'";
          } else if (bg.is_supplement == "1") {
            bqqsbgjesql =
              "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
              bg.ziduan2 +
              "'" +
              " and dept_name like '材料部' and is_supplement='1' and settlement_data between '" +
              dateData.data.startDate +
              "' and '" +
              dateData.data.endDate +
              "'";
          }
        }
        var bqqshtDataList = ObjectStore.queryByYonQL(bqqsbgjesql);
        //本期签收报告金额
        if (bqqshtDataList.length > 0) {
          bg.baogaojine = bqqshtDataList[0].baogaojine;
        }
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
        let benqijiezhuanrengongchengben = 0.0;
        let benqijiezhuanyunshuchengben = 0.0;
        let benqijiezhuanfuwuchengben = 0.0;
        let benqijiezhuanlaowuchengben = 0.0;
        let benqijiezhuanzhizaofeiyong = 0.0;
        let sqlxm = "";
        //结构部
        if (bg.dept_code == "B") {
          sqlxm = "select defineCharacter.attrext9 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "A1") {
          sqlxm = "select defineCharacter.attrext7  as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "A2") {
          sqlxm = "select defineCharacter.attrext14 from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "C") {
          sqlxm = "select defineCharacter.attrext10 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "D") {
          sqlxm = "select defineCharacter.attrext8 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        } else if (bg.dept_code == "F") {
          sqlxm = "select defineCharacter.attrext15 as money from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
        }
        var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
        let yscbsql =
          "select wangongchengbenbuhanshuiheji as yscb  from GT99994AT1.GT99994AT1.XMSSWG where dr=0 and XMYS_id in (select id from GT99994AT1.GT99994AT1.XMYS where dr=0 and yusuanbumenbianma='" +
          bg.dept_code +
          "' and xiaoshouhetongbianhao='" +
          bg.ziduan2 +
          "' )";
        let resyscb = ObjectStore.queryByYonQL(yscbsql);
        httotalMoney = resxm.length > 0 ? resxm[0].money : httotalMoney;
        ystitalMoney = resyscb.length > 0 ? resyscb[0].yscb : ystitalMoney;
        //单价合同成本结转(材料部常规合同执行单价合同成本结转计算、其他部门单价正常计算)
        if ((bg.dept_code == "D" && resxmdetail[0].classifyid == "2710655216620544") || resxmdetail[0].classifyid == "2710655740761600") {
          var benqisql = "";
          if (bg.dept_code != "D") {
            if (bg.is_supplement == "0") {
              benqisql =
                "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_code='" +
                bg.dept_code +
                "' and is_supplement='0' and baogaori between '" +
                dateData.data.startDate +
                "' and '" +
                dateData.data.endDate +
                "'";
            } else if (bg.is_supplement == "1") {
              benqisql =
                "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_code='" +
                bg.dept_code +
                "' and is_supplement='1' and is_supplement between '" +
                dateData.data.startDate +
                "' and '" +
                dateData.data.endDate +
                "'";
            }
          } else {
            if (bg.is_supplement == "0") {
              benqisql =
                "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_name like '材料部' and is_supplement='0' and baogaori between '" +
                dateData.data.startDate +
                "' and '" +
                dateData.data.endDate +
                "'";
            } else if (bg.is_supplement == "1") {
              benqisql =
                "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_name like '材料部' and is_supplement='1' and settlement_data between '" +
                dateData.data.startDate +
                "' and '" +
                dateData.data.endDate +
                "'";
            }
          }
          var bqhtDataList = ObjectStore.queryByYonQL(benqisql);
          //本期签收报告金额
          let bqqsbgMoney = bg.baogaojine;
          //总出具报告金额
          let totalcjbgje = cbgj.zongchujubaogaojine == undefined ? 0.0 : cbgj.zongchujubaogaojine;
          //累计已签收报告金额
          let totalljyqsbgje = cbgj.leijiyiqianshoubaogaojine == undefined ? 0.0 : cbgj.leijiyiqianshoubaogaojine;
          //本期出具报告金额
          let bqcjbgje = bqhtDataList.length > 0 ? bqhtDataList[0].baogaojine : 0.0;
          //上期结存成本
          let sqjccb = cbgj.shangqijiecunchengben == undefined ? 0.0 : cbgj.shangqijiecunchengben;
          //上期已结转成本
          let sqyjzcb = cbgj.shangqiyijiezhuanzongchengben == undefined ? 0.0 : cbgj.shangqiyijiezhuanzongchengben;
          let bqyfscb = cbgj.hetonglvyuechengbenbenqifashenge == undefined ? 0.0 : cbgj.hetonglvyuechengbenbenqifashenge;
          let isLast = false;
          let zbgsql1 =
            "select isEnd from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
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
              if (parseInt(yjzcbbl) >= 1) {
                yjzcbbl = 1;
              }
              isjz = true;
            } else {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "总出具报告金额-累计已签收报告金额+bqcjbgje/1.06这个结果为0"
              };
            }
          }
          if (isjz) {
            mlv = MoneyFormatReturnBd((bqqsbgMoney / 1.06 + totalljyqsbgje - (parseFloat(cbjzMoney) + parseFloat(sqyjzcb))) / (bqqsbgMoney / 1.06 + totalljyqsbgje), 2);
            benqijiezhuanrengongchengben = MoneyFormatReturnBd((rgcbres[0].qichujiecunchengben + rgcbres[0].hetonglvyuechengbenbenqifashenge2201) * yjzcbbl, 2);
            benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (yscbres[0].qichujiecunchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201), 2);
            benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (fwcbres[0].qichujiecunchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201), 2);
            benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (lwcbres[0].qichujiecunchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201), 2);
            benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (zzfyres[0].qichujiecunchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201), 2);
            jieyurengongchengben = MoneyFormatReturnBd(rgcbres[0].qichujiecunchengben + rgcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanrengongchengben, 2);
            jieyuyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichujiecunchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanyunshuchengben, 2);
            jieyufuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichujiecunchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanfuwuchengben, 2);
            jieyulaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichujiecunchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanlaowuchengben, 2);
            jieyuzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichujiecunchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanzhizaofeiyong, 2);
            cbjzMoney = MoneyFormatReturnBd(
              parseFloat(benqijiezhuanrengongchengben) +
                parseFloat(benqijiezhuanyunshuchengben) +
                parseFloat(benqijiezhuanfuwuchengben) +
                parseFloat(benqijiezhuanlaowuchengben) +
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
            "select isEnd from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
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
          let historybgqsMoney = cbgj.leijiyiqianshoubaogaojine == undefined ? 0.0 : cbgj.leijiyiqianshoubaogaojine;
          let beforejzMoney = cbgj.shangqiyijiezhuanzongchengben == undefined ? 0.0 : cbgj.shangqiyijiezhuanzongchengben;
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
            if (resxm.length > 0 || resxm[0].money != 0) {
              let sjygjMoney = 0.0;
              sjygjMoney = cbgj.hetonglvyuechengbenqimoyue;
              yjzcbbl = 1;
              if (parseInt(yjzcbbl) >= 1) {
                yjzcbbl = 1;
              }
              benqijiezhuanrengongchengben = MoneyFormatReturnBd(rgcbres[0].qichujiecunchengben + rgcbres[0].hetonglvyuechengbenbenqifashenge2201, 2);
              benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichujiecunchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201, 2);
              benqijiezhuanfuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichujiecunchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201, 2);
              benqijiezhuanlaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichujiecunchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201, 2);
              benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichujiecunchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201, 2);
              jieyurengongchengben = MoneyFormatReturnBd(rgcbres[0].qichujiecunchengben + rgcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanrengongchengben, 2);
              jieyuyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichujiecunchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanyunshuchengben, 2);
              jieyufuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichujiecunchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanfuwuchengben, 2);
              jieyulaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichujiecunchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanlaowuchengben, 2);
              jieyuzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichujiecunchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanzhizaofeiyong, 2);
              cbjzMoney = MoneyFormatReturnBd(
                parseFloat(benqijiezhuanrengongchengben) +
                  parseFloat(benqijiezhuanyunshuchengben) +
                  parseFloat(benqijiezhuanfuwuchengben) +
                  parseFloat(benqijiezhuanlaowuchengben) +
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
            if (resxm.length > 0 || resxm[0].money != 0) {
              let yscbMoney = 0.0;
              if (resyscb.length > 0) {
                yscbMoney = resyscb[0].yscb;
              }
              yjzcbbl = MoneyFormatReturnBd((historybgqsMoney + bg.baogaojine / 1.06) / (resxm[0].money / 1.06), 8);
              if (parseInt(yjzcbbl) >= 1) {
                yjzcbbl = 1;
              }
              let totgjje =
                rgcbres[0].shijiyiguijizongchengben2112 +
                rgcbres[0].hetonglvyuechengbenbenqifashenge2201 +
                fwcbres[0].shijiyiguijizongchengben +
                fwcbres[0].hetonglvyuechengbenbenqifashenge2201 +
                yscbres[0].shijiyiguijizongchengben2112 +
                yscbres[0].hetonglvyuechengbenbenqifashenge2201 +
                zzfyres[0].shijiyiguijizongchengben2112 +
                zzfyres[0].hetonglvyuechengbenbenqifashenge2201 +
                lwcbres[0].shijiyiguijizongchengben2112 +
                lwcbres[0].hetonglvyuechengbenbenqifashenge2201;
              let benqijiezhuanrengongchengbengjbl = MoneyFormatReturnBd((rgcbres[0].shijiyiguijizongchengben2112 + rgcbres[0].hetonglvyuechengbenbenqifashenge2201) / totgjje, 8);
              let benqijiezhuanyunshuchengbengjbl = MoneyFormatReturnBd((yscbres[0].shijiyiguijizongchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201) / totgjje, 8);
              let benqijiezhuanfuwuchengbengjbl = MoneyFormatReturnBd((fwcbres[0].shijiyiguijizongchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201) / totgjje, 8);
              let benqijiezhuanlaowuchengbengjbl = MoneyFormatReturnBd((lwcbres[0].shijiyiguijizongchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201) / totgjje, 8);
              let benqijiezhuanzhizaofeiyonggjbl = MoneyFormatReturnBd((zzfyres[0].shijiyiguijizongchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201) / totgjje, 8);
              benqijiezhuanrengongchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanrengongchengbengjbl * yjzcbbl - rgcbres[0].qichuyijiezhuanchengben2112, 2);
              benqijiezhuanyunshuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanyunshuchengbengjbl * yjzcbbl - yscbres[0].qichuyijiezhuanchengben2112, 2);
              benqijiezhuanfuwuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanfuwuchengbengjbl * yjzcbbl - fwcbres[0].qichuyijiezhuanchengben, 2);
              benqijiezhuanlaowuchengben = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanlaowuchengbengjbl * yjzcbbl - lwcbres[0].qichuyijiezhuanchengben2112, 2);
              benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(ystitalMoney * benqijiezhuanzhizaofeiyonggjbl * yjzcbbl - zzfyres[0].qichuyijiezhuanchengben2112, 2);
              jieyurengongchengben = MoneyFormatReturnBd(rgcbres[0].qichujiecunchengben + rgcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanrengongchengben, 2);
              jieyuyunshuchengben = MoneyFormatReturnBd(yscbres[0].qichujiecunchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanyunshuchengben, 2);
              jieyufuwuchengben = MoneyFormatReturnBd(fwcbres[0].qichujiecunchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanfuwuchengben, 2);
              jieyulaowuchengben = MoneyFormatReturnBd(lwcbres[0].qichujiecunchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanlaowuchengben, 2);
              jieyuzhizaofeiyong = MoneyFormatReturnBd(zzfyres[0].qichujiecunchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201 - benqijiezhuanzhizaofeiyong, 2);
              cbjzMoney = MoneyFormatReturnBd(
                parseFloat(benqijiezhuanrengongchengben) +
                  parseFloat(benqijiezhuanyunshuchengben) +
                  parseFloat(benqijiezhuanfuwuchengben) +
                  parseFloat(benqijiezhuanlaowuchengben) +
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
            "select isEnd from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
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
            let sqlBg = "select sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" + " and ziduan2='" + bg.ziduan2 + "'  group by ziduan2";
            var resBgMoney = ObjectStore.queryByYonQL(sqlBg);
            let totalljyqsbgje = cbgj.leijiyiqianshoubaogaojine == undefined ? 0.0 : cbgj.leijiyiqianshoubaogaojine;
            let beforejzMoney = cbgj.shangqiyijiezhuanzongchengben == undefined ? 0.0 : cbgj.shangqiyijiezhuanzongchengben;
            benqijiezhuanrengongchengben = rgcbres[0].shijiyiguijizongchengben2112 + rgcbres[0].hetonglvyuechengbenbenqifashenge2201;
            benqijiezhuanyunshuchengben = yscbres[0].shijiyiguijizongchengben2112 + yscbres[0].hetonglvyuechengbenbenqifashenge2201;
            benqijiezhuanfuwuchengben = fwcbres[0].shijiyiguijizongchengben + fwcbres[0].hetonglvyuechengbenbenqifashenge2201;
            benqijiezhuanlaowuchengben = lwcbres[0].shijiyiguijizongchengben2112 + lwcbres[0].hetonglvyuechengbenbenqifashenge2201;
            benqijiezhuanzhizaofeiyong = zzfyres[0].shijiyiguijizongchengben2112 + zzfyres[0].hetonglvyuechengbenbenqifashenge2201;
            cbjzMoney = MoneyFormatReturnBd(
              parseFloat(benqijiezhuanrengongchengben) +
                parseFloat(benqijiezhuanyunshuchengben) +
                parseFloat(benqijiezhuanfuwuchengben) +
                parseFloat(benqijiezhuanlaowuchengben) +
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
            benqijiezhuanrengongchengben: benqijiezhuanrengongchengben,
            benqijiezhuanyunshuchengben: benqijiezhuanyunshuchengben,
            benqijiezhuanfuwuchengben: benqijiezhuanfuwuchengben,
            benqijiezhuanlaowuchengben: benqijiezhuanlaowuchengben,
            benqijiezhuanzhizaofeiyong: benqijiezhuanzhizaofeiyong
          };
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
        }
      } else {
        saveResult = {
          code: "999",
          message: "报告关联项目合同编码" + bg.ziduan2 + "在成本归集未找到"
        };
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