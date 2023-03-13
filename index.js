function createSearchItem(array) {
    let div = document.createElement('div');
    div.classList.add('search-item');

    for (let i = 0; i < 3; i++) {
        let p = document.createElement('p');
        p.classList.add('search-text');
        if (i == 0) {
            let a = document.createElement('a');
            a.href = array[3]
            a.target = '_blank'
            a.textContent = array[i]
            p.append(a)
        } else {
            p.textContent = array[i];
        }
        
        div.append(p)
    }

    let main = document.querySelector('.main');
    main.append(div)
}



let input = document.getElementById('text');

input.addEventListener('input', (event) => {
    let mistake = document.querySelector('.mistake');

    if (input.value.length <= 1) {
        switch (input.value.length) {
            case 1:
                mistake.textContent = 'Поиск не может быть осуществлен по одной букве'
                break
            case 0:
                mistake.textContent = 'Текст для поиска отсутствует'
                break
        }
        
        mistake.style.opacity = '1'
        input.dataset.flag = 'no'
    } else {
        mistake.style.opacity = '0'  
        input.dataset.flag = 'ok'
    }
})




let form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let input = document.getElementById('text')
    if (input.dataset.flag == 'no') {
        console.log('error')
        return
    }

    let searchText = document.getElementById('text').value;

    fetch(`https://api.github.com/search/repositories?q=${searchText}`)
    .then(res => {
        console.log(res.status)
        let nothing = document.querySelector('.nothing')
        nothing.style.display = 'none'

        let oldResults = document.querySelectorAll('.search-item')
        oldResults.forEach(result => {
            result.remove()
        })
        return res.json()
    })
    .then(data => {
        console.log(data)
        let items = data.items;

        let number = items.length

        if (number == 0) {
            let nothing = document.querySelector('.nothing')
            nothing.style.display = 'flex'
        }
        if (number > 10) {
            number = 10;
        }

        for (let i = 0; i < number; i++) {
            let item = items[i];
            let array = []

            let title = item.name
            array.push(title)

            let owner = item.owner.login
            array.push(owner)

            let description = item.description
            array.push(description)

            let url = item.html_url
            array.push(url)

            createSearchItem(array)
        }
    })
    
})