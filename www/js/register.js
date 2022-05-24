$(window).load(() => {
    const time = 1500; 
    let type, ifCheckedEnd = 0;
    const audio = new Audio('/file/sound.mp3');
    $('.btn1').css('background-color', '#90d6e5');
    $('.btn2').css('background-color', '#fff');
    type = 1;

    $('.register').on('click', () => location.href = '/');
    $('.number').focus();
    $('.number').on('propertychange change keyup paste input', () => {
        $('.number').val().length >= 4 && $('.name').focus();
    });

    $('.btn1').on('click', () => {
        $('.btn1').css('background-color', '#90d6e5');
        $('.btn2').css('background-color', '#fff');
        type = 1;
    });
    $('.btn2').on('click', () => {
        $('.btn2').css('background-color', '#90d6e5');
        $('.btn1').css('background-color', '#fff');
        type = 2;
    });

    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    codeReader.listVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId = videoInputDevices[0].deviceId
      const cam = () => {
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'webcam', (result, err) => {
          if(result && !ifCheckedEnd) {
            ifCheckedEnd = 1;
            audio.play();
            $.ajax({
                url: '//api.dimigo.xyz/register',
                type: 'POST',
                data: {
                  serial: result.text,
                  number: $('.number').val(),
                  name: $('.name').val(),
                  userType: type
                },
                success: res => {
                  if(res.success) Swal.fire({
                    icon: 'success', 
                    title: '성공!', 
                    text: `${res.data}`,
                    timer: time,
                    timerProgressBar: true
                  }).then(() =>{
                    ifCheckedEnd = 0;
                    location.href = 'https://dimigo.xyz';
                  })
                  else Swal.fire({
                    icon: 'error', 
                    title: '오류!', 
                    text: res.message,
                    timer: time,
                    timerProgressBar: true
                  }).then(() =>{
                    ifCheckedEnd = 0;
                    location.href = 'https://dimigo.xyz';
                  })
                },
                error: res => {
                  Swal.fire({
                    icon: 'error',
                    title: '오류!', 
                    text: `[${res.status}] ${res.statusText}`,
                    timer: time,
                    timerProgressBar: true
                  }).then(() =>{
                    ifCheckedEnd = 0;
                    location.href = 'https://dimigo.xyz';
                  });
                }
              });
            
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err)
          }
        })
      }
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