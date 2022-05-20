import { http } from "@/utils/request";



export function getChangeRecordPage(datas) {
  return http.request({
    method: "post",
    url: "/changeRecord/getChangeRecordPage",
    data: datas
  });
}





