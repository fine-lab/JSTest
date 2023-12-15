let YQL = "select InvCode,InvName,InvStd,InvStdMemo,Unit,Memo from GT14098AT3.GT14098AT3.BOM_parent";
let res = ObjectStore.queryByYonQL(YQL); //YQL查询实体
//实体查询