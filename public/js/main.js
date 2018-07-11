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
            $.post(
                '/register-and-broadcast-node',
                {
                    'newNodeUrl': 'https://' + userIp[0].host
                },
                (data) => {
                    console.log(data);
                    $('#node_registered').show();
                }
            );
        })
    })

    
)