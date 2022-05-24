var timetable = ['', '', '', '', '', '', ''];
$(window).load(() => {
    const reset = () => {
        let element = $('.listText');
        for(let i = 0; i < element.length; i++){
            element[i].innerHTML = '';
        }
    }

    let list = [];

    const change = () => {
        let all = 0;
        let none = 0;
        let inClass = 0;
        let outer = ['외출', '귀가'];
        $.ajax({
            url: '//api.dimigo.xyz/getList',
            type: 'POST',
            data: {
                data: list
            },
            success: res => {
                console.log(res);
                let element = $('.buttonText');
                    let list = $('.listText');
                    let data = res.data;
                    reset();
                    all += data.length;
                    for(let j = 0; j < data.length; j++){
                        for(let i = 0; i < element.length; i++){
                            if(element[i].innerText == data[j][2].replace(/\n|\r/g, "")){
                                list[i].innerHTML = `${list[i].innerHTML}${data[j][0]}${data[j][1]}<br>`
                                break;
                            }
                        }
                        if(data[j][2] == '자습') inClass++;
                        if(outer.indexOf(data[j][2]) >= 0) none++;
                    }
                    
                    $('.numNumber')[0].innerHTML = `${all}명`;
                    $('.numNumber')[1].innerHTML = `${all - none}명`;
                    $('.numNumber')[2].innerHTML = `${inClass}명`;
                    $('.numNumber')[3].innerHTML = `${none}명`;
            }
        });
    };

    const moniter = () => {
        let test = '';
        for(let i = 0; i < list.length; i++){
            test += `${Math.floor(list[i] / 10)}-${list[i] % 10}${i == list.length - 1 ? '' : ', '}`;
        }
        Swal.fire({
            title: '학반 입력',
            html: `모니터링 할 학반을 입력해 주세요.<br>ex) 1학년 6반 => 16<br>현재 입력 된 학반: ${test}`,
            icon: 'question',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: '추가하기!',
            cancelButtonText: '끝내기!'
        }).then(res => {
            console.log(res);

            if(res.isConfirmed && res.value != ''){
                list.push(res.value);
                moniter();
            }
            else{
                for(let i = 0; i < list.length; i++){
                    let grd = Math.floor(list[i] / 10);
                    let cls = list[i] % 10;
                    let f = i != list.length - 1 ? ',' : '';
                    $('.gc').html(`${$('.gc').html()} ${grd}-${cls}${f}`);
                    //console.log(grd, cls);
                }

                change();
                setInterval(() => {
                    change();
                }, 10000);

                if(list.length == 1){
                    let today = new Date();
                    let year = today.getFullYear();
                    let month = ('0' + (today.getMonth() + 1)).slice(-2);
                    let day = ('0' + today.getDate()).slice(-2);

                    let dateString = `${year}${month}${day}`;
                    $.ajax({
                        url: '//api.dimigo.xyz/timetable',
                        type: 'get',
                        data: {
                            date: dateString,
                            grade: Math.floor(list[0] / 10),
                            class: list[0] % 10
                        },
                        success: res => {
                            res = res['hisTimetable'][1]['row'];
                            for(let i = 0; i < res.length; i++){
                                timetable[i] = res[i]['ITRT_CNTNT'];
                            }
                            console.log(timetable);
                        }
                    })
                }
            }
        });
    }
    moniter();
});