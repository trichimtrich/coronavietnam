# covi

👉[Demo](https://trichimtrich.github.io/covi/)

Bản đồ xem `Cô Vi` đang ở những chỗ nào.

Code cho vui, data chưa chính thức. Cần mấy bạn commit data dùm 😘.

## Format

- Add case vào thử mục `cases`. Ví dụ `./cases/noXX.json`

- Sau đó add thêm cái `noXX` vào `./list.json`

- Structure của `noXX.json` như sau

```
{
    "caseType": <"old" hoặc "new">,
    "age": 99,
    "gender": "femail",
    "from": "Ha Noi",
    "stayed": "15 - 17 Trúc Bạch",
    "visited": "London, Italy, France",
    "citizenship": "Vietnam",
    "relatedCaseNo": ["noYY", "noZZ"],
    "confirmDate": "05 March 2020",
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

## License

<a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
       width="80" height="15" alt="WTFPL" /></a>