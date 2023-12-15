let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let bg = request.bg;
    let saveResult = {};
    //当前会计月
    let qianshouri = bg.huijiqijian;
    let dateData = getData(qianshouri);
    let dqkjqj = substring(dateData.data.startDate, 0, 7);
    //上期会计月
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
    let rgcbres = bg.rgcbnewList;
    let fwcbres = bg.fwcbnewList;
    let yscbres = bg.yscbnewList;
    let zzfyres = bg.zzfynewList;
    let lwcbres = bg.lwcbnewList;
    let zjclres = bg.zjclnewList;
    let bgjeres = bg.bgjenewList;
    let cbjzMoney = 0.0;
    let qmjchj = 0.0;
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
    let sqlxm = "select * from bd.project.ProjectVO where code='" + bg.projectCode + "'";
    //结构部
    var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
    if (resxm.length > 0) {
      bg.type = resxm[0].classifyid;
    } else {
      saveResult = {
        code: "999",
        message: "合同" + bg.projectCode + "在项目档案未匹配"
      };
      return saveResult;
    }
    let yscbsql =
      "select IFNULL(service_fee,0)+IFNULL(service_charge,0)+IFNULL(freight,0)+IFNULL(direct_materials,0)+IFNULL(artificial,0)+IFNULL(make,0) AS yscb from GT99994AT1.GT99994AT1.projectbudget_implementnew where dr=0 and projectbudgetnew_id in (select id from GT99994AT1.GT99994AT1.projectbudgetnew where dr=0 and sanheyusuanbumenbianma='" +
      bg.shDeptCode +
      "' and xiangmubianma='" +
      bg.projectCode +
      "' and huijiqijian leftlike '" +
      dqkjqj +
      "' )";
    let resyscb = ObjectStore.queryByYonQL(yscbsql);
    httotalMoney = bg.deptMoney;
    ystitalMoney = resyscb.length > 0 ? resyscb[0].yscb : ystitalMoney;
    //本期签收报告金额
    bg.baogaojine = bgjeres[0].benqiqianshoubaogaojine;
    //本期出具报告金额
    let bqcjbgje = bgjeres[0].benqichujubaogaojine;
    //单价合同成本结转(材料部常规合同执行单价合同成本结转计算、其他部门单价正常计算)
    if (bg.type == "2710655216620544" || bg.type == "2710655740761600") {
      //本期签收报告金额
      let bqqsbgMoney = bg.baogaojine;
      //累计总出具报告金额
      let totalcjbgje = bgjeres[0].qichuleijichujubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijichujubaogaojine;
      //累计已签收报告金额
      let totalljyqsbgje = bgjeres[0].qichuleijiqianshoubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijiqianshoubaogaojine;
      //期初已结转成本
      let sqyjzcb =
        getNumBer(rgcbres == undefined ? 0 : rgcbres[0].qichuleijijiezhuan) +
        getNumBer(fwcbres == undefined ? 0 : fwcbres[0].qichuleijijiezhuan) +
        getNumBer(yscbres == undefined ? 0 : yscbres[0].qichuleijijiezhuan) +
        getNumBer(zzfyres == undefined ? 0 : zzfyres[0].qichuleijijiezhuan) +
        getNumBer(lwcbres == undefined ? 0 : lwcbres[0].qichuleijijiezhuan) +
        getNumBer(zjclres == undefined ? 0 : zjclres[0].qichuleijijiezhuan);
      let isLast = false;
      let zbgsql1 =
        "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
        bg.projectCode +
        "'" +
        " and dept_code='" +
        bg.shDeptCode +
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
        if (totalcjbgje - totalljyqsbgje + bqcjbgje !== 0) {
          yjzcbbl = MoneyFormatReturnBd(bqqsbgMoney / (totalcjbgje - totalljyqsbgje + bqcjbgje), 8);
          if (parseFloat(yjzcbbl) >= 1) {
            yjzcbbl = 1;
          } else if (parseFloat(yjzcbbl) < 0) {
            yjzcbbl = 0;
          }
          isjz = true;
        } else {
          if (totalcjbgje == 0) {
            yjzcbbl = 0;
            isjz = true;
          } else if (totalcjbgje > 0) {
            let zjclresbq = zjclres == undefined ? 0 : zjclres[0].new4 == undefined ? 0 : zjclres[0].new4;
            let yscbresbq = yscbres == undefined ? 0 : yscbres[0].benqifasheng == undefined ? 0 : yscbres[0].benqifasheng;
            let fwcbresbq = fwcbres == undefined ? 0 : fwcbres[0].benqifasheng == undefined ? 0 : fwcbres[0].benqifasheng;
            let lwcbresbq = lwcbres == undefined ? 0 : lwcbres[0].benqifasheng == undefined ? 0 : lwcbres[0].benqifasheng;
            if (bg.shDeptCode != "D") {
              if (zjclresbq != 0 || yscbresbq != 0 || fwcbresbq != 0 || lwcbresbq != 0) {
                yjzcbbl = 1;
                isjz = true;
              } else {
                saveResult = {
                  code: "999",
                  message: "合同：" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "劳务、运输、直接材料、服务本期发生都为0"
                };
              }
            } else {
              if (bqcjbgje > 0 && (zjclresbq != 0 || yscbresbq != 0 || fwcbresbq != 0 || lwcbresbq != 0)) {
                yjzcbbl = 1;
                isjz = true;
              } else {
                saveResult = {
                  code: "999",
                  message: "合同：" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "本期出具为0"
                };
              }
            }
          } else {
            saveResult = {
              code: "999",
              message: "合同：" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "累计出具报告金额-累计已签收报告金额+本期出具报告金额这个结果为0"
            };
          }
        }
      }
      if (isjz) {
        benqijiezhuanrengongchengben = MoneyFormatReturnBd((getNumBer(rgcbres == undefined ? 0 : rgcbres[0].qichujiecun) + getNumBer(rgcbres == undefined ? 0 : rgcbres[0].benqifasheng)) * yjzcbbl, 2);
        benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(yscbres == undefined ? 0 : yscbres[0].qichujiecun) + getNumBer(yscbres == undefined ? 0 : yscbres[0].benqifasheng)), 2);
        benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(fwcbres == undefined ? 0 : fwcbres[0].qichujiecun) + getNumBer(fwcbres == undefined ? 0 : fwcbres[0].benqifasheng)), 2);
        benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(lwcbres == undefined ? 0 : lwcbres[0].qichujiecun) + getNumBer(lwcbres == undefined ? 0 : lwcbres[0].benqifasheng)), 2);
        benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (getNumBer(zzfyres == undefined ? 0 : zzfyres[0].qichujiecun) + getNumBer(zzfyres == undefined ? 0 : zzfyres[0].benqifasheng)), 2);
        benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(yjzcbbl * (getNumBer(zjclres == undefined ? 0 : zjclres[0].qichujiecun) + getNumBer(zjclres == undefined ? 0 : zjclres[0].new4)), 2);
        jieyurengongchengben = MoneyFormatReturnBd(
          getNumBer(rgcbres == undefined ? 0 : rgcbres[0].qichujiecun) + getNumBer(rgcbres == undefined ? 0 : rgcbres[0].benqifasheng) - getNumBer(benqijiezhuanrengongchengben),
          2
        );
        jieyuyunshuchengben = MoneyFormatReturnBd(
          getNumBer(yscbres == undefined ? 0 : yscbres[0].qichujiecun) + getNumBer(yscbres == undefined ? 0 : yscbres[0].benqifasheng) - getNumBer(benqijiezhuanyunshuchengben),
          2
        );
        jieyufuwuchengben = MoneyFormatReturnBd(
          getNumBer(fwcbres == undefined ? 0 : fwcbres[0].qichujiecun) + getNumBer(fwcbres == undefined ? 0 : fwcbres[0].benqifasheng) - getNumBer(benqijiezhuanfuwuchengben),
          2
        );
        jieyulaowuchengben = MoneyFormatReturnBd(
          getNumBer(lwcbres == undefined ? 0 : lwcbres[0].qichujiecun) + getNumBer(lwcbres == undefined ? 0 : lwcbres[0].benqifasheng) - getNumBer(benqijiezhuanlaowuchengben),
          2
        );
        jieyuzhizaofeiyong = MoneyFormatReturnBd(
          getNumBer(zzfyres == undefined ? 0 : zzfyres[0].qichujiecun) + getNumBer(zzfyres == undefined ? 0 : zzfyres[0].benqifasheng) - getNumBer(benqijiezhuanzhizaofeiyong),
          2
        );
        qimojiecunzhijiecailiao = MoneyFormatReturnBd(
          getNumBer(zjclres == undefined ? 0 : zjclres[0].qichujiecun) + getNumBer(zjclres == undefined ? 0 : zjclres[0].new4) - getNumBer(benqijiezhuanzhijiecailiao),
          2
        );
        cbjzMoney = MoneyFormatReturnBd(
          parseFloat(benqijiezhuanrengongchengben) +
            parseFloat(benqijiezhuanyunshuchengben) +
            parseFloat(benqijiezhuanfuwuchengben) +
            parseFloat(benqijiezhuanlaowuchengben) +
            parseFloat(benqijiezhuanzhijiecailiao) +
            parseFloat(benqijiezhuanzhizaofeiyong),
          2
        );
        qmjchj = MoneyFormatReturnBd(
          parseFloat(jieyurengongchengben) +
            parseFloat(jieyuyunshuchengben) +
            parseFloat(jieyufuwuchengben) +
            parseFloat(jieyulaowuchengben) +
            parseFloat(jieyuzhizaofeiyong) +
            parseFloat(qimojiecunzhijiecailiao),
          2
        );
        mlv = MoneyFormatReturnBd((getNumBer(bqqsbgMoney) + getNumBer(totalljyqsbgje) - getNumBer(cbjzMoney) - getNumBer(sqyjzcb)) / (getNumBer(bqqsbgMoney) + getNumBer(totalljyqsbgje)), 2);
      }
    } else if (bg.type == "2710655493510400") {
      //是否末期
      let isLast = false;
      let zbgsql1 =
        "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
        bg.projectCode +
        "'" +
        " and dept_code='" +
        bg.shDeptCode +
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
        let sqlBg = "select sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" + " and ziduan2='" + bg.projectCode + "'  group by ziduan2";
        var resBgMoney = ObjectStore.queryByYonQL(sqlBg);
        let totalljyqsbgje = bgjeres[0].qichuleijiqianshoubaogaojine == undefined ? 0.0 : bgjeres[0].qichuleijiqianshoubaogaojine;
        let beforejzMoney =
          rgcbres == undefined
            ? 0
            : rgcbres[0].qichuleijijiezhuan + fwcbres == undefined
            ? 0
            : fwcbres[0].qichuleijijiezhuan + yscbres == undefined
            ? 0
            : yscbres[0].qichuleijijiezhuan + zzfyres == undefined
            ? 0
            : zzfyres[0].qichuleijijiezhuan + lwcbres == undefined
            ? 0
            : lwcbres[0].qichuleijijiezhuan + zjclres == undefined
            ? 0
            : zjclres[0].qichuleijijiezhuan;
        benqijiezhuanrengongchengben = MoneyFormatReturnBd((getNumBer(rgcbres == undefined ? 0 : rgcbres[0].qichujiecun) + getNumBer(rgcbres == undefined ? 0 : rgcbres[0].benqifasheng)) * yjzcbbl, 2);
        benqijiezhuanyunshuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(yscbres == undefined ? 0 : yscbres[0].qichujiecun) + getNumBer(yscbres == undefined ? 0 : yscbres[0].benqifasheng)), 2);
        benqijiezhuanfuwuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(fwcbres == undefined ? 0 : fwcbres[0].qichujiecun) + getNumBer(fwcbres == undefined ? 0 : fwcbres[0].benqifasheng)), 2);
        benqijiezhuanlaowuchengben = MoneyFormatReturnBd(yjzcbbl * (getNumBer(lwcbres == undefined ? 0 : lwcbres[0].qichujiecun) + getNumBer(lwcbres == undefined ? 0 : lwcbres[0].benqifasheng)), 2);
        benqijiezhuanzhizaofeiyong = MoneyFormatReturnBd(yjzcbbl * (getNumBer(zzfyres == undefined ? 0 : zzfyres[0].qichujiecun) + getNumBer(zzfyres == undefined ? 0 : zzfyres[0].benqifasheng)), 2);
        benqijiezhuanzhijiecailiao = MoneyFormatReturnBd(yjzcbbl * (getNumBer(zjclres == undefined ? 0 : zjclres[0].qichujiecun) + getNumBer(zjclres == undefined ? 0 : zjclres[0].new4)), 2);
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
          (getNumBer(resBgMoney[0].baogaojine) + getNumBer(totalljyqsbgje) - getNumBer(beforejzMoney) - getNumBer(cbjzMoney)) / (getNumBer(resBgMoney[0].baogaojine) + getNumBer(totalljyqsbgje)),
          2
        );
        isjz = true;
      } else {
        saveResult = {
          code: "999",
          message: "合同" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "未完结"
        };
      }
    }
    if (isjz) {
      let cbjzdata = {
        cbjzMoney: cbjzMoney,
        dept_code: bg.shDeptCode,
        main_Id: bg.id,
        yjzcbbl: yjzcbbl,
        mlv: mlv,
        jieyurengongchengben: jieyurengongchengben,
        jieyuyunshuchengben: jieyuyunshuchengben,
        jieyufuwuchengben: jieyufuwuchengben,
        jieyulaowuchengben: jieyulaowuchengben,
        jieyuzhizaofeiyong: jieyuzhizaofeiyong,
        qimojiecunzhijiecailiao: qimojiecunzhijiecailiao,
        qimojiecunhejichengben: qmjchj,
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
          message: "合同" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "成本结转成功"
        };
      } else {
        saveResult = {
          code: "999",
          message: "合同" + bg.projectCode + "会计期间:" + bg.huijiqijian + "三和部门：" + bg.shDeptCode + "成本结转失败"
        };
      }
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
    function getNumBer(str) {
      if (str === undefined || str == null) {
        return parseFloat("0.0");
      } else {
        return parseFloat(str);
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });