# covi

👉[Live website](https://trichimtrich.github.io/)

Bản đồ xem `Cô Vi` đang ở những chỗ nào.

Code cho vui, data góp nhặt trên mạng. Cần mấy bạn commit data dùm 😘.

- Gửi issue để mình parse vô nè
- Hoặc pull request theo hướng dẫn

## Format case

1. Add case mới vào thử mục `cases`. Ví dụ case số `noXX` => `./cases/noXX.json`

2. Sau đó add thêm cái `noXX` vào `./list.json`

3. Structure của `noXX.json` như sau, ví dụ

```
{
    "caseType": "old",
    "age": 99,
    "gender": "female",
    "from": "Da nang",
    "stayed": "199 Nguyen Van Linh",
    "visited": "London, Italy, France",
    "citizenship": "Vietnam",
    "relatedCaseNo": ["noYY", "noZZ"],
    "confirmDate": "10 March 2020",
    "credit": "superman, batman",
    "nodes": {
        "nha-17": {
            "lat": 21.0488112,
            "lng": 105.8399281,
            "desc": "15 - 17 Trúc Bạch",
            "last": true
        },

        "san-bay-da-nang": {
            "url": "https://www.google.com/maps/place/Da+Nang+International+Airport/@16.0632712,108.2280497,17z/data=!4m5!3m4!1s0x314219a273df52d1:0xb203f9fca295071a!8m2!3d16.0563276!4d108.2008338",
            "desc": "Sân bay Đà Nẵng"
        }
    },
    "reference": [
        "https://link1.com",
        "https://link2.com
    ],
    "customHTML": ""
}
```

Trong đó

- Các trường có data format
    - `caseType` là string trong array `["new", "update", "old", "discharge", "indirect"]`
    - `relatedCaseNo` là array, và value là keyname của case khác, như `noYY`, `noZZ`. Nếu không có thì để rỗng
    - `nodes` là dict
        - key của location, nên dùng lại key (của các case khác) nếu trùng vị trí.
        - phải có trường `lat` + `lng` hoặc `url` (của google map)
        - `last` là địa điểm cuối cùng, hoặc rất nguy hiểm liên quan tới case. Phải có ít nhất 1 địa điểm có trường `last` là true
    - `customHTML` là string để add vào popup. Ví dụ `<b>Notice:</b> Something wrong` => **Notice**: Something wrong

- Các trường còn lại thì chỉ dùng để bổ sung thông tin, không ảnh hưởng logic nên không có format

## Credit

- 🐦 [trichimtrich](https://github.com/trichimtrich)
- 🐖 [codenamelxl](https://github.com/codenamelxl)

## License

<a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
       width="80" height="15" alt="WTFPL" /></a>