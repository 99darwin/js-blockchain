jQuery(
    $('#register').on('click', () => {
        let userIp = [];
        $.get({
            url: 'http://localhost:6489/ip'
        }).done(response => {
            userIp.push(response.ip);
            console.log(userIp);
            $.post(
                'http://localhost:6489/register-and-broadcast-node',
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