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

        $('#register-node').submit((e) => {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/register-and-broadcast-node',
                data: {
                    newNodeUrl: 'https://' + userIp[0]
                }
            })
            .done(() => {
                $('#node_registered').show();
            })
        })

        $('#node_start').on('click', (e) => {
            e.preventDefault();
            $.get({url: '/start'})
            .done(response => {
                console.log(response)
            })
        })
    })

    
)