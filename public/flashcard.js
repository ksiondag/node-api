window.onload = function () {
    $.getJSON('/api/kanji', function (data) {
        var index = 0;

        $('#flashcard').html(data[index].translation);

        $('#success').click(function () {
            $.ajax(
                '/api/kanji/' + data[index]._id,
                {
                    data: {
                        remembered: true
                    },
                    method: 'PUT',
                    success: function (data) {
                        console.log(data);
                    }
                }
            );

            index = index + 1;

            if (index >= data.length) {
                $('#flashcard').html('Out of cards! Refresh the page!');
            } else {
                $('#flashcard').html(data[index].translation);
            }
        });

        $('#failure').click(function () {
            $.ajax(
                '/api/kanji/' + data[index]._id,
                {
                    method: 'PUT',
                    success: function (data) {
                        console.log(data);
                    }
                }
            );

            index = index + 1;

            if (index >= data.length) {
                $('#flashcard').html('Out of cards! Refresh the page!');
            } else {
                $('#flashcard').html(data[index].translation);
            }
        });
        
        $('#english').click(function () {
            $('#flashcard').html(data[index].translation);
        });
        $('#hiragana').click(function () {
            $('#flashcard').html(data[index].hiragana);
        });
        $('#kanji').click(function () {
            $('#flashcard').html(data[index].kanji);
        });
    });
};
