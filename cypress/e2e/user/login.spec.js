// describe("Login page", () => {
//   before(() => {
//     cy.log(`Visiting https://company.tld`);
//     cy.visit("/");
//   });
//   it("Login with Google", () => {
//     const username = Cypress.env("CREDENTIAL_USER");
//     const password = Cypress.env("CREDENTIAL_PW");
//     const loginUrl = Cypress.env("SITE_NAME");
//     const cookieName = Cypress.env("COOKIE_NAME");
//     const socialLoginOptions = {
//       username,
//       password,
//       loginUrl,
//       headless: true,
//       logs: false,
//       isPopup: true,
//       loginSelector: `a[href="${Cypress.env(
//         "SITE_NAME"
//       )}/api/auth/post-login"]`,
//       postLoginSelector: ".unread-count",
//     };


//     return cy
//       .task("Login", socialLoginOptions)
//       .then(({ cookies }) => {
//         cy.clearCookies();

//         const cookie = cookies
//           .filter((cookie) => cookie.name === cookieName)
//           .pop();
//         if (cookie) {
//           cy.setCookie(cookie.name, cookie.value, {
//             domain: cookie.domain,
//             expiry: cookie.expires,
//             httpOnly: cookie.httpOnly,
//             path: cookie.path,
//             secure: cookie.secure,
//           });

//           Cypress.Cookies.defaults({
//             preserve: cookieName,
//           });

//           // remove the two lines below if you need to stay logged in
//           // for your remaining tests
//           cy.visit("/api/auth/signout");
//           cy.get("form").submit();
//         }
//       });
//   });
// });
describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('greets with Login', () => {
    cy.contains('h4', 'Ввійти');
  });

  it('links to /register', () => {
    cy
      .contains('Подати заявку на реєстрацію')
      .should('have.attr', 'href', '/register');
  });

  it('requires Login name', () => {
    cy.get('form').contains('Підтвердити').click();
    cy.get('.Mui-error').should('contain', 'Ім\'я обов\'язкове до заповнення');
    cy.url().should('not.eq', 'http://localhost:3000/');
  });

  it('requires password', () => {
    cy.get('input[name="name"]').type('example@mail.com{enter}');
    cy.get('.Mui-error').should('contain', 'Пароль обов\'язковий до заповнення');
    cy.url().should('not.eq', 'http://localhost:3000/');
  });

  it('requires valid login and password', () => {
    cy.get('input[name="name"]').type('example@mail.com');
    cy.get('input[name="password"]').type('12345{enter}');
    cy.get('#notistack-snackbar').should('contain', 'Такого користувача не існує');
    cy.url().should('not.eq', 'http://localhost:3000/');
  });

  it('navigates to / on successful login', () => {
    cy.get('input[name="name"]').type('admin');
    cy.get('input[name="password"]').type('admin{enter}');
    cy.url().should('eq', 'http://localhost:3000/');
  });
});