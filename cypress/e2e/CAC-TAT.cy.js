const { before } = require("lodash")

describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(() => {
   cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
      
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

  })

// exercício extra 1
  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()

    const longText = Cypress._.repeat('Lorem ipsum elementum pellentesque suspendisse id primis duis morbi luctus ', 6)
    // cria uma constante longText para repetir 6x o mesmo texto lorem ipsum

    cy.get('[name="firstName"]').type('Fulano')
    cy.get('[name="lastName"]').type('de Tal')
    cy.get(':nth-child(2) > :nth-child(1) > [name="email"]').type('fulanodetal@teste.com')
    cy.get('[name="open-text-area"]').type(longText, { delay: 0 })
    cy.contains('Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000) // avança o relógio em 3 segundos

    cy.get('.success').should('not.be.visible')
  })

  // exercício extra 2
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    
    cy.get('[name="firstName"]').type('Maria')
    cy.get('[name="lastName"]').type('da Silva')
    cy.get(':nth-child(2) > :nth-child(1) > [name="email"]').type('mariadasilva@teste.teste')
    cy.get('[name="open-text-area"]').type('Agradeço pela atenção')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

  })

  // exercício extra 3
  it('validando campo numérico de telefone', () => {

    cy.get(':nth-child(2) > [name="phone"]')
    .type('abcdefgh')
    .should('have.value', '')
  
  })

  // exercício extra 4
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {

    cy.clock()

    cy.get('[name="firstName"]').type('João')
    cy.get('[name="lastName"]').type('de Souza')
    cy.get(':nth-child(2) > :nth-child(1) > [name="email"]').type('joaodesouza@teste.com')
    cy.get('#check > [name="phone"]').check()
    cy.get('[name="open-text-area"]').type('Agradeço pela atenção')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000) // avança o relógio em 3 segundos

    cy.get('.error').should('not.be.visible')

  })

  // exercício extra 5
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {

    cy.get('[name="firstName"]')
    .type('João')
    .should('have.value', 'João')
    .clear()
    .should('have.value', '')

    cy.get('[name="lastName"]')
    .type('de Souza')
    .should('have.value', 'de Souza')
    .clear()
    .should('have.value', '')

    cy.get(':nth-child(2) > :nth-child(1) > [name="email"]')
    .type('joaodesouza@teste.com')
    .should('have.value', 'joaodesouza@teste.com')
    .clear()
    .should('have.value', '')

    cy.get(':nth-child(2) > [name="phone"]')
    .type('1234567890')
    .should('have.value', '1234567890')
    .clear()
    .should('have.value', '')

  })

  // exercício extra 6
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {

    cy.clock()

    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

    cy.tick(3000) // avança o relógio em 3 segundos

    cy.get('.error').should('not.be.visible')
  })

  // exercício extra 7
  it('envia o formuário com sucesso usando um comando customizado', () => { 

    cy.clock()
/* 
    const data = {
      firstName: 'João',
      lastName: 'de Souza',
      email: 'joaodesouza@email.com',
      text: 'Teste'
    } */

    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')

    cy.tick(3000) // avança o relógio em 3 segundos

    cy.get('.success').should('not.be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {

    cy.get('#product')
    .select('YouTube')
    .should('have.value', 'youtube') 
  
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {

    cy.get('#product')
    .select('mentoria')
    .should('have.value', 'mentoria')

  })

  it('seleciona um produto (Blog) por seu índice', () => {

    cy.get('#product')
    .select(1)
    .should('have.value', 'blog')

  })
  
  it('marca o tipo de atendimento "Feedback"', () => {

    cy.get('input[type="radio"][value="feedback"]')
    .check()
    .should('be.checked') 

  })

  it('marca cada tipo de atendimento', () => {

    cy.get('input[type="radio"]')
    .should('have.length', 3)
    .each(($radio) => {
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })

  })

  it('marca ambos checkboxes, depois desmarca o último', () => {

    cy.get('input[type="checkbox"]')
    .check()
    .should('be.checked')
    .last()
    .uncheck()
    .should('not.be.checked') 

  })

  it('seleciona um arquivo da pasta fixtures', () => {

    cy.get('input[type="file"]#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json')
    .should(($input) => {
      expect($input[0].files[0].name).to.equal('example.json')
    })

  })

    it('seleciona um arquivo simulando um drag-and-drop', () => {

      cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })

    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {

      cy.fixture('example.json').as('sampleFile') 
    
    })
  
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {

      cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')

    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {

      cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

      cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
      
      cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
      cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')

    })

    it('preenche a area de texto usando o comando invoke', () => {

      cy.get('#open-text-area')
      .invoke('val', 'Lorem Ipsum')
      .should('have.value', 'Lorem Ipsum')
      
    })

    it('faz uma requisição HTTP', () => {

      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)
      cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
      cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')

    })
    
    it('encontra o gato escondido', () => {

      cy.get('#cat')
      .invoke('show')
      .should('be.visible')
      cy.get('#title')
      .invoke('text', 'CAT TAT')
      cy.get('#subtitle')
      .invoke('text', 'Eu 💖 gatos!')
      
    })
})
