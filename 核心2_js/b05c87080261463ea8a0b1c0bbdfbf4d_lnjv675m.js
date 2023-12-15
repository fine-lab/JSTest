viewModel.get("button58qk") &&
  viewModel.get("button58qk").on("click", function (data) {
    // 测试更新编码--单击
    let sql =
      "select OrgCode,sysOrgCode,shortname,sysparent,taxpayerid,taxpayername,principal," +
      "branchleader,contact,telephone,address,isbizunit,id,sysOrg " +
      "from GT34544AT7.GT34544AT7.GxsOrg where sysOrgCode like 'H510000000000'";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      let { recordList } = res;
      let objs = [];
      for (let i in recordList) {
        let obj = recordList[i];
        let { OrgCode, sysOrgCode } = obj;
        let len = sysOrgCode.length;
        if (len > 15) {
          let substr = sysOrgCode.substring(15, len);
          console.log(substr);
          let check = false;
          let end = 0;
          for (let j = 0; j < 3; j++) {
            let c = substr.substring(j, j + 1);
            if (!!c) {
              if (isNaN(parseFloat(c))) {
                if (c !== "_" && !(j == 0 && c == "O") && !(j == 0 && c == "A")) {
                  check = true;
                } else if (!(j == 0 && c == "O") && !(j == 0 && c == "A")) {
                  console.log("下划线");
                  console.log(c);
                  check = true;
                }
                end = j;
                break;
              }
            } else {
              check = true;
              end = j;
              break;
            }
          }
          if (check) {
            console.log("end == ");
            console.log(end);
            let zeronum = 3 - end;
            let { OrgCode } = obj;
            let ncode1 = OrgCode.substring(0, 15);
            let ncode = "";
            for (let i = 0; i < zeronum; i++) {
              ncode += "0";
            }
            let old = OrgCode.substring(15, 15 + end);
            let ncode3 = OrgCode.substring(15 + end);
            obj.OrgCode = ncode1 + old + ncode + ncode3;
            obj.sysOrgCode = obj.OrgCode;
            objs.push(obj);
          }
        }
        OrgCode.indexOf();
      }
      console.log(objs);
      let size = 100;
      let len = objs.length;
      let sub = len % size;
      let pages = (len - sub) / size;
      let max = sub == 0 ? pages : pages + 1;
      let upobj1 = [];
      for (let i = 0; i < max; i++) {
        let upobj = [];
        if (i < max - 1) {
          upobj = objs.slice(i * size, (i + 1) * size);
        } else {
          upobj = objs.slice(i * size);
        }
        upobj1.push(upobj);
      }
      console.log(upobj1);
      for (let i = 0; i < upobj1.length; i++) {
        let uparr = upobj1[i];
        cb.rest.invokeFunction(
          "GT34544AT7.common.updateBatchSql",
          {
            billNum: "yb9be67c53",
            list: uparr,
            table: "GT34544AT7.GT34544AT7.GxsOrg"
          },
          function (err, res) {
            console.log(res);
          }
        );
      }
    });
  });