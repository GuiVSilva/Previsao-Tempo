// Adiciona um ouvinte de evento para o formulário de busca
document.querySelector('#search').addEventListener('submit', async event => {
  // Impede que o formulário seja enviado de maneira padrão, o que evita que a página seja recarregada
  event.preventDefault()

  // Obtém o valor digitado pelo usuário no campo de entrada referente ao nome da cidade
  const cityName = document.querySelector('#city_name').value

  // Verifica se o campo da cidade está vazio
  if (!cityName) {
    // Se estiver vazio, remove a exibição do contêiner de informações de clima e mostra uma mensagem de alerta solicitando que o usuário insira uma cidade
    document.querySelector('#weather').classList.remove('show')
    showAlert('Você precisa digitar uma cidade...')
    return // Encerra a função, já que não há uma cidade válida para pesquisar
  }

  // Define a chave de API para acessar os dados da previsão do tempo
  const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c'
  // Constrói a URL da API de previsão do tempo com base na cidade fornecida pelo usuário, convertendo o nome da cidade para um formato seguro de ser transmitido pela internet (URI encoding)
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
    cityName
  )}&appid=${apiKey}&units=metric&lang=pt_br`

  // Faz uma solicitação assíncrona à API de previsão do tempo usando a função fetch
  const results = await fetch(apiUrl)
  // Converte a resposta da solicitação em formato JSON para poder ser facilmente manipulada pelo JavaScript
  const json = await results.json()

  // Verifica se a solicitação foi bem-sucedida com base no código de resposta da API (código 200 indica sucesso)
  if (json.cod === 200) {
    // Se a solicitação for bem-sucedida, exibe as informações do clima na página
    showInfo({
      city: json.name, // Nome da cidade
      country: json.sys.country, // País da cidade
      temp: json.main.temp, // Temperatura atual
      tempMax: json.main.temp_max, // Temperatura máxima
      tempMin: json.main.temp_min, // Temperatura mínima
      description: json.weather[0].description, // Descrição do clima
      tempIcon: json.weather[0].icon, // Ícone representativo do clima
      windSpeed: json.wind.speed, // Velocidade do vento
      humidity: json.main.humidity // Umidade do ar
    })
  } else {
    // Se a solicitação não for bem-sucedida, remove a exibição do contêiner de informações de clima e mostra uma mensagem de alerta indicando que a cidade não pôde ser encontrada
    document.querySelector('#weather').classList.remove('show')
    showAlert(`
            Não foi possível localizar...

            <img src="img/404.svg"/> // Adiciona uma imagem de erro à mensagem de alerta
        `)
  }
})

// Função responsável por exibir as informações do clima na página
function showInfo(json) {
  // Limpa qualquer mensagem de alerta anteriormente exibida
  showAlert('')
  // Exibe o contêiner de informações de clima na página, adicionando a classe 'show' que controla sua visibilidade
  document.querySelector('#weather').classList.add('show')

  // Atualiza os elementos HTML na página com as informações do clima fornecidas
  document.querySelector('#title').innerHTML = `${json.city}, ${json.country}` // Exibe o título com o nome da cidade e o país
  document.querySelector('#temp_value').innerHTML = `${json.temp
    .toFixed(1)
    .toString()
    .replace('.', ',')} <sup>C°</sup>` // Exibe a temperatura atual
  document.querySelector('#temp_description').innerHTML = `${json.description}` // Exibe a descrição do clima
  document
    .querySelector('#temp_img')
    .setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`
    )
  document.querySelector('#temp_max').innerHTML = `${json.tempMax
    .toFixed(1)
    .toString()
    .replace('.', ',')} <sup>C°</sup>` // Exibe a temperatura máxima
  document.querySelector('#temp_min').innerHTML = `${json.tempMin
    .toFixed(1)
    .toString()
    .replace('.', ',')} <sup>C°</sup>` // Exibe a temperatura mínima
  document.querySelector('#humidity').innerHTML = `${json.humidity}%` // Exibe a umidade do ar
  document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h` // Exibe a velocidade do vento
}

// Função responsável por exibir mensagens de alerta na página
function showAlert(msg) {
  // Atualiza o conteúdo do elemento HTML com o ID 'alert' com a mensagem fornecida como argumento
  document.querySelector('#alert').innerHTML = msg
}
