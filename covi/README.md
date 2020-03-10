# covi

👉[Demo](https://trichimtrich.github.io/covi/)

Bản đồ xem `Cô Vi` đang ở những chỗ nào.

Code cho vui, data chưa chính thức. Cần mấy bạn commit data dùm 😘.

- Gửi issue để mình parse vô nè
- Hoặc pull request

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
    "reference": [
        "https://link1.com",
        "https://link2.com
    ],
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
    }
}
```

Trong đó

- Các trường có data format
    - `caseType` là string `old` hoặc `new`
    - `relatedCaseNo` là array, và value là keyname của case khác, như `noYY`, `noZZ`. Nếu không có thì để rỗng
    - `nodes` là dict
        - key của location, nên dùng lại key (của các case khác) nếu trùng vị trí.
        - phải có trường `lat` + `lng` hoặc `url` (của google map)
        - `last` là địa điểm cuối cùng, hoặc rất nguy hiểm liên quan tới case. Có ít nhất 1 địa điểm có trường `last` là true

- Các trường còn lại thì chỉ dùng để hiện thông tin, không có logic nên không có format

## License

<a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
       width="80" height="15" alt="WTFPL" /></a>