jQuery(
    $('#register').on('click', () => {
        let userIp = [];
        $.get({
            url: '/ip'
        }).done(response => {
            userIp.push(response.ip);
            console.log(userIp);
            $.post(
                '/register-and-broadcast-node',
                {
                    'newNodeUrl': 'http://' + userIp[0].host
                },
                (data) => {
                    console.log(data);
                    $('#node_registered').show();
                }
            );
        });
    })
)