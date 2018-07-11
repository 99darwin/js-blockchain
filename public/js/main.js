jQuery(

    $(document).ready(() => {

        let userIp = [];
        $.get({
            url: '/ip'
        }).done(response => {
            userIp.push(response.ip);
            console.log(userIp);
        });

        $('#register').on('click', () => {
            $('#node_registered').show();
        })
    })

    
)