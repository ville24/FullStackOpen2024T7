describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Meikäläinen',
      username: 'mmeikala',
      password: 'salasana'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.visit('')
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mmeikala')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('User Matti Meikäläinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mmeikala')
      cy.get('#password').type('salasan')
      cy.get('#login-button').click()

      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mmeikala', password: 'salasana' })
    })
    it('A blog can be created', function() {
      cy.get('#newblog').click()
      cy.get('[name=\'title\']').type('React patterns')
      cy.get('[name=\'author\']').type('Michael Chan')
      cy.get('[name=\'url\']').type('https://reactpatterns.com/')
      cy.get('#createblog').click()

      cy.contains('React patterns')
      cy.contains('Michael Chan')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/'
        })
      })

      it('A blog can be liked', function() {
        cy.get('.viewbutton:first').click()
        cy.get('.likebutton:first').click()
        cy.get('.likes:first').contains('1')
      })

      it('A blog can be removed', function() {
        cy.get('.viewbutton:first').click()
        cy.get('.removebutton:first').click()
        cy.get('.info').contains('Blog deleted')
        cy.get('html').should('not.contain', 'React patterns')
      })

      it('A blog can be removed only by the creator', function() {
        cy.get('.viewbutton:first').click()
        cy.get('.removebutton:first').contains('remove')

        cy.get('#logoutbutton').click()

        const user = {
          name: 'Matti Meikäläinen 2',
          username: 'mmeikal2',
          password: 'salasana'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

        cy.login({ username: 'mmeikal2', password: 'salasana' })

        cy.get('.viewbutton:first').click()
        cy.get('removebutton').should('not.exist')
      })

      it('Blogs are sorted by likes', function() {
        cy.get('.viewbutton:first').click()
        cy.get('.likebutton:first').click()
        cy.get('.likes:first').contains('1')

        cy.createBlog({
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
        })

        cy.get('.blog').eq(0).should('contain','React patterns')
        cy.get('.blog').eq(1).should('contain','Go To Statement Considered Harmful')

        cy.get('.viewbutton').eq(0).click()
        cy.get('.viewbutton').eq(1).click()

        cy.get('.likebutton').eq(1).click()
        cy.get('.likes').eq(1).contains('1')

        cy.get('.likebutton').eq(1).click()

        cy.get('.blog').eq(0).should('contain','Go To Statement Considered Harmful')
        cy.get('.blog').eq(1).should('contain','React patterns')
      })
    })
  })
})