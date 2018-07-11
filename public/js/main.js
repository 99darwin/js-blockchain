jQuery(

    $(document).ready(() => {

        let userIp = [];
        $.get({
            url: '/ip'
        }).done(response => {
            $('#ip').val(response.ip);
            userIp.push(response.ip);
            console.log(userIp);
        });

        $('#register').on('click', () => {
            $('#node_registered').show();
        })
    })

    
)