$(window).load(() => {
    const time = 1500; 
    const audio = new Audio('/file/sound.mp3');
    let button = $('.button');
    let ifCheckedEnd = 0;
    let serial, select;

    const resetColor = () => {
        for(let i = 0; i < button.length; i++){
            button[i].style['background-color'] = '#fff';
        }
    }
    const setBackground = element => {
        resetColor();
        element.style['background-color'] = '#90D6E5';
        select = element.innerText;
    }
    for(let i = 0; i< button.length; i++){
        button[i].addEventListener('click', () => setBackground(button[i]));
    }
    setBackground(button[0]);
    $('.register').on('click', () => location.href = '/register');

    let selectedDeviceId, url;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    codeReader.listVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId = videoInputDevices[0].deviceId
      const cam = () => {
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'webcam', (result, err) => {
          if(result && !ifCheckedEnd) {
            audio.play();
            ifCheckedEnd = 1;
            //console.log(result);
            if($('.button1').val()) url = '//api.dimigo.xyz/update';
            else url = '//api.dimigo.xyz/jasup';
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    serial: result.text,
                    doing: select,
                    update: $('.button1').val()
                },
                success: res => {
                    setBackground(button[0]);
                    $('.button1').val('');
                    if(res.success) Swal.fire({
                      icon: 'success', 
                      title: '성공!', 
                      text: `${res.data}`,
                      timer: time,
                      timerProgressBar: true
                    }).then(() => {
                      ifCheckedEnd = 0
                    });
                    else Swal.fire({
                      icon: 'error', 
                      title: '오류!', 
                      text: res.message,
                      timer: time,
                      timerProgressBar: true
                    }).then(() => {
                      ifCheckedEnd = 0
                    });
                },
                error: res => {
                  setBackground(button[0]);
                  $('.button1').val('');
                  Swal.fire({
                    icon: 'error', 
                    title: '오류!', 
                    text: res.message,
                    timer: time,
                    timerProgressBar: true
                  }).then(() => {
                    ifCheckedEnd = 0
                  });
                }
            });
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err)
          }
        })
      };
      cam();

      
      const sourceSelect = document.getElementById('sourceSelect')
      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option')
          sourceOption.text = element.label
          sourceOption.value = element.deviceId
          sourceSelect.appendChild(sourceOption)
        })

        sourceSelect.onchange = () => {
          codeReader.reset();
          selectedDeviceId = sourceSelect.value;
          cam();
        };
      }
      

      let trsg = 180;
      $('#webcam').on('click', () => {
        trsg += 180;
        $('#webcam').css('transform', `rotateY(${trsg}deg)`);
      });
    })
    .catch((err) => {
      console.error(err)
    })
});