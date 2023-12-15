let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取保存子表数据
    var newBasicInformationDetailsList = param.data[0].BasicInformationDetailsList;
    //循环子表
    if (newBasicInformationDetailsList) {
      for (var i = 0; i < newBasicInformationDetailsList.length; i++) {
        //判断子表状态是否为修改
        var status = newBasicInformationDetailsList[i]._status;
        if (status == "Update") {
          //获取id
          var id = newBasicInformationDetailsList[i].id;
          //根据id查询子表数据
          var object = { id: id };
          var res = ObjectStore.selectByMap("GT102917AT3.GT102917AT3.BasicInformationDetails", object);
          //判断质量安全检查菜单是否发生变化
          if (
            res[0].jihuajijianriqin != null ||
            res[0].jihuayanshouriqin != null ||
            res[0].tuijianriqi != null ||
            res[0].tuidiao != null ||
            res[0].quxiandabiaoqingkuangn != null ||
            res[0].baodiaoriqi != null ||
            res[0].EscalatorInspectionDate != null ||
            res[0].EscalatorInspectionScore != null ||
            res[0].an2gongfajianchariqi != null ||
            res[0].an2gongfashenqingchuxiancaidann != null ||
            res[0].an2gongfashenqingn != null ||
            res[0].anquanzhenggaiwanchengriqin != null ||
            res[0].beizhu13 != null ||
            res[0].beizhu14 != null ||
            res[0].beizhu15 != null ||
            res[0].daoguijianyanriqi != null ||
            res[0].diaolangongfachouchan != null ||
            res[0].hanging_basket_method != null ||
            res[0].diaolangongfajianchariqin != null ||
            res[0].jiaoshoujiachuxiancaidann != null ||
            res[0].jiaoshoujiajianchan != null ||
            res[0].jiaoshoujiajianchariqi != null ||
            res[0].zhiliangzijianchuxiancaidann != null ||
            res[0].zhiliangzijianriqi != null ||
            res[0].ziduan20 != null ||
            res[0].randomEscalators != null
          ) {
            if (
              newBasicInformationDetailsList[i].jihuajijianriqin != res[0].jihuajijianriqin ||
              newBasicInformationDetailsList[i].jihuayanshouriqin != res[0].jihuayanshouriqin ||
              newBasicInformationDetailsList[i].tuijianriqi != res[0].tuijianriqi ||
              newBasicInformationDetailsList[i].tuidiao != res[0].tuidiao ||
              newBasicInformationDetailsList[i].quxiandabiaoqingkuangn != res[0].quxiandabiaoqingkuangn ||
              newBasicInformationDetailsList[i].baodiaoriqi != res[0].baodiaoriqi ||
              newBasicInformationDetailsList[i].EscalatorInspectionDate != res[0].EscalatorInspectionDate ||
              newBasicInformationDetailsList[i].EscalatorInspectionScore != res[0].EscalatorInspectionScore ||
              newBasicInformationDetailsList[i].an2gongfajianchariqi != res[0].an2gongfajianchariqi ||
              newBasicInformationDetailsList[i].an2gongfashenqingchuxiancaidann != res[0].an2gongfashenqingchuxiancaidann ||
              newBasicInformationDetailsList[i].an2gongfashenqingn != res[0].an2gongfashenqingn ||
              newBasicInformationDetailsList[i].anquanzhenggaiwanchengriqin != res[0].anquanzhenggaiwanchengriqin ||
              newBasicInformationDetailsList[i].daoguijianyanriqi != res[0].daoguijianyanriqi ||
              newBasicInformationDetailsList[i].diaolangongfachouchan != res[0].diaolangongfachouchan ||
              newBasicInformationDetailsList[i].hanging_basket_method != res[0].hanging_basket_method ||
              newBasicInformationDetailsList[i].diaolangongfajianchariqin != res[0].diaolangongfajianchariqin ||
              newBasicInformationDetailsList[i].jiaoshoujiachuxiancaidann != res[0].jiaoshoujiachuxiancaidann ||
              newBasicInformationDetailsList[i].jiaoshoujiajianchan != res[0].jiaoshoujiajianchan ||
              newBasicInformationDetailsList[i].jiaoshoujiajianchariqi != res[0].jiaoshoujiajianchariqi ||
              newBasicInformationDetailsList[i].zhiliangzijianchuxiancaidann != res[0].zhiliangzijianchuxiancaidann ||
              newBasicInformationDetailsList[i].zhiliangzijianriqi != res[0].zhiliangzijianriqi ||
              newBasicInformationDetailsList[i].ziduan20 != res[0].ziduan20 ||
              newBasicInformationDetailsList[i].randomEscalators != res[0].randomEscalators
            ) {
              //更新质量安全检查版本
              var object = {
                BasicInformationDetails_id: res[0].id,
                baodiaoriqin: res[0].baodiaoriqi,
                quxiandabiaoqingkuangn: res[0].quxiandabiaoqingkuangn,
                jihuajijianriqin: res[0].jihuajijianriqin,
                jihuayanshouriqin: res[0].jihuayanshouriqin,
                tuijianriqin: res[0].tuijianriqi,
                tuidiaoriqin: res[0].tuidiao,
                productionNumber: res[0].Productionworknumber,
                EscalatorInspectionDate: res[0].EscalatorInspectionDate,
                EscalatorInspectionScore: res[0].EscalatorInspectionScore,
                an2gongfajianchariqi: res[0].an2gongfajianchariqi,
                an2gongfashenqingchuxiancaidann: res[0].an2gongfashenqingchuxiancaidann,
                an2gongfashenqingn: res[0].an2gongfashenqingn,
                anquanzhenggaiwanchengriqin: res[0].anquanzhenggaiwanchengriqin,
                beizhu1: res[0].beizhu13,
                beizhu2: res[0].beizhu14,
                new17: res[0].beizhu15,
                daoguijianyanriqi: res[0].daoguijianyanriqi,
                diaolangongfachouchan: res[0].diaolangongfachouchan,
                diaolangongfachuxiancaidann: res[0].hanging_basket_method,
                diaolangongfajianchariqin: res[0].diaolangongfajianchariqin,
                jiaoshoujiachuxiancaidann: res[0].jiaoshoujiachuxiancaidann,
                jiaoshoujiajianchan: res[0].jiaoshoujiajianchan,
                jiaoshoujiajianchariqi: res[0].jiaoshoujiajianchariqi,
                zhiliangzijianchuxiancaidann: res[0].zhiliangzijianchuxiancaidann,
                zhiliangzijianriqi: res[0].zhiliangzijianriqi,
                ziduan20: res[0].ziduan20,
                futichouchacaidan: res[0].randomEscalators
              };
              var res = ObjectStore.insert("GT102917AT3.GT102917AT3.qualitySafetyInspection", object, "ybefae1b5d"); //an2gongfashenqingchuxiancaidann an2gongfashenqingchuxiancaidan
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });